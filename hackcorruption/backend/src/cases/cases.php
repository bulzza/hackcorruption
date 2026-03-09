<?php
// backend/src/cases/cases.php

declare(strict_types=1);

require_once __DIR__ . '/../response.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/cases_repo.php';

/**
 * Controller: List all cases
 */
function cases_list_controller(): void
{
    try {
        $pdo = db();
        $cases = case_list($pdo);
        json_response(['ok' => true, 'data' => $cases]);
    } catch (Throwable $e) {
        json_response(['ok' => false, 'error' => $e->getMessage()], 500);
    }
}

/**
 * Controller: Get a single case
 */
function case_get_controller(string $caseId): void
{
    try {
        $pdo = db();
        $case = case_get($pdo, $caseId);

        if (!$case) {
            json_response(['ok' => false, 'error' => "Case '$caseId' not found"], 404);
            return;
        }

        json_response(['ok' => true, 'data' => $case]);
    } catch (Throwable $e) {
        json_response(['ok' => false, 'error' => $e->getMessage()], 500);
    }
}

/**
 * Controller: Create a new case
 */
function case_create_controller(): void
{
    try {
        $input = file_get_contents('php://input');
        $payload = json_decode($input, true) ?? [];

        if (!is_array($payload)) {
            json_response(['ok' => false, 'error' => 'Invalid JSON'], 400);
            return;
        }

        $pdo = db();
        $result = case_create($pdo, $payload);

        json_response(['ok' => true, 'data' => $result], 201);
    } catch (InvalidArgumentException $e) {
        json_response(['ok' => false, 'error' => $e->getMessage()], 400);
    } catch (Throwable $e) {
        json_response(['ok' => false, 'error' => $e->getMessage()], 500);
    }
}

/**
 * Controller: Update an existing case
 */
function case_update_controller(string $caseId): void
{
    try {
        $input = file_get_contents('php://input');
        $payload = json_decode($input, true) ?? [];

        if (!is_array($payload)) {
            json_response(['ok' => false, 'error' => 'Invalid JSON'], 400);
            return;
        }

        $pdo = db();
        $result = case_update($pdo, $caseId, $payload);

        json_response(['ok' => true, 'data' => $result]);
    } catch (InvalidArgumentException $e) {
        json_response(['ok' => false, 'error' => $e->getMessage()], 400);
    } catch (Throwable $e) {
        json_response(['ok' => false, 'error' => $e->getMessage()], 500);
    }
}

/**
 * Controller: Delete a case
 */
function case_delete_controller(string $caseId): void
{
    try {
        $pdo = db();
        
        if (!case_delete($pdo, $caseId)) {
            json_response(['ok' => false, 'error' => "Case '$caseId' not found"], 404);
            return;
        }

        json_response(['ok' => true, 'data' => ['message' => "Case '$caseId' deleted"]]);
    } catch (Throwable $e) {
        json_response(['ok' => false, 'error' => $e->getMessage()], 500);
    }
}
