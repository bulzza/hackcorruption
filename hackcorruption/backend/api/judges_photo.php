<?php
// backend/api/judges_photo.php

declare(strict_types=1);

require_once __DIR__ . '/../src/db.php';
require_once __DIR__ . '/../src/judges/judges_repo.php';

function get_pdo(): PDO
{
    if (function_exists('db')) {
        $pdo = db();
        if ($pdo instanceof PDO) return $pdo;
    }
    if (isset($GLOBALS['pdo']) && $GLOBALS['pdo'] instanceof PDO) return $GLOBALS['pdo'];
    throw new RuntimeException("PDO connection not found. Adjust get_pdo() in api/judges_photo.php");
}

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) {
    http_response_code(400);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => 'Missing or invalid id']);
    exit;
}

$pdo = get_pdo();
$photo = judge_photo($pdo, $id);

if ($photo === null) {
    http_response_code(404);
    exit;
}

if ($photo['data'] === null) {
    http_response_code(404);
    exit;
}

header('Content-Type: ' . $photo['mime']);
header('Cache-Control: public, max-age=3600');
echo $photo['data'];
?>