<?php
// backend/src/profile/profile.php

declare(strict_types=1);

require_once __DIR__ . '/../response.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/profile_repo.php';

function profile_get_pdo(): PDO
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

function profile_read_body(): array
{
    $raw = file_get_contents('php://input') ?: '';
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function profile_get_controller(): void
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    $userId = (int)($_SESSION['user_id'] ?? 0);
    if ($userId <= 0) {
        json_response(['ok' => false, 'error' => 'Not authenticated'], 401);
        return;
    }

    $pdo = profile_get_pdo();
    $data = profile_get($pdo, $userId);
    if (!$data) {
        json_response(['ok' => false, 'error' => 'User not found'], 404);
        return;
    }
    $data['status'] = ((int)($data['is_active'] ?? 1) === 1) ? 'Active' : 'Inactive';
    json_response(['ok' => true, 'data' => $data], 200);
}

function profile_update_controller(): void
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    $userId = (int)($_SESSION['user_id'] ?? 0);
    if ($userId <= 0) {
        json_response(['ok' => false, 'error' => 'Not authenticated'], 401);
        return;
    }

    $payload = profile_read_body();
    if (!$payload) {
        json_response(['ok' => false, 'error' => 'Missing data payload'], 400);
        return;
    }

    $pdo = profile_get_pdo();
    try {
        $updated = profile_update($pdo, $userId, $payload);
        $updated['status'] = ((int)($updated['is_active'] ?? 1) === 1) ? 'Active' : 'Inactive';

        $_SESSION['email'] = (string)($updated['email'] ?? $_SESSION['email'] ?? '');
        if (!empty($updated['full_name'])) {
            $_SESSION['full_name'] = (string)$updated['full_name'];
        }

        json_response(['ok' => true, 'data' => $updated], 200);
    } catch (InvalidArgumentException $e) {
        json_response(['ok' => false, 'error' => $e->getMessage()], 400);
    } catch (Throwable $e) {
        json_response(['ok' => false, 'error' => 'Server error'], 500);
        error_log("profile_update_controller error: " . $e->getMessage());
    }
}

