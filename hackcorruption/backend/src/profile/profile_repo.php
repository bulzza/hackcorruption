<?php
// backend/src/profile/profile_repo.php

declare(strict_types=1);

require_once __DIR__ . '/../users/users_repo.php';

function profile_get(PDO $pdo, int $userId): ?array
{
    return user_get($pdo, $userId);
}

function profile_update(PDO $pdo, int $userId, array $payload): array
{
    $columns = users_columns($pdo);
    $nameColumn = user_name_column($columns);

    $existing = user_get($pdo, $userId);
    if (!$existing) {
        throw new InvalidArgumentException("User not found");
    }

    $email = trim((string)($payload['email'] ?? $existing['email'] ?? ''));
    $fullName = trim((string)($payload['full_name'] ?? ($existing['full_name'] ?? '')));
    $password = (string)($payload['password'] ?? '');

    if ($email === '') {
        throw new InvalidArgumentException("Email is required");
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException("Invalid email address");
    }
    if (user_email_exists($pdo, $email, $userId)) {
        throw new InvalidArgumentException("Email already exists");
    }

    $set = ["email = :email"];
    $params = [':email' => $email, ':id' => $userId];

    if ($nameColumn) {
        $set[] = "{$nameColumn} = :full_name";
        $params[':full_name'] = $fullName !== '' ? $fullName : null;
    }
    if (trim($password) !== '') {
        $set[] = "password_hash = :password_hash";
        $params[':password_hash'] = password_hash($password, PASSWORD_DEFAULT);
    }

    $sql = "UPDATE users SET " . implode(', ', $set) . " WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $updated = user_get($pdo, $userId);
    if (!$updated) throw new RuntimeException("Updated user not found");
    return $updated;
}

