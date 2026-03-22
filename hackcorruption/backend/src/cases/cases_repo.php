<?php
// backend/src/cases/cases_repo.php

declare(strict_types=1);

function trim_nullable_string(mixed $value): ?string
{
    $text = trim((string)($value ?? ''));
    return $text === '' ? null : $text;
}

function trim_nullable_date(mixed $value): ?string
{
    $text = trim((string)($value ?? ''));
    return $text === '' ? null : $text;
}

function to_nullable_float(mixed $value): ?float
{
    if ($value === null || $value === '') {
        return null;
    }

    if (!is_numeric($value)) {
        return null;
    }

    return (float)$value;
}

function to_nullable_int(mixed $value): ?int
{
    if ($value === null || $value === '') {
        return null;
    }

    if (!is_numeric($value)) {
        return null;
    }

    return (int)$value;
}

function has_non_empty_values(array $values): bool
{
    foreach ($values as $value) {
        if (is_array($value)) {
            if (has_non_empty_values($value)) {
                return true;
            }
            continue;
        }

        if ($value !== null && $value !== '') {
            return true;
        }
    }

    return false;
}

function case_default_detail(): array
{
    return [
        'case_type' => null,
        'case_subtype' => null,
        'basis_type' => null,
        'basis' => null,
        'articles' => null,
        'public_prosecutor_case' => null,
    ];
}

function case_default_financials(): array
{
    return [
        'case_cost' => null,
        'total_case_cost' => null,
    ];
}

function case_default_insights(): array
{
    return [
        'mitigating_factors' => null,
        'plea_deal' => null,
        'duration_days' => null,
        'severity_ratio' => null,
        'sentence_severity' => null,
        'appeal' => null,
    ];
}

function case_payload_main_values(array $payload): array
{
    return [
        'court' => trim_nullable_string($payload['court'] ?? null),
        'judge' => trim_nullable_string($payload['judge'] ?? null),
        'decision_date' => trim_nullable_date($payload['decision_date'] ?? null),
        'legal_area' => trim_nullable_string($payload['legal_area'] ?? null),
        'summary' => trim_nullable_string($payload['summary'] ?? null),
        'status' => trim_nullable_string($payload['case_status'] ?? ($payload['status'] ?? null)),
    ];
}

function case_payload_court_id(array $payload): ?int
{
    return to_nullable_int($payload['court_id'] ?? null);
}

function case_payload_detail_values(array $payload): array
{
    $detail = is_array($payload['case_detail'] ?? null) ? $payload['case_detail'] : [];

    return [
        'case_type' => trim_nullable_string($detail['case_type'] ?? null),
        'case_subtype' => trim_nullable_string($detail['case_subtype'] ?? null),
        'basis_type' => trim_nullable_string($detail['basis_type'] ?? null),
        'basis' => trim_nullable_string($detail['basis'] ?? null),
        'articles' => trim_nullable_string($detail['articles'] ?? null),
        'public_prosecutor_case' => trim_nullable_string($detail['public_prosecutor_case'] ?? null),
    ];
}

function case_payload_financial_values(array $payload): array
{
    $financials = is_array($payload['case_financials'] ?? null) ? $payload['case_financials'] : [];

    return [
        'case_cost' => to_nullable_float($financials['case_cost'] ?? null),
        'total_case_cost' => to_nullable_float($financials['total_case_cost'] ?? null),
    ];
}

function case_payload_insight_values(array $payload): array
{
    $insights = is_array($payload['case_insights'] ?? null) ? $payload['case_insights'] : [];

    return [
        'mitigating_factors' => trim_nullable_string($insights['mitigating_factors'] ?? null),
        'plea_deal' => trim_nullable_string($insights['plea_deal'] ?? null),
        'duration_days' => to_nullable_int($insights['duration_days'] ?? null),
        'severity_ratio' => to_nullable_float($insights['severity_ratio'] ?? null),
        'sentence_severity' => trim_nullable_string($insights['sentence_severity'] ?? null),
        'appeal' => trim_nullable_string($insights['appeal'] ?? null),
    ];
}

function case_payload_timeline_values(array $payload): array
{
    $timeline = is_array($payload['case_timeline'] ?? null) ? $payload['case_timeline'] : [];
    $items = [];

    foreach ($timeline as $item) {
        if (!is_array($item)) {
            continue;
        }

        $eventName = trim((string)($item['event_name'] ?? ''));
        $eventDate = trim((string)($item['event_date'] ?? ''));

        if ($eventName === '' && $eventDate === '') {
            continue;
        }

        $items[] = [
            'event_name' => $eventName,
            'event_date' => $eventDate,
        ];
    }

    return $items;
}

