<?php
// backend/src/users/users_repo.php

declare(strict_types=1);

function users_columns(PDO $pdo): array
{
    static $cached = null;
    if ($cached !== null) return $cached;

    $candidates = [
        'full_name',
        'name',
        'username',
        'role',
        'is_active',
        'created_at',
        'updated_at',
        'last_login',
        'password_hash',
    ];

    $in = "'" . implode("','", $candidates) . "'";
    $stmt = $pdo->query("
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'users'
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

function user_name_column(array $columns): ?string
{
    if (!empty($columns['full_name'])) return 'full_name';
    if (!empty($columns['name'])) return 'name';
    if (!empty($columns['username'])) return 'username';
    return null;
}

function user_email_exists(PDO $pdo, string $email, ?int $excludeId = null): bool
{
    if ($excludeId !== null) {
        $stmt = $pdo->prepare("SELECT 1 FROM users WHERE email = :email AND id <> :id LIMIT 1");
        $stmt->execute([':email' => $email, ':id' => $excludeId]);
    } else {
        $stmt = $pdo->prepare("SELECT 1 FROM users WHERE email = :email LIMIT 1");
        $stmt->execute([':email' => $email]);
    }
    return (bool)$stmt->fetchColumn();
}

function users_list(PDO $pdo): array
{
    $columns = users_columns($pdo);
    $nameColumn = user_name_column($columns);

    $select = "SELECT id, email";
    if ($nameColumn) {
        $select .= ", {$nameColumn} AS full_name";
    } else {
        $select .= ", NULL AS full_name";
    }
    if (!empty($columns['role'])) {
        $select .= ", role";
    } else {
        $select .= ", 'user' AS role";
    }
    if (!empty($columns['is_active'])) {
        $select .= ", is_active";
    } else {
        $select .= ", 1 AS is_active";
    }
    if (!empty($columns['created_at'])) {
        $select .= ", created_at";
    } else {
        $select .= ", NULL AS created_at";
    }
    if (!empty($columns['last_login'])) {
        $select .= ", last_login";
    } else {
        $select .= ", NULL AS last_login";
    }
    $select .= " FROM users ORDER BY id DESC";

    $stmt = $pdo->query($select);
    return $stmt->fetchAll() ?: [];
}

function user_get(PDO $pdo, int $id): ?array
{
    $columns = users_columns($pdo);
    $nameColumn = user_name_column($columns);

    $select = "SELECT id, email";
    if ($nameColumn) {
        $select .= ", {$nameColumn} AS full_name";
    } else {
        $select .= ", NULL AS full_name";
    }
    if (!empty($columns['role'])) {
        $select .= ", role";
    } else {
        $select .= ", 'user' AS role";
    }
    if (!empty($columns['is_active'])) {
        $select .= ", is_active";
    } else {
        $select .= ", 1 AS is_active";
    }
    if (!empty($columns['created_at'])) {
        $select .= ", created_at";
    } else {
        $select .= ", NULL AS created_at";
    }
    if (!empty($columns['last_login'])) {
        $select .= ", last_login";
    } else {
        $select .= ", NULL AS last_login";
    }
    $select .= " FROM users WHERE id = :id LIMIT 1";

    $stmt = $pdo->prepare($select);
    $stmt->execute([':id' => $id]);
    $row = $stmt->fetch();
    return $row ?: null;
}

function user_create(PDO $pdo, array $payload): array
{
    $columns = users_columns($pdo);
    $nameColumn = user_name_column($columns);

    $email = trim((string)($payload['email'] ?? ''));
    $fullName = trim((string)($payload['full_name'] ?? ''));
    $role = trim((string)($payload['role'] ?? 'user')) ?: 'user';
    $password = (string)($payload['password'] ?? '');
    $isActive = array_key_exists('is_active', $payload) ? (int)$payload['is_active'] : 1;

    if ($email === '' || $password === '') {
        throw new InvalidArgumentException("Missing required fields: email, password");
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException("Invalid email address");
    }
    if (user_email_exists($pdo, $email)) {
        throw new InvalidArgumentException("Email already exists");
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);

    $insertCols = ['email', 'password_hash'];
    $placeholders = [':email', ':password_hash'];
    $params = [
        ':email' => $email,
        ':password_hash' => $hash,
    ];

    if ($nameColumn) {
        $insertCols[] = $nameColumn;
        $placeholders[] = ':full_name';
        $params[':full_name'] = $fullName !== '' ? $fullName : null;
    }
    if (!empty($columns['role'])) {
        $insertCols[] = 'role';
        $placeholders[] = ':role';
        $params[':role'] = $role;
    }
    if (!empty($columns['is_active'])) {
        $insertCols[] = 'is_active';
        $placeholders[] = ':is_active';
        $params[':is_active'] = $isActive;
    }

    $sql = "INSERT INTO users (" . implode(', ', $insertCols) . ") VALUES (" . implode(', ', $placeholders) . ")";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $userId = (int)$pdo->lastInsertId();
    $created = user_get($pdo, $userId);
    if (!$created) throw new RuntimeException("Created user not found");
    return $created;
}

function user_update(PDO $pdo, int $id, array $payload): array
{
    $columns = users_columns($pdo);
    $nameColumn = user_name_column($columns);

    $existing = user_get($pdo, $id);
    if (!$existing) {
        throw new InvalidArgumentException("User not found");
    }

    $email = trim((string)($payload['email'] ?? $existing['email'] ?? ''));
    $fullName = trim((string)($payload['full_name'] ?? ($existing['full_name'] ?? '')));
    $role = trim((string)($payload['role'] ?? $existing['role'] ?? 'user')) ?: 'user';
    $password = (string)($payload['password'] ?? '');
    $isActive = array_key_exists('is_active', $payload)
        ? (int)$payload['is_active']
        : (int)($existing['is_active'] ?? 1);

    if ($email === '') {
        throw new InvalidArgumentException("Email is required");
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException("Invalid email address");
    }
    if (user_email_exists($pdo, $email, $id)) {
        throw new InvalidArgumentException("Email already exists");
    }

    $set = ["email = :email"];
    $params = [':email' => $email, ':id' => $id];

    if ($nameColumn) {
        $set[] = "{$nameColumn} = :full_name";
        $params[':full_name'] = $fullName !== '' ? $fullName : null;
    }
    if (!empty($columns['role'])) {
        $set[] = "role = :role";
        $params[':role'] = $role;
    }
    if (!empty($columns['is_active'])) {
        $set[] = "is_active = :is_active";
        $params[':is_active'] = $isActive;
    }
    if (trim($password) !== '') {
        $set[] = "password_hash = :password_hash";
        $params[':password_hash'] = password_hash($password, PASSWORD_DEFAULT);
    }

    $sql = "UPDATE users SET " . implode(', ', $set) . " WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $updated = user_get($pdo, $id);
    if (!$updated) throw new RuntimeException("Updated user not found");
    return $updated;
}

function user_toggle_active(PDO $pdo, int $id): ?array
{
    $columns = users_columns($pdo);
    if (empty($columns['is_active'])) {
        throw new InvalidArgumentException("is_active column is missing on users table.");
    }

    $stmt = $pdo->prepare("
        UPDATE users
        SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END
        WHERE id = :id
    ");
    $stmt->execute([':id' => $id]);

    return user_get($pdo, $id);
}
