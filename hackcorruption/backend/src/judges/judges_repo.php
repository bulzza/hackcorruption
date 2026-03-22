<?php
// backend/src/judges/judges_repo.php

declare(strict_types=1);

function slug_is_url_safe(string $slug): bool
{
    return (bool)preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug);
}

function judge_slug_exists(PDO $pdo, string $slug, ?int $excludeId = null): bool
{
    if ($excludeId !== null) {
        $stmt = $pdo->prepare("SELECT 1 FROM judges WHERE slug = :slug AND id <> :id LIMIT 1");
        $stmt->execute([':slug' => $slug, ':id' => $excludeId]);
    } else {
        $stmt = $pdo->prepare("SELECT 1 FROM judges WHERE slug = :slug LIMIT 1");
        $stmt->execute([':slug' => $slug]);
    }
    return (bool)$stmt->fetchColumn();
}

function judge_columns(PDO $pdo): array
{
    static $cached = null;
    if ($cached !== null) return $cached;

    $stmt = $pdo->query("
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'judges'
          AND COLUMN_NAME IN ('is_active')
    ");
    $cols = $stmt->fetchAll(PDO::FETCH_COLUMN) ?: [];
    $cached = [
        'is_active' => in_array('is_active', $cols, true),
    ];
    return $cached;
}

/**
 * DB-layer create (NO HTTP, NO $_POST).
 * Pass:
 * - $payload: decoded JSON array
 * - $photoBlob: raw bytes or null
 * - $photoMime: mime string or null
 *
 * Returns the same payload shape as judge_get()
 */
function judge_create(PDO $pdo, array $payload, ?string $photoBlob, ?string $photoMime): array
{ 

    if (empty($_POST) && empty($_FILES) && (int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
    json_response(413, ['error' => 'Request is too large. Please upload a smaller image.']);
    }

    $columns = judge_columns($pdo);
    $hasIsActive = $columns['is_active'];

    $slug = strtolower(trim((string)($payload['slug'] ?? '')));
    $fullName = trim((string)($payload['full_name'] ?? ''));
    $areaOfWork = trim((string)($payload['area_of_work'] ?? ''));
    $role = trim((string)($payload['role'] ?? 'Judge')) ?: 'Judge';

    $yearOfElection = $payload['year_of_election'] ?? null;
    $isActive  = isset($payload['is_active']) ? (int)$payload['is_active'] : 1;

    if ($slug === '' || $fullName === '' || $areaOfWork === '') {
        throw new InvalidArgumentException("Missing required fields: slug, full_name, area_of_work");
    }
    if (!slug_is_url_safe($slug)) {
        throw new InvalidArgumentException("Slug must be URL-safe (lowercase letters, numbers, hyphens)");
    }
    // sort_order removed — no validation required
    if (judge_slug_exists($pdo, $slug)) {
        throw new InvalidArgumentException("Slug already exists");
    }

    $yearOfElection = ($yearOfElection === '' || $yearOfElection === null) ? null : (int)$yearOfElection;

    $education  = is_array($payload['education'] ?? null) ? $payload['education'] : [];
    $experience = is_array($payload['experience'] ?? null) ? $payload['experience'] : [];
    $cases      = is_array($payload['cases'] ?? null) ? $payload['cases'] : [];
    $metrics    = is_array($payload['metrics'] ?? null) ? $payload['metrics'] : [];

    // Validate percent fields as numbers only
    foreach (['clearance_rate_percent', 'appeal_reversal_percent'] as $pf) {
        if (isset($metrics[$pf]) && $metrics[$pf] !== null && $metrics[$pf] !== '') {
            $v = str_replace('%', '', (string)$metrics[$pf]);
            if (!is_numeric($v)) throw new InvalidArgumentException("$pf must be a number (no %)");
            $metrics[$pf] = (float)$v;
        }
    }

    // Validate filing_date format YYYY-MM-DD
    foreach ($cases as $c) {
        $fd = (string)($c['filing_date'] ?? '');
        if ($fd !== '' && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $fd)) {
            throw new InvalidArgumentException("filing_date must be YYYY-MM-DD");
        }
    }

    try {
        $pdo->beginTransaction();

        // sort_order removed — no reordering required

        // Insert judge
        $columns = ['slug', 'full_name', 'year_of_election', 'area_of_work', 'role', 'photo', 'photo_mime'];
        $placeholders = [':slug', ':full_name', ':year_of_election', ':area_of_work', ':role', ':photo', ':photo_mime'];
        $params = [
            ':slug' => $slug,
            ':full_name' => $fullName,
            ':year_of_election' => $yearOfElection,
            ':area_of_work' => $areaOfWork,
            ':role' => $role,
            ':photo' => $photoBlob,
            ':photo_mime' => $photoMime,
        ];
        if ($hasIsActive) {
            $columns[] = 'is_active';
            $placeholders[] = ':is_active';
            $params[':is_active'] = $isActive;
        }
        $stmt = $pdo->prepare("
            INSERT INTO judges
              (" . implode(', ', $columns) . ")
            VALUES
              (" . implode(', ', $placeholders) . ")
        ");
        $stmt->execute($params);

        $judgeId = (int)$pdo->lastInsertId();

        // Education
        if (!empty($education)) {
            $stmtEdu = $pdo->prepare("
                INSERT INTO judge_education (judge_id, institution, location, year)
                VALUES (:judge_id, :institution, :location, :year)
            ");
            foreach ($education as $e) {
                $institution = trim((string)($e['institution'] ?? ''));
                if ($institution === '') continue;
                $location = trim((string)($e['location'] ?? '')) ?: null;
                $year = $e['year'] ?? null;
                $year = ($year === '' || $year === null) ? null : (int)$year;
                $stmtEdu->execute([
                    ':judge_id' => $judgeId,
                    ':institution' => $institution,
                    ':location' => $location,
                    ':year' => $year,
                    
                ]);
            }
        }

        // Experience
        if (!empty($experience)) {
            $stmtExp = $pdo->prepare("
                INSERT INTO judge_experience (judge_id, title, position, start_year, end_year, is_current)
                VALUES (:judge_id, :title, :position, :start_year, :end_year, :is_current)
            ");
            foreach ($experience as $x) {
                $title = trim((string)($x['title'] ?? ''));
                if ($title === '') continue;
                $position = trim((string)($x['position'] ?? '')) ?: null;

                $start = $x['start_year'] ?? null;
                $start = ($start === '' || $start === null) ? null : (int)$start;

                $isCurrent = isset($x['is_current']) ? (int)$x['is_current'] : 0;

                $end = $x['end_year'] ?? null;
                if ($isCurrent === 1) $end = null;
                $end = ($end === '' || $end === null) ? null : (int)$end;

                $stmtExp->execute([
                    ':judge_id' => $judgeId,
                    ':title' => $title,
                    ':position' => $position,
                    ':start_year' => $start,
                    ':end_year' => $end,
                    ':is_current' => $isCurrent,
                    
                ]);
            }
        }

        // Metrics (unique per judge)
        if (!empty($metrics)) {
            $stmtMet = $pdo->prepare("
                INSERT INTO judge_metrics
                  (judge_id, avg_duration_days, clearance_rate_percent, total_solved_year, total_solved, active_cases, sentence_severity, appeal_reversal_percent)
                VALUES
                  (:judge_id, :avg_duration_days, :clearance_rate_percent, :total_solved_year, :total_solved, :active_cases, :sentence_severity, :appeal_reversal_percent)
            ");
            $stmtMet->execute([
                ':judge_id' => $judgeId,
                ':avg_duration_days' => ($metrics['avg_duration_days'] ?? null) !== '' ? ($metrics['avg_duration_days'] ?? null) : null,
                ':clearance_rate_percent' => ($metrics['clearance_rate_percent'] ?? null) !== '' ? ($metrics['clearance_rate_percent'] ?? null) : null,
                ':total_solved_year' => ($metrics['total_solved_year'] ?? null) !== '' ? ($metrics['total_solved_year'] ?? null) : null,
                ':total_solved' => ($metrics['total_solved'] ?? null) !== '' ? ($metrics['total_solved'] ?? null) : null,
                ':active_cases' => ($metrics['active_cases'] ?? null) !== '' ? ($metrics['active_cases'] ?? null) : null,
                ':sentence_severity' => ($metrics['sentence_severity'] ?? null) !== '' ? ($metrics['sentence_severity'] ?? null) : null,
                ':appeal_reversal_percent' => ($metrics['appeal_reversal_percent'] ?? null) !== '' ? ($metrics['appeal_reversal_percent'] ?? null) : null,
            ]);
        }

        // Cases link (ensure cases row exists because FK)
        if (!empty($cases)) {
            $stmtCaseExists = $pdo->prepare("SELECT 1 FROM cases WHERE id = :id LIMIT 1");
            $stmtInsertCase = $pdo->prepare("
                INSERT INTO cases (id, court, judge, decision_date, legal_area, summary)
                VALUES (:id, :court, :judge, NULL, NULL, NULL)
            ");
            $stmtJudgeCase = $pdo->prepare("
                INSERT INTO judge_cases (judge_id, case_id, court, type, subtype, basis_type, filing_date, status)
                VALUES (:judge_id, :case_id, :court, :type, :subtype, :basis_type, :filing_date, :status)
            ");

            foreach ($cases as $c) {
                $caseId = trim((string)($c['case_id'] ?? ''));
                if ($caseId === '') continue;

                $stmtCaseExists->execute([':id' => $caseId]);
                $exists = (bool)$stmtCaseExists->fetchColumn();
                if (!$exists) {
                    $stmtInsertCase->execute([
                        ':id' => $caseId,
                        ':court' => (string)($c['court'] ?? 'Unknown Court'),
                        ':judge' => $fullName,
                    ]);
                }

                $stmtJudgeCase->execute([
                    ':judge_id' => $judgeId,
                    ':case_id' => $caseId,
                    ':court' => (string)($c['court'] ?? null),
                    ':type' => (string)($c['type'] ?? null),
                    ':subtype' => (string)($c['subtype'] ?? null),
                    ':basis_type' => (string)($c['basis_type'] ?? null),
                    ':filing_date' => ($c['filing_date'] ?? null) !== '' ? ($c['filing_date'] ?? null) : null,
                    ':status' => (string)($c['status'] ?? 'Unknown'),
                ]);
            }
        }

        $pdo->commit();

        $created = judge_get($pdo, $judgeId);
        if (!$created) throw new RuntimeException("Created judge not found");
        return $created;
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        throw $e;
    }
}

function judge_update(
    PDO $pdo,
    int $id,
    array $payload,
    ?string $photoBlob,
    ?string $photoMime,
    bool $photoProvided
): array {
    $columns = judge_columns($pdo);
    $hasIsActive = $columns['is_active'];

    $existingSelect = "
        SELECT id, role";
    if ($hasIsActive) {
        $existingSelect .= ", is_active";
    } else {
        $existingSelect .= ", 1 AS is_active";
    }
    $existingSelect .= " FROM judges WHERE id = :id LIMIT 1";
    $stmtExisting = $pdo->prepare($existingSelect);
    $stmtExisting->execute([':id' => $id]);
    $existing = $stmtExisting->fetch();
    if (!$existing) {
        throw new InvalidArgumentException("Judge not found");
    }

    $slug = strtolower(trim((string)($payload['slug'] ?? '')));
    $fullName = trim((string)($payload['full_name'] ?? ''));
    $areaOfWork = trim((string)($payload['area_of_work'] ?? ''));
    $role = trim((string)($payload['role'] ?? $existing['role'] ?? 'Judge')) ?: 'Judge';

    $yearOfElection = $payload['year_of_election'] ?? null;
    $isActive = array_key_exists('is_active', $payload) ? (int)$payload['is_active'] : (int)$existing['is_active'];

    if ($slug === '' || $fullName === '' || $areaOfWork === '') {
        throw new InvalidArgumentException("Missing required fields: slug, full_name, area_of_work");
    }
    if (!slug_is_url_safe($slug)) {
        throw new InvalidArgumentException("Slug must be URL-safe (lowercase letters, numbers, hyphens)");
    }
    // sort_order removed — no validation required
    if (judge_slug_exists($pdo, $slug, $id)) {
        throw new InvalidArgumentException("Slug already exists");
    }

    $yearOfElection = ($yearOfElection === '' || $yearOfElection === null) ? null : (int)$yearOfElection;

    $education  = is_array($payload['education'] ?? null) ? $payload['education'] : [];
    $experience = is_array($payload['experience'] ?? null) ? $payload['experience'] : [];
    $cases      = is_array($payload['cases'] ?? null) ? $payload['cases'] : [];
    $metrics    = is_array($payload['metrics'] ?? null) ? $payload['metrics'] : [];

    foreach (['clearance_rate_percent', 'appeal_reversal_percent'] as $pf) {
        if (isset($metrics[$pf]) && $metrics[$pf] !== null && $metrics[$pf] !== '') {
            $v = str_replace('%', '', (string)$metrics[$pf]);
            if (!is_numeric($v)) throw new InvalidArgumentException("$pf must be a number (no %)");
            $metrics[$pf] = (float)$v;
        }
    }

    foreach ($cases as $c) {
        $fd = (string)($c['filing_date'] ?? '');
        if ($fd !== '' && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $fd)) {
            throw new InvalidArgumentException("filing_date must be YYYY-MM-DD");
        }
    }

    try {
        $pdo->beginTransaction();

        $updateSql = "
            UPDATE judges
            SET
                slug = :slug,
                full_name = :full_name,
                year_of_election = :year_of_election,
                area_of_work = :area_of_work,
                role = :role";
        if ($hasIsActive) {
            $updateSql .= ", is_active = :is_active";
        }
        if ($photoProvided) {
            $updateSql .= ", photo = :photo, photo_mime = :photo_mime";
        }
        $updateSql .= " WHERE id = :id";

        $params = [
            ':slug' => $slug,
            ':full_name' => $fullName,
            ':year_of_election' => $yearOfElection,
            ':area_of_work' => $areaOfWork,
            ':role' => $role,
            ':id' => $id,
        ];
        if ($hasIsActive) {
            $params[':is_active'] = $isActive;
        }
        if ($photoProvided) {
            $params[':photo'] = $photoBlob;
            $params[':photo_mime'] = $photoMime;
        }

        $stmtUpdate = $pdo->prepare($updateSql);
        $stmtUpdate->execute($params);

        $pdo->prepare("DELETE FROM judge_education WHERE judge_id = :id")->execute([':id' => $id]);
        $pdo->prepare("DELETE FROM judge_experience WHERE judge_id = :id")->execute([':id' => $id]);
        $pdo->prepare("DELETE FROM judge_metrics WHERE judge_id = :id")->execute([':id' => $id]);
        $pdo->prepare("DELETE FROM judge_cases WHERE judge_id = :id")->execute([':id' => $id]);

        if (!empty($education)) {
            $stmtEdu = $pdo->prepare("
                INSERT INTO judge_education (judge_id, institution, location, year)
                VALUES (:judge_id, :institution, :location, :year)
            ");
            foreach ($education as $e) {
                $institution = trim((string)($e['institution'] ?? ''));
                if ($institution === '') continue;
                $location = trim((string)($e['location'] ?? '')) ?: null;
                $year = $e['year'] ?? null;
                $year = ($year === '' || $year === null) ? null : (int)$year;
                $stmtEdu->execute([
                    ':judge_id' => $id,
                    ':institution' => $institution,
                    ':location' => $location,
                    ':year' => $year,
                    
                ]);
            }
        }

        if (!empty($experience)) {
            $stmtExp = $pdo->prepare("
                INSERT INTO judge_experience (judge_id, title, position, start_year, end_year, is_current)
                VALUES (:judge_id, :title, :position, :start_year, :end_year, :is_current)
            ");
            foreach ($experience as $x) {
                $title = trim((string)($x['title'] ?? ''));
                if ($title === '') continue;
                $position = trim((string)($x['position'] ?? '')) ?: null;

                $start = $x['start_year'] ?? null;
                $start = ($start === '' || $start === null) ? null : (int)$start;

                $isCurrent = isset($x['is_current']) ? (int)$x['is_current'] : 0;

                $end = $x['end_year'] ?? null;
                if ($isCurrent === 1) $end = null;
                $end = ($end === '' || $end === null) ? null : (int)$end;

                $stmtExp->execute([
                    ':judge_id' => $id,
                    ':title' => $title,
                    ':position' => $position,
                    ':start_year' => $start,
                    ':end_year' => $end,
                    ':is_current' => $isCurrent,
                    
                ]);
            }
        }

        if (!empty($metrics)) {
            $stmtMet = $pdo->prepare("
                INSERT INTO judge_metrics
                  (judge_id, avg_duration_days, clearance_rate_percent, total_solved_year, total_solved, active_cases, sentence_severity, appeal_reversal_percent)
                VALUES
                  (:judge_id, :avg_duration_days, :clearance_rate_percent, :total_solved_year, :total_solved, :active_cases, :sentence_severity, :appeal_reversal_percent)
            ");
            $stmtMet->execute([
                ':judge_id' => $id,
                ':avg_duration_days' => ($metrics['avg_duration_days'] ?? null) !== '' ? ($metrics['avg_duration_days'] ?? null) : null,
                ':clearance_rate_percent' => ($metrics['clearance_rate_percent'] ?? null) !== '' ? ($metrics['clearance_rate_percent'] ?? null) : null,
                ':total_solved_year' => ($metrics['total_solved_year'] ?? null) !== '' ? ($metrics['total_solved_year'] ?? null) : null,
                ':total_solved' => ($metrics['total_solved'] ?? null) !== '' ? ($metrics['total_solved'] ?? null) : null,
                ':active_cases' => ($metrics['active_cases'] ?? null) !== '' ? ($metrics['active_cases'] ?? null) : null,
                ':sentence_severity' => ($metrics['sentence_severity'] ?? null) !== '' ? ($metrics['sentence_severity'] ?? null) : null,
                ':appeal_reversal_percent' => ($metrics['appeal_reversal_percent'] ?? null) !== '' ? ($metrics['appeal_reversal_percent'] ?? null) : null,
            ]);
        }

        if (!empty($cases)) {
            $stmtCaseExists = $pdo->prepare("SELECT 1 FROM cases WHERE id = :id LIMIT 1");
            $stmtInsertCase = $pdo->prepare("
                INSERT INTO cases (id, court, judge, decision_date, legal_area, summary)
                VALUES (:id, :court, :judge, NULL, NULL, NULL)
            ");
            $stmtJudgeCase = $pdo->prepare("
                INSERT INTO judge_cases (judge_id, case_id, court, type, subtype, basis_type, filing_date, status)
                VALUES (:judge_id, :case_id, :court, :type, :subtype, :basis_type, :filing_date, :status)
            ");

            foreach ($cases as $c) {
                $caseId = trim((string)($c['case_id'] ?? ''));
                if ($caseId === '') continue;

                $stmtCaseExists->execute([':id' => $caseId]);
                $exists = (bool)$stmtCaseExists->fetchColumn();
                if (!$exists) {
                    $stmtInsertCase->execute([
                        ':id' => $caseId,
                        ':court' => (string)($c['court'] ?? 'Unknown Court'),
                        ':judge' => $fullName,
                    ]);
                }

                $stmtJudgeCase->execute([
                    ':judge_id' => $id,
                    ':case_id' => $caseId,
                    ':court' => (string)($c['court'] ?? null),
                    ':type' => (string)($c['type'] ?? null),
                    ':subtype' => (string)($c['subtype'] ?? null),
                    ':basis_type' => (string)($c['basis_type'] ?? null),
                    ':filing_date' => ($c['filing_date'] ?? null) !== '' ? ($c['filing_date'] ?? null) : null,
                    ':status' => (string)($c['status'] ?? 'Unknown'),
                ]);
            }
        }

        $pdo->commit();

        $updated = judge_get($pdo, $id);
        if (!$updated) throw new RuntimeException("Updated judge not found");
        return $updated;
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        throw $e;
    }
}

function judges_list(PDO $pdo): array
{
    $columns = judge_columns($pdo);
    $select = "
        SELECT
            j.id,
            j.slug,
            j.full_name,
            j.year_of_election,
            j.area_of_work,
            j.role,
            COALESCE(
                (
                    SELECT jc.court
                    FROM judge_cases jc
                    WHERE jc.judge_id = j.id
                      AND jc.court IS NOT NULL
                      AND jc.court <> ''
                    ORDER BY jc.filing_date DESC, jc.case_id ASC
                    LIMIT 1
                ),
                (
                    SELECT c.name
                    FROM court_cases cc
                    INNER JOIN courts c ON c.id = cc.court_id
                    WHERE cc.judge_name = j.full_name
                      AND c.name IS NOT NULL
                      AND c.name <> ''
                    ORDER BY cc.filing_date DESC, cc.id DESC
                    LIMIT 1
                )
            ) AS primary_court,
            (j.photo IS NOT NULL) AS has_photo";
    if ($columns['is_active']) {
        $select .= ", j.is_active";
    } else {
        $select .= ", 1 AS is_active";
    }
    $select .= " FROM judges j ORDER BY j.full_name ASC";

    $stmt = $pdo->query($select);
    return $stmt->fetchAll() ?: [];
}

function judge_get(PDO $pdo, int $id): ?array
{
    $columns = judge_columns($pdo);
    $select = "
        SELECT
            id,
            slug,
            full_name,
            year_of_election,
            area_of_work,
            role,
            (photo IS NOT NULL) AS has_photo";
    if ($columns['is_active']) {
        $select .= ", is_active";
    } else {
        $select .= ", 1 AS is_active";
    }
    $select .= " FROM judges WHERE id = :id LIMIT 1";
    $stmt = $pdo->prepare($select);
    $stmt->execute([':id' => $id]);
    $judge = $stmt->fetch();
    if (!$judge) return null;

    $judge['photo_url'] = $judge['has_photo']
        ? ("/hackcorruption/backend/api/judges_photo.php?id=" . $judge['id'])
        : null;
    $judge['status'] = ((int)$judge['is_active'] === 1) ? 'Active' : 'Inactive';

    $stmtEdu = $pdo->prepare("
        SELECT institution, location, year
        FROM judge_education
        WHERE judge_id = :id
        ORDER BY year ASC
    ");
    $stmtEdu->execute([':id' => $id]);
    $education = $stmtEdu->fetchAll() ?: [];

    $stmtExp = $pdo->prepare("
        SELECT title, position, start_year, end_year, is_current
        FROM judge_experience
        WHERE judge_id = :id
        ORDER BY start_year ASC
    ");
    $stmtExp->execute([':id' => $id]);
    $experience = $stmtExp->fetchAll() ?: [];

    $stmtMet = $pdo->prepare("
        SELECT avg_duration_days, clearance_rate_percent, total_solved, active_cases, sentence_severity, appeal_reversal_percent
        FROM judge_metrics
        WHERE judge_id = :id
        LIMIT 1
    ");
    $stmtMet->execute([':id' => $id]);
    $metrics = $stmtMet->fetch() ?: null;

    $stmtCases = $pdo->prepare("
        SELECT case_id, court, type, subtype, basis_type, filing_date, status
        FROM judge_cases
        WHERE judge_id = :id
        ORDER BY filing_date DESC, case_id ASC
    ");
    $stmtCases->execute([':id' => $id]);
    $cases = $stmtCases->fetchAll() ?: [];

    return [
        'judge' => $judge,
        'education' => $education,
        'experience' => $experience,
        'metrics' => $metrics,
        'cases' => $cases,
    ];
}

function judge_toggle_active(PDO $pdo, int $id): ?array
{
    $columns = judge_columns($pdo);
    if (!$columns['is_active']) {
        throw new InvalidArgumentException("is_active column is missing on judges table.");
    }

    $stmt = $pdo->prepare("
        UPDATE judges
        SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END
        WHERE id = :id
    ");
    $stmt->execute([':id' => $id]);

    $select = "
        SELECT
            id,
            slug,
            full_name,
            year_of_election,
            area_of_work,
            role,
            (photo IS NOT NULL) AS has_photo";
    $select .= ", is_active FROM judges WHERE id = :id LIMIT 1";
    $stmtFetch = $pdo->prepare($select);
    $stmtFetch->execute([':id' => $id]);
    $judge = $stmtFetch->fetch();
    return $judge ?: null;
}

function judge_photo(PDO $pdo, int $id): ?array
{
    $stmt = $pdo->prepare("SELECT photo, photo_mime FROM judges WHERE id = :id LIMIT 1");
    $stmt->execute([':id' => $id]);
    $row = $stmt->fetch();
    if (!$row) return null;
    return [
        'data' => $row['photo'],
        'mime' => $row['photo_mime'] ?: 'application/octet-stream',
    ];
}
