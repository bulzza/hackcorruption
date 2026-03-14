<?php

declare(strict_types=1);

function dashboard_table_exists(PDO $pdo, string $table): bool
{
    static $cache = [];
    if (array_key_exists($table, $cache)) {
        return $cache[$table];
    }

    $stmt = $pdo->prepare("
        SELECT 1
        FROM information_schema.TABLES
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = :table
        LIMIT 1
    ");
    $stmt->execute([':table' => $table]);

    $cache[$table] = (bool)$stmt->fetchColumn();
    return $cache[$table];
}

function dashboard_column_exists(PDO $pdo, string $table, string $column): bool
{
    static $cache = [];
    $key = $table . '.' . $column;
    if (array_key_exists($key, $cache)) {
        return $cache[$key];
    }

    $stmt = $pdo->prepare("
        SELECT 1
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = :table
          AND COLUMN_NAME = :column
        LIMIT 1
    ");
    $stmt->execute([
        ':table' => $table,
        ':column' => $column,
    ]);

    $cache[$key] = (bool)$stmt->fetchColumn();
    return $cache[$key];
}

function dashboard_count_rows(PDO $pdo, string $table): int
{
    if (!dashboard_table_exists($pdo, $table)) {
        return 0;
    }

    $value = $pdo->query("SELECT COUNT(*) FROM {$table}")->fetchColumn();
    return $value === false ? 0 : (int)$value;
}

function dashboard_count_active(PDO $pdo, string $table): int
{
    if (!dashboard_table_exists($pdo, $table)) {
        return 0;
    }

    if (!dashboard_column_exists($pdo, $table, 'is_active')) {
        return dashboard_count_rows($pdo, $table);
    }

    $stmt = $pdo->query("SELECT COUNT(*) FROM {$table} WHERE is_active = 1");
    $value = $stmt->fetchColumn();
    return $value === false ? 0 : (int)$value;
}

function dashboard_average_duration(PDO $pdo): ?float
{
    if (!dashboard_table_exists($pdo, 'case_insights') || !dashboard_column_exists($pdo, 'case_insights', 'duration_days')) {
        return null;
    }

    $value = $pdo->query("
        SELECT AVG(duration_days)
        FROM case_insights
        WHERE duration_days IS NOT NULL
          AND duration_days > 0
    ")->fetchColumn();

    if ($value === false || $value === null) {
        return null;
    }

    return round((float)$value, 1);
}

function dashboard_lowercase(string $value): string
{
    return function_exists('mb_strtolower') ? mb_strtolower($value, 'UTF-8') : strtolower($value);
}

function dashboard_status_rows(PDO $pdo, int $limit = 0): array
{
    if (!dashboard_table_exists($pdo, 'court_cases') || !dashboard_column_exists($pdo, 'court_cases', 'status')) {
        return [];
    }

    $sql = "
        SELECT COALESCE(NULLIF(TRIM(status), ''), 'Unknown') AS label, COUNT(*) AS total
        FROM court_cases
        GROUP BY COALESCE(NULLIF(TRIM(status), ''), 'Unknown')
        ORDER BY total DESC, label ASC
    ";
    if ($limit > 0) {
        $sql .= " LIMIT " . (int)$limit;
    }

    $stmt = $pdo->query($sql);
    return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
}

function dashboard_is_final_status(string $status): bool
{
    $normalized = dashboard_lowercase(trim($status));
    $finalStatuses = [
        'closed',
        'resolved',
        'dismissed',
        'archived',
        'completed',
        'presuda',
        'reshenie',
        'zaprena postapka',
        'objaveno',
        "\u{043F}\u{0440}\u{0435}\u{0441}\u{0443}\u{0434}\u{0430}",
        "\u{0440}\u{0435}\u{0448}\u{0435}\u{043D}\u{0438}\u{0435}",
        "\u{0437}\u{0430}\u{043F}\u{0440}\u{0435}\u{043D}\u{0430} \u{043F}\u{043E}\u{0441}\u{0442}\u{0430}\u{043F}\u{043A}\u{0430}",
        "\u{043E}\u{0431}\u{0458}\u{0430}\u{0432}\u{0435}\u{043D}\u{043E}",
    ];

    return in_array($normalized, $finalStatuses, true);
}

function dashboard_open_cases(PDO $pdo): int
{
    $rows = dashboard_status_rows($pdo);
    $openCases = 0;

    foreach ($rows as $row) {
        $label = (string)($row['label'] ?? 'Unknown');
        if (!dashboard_is_final_status($label)) {
            $openCases += (int)($row['total'] ?? 0);
        }
    }

    return $openCases;
}

function dashboard_recent_activity(PDO $pdo): array
{
    if (!dashboard_table_exists($pdo, 'court_cases') || !dashboard_column_exists($pdo, 'court_cases', 'filing_date')) {
        return [];
    }

    $stmt = $pdo->query("
        SELECT filing_date, COUNT(*) AS total
        FROM court_cases
        WHERE filing_date IS NOT NULL
        GROUP BY filing_date
        ORDER BY filing_date DESC
        LIMIT 7
    ");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    $rows = array_reverse($rows);

    return array_map(static function (array $row): array {
        return [
            'label' => (string)($row['filing_date'] ?? ''),
            'value' => (int)($row['total'] ?? 0),
        ];
    }, $rows);
}

function dashboard_case_types(PDO $pdo): array
{
    if (!dashboard_table_exists($pdo, 'court_cases')) {
        return [];
    }

    $colors = ['#3b6f95', '#2bb3a6', '#f2b259', '#c86b85', '#7b8de0'];
    $stmt = $pdo->query("
        SELECT
            COALESCE(NULLIF(TRIM(type), ''), NULLIF(TRIM(legal_area), ''), 'Unknown') AS label,
            COUNT(*) AS total
        FROM court_cases
        GROUP BY COALESCE(NULLIF(TRIM(type), ''), NULLIF(TRIM(legal_area), ''), 'Unknown')
        ORDER BY total DESC, label ASC
        LIMIT 5
    ");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

    $result = [];
    foreach ($rows as $index => $row) {
        $result[] = [
            'label' => (string)($row['label'] ?? 'Unknown'),
            'value' => (int)($row['total'] ?? 0),
            'color' => $colors[$index % count($colors)],
        ];
    }

    return $result;
}

function dashboard_status_breakdown(PDO $pdo): array
{
    $totalCases = dashboard_count_rows($pdo, 'court_cases');
    if ($totalCases === 0) {
        return [];
    }

    $rows = dashboard_status_rows($pdo, 5);

    return array_map(static function (array $row) use ($totalCases): array {
        $value = (int)($row['total'] ?? 0);
        return [
            'label' => (string)($row['label'] ?? 'Unknown'),
            'value' => $value,
            'percentage' => round(($value / $totalCases) * 100, 1),
        ];
    }, $rows);
}

function dashboard_summary(PDO $pdo): array
{
    $totalCases = dashboard_count_rows($pdo, 'court_cases');
    $recentActivity = dashboard_recent_activity($pdo);
    $latestActivity = $recentActivity === [] ? null : $recentActivity[count($recentActivity) - 1];

    return [
        'totals' => [
            'total_cases' => $totalCases,
            'open_cases' => dashboard_open_cases($pdo),
            'active_judges' => dashboard_count_active($pdo, 'judges'),
            'avg_duration_days' => dashboard_average_duration($pdo),
            'total_courts' => dashboard_count_rows($pdo, 'courts'),
            'total_users' => dashboard_count_rows($pdo, 'users'),
        ],
        'recent_activity' => $recentActivity,
        'latest_activity' => $latestActivity,
        'case_types' => dashboard_case_types($pdo),
        'statuses' => dashboard_status_breakdown($pdo),
    ];
}
