<?php

declare(strict_types=1);

function schema_table_exists(PDO $pdo, string $table): bool
{
    $stmt = $pdo->prepare("
        SELECT 1
        FROM information_schema.TABLES
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = :table
        LIMIT 1
    ");
    $stmt->execute([':table' => $table]);

    return (bool)$stmt->fetchColumn();
}

function schema_column_exists(PDO $pdo, string $table, string $column): bool
{
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

    return (bool)$stmt->fetchColumn();
}

function schema_column_length(PDO $pdo, string $table, string $column): ?int
{
    $stmt = $pdo->prepare("
        SELECT CHARACTER_MAXIMUM_LENGTH
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

    $value = $stmt->fetchColumn();
    if ($value === false || $value === null) {
        return null;
    }

    return (int)$value;
}

function schema_bootstrap_case_support(PDO $pdo): void
{
    if (!schema_table_exists($pdo, 'court_cases')) {
        return;
    }

    if (!schema_table_exists($pdo, 'cases')) {
        $pdo->exec("
            CREATE TABLE cases (
                id varchar(30) NOT NULL,
                court varchar(255) NOT NULL,
                judge varchar(255) DEFAULT NULL,
                decision_date date DEFAULT NULL,
                legal_area varchar(255) DEFAULT NULL,
                summary longtext DEFAULT NULL,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        ");
    }

    if ((schema_column_length($pdo, 'cases', 'id') ?? 0) < 30) {
        $pdo->exec("ALTER TABLE cases MODIFY id varchar(30) NOT NULL");
    }
    if (schema_column_exists($pdo, 'case_detail', 'case_type') && (schema_column_length($pdo, 'case_detail', 'case_type') ?? 0) < 120) {
        $pdo->exec("ALTER TABLE case_detail MODIFY case_type varchar(120) DEFAULT NULL");
    }
    if (schema_column_exists($pdo, 'case_detail', 'case_subtype') && (schema_column_length($pdo, 'case_detail', 'case_subtype') ?? 0) < 120) {
        $pdo->exec("ALTER TABLE case_detail MODIFY case_subtype varchar(120) DEFAULT NULL");
    }
    if (schema_column_exists($pdo, 'case_detail', 'basis_type') && (schema_column_length($pdo, 'case_detail', 'basis_type') ?? 0) < 255) {
        $pdo->exec("ALTER TABLE case_detail MODIFY basis_type varchar(255) DEFAULT NULL");
    }
    if (schema_column_exists($pdo, 'case_detail', 'basis') && (schema_column_length($pdo, 'case_detail', 'basis') ?? 0) < 255) {
        $pdo->exec("ALTER TABLE case_detail MODIFY basis varchar(255) DEFAULT NULL");
    }
    $courtCaseColumns = [
        'judge_name' => "ALTER TABLE court_cases ADD COLUMN judge_name varchar(255) DEFAULT NULL AFTER status",
        'legal_area' => "ALTER TABLE court_cases ADD COLUMN legal_area varchar(255) DEFAULT NULL AFTER judge_name",
        'basis_group' => "ALTER TABLE court_cases ADD COLUMN basis_group varchar(255) DEFAULT NULL AFTER legal_area",
        'basis' => "ALTER TABLE court_cases ADD COLUMN basis varchar(255) DEFAULT NULL AFTER basis_group",
        'download_link' => "ALTER TABLE court_cases ADD COLUMN download_link text DEFAULT NULL AFTER basis",
        'summary' => "ALTER TABLE court_cases ADD COLUMN summary longtext DEFAULT NULL AFTER download_link",
    ];

    foreach ($courtCaseColumns as $column => $sql) {
        if (!schema_column_exists($pdo, 'court_cases', $column)) {
            $pdo->exec($sql);
        }
    }

}

function schema_bootstrap(PDO $pdo): void
{
    static $bootstrapped = false;

    if ($bootstrapped) {
        return;
    }

    schema_bootstrap_case_support($pdo);
    $bootstrapped = true;
}
