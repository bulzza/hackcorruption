<?php

declare(strict_types=1);

require_once __DIR__ . '/../response.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/dashboard_repo.php';

function dashboard_summary_controller(): void
{
    try {
        $pdo = db();
        $summary = dashboard_summary($pdo);
        json_response(['ok' => true, 'data' => $summary]);
    } catch (Throwable $e) {
        json_response(['ok' => false, 'error' => $e->getMessage()], 500);
    }
}
