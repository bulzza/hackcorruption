<?php
declare(strict_types=1);

require_once __DIR__ . '/access.php';
require_once __DIR__ . '/response.php';

const STATIC_SITE_ACCESS_EMAIL = 'admin@gmail.com';
const STATIC_SITE_ACCESS_PASSWORD = '12345678';

ensure_session_started();

$allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
    header('Vary: Origin');
}

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function read_site_access_body(): array
{
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

    if (stripos($contentType, 'application/json') !== false) {
        $raw = file_get_contents('php://input') ?: '';
        $decoded = json_decode($raw, true);
        return is_array($decoded) ? $decoded : [];
    }

    if (!empty($_POST) && is_array($_POST)) {
        return $_POST;
    }

    return [];
}

function site_access_login_controller(): void
{
    $body = read_site_access_body();

    $email = trim((string)($body['email'] ?? ''));
    $password = (string)($body['password'] ?? '');

    if ($email === '' || $password === '') {
        json_response(['ok' => false, 'error' => 'Email and password are required'], 400);
    }

    if ($email !== STATIC_SITE_ACCESS_EMAIL || $password !== STATIC_SITE_ACCESS_PASSWORD) {
        json_response(['ok' => false, 'error' => 'Invalid site access credentials'], 401);
    }

    session_regenerate_id(true);
    grant_site_access_session(STATIC_SITE_ACCESS_EMAIL);

    json_response([
        'ok' => true,
        'user' => [
            'email' => STATIC_SITE_ACCESS_EMAIL,
        ],
    ]);
}

function site_access_me_controller(): void
{
    if (!has_site_access_session()) {
        json_response(['ok' => false, 'error' => 'Site access required'], 401);
    }

    json_response([
        'ok' => true,
        'user' => get_site_access_identity(),
    ]);
}

function site_access_logout_controller(): void
{
    clear_site_access_session();
    json_response(['ok' => true]);
}

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($action === 'login' && $method === 'POST') {
    site_access_login_controller();
}

if ($action === 'me' && $method === 'GET') {
    site_access_me_controller();
}

if ($action === 'logout' && $method === 'POST') {
    site_access_logout_controller();
}

json_response(['ok' => false, 'error' => 'Not found'], 404);