function case_overlay_non_empty(array $base, array $overlay): array
{
    foreach ($overlay as $key => $value) {
        if ($value !== null && $value !== '') {
            $base[$key] = $value;
        }
    }

    return $base;
}

function case_related_sections(PDO $pdo, string $caseId): array
{
    $detailStmt = $pdo->prepare("
        SELECT case_type, case_subtype, basis_type, basis, articles, public_prosecutor_case
        FROM case_detail
        WHERE case_id = :id
        ORDER BY id DESC
        LIMIT 1
    ");
    $detailStmt->execute([':id' => $caseId]);
    $detail = $detailStmt->fetch(PDO::FETCH_ASSOC) ?: case_default_detail();

    $financialStmt = $pdo->prepare("
        SELECT case_cost, total_case_cost
        FROM case_financials
        WHERE case_id = :id
        ORDER BY id DESC
        LIMIT 1
    ");
    $financialStmt->execute([':id' => $caseId]);
    $financials = $financialStmt->fetch(PDO::FETCH_ASSOC) ?: case_default_financials();

    $insightsStmt = $pdo->prepare("
        SELECT mitigating_factors, plea_deal, duration_days, severity_ratio, sentence_severity, appeal
        FROM case_insights
        WHERE case_id = :id
        ORDER BY id DESC
        LIMIT 1
    ");
    $insightsStmt->execute([':id' => $caseId]);
    $insights = $insightsStmt->fetch(PDO::FETCH_ASSOC) ?: case_default_insights();

    $timelineStmt = $pdo->prepare("
        SELECT event_name, event_date
        FROM case_timeline
        WHERE case_id = :id
        ORDER BY event_date ASC, id ASC
    ");
    $timelineStmt->execute([':id' => $caseId]);
    $timeline = $timelineStmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

    return [
        'case_detail' => array_merge(case_default_detail(), $detail),
        'case_financials' => array_merge(case_default_financials(), $financials),
        'case_insights' => array_merge(case_default_insights(), $insights),
        'case_timeline' => $timeline,
    ];
}

function replace_case_detail(PDO $pdo, string $caseId, array $detail): void
{
    $deleteStmt = $pdo->prepare("DELETE FROM case_detail WHERE case_id = :id");
    $deleteStmt->execute([':id' => $caseId]);

    if (!has_non_empty_values($detail)) {
        return;
    }

    $insertStmt = $pdo->prepare("
        INSERT INTO case_detail (case_id, case_type, case_subtype, basis_type, basis, articles, public_prosecutor_case)
        VALUES (:case_id, :case_type, :case_subtype, :basis_type, :basis, :articles, :public_prosecutor_case)
    ");
    $insertStmt->execute([
        ':case_id' => $caseId,
        ':case_type' => $detail['case_type'],
        ':case_subtype' => $detail['case_subtype'],
        ':basis_type' => $detail['basis_type'],
        ':basis' => $detail['basis'],
        ':articles' => $detail['articles'],
        ':public_prosecutor_case' => $detail['public_prosecutor_case'],
    ]);
}

function replace_case_financials(PDO $pdo, string $caseId, array $financials): void
{
    $deleteStmt = $pdo->prepare("DELETE FROM case_financials WHERE case_id = :id");
    $deleteStmt->execute([':id' => $caseId]);

    if (!has_non_empty_values($financials)) {
        return;
    }

    $insertStmt = $pdo->prepare("
        INSERT INTO case_financials (case_id, case_cost, total_case_cost)
        VALUES (:case_id, :case_cost, :total_case_cost)
    ");
    $insertStmt->execute([
        ':case_id' => $caseId,
        ':case_cost' => $financials['case_cost'],
        ':total_case_cost' => $financials['total_case_cost'],
    ]);
}

function replace_case_insights(PDO $pdo, string $caseId, array $insights): void
{
    $deleteStmt = $pdo->prepare("DELETE FROM case_insights WHERE case_id = :id");
    $deleteStmt->execute([':id' => $caseId]);

    if (!has_non_empty_values($insights)) {
        return;
    }

    $insertStmt = $pdo->prepare("
        INSERT INTO case_insights
            (case_id, mitigating_factors, plea_deal, duration_days, severity_ratio, sentence_severity, appeal)
        VALUES
            (:case_id, :mitigating_factors, :plea_deal, :duration_days, :severity_ratio, :sentence_severity, :appeal)
    ");
    $insertStmt->execute([
        ':case_id' => $caseId,
        ':mitigating_factors' => $insights['mitigating_factors'],
        ':plea_deal' => $insights['plea_deal'],
        ':duration_days' => $insights['duration_days'],
        ':severity_ratio' => $insights['severity_ratio'],
        ':sentence_severity' => $insights['sentence_severity'],
        ':appeal' => $insights['appeal'],
    ]);
}

function replace_case_timeline(PDO $pdo, string $caseId, array $timeline): void
{
    $deleteStmt = $pdo->prepare("DELETE FROM case_timeline WHERE case_id = :id");
    $deleteStmt->execute([':id' => $caseId]);

    if ($timeline === []) {
        return;
    }

    $insertStmt = $pdo->prepare("
        INSERT INTO case_timeline (case_id, event_date, event_name)
        VALUES (:case_id, :event_date, :event_name)
    ");

    foreach ($timeline as $item) {
        $eventName = trim((string)($item['event_name'] ?? ''));
        $eventDate = trim((string)($item['event_date'] ?? ''));

        if ($eventName === '' || $eventDate === '') {
            continue;
        }

        $insertStmt->execute([
            ':case_id' => $caseId,
            ':event_date' => $eventDate,
            ':event_name' => $eventName,
        ]);
    }
}

function replace_case_related_sections(PDO $pdo, string $caseId, array $payload): void
{
    replace_case_detail($pdo, $caseId, case_payload_detail_values($payload));
    replace_case_financials($pdo, $caseId, case_payload_financial_values($payload));
    replace_case_insights($pdo, $caseId, case_payload_insight_values($payload));
    replace_case_timeline($pdo, $caseId, case_payload_timeline_values($payload));
}

function find_court(PDO $pdo, ?int $courtId, ?string $courtName): array
{
    if ($courtId !== null) {
        $stmt = $pdo->prepare("SELECT id, name, slug FROM courts WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $courtId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            return $row;
        }

        throw new InvalidArgumentException("Selected court was not found");
    }

    if ($courtName !== null) {
        $stmt = $pdo->prepare("SELECT id, name, slug FROM courts WHERE name = :name LIMIT 1");
        $stmt->execute([':name' => $courtName]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            return $row;
        }

        $stmt = $pdo->prepare("SELECT id, name, slug FROM courts WHERE slug = :slug LIMIT 1");
        $stmt->execute([':slug' => $courtName]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            return $row;
        }
    }

    throw new InvalidArgumentException("Missing required field: court_id");
}

function upsert_shadow_case(PDO $pdo, string $caseId, array $mainValues): void
{
    $existsStmt = $pdo->prepare("SELECT 1 FROM cases WHERE id = :id LIMIT 1");
    $existsStmt->execute([':id' => $caseId]);
    $exists = (bool)$existsStmt->fetchColumn();

    if ($exists) {
        $updateStmt = $pdo->prepare("
            UPDATE cases
            SET court = :court, judge = :judge, decision_date = :decision_date, legal_area = :legal_area, summary = :summary
            WHERE id = :id
        ");
        $updateStmt->execute([
            ':id' => $caseId,
            ':court' => $mainValues['court'],
            ':judge' => $mainValues['judge'],
            ':decision_date' => $mainValues['decision_date'],
            ':legal_area' => $mainValues['legal_area'],
            ':summary' => $mainValues['summary'],
        ]);
        return;
    }

    $insertStmt = $pdo->prepare("
        INSERT INTO cases (id, court, judge, decision_date, legal_area, summary)
        VALUES (:id, :court, :judge, :decision_date, :legal_area, :summary)
    ");
    $insertStmt->execute([
        ':id' => $caseId,
        ':court' => $mainValues['court'],
        ':judge' => $mainValues['judge'],
        ':decision_date' => $mainValues['decision_date'],
        ':legal_area' => $mainValues['legal_area'],
        ':summary' => $mainValues['summary'],
    ]);
}

function sync_case_judge_links(PDO $pdo, string $caseId, array $mainValues, array $detailValues): void
{
    $deleteStmt = $pdo->prepare("DELETE FROM judge_cases WHERE case_id = :case_id");
    $deleteStmt->execute([':case_id' => $caseId]);

    if ($mainValues['judge'] === null) {
        return;
    }

    $judgeStmt = $pdo->prepare("SELECT id FROM judges WHERE full_name = :full_name");
    $judgeStmt->execute([':full_name' => $mainValues['judge']]);
    $judgeIds = $judgeStmt->fetchAll(PDO::FETCH_COLUMN) ?: [];

    if ($judgeIds === []) {
        return;
    }

    $insertStmt = $pdo->prepare("
        INSERT INTO judge_cases (judge_id, case_id, court, type, subtype, basis_type, filing_date, status)
        VALUES (:judge_id, :case_id, :court, :type, :subtype, :basis_type, :filing_date, :status)
        ON DUPLICATE KEY UPDATE
            court = VALUES(court),
            type = VALUES(type),
            subtype = VALUES(subtype),
            basis_type = VALUES(basis_type),
            filing_date = VALUES(filing_date),
            status = VALUES(status)
    ");

    foreach ($judgeIds as $judgeId) {
        $insertStmt->execute([
            ':judge_id' => (int)$judgeId,
            ':case_id' => $caseId,
            ':court' => $mainValues['court'],
            ':type' => $detailValues['case_type'],
            ':subtype' => $detailValues['case_subtype'],
            ':basis_type' => $detailValues['basis_type'],
            ':filing_date' => $mainValues['decision_date'],
            ':status' => $mainValues['status'] ?? 'Unknown',
        ]);
    }
}

function case_query_base(): string
{
    return "
        SELECT
            cc.id AS court_case_row_id,
            cc.court_id,
            cc.case_id,
            cc.type,
            cc.subtype,
            cc.basis_type,
            cc.filing_date,
            cc.status,
            cc.judge_name,
            cc.legal_area,
            cc.basis_group,
            cc.basis,
            cc.download_link,
            cc.summary,
            c.name AS court_name,
            c.slug AS court_slug
        FROM court_cases cc
        INNER JOIN courts c ON c.id = cc.court_id
    ";
}

function case_find_by_record_key(PDO $pdo, int $rowId): ?array
{
    $stmt = $pdo->prepare(case_query_base() . " WHERE cc.id = :id LIMIT 1");
    $stmt->execute([':id' => $rowId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    return $row ?: null;
}

function case_find_by_case_id(PDO $pdo, string $caseId): ?array
{
    $stmt = $pdo->prepare(case_query_base() . "
        WHERE cc.case_id = :case_id
        ORDER BY cc.filing_date DESC, cc.id DESC
        LIMIT 1
    ");
    $stmt->execute([':case_id' => $caseId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    return $row ?: null;
}

function case_find_row(PDO $pdo, string $identifier): ?array
{
    if (preg_match('/^courtcase-(\d+)$/', $identifier, $m)) {
        return case_find_by_record_key($pdo, (int)$m[1]);
    }

    return case_find_by_case_id($pdo, $identifier);
}

function map_case_row_summary(array $row): ?string
{
    return $row['summary']
        ?? $row['basis']
        ?? $row['basis_group']
        ?? $row['basis_type']
        ?? $row['subtype']
        ?? $row['type']
        ?? null;
}

function map_case_detail_response(PDO $pdo, array $row): array
{
    $caseId = (string)$row['case_id'];
    $sections = case_related_sections($pdo, $caseId);

    $detail = case_default_detail();
    $detail = case_overlay_non_empty($detail, [
        'case_type' => $row['type'] ?? null,
        'case_subtype' => $row['subtype'] ?? null,
        'basis_type' => $row['basis_group'] ?? ($row['basis_type'] ?? null),
        'basis' => $row['basis'] ?? null,
    ]);
    $detail = case_overlay_non_empty($detail, $sections['case_detail']);

    return [
        'record_key' => 'courtcase-' . $row['court_case_row_id'],
        'id' => $caseId,
        'court_id' => isset($row['court_id']) ? (int)$row['court_id'] : null,
        'court' => $row['court_name'] ?? '',
        'judge' => $row['judge_name'] ?? null,
        'decision_date' => $row['filing_date'] ?? null,
        'legal_area' => $row['legal_area'] ?? ($row['type'] ?? null),
        'summary' => map_case_row_summary($row),
        'source' => 'court_file',
        'court_slug' => $row['court_slug'] ?? null,
        'case_status' => $row['status'] ?? 'Unknown',
        'can_edit' => true,
        'can_delete' => true,
        'case_detail' => $detail,
        'case_financials' => $sections['case_financials'],
        'case_insights' => $sections['case_insights'],
        'case_timeline' => $sections['case_timeline'],
    ];
}

function refresh_shadow_case_from_court_case(PDO $pdo, string $caseId): void
{
    $row = case_find_by_case_id($pdo, $caseId);
    if (!$row) {
        return;
    }

    upsert_shadow_case($pdo, $caseId, [
        'court' => $row['court_name'] ?? null,
        'judge' => $row['judge_name'] ?? null,
        'decision_date' => $row['filing_date'] ?? null,
        'legal_area' => $row['legal_area'] ?? ($row['type'] ?? null),
        'summary' => map_case_row_summary($row),
    ]);
}

function case_list(PDO $pdo, bool $includeCourtFiles = false): array
{
    $stmt = $pdo->query("
        SELECT
            CONCAT('courtcase-', cc.id) AS record_key,
            cc.case_id AS id,
            cc.court_id AS court_id,
            c.name AS court,
            cc.judge_name AS judge,
            cc.filing_date AS decision_date,
            COALESCE(cc.legal_area, cc.type) AS legal_area,
            COALESCE(cc.summary, cc.basis, cc.basis_group, cc.basis_type, cc.subtype, cc.type) AS summary,
            'court_file' AS source,
            c.slug AS court_slug,
            cc.status AS case_status,
            cd.case_type AS case_type,
            cd.case_subtype AS case_subtype,
            COALESCE(cd.basis_type, cc.basis_group, cc.basis_type) AS basis_type,
            COALESCE(cd.basis, cc.basis) AS basis,
            cd.articles AS articles,
            cd.public_prosecutor_case AS public_prosecutor_case,
            cf.case_cost AS case_cost,
            cf.total_case_cost AS total_case_cost,
            cc.download_link AS download_link,
            1 AS can_edit,
            1 AS can_delete
        FROM court_cases cc
        INNER JOIN courts c ON c.id = cc.court_id
        LEFT JOIN (
            SELECT d.case_id, d.case_type, d.case_subtype, d.basis_type, d.basis, d.articles, d.public_prosecutor_case
            FROM case_detail d
            INNER JOIN (
                SELECT case_id, MAX(id) AS max_id
                FROM case_detail
                GROUP BY case_id
            ) latest_case_detail ON latest_case_detail.max_id = d.id
        ) cd ON cd.case_id = cc.case_id
        LEFT JOIN (
            SELECT f.case_id, f.case_cost, f.total_case_cost
            FROM case_financials f
            INNER JOIN (
                SELECT case_id, MAX(id) AS max_id
                FROM case_financials
                GROUP BY case_id
            ) latest_case_financials ON latest_case_financials.max_id = f.id
        ) cf ON cf.case_id = cc.case_id
        ORDER BY cc.filing_date DESC, cc.id DESC
    ");

    return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
}

function case_get(PDO $pdo, string $caseId): ?array
{
    $row = case_find_row($pdo, $caseId);
    if (!$row) {
        return null;
    }

    return map_case_detail_response($pdo, $row);
}

function case_create(PDO $pdo, array $payload): array
{
    $id = trim((string)($payload['id'] ?? ''));
    $courtId = case_payload_court_id($payload);
    $mainValues = case_payload_main_values($payload);
    $detailValues = case_payload_detail_values($payload);

    if ($id === '' || $courtId === null) {
        throw new InvalidArgumentException("Missing required fields: id, court_id");
    }

    $existsStmt = $pdo->prepare("SELECT 1 FROM court_cases WHERE case_id = :id LIMIT 1");
    $existsStmt->execute([':id' => $id]);
    if ($existsStmt->fetchColumn()) {
        throw new InvalidArgumentException("Case with id '$id' already exists");
    }

    $pdo->beginTransaction();

    try {
        $court = find_court($pdo, $courtId, $mainValues['court']);
        $storedMainValues = $mainValues;
        $storedMainValues['court'] = $court['name'];
        upsert_shadow_case($pdo, $id, $storedMainValues);

        $status = $storedMainValues['status'] ?? 'Unknown';
        $insertStmt = $pdo->prepare("
            INSERT INTO court_cases
                (court_id, case_id, type, subtype, basis_type, filing_date, status, judge_name, legal_area, basis_group, basis, download_link, summary)
            VALUES
                (:court_id, :case_id, :type, :subtype, :basis_type, :filing_date, :status, :judge_name, :legal_area, :basis_group, :basis, :download_link, :summary)
        ");
        $insertStmt->execute([
            ':court_id' => (int)$court['id'],
            ':case_id' => $id,
            ':type' => $detailValues['case_type'],
            ':subtype' => $detailValues['case_subtype'],
            ':basis_type' => $detailValues['basis_type'],
            ':filing_date' => $mainValues['decision_date'],
            ':status' => $status,
            ':judge_name' => $mainValues['judge'],
            ':legal_area' => $mainValues['legal_area'],
            ':basis_group' => $detailValues['basis_type'],
            ':basis' => $detailValues['basis'],
            ':download_link' => trim_nullable_string($payload['download_link'] ?? null),
            ':summary' => $mainValues['summary'],
        ]);
        $rowId = (int)$pdo->lastInsertId();

        replace_case_related_sections($pdo, $id, $payload);
        sync_case_judge_links($pdo, $id, $storedMainValues, $detailValues);

        $pdo->commit();
        return case_get($pdo, 'courtcase-' . $rowId) ?? [];
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $e;
    }
}

function case_update(PDO $pdo, string $caseId, array $payload): array
{
    $existing = case_find_row($pdo, $caseId);
    if (!$existing) {
        throw new InvalidArgumentException("Case '$caseId' not found");
    }

    $courtId = case_payload_court_id($payload);
    $mainValues = case_payload_main_values($payload);
    $detailValues = case_payload_detail_values($payload);

    if ($courtId === null) {
        throw new InvalidArgumentException("Missing required field: court_id");
    }

    $pdo->beginTransaction();

    try {
        $court = find_court($pdo, $courtId, $mainValues['court']);
        $storedMainValues = $mainValues;
        $storedMainValues['court'] = $court['name'];
        $status = $storedMainValues['status'] ?? ($existing['status'] ?? 'Unknown');

        $updateStmt = $pdo->prepare("
            UPDATE court_cases
            SET
                court_id = :court_id,
                type = :type,
                subtype = :subtype,
                basis_type = :basis_type,
                filing_date = :filing_date,
                status = :status,
                judge_name = :judge_name,
                legal_area = :legal_area,
                basis_group = :basis_group,
                basis = :basis,
                download_link = :download_link,
                summary = :summary
            WHERE id = :id
        ");
        $updateStmt->execute([
            ':id' => (int)$existing['court_case_row_id'],
            ':court_id' => (int)$court['id'],
            ':type' => $detailValues['case_type'],
            ':subtype' => $detailValues['case_subtype'],
            ':basis_type' => $detailValues['basis_type'],
            ':filing_date' => $mainValues['decision_date'],
            ':status' => $status,
            ':judge_name' => $mainValues['judge'],
            ':legal_area' => $mainValues['legal_area'],
            ':basis_group' => $detailValues['basis_type'],
            ':basis' => $detailValues['basis'],
            ':download_link' => trim_nullable_string($payload['download_link'] ?? ($existing['download_link'] ?? null)),
            ':summary' => $mainValues['summary'],
        ]);

        $storedMainValues['status'] = $status;

        upsert_shadow_case($pdo, (string)$existing['case_id'], $storedMainValues);
        replace_case_related_sections($pdo, (string)$existing['case_id'], $payload);
        sync_case_judge_links($pdo, (string)$existing['case_id'], $storedMainValues, $detailValues);

        $pdo->commit();
        return case_get($pdo, 'courtcase-' . $existing['court_case_row_id']) ?? [];
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $e;
    }
}

function case_delete(PDO $pdo, string $caseId): bool
{
    $existing = case_find_row($pdo, $caseId);
    if (!$existing) {
        return false;
    }

    $caseIdValue = (string)$existing['case_id'];
    $rowId = (int)$existing['court_case_row_id'];

    $pdo->beginTransaction();

    try {
        $deleteCourtCaseStmt = $pdo->prepare("DELETE FROM court_cases WHERE id = :id");
        $deleteCourtCaseStmt->execute([':id' => $rowId]);

        $remainingStmt = $pdo->prepare("SELECT COUNT(*) FROM court_cases WHERE case_id = :case_id");
        $remainingStmt->execute([':case_id' => $caseIdValue]);
        $remaining = (int)$remainingStmt->fetchColumn();

        if ($remaining === 0) {
            $deleteShadowStmt = $pdo->prepare("DELETE FROM cases WHERE id = :id");
            $deleteShadowStmt->execute([':id' => $caseIdValue]);
        } else {
            refresh_shadow_case_from_court_case($pdo, $caseIdValue);
        }

        $pdo->commit();
        return true;
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $e;
    }
}
