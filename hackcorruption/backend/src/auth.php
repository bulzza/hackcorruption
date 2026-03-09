<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/response.php';

session_start();

// ---- CORS (single source of truth) ----
$allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins, true)) {
  header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
  header('Vary: Origin');
}

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

/**
 * Read body as:
 * - JSON (application/json)
 * - or form-urlencoded / multipart (fallback to $_POST)
 */
function read_body(): array {
  $ct = $_SERVER['CONTENT_TYPE'] ?? '';

  if (stripos($ct, 'application/json') !== false) {
    $raw = file_get_contents('php://input');
    $decoded = json_decode($raw ?: '', true);
    return is_array($decoded) ? $decoded : [];
  }

  // for x-www-form-urlencoded or multipart/form-data
  if (!empty($_POST) && is_array($_POST)) {
    return $_POST;
  }

  // last fallback: try parse raw
  $raw = file_get_contents('php://input');
  if ($raw) {
    parse_str($raw, $parsed);
    return is_array($parsed) ? $parsed : [];
  }

  return [];
}

function login_controller(): void {
  $body = read_body();

  $email = isset($body['email']) ? trim((string)$body['email']) : '';
  $password = isset($body['password']) ? (string)$body['password'] : '';

  if ($email === '' || $password === '') {
    json_response(['ok' => false, 'error' => 'Email and password are required'], 400);
  }

  $pdo = db();
  $stmt = $pdo->prepare('SELECT id, email, password_hash, role, full_name FROM users WHERE email = ? LIMIT 1');
  $stmt->execute([$email]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$user) {
    json_response(['ok' => false, 'error' => 'Invalid credentials'], 401);
  }

  if (!password_verify($password, (string)$user['password_hash'])) {
    json_response(['ok' => false, 'error' => 'Invalid credentials'], 401);
  }

  // Good practice: prevent session fixation
  session_regenerate_id(true);

  $_SESSION['user_id'] = (int)$user['id'];
  $_SESSION['role'] = (string)$user['role'];
  $_SESSION['email'] = (string)$user['email'];
  $_SESSION['full_name'] = (string)($user['full_name'] ?? '');

  json_response([
    'ok' => true,
    'user' => [
      'id' => (int)$user['id'],
      'email' => (string)$user['email'],
      'role' => (string)$user['role'],
      'full_name' => (string)($user['full_name'] ?? ''),
    ],
  ]);
}

function me_controller(): void {
  if (empty($_SESSION['user_id'])) {
    json_response(['ok' => false, 'error' => 'Not authenticated'], 401);
  }

  $email = (string)($_SESSION['email'] ?? '');
  $role = (string)($_SESSION['role'] ?? '');
  $fullName = (string)($_SESSION['full_name'] ?? '');

  if ($email === '' || $role === '') {
    $pdo = db();
    $stmt = $pdo->prepare('SELECT email, role, full_name FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([(int)$_SESSION['user_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    if ($user) {
      $email = (string)$user['email'];
      $role = (string)$user['role'];
      $fullName = (string)($user['full_name'] ?? '');
      $_SESSION['email'] = $email;
      $_SESSION['role'] = $role;
      $_SESSION['full_name'] = $fullName;
    }
  }

  json_response([
    'ok' => true,
    'user' => [
      'id' => (int)$_SESSION['user_id'],
      'email' => $email,
      'role' => $role,
      'full_name' => $fullName,
    ],
  ]);
}

function logout_controller(): void {
  // clear session cookie too
  $_SESSION = [];
  if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], (bool)$params['secure'], (bool)$params['httponly']);
  }
  session_destroy();
  json_response(['ok' => true]);
  header('Location: /login');
}

/**
 * Simple router:
 * POST  /auth.php?action=login
 * GET   /auth.php?action=me
 * POST  /auth.php?action=logout
 */
$action = $_GET['action'] ?? '';

if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
  login_controller();
}

if ($action === 'me' && $_SERVER['REQUEST_METHOD'] === 'GET') {
  me_controller();
}

if ($action === 'logout' && $_SERVER['REQUEST_METHOD'] === 'POST') {
  logout_controller();
}

json_response(['ok' => false, 'error' => 'Not found'], 404);
