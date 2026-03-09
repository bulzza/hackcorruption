<?php
// backend/src/users/users.php

declare(strict_types=1);

require_once __DIR__ . '/../response.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/users_repo.php';

function users_get_pdo(): PDO
{
    if (function_exists('db')) {
        $pdo = db();
        if ($pdo instanceof PDO) return $pdo;
    }
    if (isset($GLOBALS['pdo']) && $GLOBALS['pdo'] instanceof PDO) {
        return $GLOBALS['pdo'];
    }
    throw new RuntimeException("PDO connection not found.");
}

function users_log_error(string $message): void
{
    if (function_exists('console_error')) {
        console_error($message);
        return;
    }
    error_log($message);
}

function users_read_body(): array
{
    $raw = file_get_contents('php://input') ?: '';
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function users_list_controller(): void
{
    $pdo = users_get_pdo();
    $rows = users_list($pdo);
    foreach ($rows as &$r) {
        $r['status'] = ((int)($r['is_active'] ?? 1) === 1) ? 'Active' : 'Inactive';
    }
    json_response(['ok' => true, 'data' => $rows], 200);
}

function user_get_controller(int $id): void
{
    $pdo = users_get_pdo();
    $data = user_get($pdo, $id);
    if (!$data) {
        json_response(['ok' => false, 'error' => 'User not found'], 404);
        return;
    }
    $data['status'] = ((int)($data['is_active'] ?? 1) === 1) ? 'Active' : 'Inactive';
    json_response(['ok' => true, 'data' => $data], 200);
}

function user_create_controller(): void
{
    $pdo = users_get_pdo();
    $payload = users_read_body();
    if (!$payload) {
        json_response(['ok' => false, 'error' => 'Missing data payload'], 400);
        return;
    }

    try {
        $created = user_create($pdo, $payload);
        $created['status'] = ((int)($created['is_active'] ?? 1) === 1) ? 'Active' : 'Inactive';
        json_response(['ok' => true, 'data' => $created], 201);
    } catch (InvalidArgumentException $e) {
        json_response(['ok' => false, 'error' => $e->getMessage()], 400);
    } catch (Throwable $e) {
        users_log_error("user_create_controller error: " . $e->getMessage());
        json_response(['ok' => false, 'error' => 'Server error'], 500);
    }
}

function user_update_controller(int $id): void
{
    if ($id <= 0) {
        json_response(['ok' => false, 'error' => 'Invalid user id'], 400);
        return;
    }
    $pdo = users_get_pdo();
    $payload = users_read_body();
    if (!$payload) {
        json_response(['ok' => false, 'error' => 'Missing data payload'], 400);
        return;
    }

    try {
        $updated = user_update($pdo, $id, $payload);
        $updated['status'] = ((int)($updated['is_active'] ?? 1) === 1) ? 'Active' : 'Inactive';
        json_response(['ok' => true, 'data' => $updated], 200);
    } catch (InvalidArgumentException $e) {
        json_response(['ok' => false, 'error' => $e->getMessage()], 400);
    } catch (Throwable $e) {
        users_log_error("user_update_controller error: " . $e->getMessage());
        json_response(['ok' => false, 'error' => 'Server error'], 500);
    }
}

function user_toggle_active_controller(int $id): void
{
    if ($id <= 0) {
        json_response(['ok' => false, 'error' => 'Invalid user id'], 400);
        return;
    }
    $pdo = users_get_pdo();

    try {
        $updated = user_toggle_active($pdo, $id);
        if (!$updated) {
            json_response(['ok' => false, 'error' => 'User not found'], 404);
            return;
        }
        $updated['status'] = ((int)($updated['is_active'] ?? 1) === 1) ? 'Active' : 'Inactive';
        json_response(['ok' => true, 'data' => $updated], 200);
    } catch (InvalidArgumentException $e) {
        json_response(['ok' => false, 'error' => $e->getMessage()], 400);
    } catch (Throwable $e) {
        users_log_error("user_toggle_active_controller error: " . $e->getMessage());
        json_response(['ok' => false, 'error' => 'Server error'], 500);
    }
}
