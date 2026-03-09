<?php
// backend/src/courts/courts.php

declare(strict_types=1);

require_once __DIR__ . '/../response.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/courts_repo.php';

function courts_get_pdo(): PDO
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

function courts_read_body(): array
{
    $raw = file_get_contents('php://input') ?: '';
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function courts_list_controller(): void
{
    $pdo = courts_get_pdo();
    $rows = courts_list($pdo);
    foreach ($rows as &$r) {
        $r['status'] = ((int)($r['is_active'] ?? 1) === 1) ? 'Active' : 'Inactive';
    }
    json_response(['ok' => true, 'data' => $rows], 200);
}

function court_get_controller(string $idOrSlug): void
{
    $pdo = courts_get_pdo();
    $data = court_get($pdo, $idOrSlug);
    if (!$data) {
        json_response(['ok' => false, 'error' => 'Court not found'], 404);
        return;
    }
    $data['status'] = ((int)($data['is_active'] ?? 1) === 1) ? 'Active' : 'Inactive';
    json_response(['ok' => true, 'data' => $data], 200);
}

function court_create_controller(): void
{
    $pdo = courts_get_pdo();
    $payload = courts_read_body();
    if (!$payload) {
        json_response(['ok' => false, 'error' => 'Missing data payload'], 400);
        return;
    }

    try {
        $created = court_create($pdo, $payload);
        $created['status'] = ((int)($created['is_active'] ?? 1) === 1) ? 'Active' : 'Inactive';
        json_response(['ok' => true, 'data' => $created], 201);
    } catch (InvalidArgumentException $e) {
        json_response(['ok' => false, 'error' => $e->getMessage()], 400);
    } catch (Throwable $e) {
        json_response(['ok' => false, 'error' => 'Server error'], 500);
        error_log("court_create_controller error: " . $e->getMessage());
    }
}

function court_update_controller(string $idOrSlug): void
{
    $pdo = courts_get_pdo();
    $payload = courts_read_body();
    if (!$payload) {
        json_response(['ok' => false, 'error' => 'Missing data payload'], 400);
        return;
    }

    try {
        $updated = court_update($pdo, $idOrSlug, $payload);
        $updated['status'] = ((int)($updated['is_active'] ?? 1) === 1) ? 'Active' : 'Inactive';
        json_response(['ok' => true, 'data' => $updated], 200);
    } catch (InvalidArgumentException $e) {
        json_response(['ok' => false, 'error' => $e->getMessage()], 400);
    } catch (Throwable $e) {
        json_response(['ok' => false, 'error' => 'Server error'], 500);
        error_log("court_update_controller error: " . $e->getMessage());
    }
}

function court_toggle_active_controller(string $idOrSlug): void
{
    $pdo = courts_get_pdo();
    try {
        $updated = court_toggle_active($pdo, $idOrSlug);
        if (!$updated) {
            json_response(['ok' => false, 'error' => 'Court not found'], 404);
            return;
        }
        $updated['status'] = ((int)($updated['is_active'] ?? 1) === 1) ? 'Active' : 'Inactive';
        json_response(['ok' => true, 'data' => $updated], 200);
    } catch (InvalidArgumentException $e) {
        json_response(['ok' => false, 'error' => $e->getMessage()], 400);
    } catch (Throwable $e) {
        json_response(['ok' => false, 'error' => 'Server error'], 500);
        error_log("court_toggle_active_controller error: " . $e->getMessage());
    }
}

function court_delete_controller(string $idOrSlug): void
{
    $pdo = courts_get_pdo();
    try {
        if (!court_delete($pdo, $idOrSlug)) {
            json_response(['ok' => false, 'error' => 'Court not found'], 404);
            return;
        }
        json_response(['ok' => true, 'data' => ['message' => 'Court deleted']], 200);
    } catch (Throwable $e) {
        json_response(['ok' => false, 'error' => 'Server error'], 500);
        error_log("court_delete_controller error: " . $e->getMessage());
    }
}
