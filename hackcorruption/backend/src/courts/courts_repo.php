<?php
// backend/src/courts/courts_repo.php

declare(strict_types=1);

function courts_columns(PDO $pdo): array
{
    static $cached = null;
    if ($cached !== null) return $cached;

    $candidates = ['website', 'is_active'];
    $in = "'" . implode("','", $candidates) . "'";
    $stmt = $pdo->query("
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'courts'
          AND COLUMN_NAME IN ($in)
    ");
    $cols = $stmt->fetchAll(PDO::FETCH_COLUMN) ?: [];

    $map = [];
    foreach ($candidates as $c) {
        $map[$c] = in_array($c, $cols, true);
    }
    $cached = $map;
    return $cached;
}

function courts_slug_is_url_safe(string $slug): bool
{
    return (bool)preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug);
}

function court_slug_exists(PDO $pdo, string $slug, ?int $excludeId = null): bool
{
    if ($excludeId !== null) {
        $stmt = $pdo->prepare("SELECT 1 FROM courts WHERE slug = :slug AND id <> :id LIMIT 1");
        $stmt->execute([':slug' => $slug, ':id' => $excludeId]);
    } else {
        $stmt = $pdo->prepare("SELECT 1 FROM courts WHERE slug = :slug LIMIT 1");
        $stmt->execute([':slug' => $slug]);
    }
    return (bool)$stmt->fetchColumn();
}

function courts_normalize_phone($value): ?string
{
    if (is_array($value)) {
        $parts = [];
        foreach ($value as $item) {
            if (!is_string($item)) continue;
            $v = trim($item);
            if ($v !== '') $parts[] = $v;
        }
        return !empty($parts) ? implode('; ', $parts) : null;
    }

    if ($value === null) return null;
    if (!is_string($value)) return null;
    $value = trim($value);
    return $value === '' ? null : $value;
}

function courts_status_to_is_active($value): ?int
{
    if ($value === null || $value === '') return null;
    if (is_string($value)) {
        $v = strtolower(trim($value));
        if ($v === 'active') return 1;
        if ($v === 'inactive') return 0;
    }
    if (is_bool($value)) return $value ? 1 : 0;
    if (is_numeric($value)) return ((int)$value) === 1 ? 1 : 0;
    return null;
}

function courts_list(PDO $pdo): array
{
    $columns = courts_columns($pdo);

    $select = "SELECT id, slug, name, court_type, address, phone, jurisdiction, about";
    if (!empty($columns['website'])) {
        $select .= ", website";
    } else {
        $select .= ", NULL AS website";
    }
    if (!empty($columns['is_active'])) {
        $select .= ", is_active";
    } else {
        $select .= ", 1 AS is_active";
    }
    $select .= " FROM courts ORDER BY name ASC";

    $stmt = $pdo->query($select);
    return $stmt->fetchAll() ?: [];
}

function courts_fetch_base(PDO $pdo, string $idOrSlug): ?array
{
    $columns = courts_columns($pdo);

    $select = "SELECT id, slug, name, court_type, address, phone, jurisdiction, about";
    if (!empty($columns['website'])) {
        $select .= ", website";
    } else {
        $select .= ", NULL AS website";
    }
    if (!empty($columns['is_active'])) {
        $select .= ", is_active";
    } else {
        $select .= ", 1 AS is_active";
    }
    $select .= " FROM courts WHERE ";

    if (ctype_digit($idOrSlug)) {
        $stmt = $pdo->prepare($select . "id = :id LIMIT 1");
        $stmt->execute([':id' => (int)$idOrSlug]);
        $row = $stmt->fetch();
        if ($row) return $row;
    }

    $stmt = $pdo->prepare($select . "slug = :slug LIMIT 1");
    $stmt->execute([':slug' => $idOrSlug]);
    $row = $stmt->fetch();
    return $row ?: null;
}

function court_metrics_list(PDO $pdo, int $courtId): array
{
    $stmt = $pdo->prepare("
        SELECT total_cases, clearance_rate_percent, active_cases, avg_duration_days, reversal_rate_percent, total_judges
        FROM court_metrics
        WHERE court_id = :id
        LIMIT 1
    ");
    $stmt->execute([':id' => $courtId]);
    $row = $stmt->fetch();
    if (!$row) return [];

    $metrics = [];
    if ($row['total_cases'] !== null) {
        $metrics[] = ['label' => 'Total Cases', 'value' => (string)$row['total_cases']];
    }
    if ($row['clearance_rate_percent'] !== null) {
        $val = rtrim(rtrim((string)$row['clearance_rate_percent'], '0'), '.');
        $metrics[] = ['label' => 'Clearance Rate', 'value' => $val . '%'];
    }
    if ($row['active_cases'] !== null) {
        $metrics[] = ['label' => 'Active Cases', 'value' => (string)$row['active_cases']];
    }
    if ($row['avg_duration_days'] !== null) {
        $metrics[] = ['label' => 'Avg Duration', 'value' => (string)$row['avg_duration_days'] . ' days'];
    }
    if ($row['reversal_rate_percent'] !== null) {
        $val = rtrim(rtrim((string)$row['reversal_rate_percent'], '0'), '.');
        $metrics[] = ['label' => 'Reversal Rate', 'value' => $val . '%'];
    }
    if ($row['total_judges'] !== null) {
        $metrics[] = ['label' => 'Total Judges', 'value' => (string)$row['total_judges']];
    }

    return $metrics;
}

function court_case_types_list(PDO $pdo, int $courtId): array
{
    $stmt = $pdo->prepare("
        SELECT case_type_label, total_cases
        FROM court_case_type_stats
        WHERE court_id = :id
        ORDER BY sort_order ASC, case_type_label ASC
    ");
    $stmt->execute([':id' => $courtId]);
    $rows = $stmt->fetchAll() ?: [];

    $out = [];
    foreach ($rows as $r) {
        $out[] = [
            'label' => $r['case_type_label'] ?? '',
            'value' => (int)($r['total_cases'] ?? 0),
        ];
    }
    return $out;
}

function court_cases_per_year_list(PDO $pdo, int $courtId): array
{
    $stmt = $pdo->prepare("
        SELECT year, total_cases
        FROM court_cases_per_year
        WHERE court_id = :id
        ORDER BY year ASC
    ");
    $stmt->execute([':id' => $courtId]);
    $rows = $stmt->fetchAll() ?: [];

    $out = [];
    foreach ($rows as $r) {
        $out[] = [
            'label' => (string)($r['year'] ?? ''),
            'value' => (int)($r['total_cases'] ?? 0),
        ];
    }
    return $out;
}

function court_avg_time_by_type_list(PDO $pdo, int $courtId): array
{
    $stmt = $pdo->prepare("
        SELECT case_type_label, avg_days
        FROM court_avg_time_by_case_type
        WHERE court_id = :id
        ORDER BY avg_days DESC, case_type_label ASC
    ");
    $stmt->execute([':id' => $courtId]);
    $rows = $stmt->fetchAll() ?: [];

    $out = [];
    foreach ($rows as $r) {
        $out[] = [
            'label' => $r['case_type_label'] ?? '',
            'value' => (float)($r['avg_days'] ?? 0),
        ];
    }
    return $out;
}

function court_avg_cost_by_type_list(PDO $pdo, int $courtId): array
{
    $stmt = $pdo->prepare("
        SELECT case_type_label, avg_cost_eur
        FROM court_avg_cost_by_case_type
        WHERE court_id = :id
        ORDER BY avg_cost_eur DESC, case_type_label ASC
    ");
    $stmt->execute([':id' => $courtId]);
    $rows = $stmt->fetchAll() ?: [];

    $out = [];
    foreach ($rows as $r) {
        $out[] = [
            'label' => $r['case_type_label'] ?? '',
            'value' => (float)($r['avg_cost_eur'] ?? 0),
        ];
    }
    return $out;
}

function court_cases_list(PDO $pdo, int $courtId): array
{
    $stmt = $pdo->prepare("
        SELECT case_id, type, subtype, basis_type, filing_date, status
        FROM court_cases
        WHERE court_id = :id
        ORDER BY filing_date DESC, case_id ASC
    ");
    $stmt->execute([':id' => $courtId]);
    $rows = $stmt->fetchAll() ?: [];

    $out = [];
    foreach ($rows as $r) {
        $out[] = [
            'id' => $r['case_id'] ?? '',
            'type' => $r['type'] ?? '',
            'subtype' => $r['subtype'] ?? '',
            'basisType' => $r['basis_type'] ?? '',
            'filingDate' => $r['filing_date'] ?? '',
            'status' => $r['status'] ?? 'Unknown',
        ];
    }
    return $out;
}

function court_get(PDO $pdo, string $idOrSlug): ?array
{
    $base = courts_fetch_base($pdo, $idOrSlug);
    if (!$base) return null;

    $courtId = (int)$base['id'];

    $base['metrics'] = court_metrics_list($pdo, $courtId);
    $base['caseTypes'] = court_case_types_list($pdo, $courtId);
    $base['casesPerYear'] = court_cases_per_year_list($pdo, $courtId);
    $base['avgTimeByType'] = court_avg_time_by_type_list($pdo, $courtId);
    $base['avgCostByType'] = court_avg_cost_by_type_list($pdo, $courtId);
    $base['cases'] = court_cases_list($pdo, $courtId);

    return $base;
}

function court_extract_numeric($value): ?float
{
    if ($value === null) return null;
    if (is_numeric($value)) return (float)$value;
    if (!is_string($value)) return null;

    $v = strtolower(trim($value));
    if ($v === '') return null;
    $v = str_replace(['%', 'days', 'day', ','], '', $v);
    $v = trim($v);
    return is_numeric($v) ? (float)$v : null;
}

function court_is_list_array(array $value): bool
{
    if ($value === []) return true;
    return array_keys($value) === range(0, count($value) - 1);
}

function court_normalize_metrics($input): array
{
    $result = [
        'total_cases' => null,
        'clearance_rate_percent' => null,
        'active_cases' => null,
        'avg_duration_days' => null,
        'reversal_rate_percent' => null,
        'total_judges' => null,
    ];

    if (!is_array($input)) return $result;

    if (court_is_list_array($input)) {
        foreach ($input as $item) {
            if (!is_array($item)) continue;
            $label = strtolower(trim((string)($item['label'] ?? '')));
            $value = $item['value'] ?? null;
            if ($label === '') continue;

            if (strpos($label, 'total cases') !== false) {
                $v = court_extract_numeric($value);
                $result['total_cases'] = $v !== null ? (int)$v : null;
            } elseif (strpos($label, 'clearance') !== false) {
                $result['clearance_rate_percent'] = court_extract_numeric($value);
            } elseif (strpos($label, 'active cases') !== false) {
                $v = court_extract_numeric($value);
                $result['active_cases'] = $v !== null ? (int)$v : null;
            } elseif (strpos($label, 'avg duration') !== false) {
                $v = court_extract_numeric($value);
                $result['avg_duration_days'] = $v !== null ? (int)$v : null;
            } elseif (strpos($label, 'reversal') !== false) {
                $result['reversal_rate_percent'] = court_extract_numeric($value);
            } elseif (strpos($label, 'total judges') !== false) {
                $v = court_extract_numeric($value);
                $result['total_judges'] = $v !== null ? (int)$v : null;
            }
        }
        return $result;
    }

    if (array_key_exists('total_cases', $input)) {
        $v = court_extract_numeric($input['total_cases']);
        $result['total_cases'] = $v !== null ? (int)$v : null;
    }
    $result['clearance_rate_percent'] = court_extract_numeric($input['clearance_rate_percent'] ?? null);
    if (array_key_exists('active_cases', $input)) {
        $v = court_extract_numeric($input['active_cases']);
        $result['active_cases'] = $v !== null ? (int)$v : null;
    }
    if (array_key_exists('avg_duration_days', $input)) {
        $v = court_extract_numeric($input['avg_duration_days']);
        $result['avg_duration_days'] = $v !== null ? (int)$v : null;
    }
    $result['reversal_rate_percent'] = court_extract_numeric($input['reversal_rate_percent'] ?? null);
    if (array_key_exists('total_judges', $input)) {
        $v = court_extract_numeric($input['total_judges']);
        $result['total_judges'] = $v !== null ? (int)$v : null;
    }

    return $result;
}

function court_insert_metrics(PDO $pdo, int $courtId, $metrics): void
{
    $normalized = court_normalize_metrics($metrics);
    $allNull = true;
    foreach ($normalized as $value) {
        if ($value !== null) {
            $allNull = false;
            break;
        }
    }
    if ($allNull) return;

    $stmt = $pdo->prepare("
        INSERT INTO court_metrics
          (court_id, total_cases, clearance_rate_percent, active_cases, avg_duration_days, reversal_rate_percent, total_judges)
        VALUES
          (:court_id, :total_cases, :clearance_rate_percent, :active_cases, :avg_duration_days, :reversal_rate_percent, :total_judges)
    ");
    $stmt->execute([
        ':court_id' => $courtId,
        ':total_cases' => $normalized['total_cases'],
        ':clearance_rate_percent' => $normalized['clearance_rate_percent'],
        ':active_cases' => $normalized['active_cases'],
        ':avg_duration_days' => $normalized['avg_duration_days'],
        ':reversal_rate_percent' => $normalized['reversal_rate_percent'],
        ':total_judges' => $normalized['total_judges'],
    ]);
}

function court_replace_metrics(PDO $pdo, int $courtId, $metrics): void
{
    $pdo->prepare("DELETE FROM court_metrics WHERE court_id = :id")->execute([':id' => $courtId]);
    court_insert_metrics($pdo, $courtId, $metrics);
}

function court_replace_case_types(PDO $pdo, int $courtId, array $items): void
{
    $pdo->prepare("DELETE FROM court_case_type_stats WHERE court_id = :id")->execute([':id' => $courtId]);
    if (empty($items)) return;

    $stmt = $pdo->prepare("
        INSERT INTO court_case_type_stats (court_id, case_type_label, total_cases, sort_order)
        VALUES (:court_id, :label, :total_cases, :sort_order)
    ");
    $i = 0;
    foreach ($items as $item) {
        if (!is_array($item)) continue;
        $label = trim((string)($item['label'] ?? ''));
        if ($label === '') continue;
        $value = court_extract_numeric($item['value'] ?? 0) ?? 0;
        $stmt->execute([
            ':court_id' => $courtId,
            ':label' => $label,
            ':total_cases' => (int)$value,
            ':sort_order' => $i++,
        ]);
    }
}

function court_replace_cases_per_year(PDO $pdo, int $courtId, array $items): void
{
    $pdo->prepare("DELETE FROM court_cases_per_year WHERE court_id = :id")->execute([':id' => $courtId]);
    if (empty($items)) return;

    $stmt = $pdo->prepare("
        INSERT INTO court_cases_per_year (court_id, year, total_cases)
        VALUES (:court_id, :year, :total_cases)
    ");
    foreach ($items as $item) {
        if (!is_array($item)) continue;
        $label = trim((string)($item['label'] ?? ''));
        if ($label === '') continue;
        $year = (int)$label;
        $value = court_extract_numeric($item['value'] ?? 0) ?? 0;
        if ($year <= 0) continue;
        $stmt->execute([
            ':court_id' => $courtId,
            ':year' => $year,
            ':total_cases' => (int)$value,
        ]);
    }
}

function court_replace_avg_time(PDO $pdo, int $courtId, array $items): void
{
    $pdo->prepare("DELETE FROM court_avg_time_by_case_type WHERE court_id = :id")->execute([':id' => $courtId]);
    if (empty($items)) return;

    $stmt = $pdo->prepare("
        INSERT INTO court_avg_time_by_case_type (court_id, case_type_label, avg_days)
        VALUES (:court_id, :label, :avg_days)
    ");
    foreach ($items as $item) {
        if (!is_array($item)) continue;
        $label = trim((string)($item['label'] ?? ''));
        if ($label === '') continue;
        $value = court_extract_numeric($item['value'] ?? 0) ?? 0;
        $stmt->execute([
            ':court_id' => $courtId,
            ':label' => $label,
            ':avg_days' => $value,
        ]);
    }
}

function court_replace_avg_cost(PDO $pdo, int $courtId, array $items): void
{
    $pdo->prepare("DELETE FROM court_avg_cost_by_case_type WHERE court_id = :id")->execute([':id' => $courtId]);
    if (empty($items)) return;

    $stmt = $pdo->prepare("
        INSERT INTO court_avg_cost_by_case_type (court_id, case_type_label, avg_cost_eur)
        VALUES (:court_id, :label, :avg_cost_eur)
    ");
    foreach ($items as $item) {
        if (!is_array($item)) continue;
        $label = trim((string)($item['label'] ?? ''));
        if ($label === '') continue;
        $value = court_extract_numeric($item['value'] ?? 0) ?? 0;
        $stmt->execute([
            ':court_id' => $courtId,
            ':label' => $label,
            ':avg_cost_eur' => $value,
        ]);
    }
}

function court_normalize_date(?string $value): ?string
{
    if ($value === null) return null;
    $value = trim($value);
    if ($value === '') return null;
    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) return $value;
    if (preg_match('/^(\d{2})\.(\d{2})\.(\d{4})$/', $value, $m)) {
        return "{$m[3]}-{$m[2]}-{$m[1]}";
    }
    return null;
}

function court_replace_cases(PDO $pdo, int $courtId, array $items): void
{
    $pdo->prepare("DELETE FROM court_cases WHERE court_id = :id")->execute([':id' => $courtId]);
    if (empty($items)) return;

    $stmt = $pdo->prepare("
        INSERT INTO court_cases (court_id, case_id, type, subtype, basis_type, filing_date, status)
        VALUES (:court_id, :case_id, :type, :subtype, :basis_type, :filing_date, :status)
    ");
    foreach ($items as $item) {
        if (!is_array($item)) continue;
        $caseId = trim((string)($item['id'] ?? $item['case_id'] ?? ''));
        if ($caseId === '') continue;
        $type = trim((string)($item['type'] ?? '')) ?: null;
        $subtype = trim((string)($item['subtype'] ?? '')) ?: null;
        $basisType = trim((string)($item['basisType'] ?? $item['basis_type'] ?? '')) ?: null;
        $filingDate = court_normalize_date($item['filingDate'] ?? $item['filing_date'] ?? null);
        $status = trim((string)($item['status'] ?? 'Unknown')) ?: 'Unknown';

        $stmt->execute([
            ':court_id' => $courtId,
            ':case_id' => $caseId,
            ':type' => $type,
            ':subtype' => $subtype,
            ':basis_type' => $basisType,
            ':filing_date' => $filingDate,
            ':status' => $status,
        ]);
    }
}

function court_apply_related(PDO $pdo, int $courtId, array $payload, bool $replace): void
{
    if (array_key_exists('metrics', $payload)) {
        if ($replace) court_replace_metrics($pdo, $courtId, $payload['metrics']);
        else court_insert_metrics($pdo, $courtId, $payload['metrics']);
    }
    if (array_key_exists('caseTypes', $payload) && is_array($payload['caseTypes'])) {
        court_replace_case_types($pdo, $courtId, $payload['caseTypes']);
    }
    if (array_key_exists('casesPerYear', $payload) && is_array($payload['casesPerYear'])) {
        court_replace_cases_per_year($pdo, $courtId, $payload['casesPerYear']);
    }
    if (array_key_exists('avgTimeByType', $payload) && is_array($payload['avgTimeByType'])) {
        court_replace_avg_time($pdo, $courtId, $payload['avgTimeByType']);
    }
    if (array_key_exists('avgCostByType', $payload) && is_array($payload['avgCostByType'])) {
        court_replace_avg_cost($pdo, $courtId, $payload['avgCostByType']);
    }
    if (array_key_exists('cases', $payload) && is_array($payload['cases'])) {
        court_replace_cases($pdo, $courtId, $payload['cases']);
    }
}

function court_create(PDO $pdo, array $payload): array
{
    $columns = courts_columns($pdo);

    $slug = strtolower(trim((string)($payload['slug'] ?? '')));
    $name = trim((string)($payload['name'] ?? ''));
    $courtType = trim((string)($payload['type'] ?? $payload['court_type'] ?? ''));
    $jurisdiction = trim((string)($payload['jurisdiction'] ?? ''));
    $address = trim((string)($payload['address'] ?? ''));
    $phone = courts_normalize_phone($payload['phones'] ?? ($payload['phone'] ?? null));
    $website = trim((string)($payload['website'] ?? ''));
    $about = trim((string)($payload['about'] ?? ''));
    $isActive = courts_status_to_is_active($payload['status'] ?? ($payload['is_active'] ?? null));

    if ($slug === '' || $name === '' || $courtType === '') {
        throw new InvalidArgumentException("Missing required fields: slug, name, type");
    }
    if ($jurisdiction === '' || $address === '') {
        throw new InvalidArgumentException("Missing required fields: jurisdiction, address");
    }
    if (!courts_slug_is_url_safe($slug)) {
        throw new InvalidArgumentException("Slug must be URL-safe (lowercase letters, numbers, hyphens)");
    }
    if (court_slug_exists($pdo, $slug)) {
        throw new InvalidArgumentException("Slug already exists");
    }

    try {
        $pdo->beginTransaction();

        $cols = ['slug', 'name', 'court_type', 'address', 'phone', 'jurisdiction', 'about'];
        $placeholders = [':slug', ':name', ':court_type', ':address', ':phone', ':jurisdiction', ':about'];
        $params = [
            ':slug' => $slug,
            ':name' => $name,
            ':court_type' => $courtType,
            ':address' => $address ?: null,
            ':phone' => $phone,
            ':jurisdiction' => $jurisdiction ?: null,
            ':about' => $about ?: null,
        ];

        if (!empty($columns['website'])) {
            $cols[] = 'website';
            $placeholders[] = ':website';
            $params[':website'] = $website ?: null;
        }
        if (!empty($columns['is_active'])) {
            $cols[] = 'is_active';
            $placeholders[] = ':is_active';
            $params[':is_active'] = $isActive !== null ? $isActive : 1;
        }

        $sql = "INSERT INTO courts (" . implode(', ', $cols) . ") VALUES (" . implode(', ', $placeholders) . ")";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $courtId = (int)$pdo->lastInsertId();
        court_apply_related($pdo, $courtId, $payload, false);

        $pdo->commit();

        $created = court_get($pdo, (string)$courtId);
        if (!$created) throw new RuntimeException("Created court not found");
        return $created;
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        throw $e;
    }
}

function court_update(PDO $pdo, string $idOrSlug, array $payload): array
{
    $columns = courts_columns($pdo);
    $existing = courts_fetch_base($pdo, $idOrSlug);
    if (!$existing) {
        throw new InvalidArgumentException("Court not found");
    }

    $slug = strtolower(trim((string)($payload['slug'] ?? $existing['slug'] ?? '')));
    $name = trim((string)($payload['name'] ?? $existing['name'] ?? ''));
    $courtType = trim((string)($payload['type'] ?? $payload['court_type'] ?? $existing['court_type'] ?? ''));
    $jurisdiction = trim((string)($payload['jurisdiction'] ?? $existing['jurisdiction'] ?? ''));
    $address = trim((string)($payload['address'] ?? $existing['address'] ?? ''));
    $phone = courts_normalize_phone($payload['phones'] ?? ($payload['phone'] ?? $existing['phone'] ?? null));
    $website = trim((string)($payload['website'] ?? ($existing['website'] ?? '')));
    $about = trim((string)($payload['about'] ?? ($existing['about'] ?? '')));
    $isActive = courts_status_to_is_active($payload['status'] ?? ($payload['is_active'] ?? $existing['is_active'] ?? null));

    if ($slug === '' || $name === '' || $courtType === '') {
        throw new InvalidArgumentException("Missing required fields: slug, name, type");
    }
    if ($jurisdiction === '' || $address === '') {
        throw new InvalidArgumentException("Missing required fields: jurisdiction, address");
    }
    if (!courts_slug_is_url_safe($slug)) {
        throw new InvalidArgumentException("Slug must be URL-safe (lowercase letters, numbers, hyphens)");
    }
    if (court_slug_exists($pdo, $slug, (int)$existing['id'])) {
        throw new InvalidArgumentException("Slug already exists");
    }

    try {
        $pdo->beginTransaction();

        $set = [
            "slug = :slug",
            "name = :name",
            "court_type = :court_type",
            "address = :address",
            "phone = :phone",
            "jurisdiction = :jurisdiction",
            "about = :about",
        ];
        $params = [
            ':slug' => $slug,
            ':name' => $name,
            ':court_type' => $courtType,
            ':address' => $address ?: null,
            ':phone' => $phone,
            ':jurisdiction' => $jurisdiction ?: null,
            ':about' => $about ?: null,
            ':id' => (int)$existing['id'],
        ];

        if (!empty($columns['website'])) {
            $set[] = "website = :website";
            $params[':website'] = $website ?: null;
        }
        if (!empty($columns['is_active']) && $isActive !== null) {
            $set[] = "is_active = :is_active";
            $params[':is_active'] = $isActive;
        }

        $sql = "UPDATE courts SET " . implode(', ', $set) . " WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        court_apply_related($pdo, (int)$existing['id'], $payload, true);

        $pdo->commit();

        $updated = court_get($pdo, $slug);
        if (!$updated) throw new RuntimeException("Updated court not found");
        return $updated;
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        throw $e;
    }
}

function court_toggle_active(PDO $pdo, string $idOrSlug): ?array
{
    $columns = courts_columns($pdo);
    if (empty($columns['is_active'])) {
        throw new InvalidArgumentException("is_active column is missing on courts table.");
    }

    $base = courts_fetch_base($pdo, $idOrSlug);
    if (!$base) return null;

    $stmt = $pdo->prepare("
        UPDATE courts
        SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END
        WHERE id = :id
    ");
    $stmt->execute([':id' => (int)$base['id']]);

    return courts_fetch_base($pdo, (string)$base['id']);
}

function court_delete(PDO $pdo, string $idOrSlug): bool
{
    $base = courts_fetch_base($pdo, $idOrSlug);
    if (!$base) return false;

    $stmt = $pdo->prepare("DELETE FROM courts WHERE id = :id");
    $stmt->execute([':id' => (int)$base['id']]);
    return $stmt->rowCount() > 0;
}
