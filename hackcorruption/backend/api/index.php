<?php
// backend/api/index.php

declare(strict_types=1);

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

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
  http_response_code(204);
  exit;
}

// ---- continue normal app ----
require_once __DIR__ . '/../src/response.php';
require_once __DIR__ . '/../src/dashboard/dashboard.php'; // dashboard controllers
require_once __DIR__ . '/../src/courts/courts.php'; // courts controllers
require_once __DIR__ . '/../src/judges/judges.php'; // controllers (we created earlier)
require_once __DIR__ . '/../src/cases/cases.php'; // cases controllers
require_once __DIR__ . '/../src/users/users.php'; // users controllers
require_once __DIR__ . '/../src/profile/profile.php'; // profile controllers

// Always respond JSON for API index.php routes
header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Normalize path
$uriPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
$path = rtrim($uriPath, '/');

// Examples of $path:
// /hackcorruption/backend/api/judges
// /hackcorruption/backend/api/judges/1
//
// We match only the part after /backend/api
$apiBase = '/backend/api';
$pos = strpos($path, $apiBase);
$subPath = $pos !== false ? substr($path, $pos + strlen($apiBase)) : $path;
$subPath = $subPath === '' ? '/' : $subPath;

// ROUTES:

// DASHBOARD ROUTES

// GET /dashboard/summary
if ($method === 'GET' && $subPath === '/dashboard/summary') {
  dashboard_summary_controller();
  exit;
}

// COURTS ROUTES

// GET /courts
if ($method === 'GET' && $subPath === '/courts') {
  courts_list_controller();
  exit;
}

// GET /courts/{id}
if ($method === 'GET' && preg_match('#^/courts/([^/]+)$#', $subPath, $m)) {
  court_get_controller($m[1]);
  exit;
}

// POST /courts/create
if ($method === 'POST' && $subPath === '/courts/create') {
  court_create_controller();
  exit;
}

// POST /courts/{id}/update
if ($method === 'POST' && preg_match('#^/courts/([^/]+)/update$#', $subPath, $m)) {
  court_update_controller($m[1]);
  exit;
}

// PATCH /courts/{id}/toggle-active
if ($method === 'PATCH' && preg_match('#^/courts/([^/]+)/toggle-active$#', $subPath, $m)) {
  court_toggle_active_controller($m[1]);
  exit;
}

// DELETE /courts/{id}
if ($method === 'DELETE' && preg_match('#^/courts/([^/]+)$#', $subPath, $m)) {
  court_delete_controller($m[1]);
  exit;
}

// GET /judges
if ($method === 'GET' && $subPath === '/judges') {
  judges_list_controller();
  exit;
}

// GET /judges/{id}
if ($method === 'GET' && preg_match('#^/judges/(\d+)$#', $subPath, $m)) {
  judge_get_controller((int)$m[1]);
  exit;
}

if ($method === 'POST' && $subPath === '/judges/create') {
  judge_create_controller();
  exit;
}

// POST /judges/{id}/update
if ($method === 'POST' && preg_match('#^/judges/(\d+)/update$#', $subPath, $m)) {
  judge_update_controller((int)$m[1]);
  exit;
}

// PATCH /judges/{id}/toggle-active
if ($method === 'PATCH' && preg_match('#^/judges/(\d+)/toggle-active$#', $subPath, $m)) {
  judge_toggle_active_controller((int)$m[1]);
  exit;
}

// CASES ROUTES

// GET /cases or GET /cases?id=... (query param support for IDs with slashes)
if ($method === 'GET' && ($subPath === '/cases' || $subPath === '/cases/')) {
  if (isset($_GET['id']) && !empty($_GET['id'])) {
    // Handle /cases?id=К-1521/24 for problematic case IDs
    case_get_controller($_GET['id']);
  } else {
    // Handle /cases - list all
    cases_list_controller();
  }
  exit;
}

// POST /cases/create (must come before generic /cases/{id})
if ($method === 'POST' && $subPath === '/cases/create') {
  case_create_controller();
  exit;
}

// POST /cases/{id}/update or POST /cases?id=...&action=update (query param support)
if ($method === 'POST' && ($subPath === '/cases' || $subPath === '/cases/')) {
  if (isset($_GET['id']) && !empty($_GET['id'])) {
    case_update_controller($_GET['id']);
  } else {
    json_response(['ok' => false, 'error' => 'Missing case id'], 400);
  }
  exit;
}
if ($method === 'POST' && preg_match('#^/cases/(.+)/update$#', $subPath, $m)) {
  case_update_controller($m[1]);
  exit;
}

// GET /cases/{id}
if ($method === 'GET' && preg_match('#^/cases/(.+)$#', $subPath, $m)) {
  case_get_controller($m[1]);
  exit;
}

// DELETE /cases/{id} or DELETE /cases?id=... (query param support)
if ($method === 'DELETE' && ($subPath === '/cases' || $subPath === '/cases/')) {
  if (isset($_GET['id']) && !empty($_GET['id'])) {
    case_delete_controller($_GET['id']);
  } else {
    json_response(['ok' => false, 'error' => 'Missing case id'], 400);
  }
  exit;
}
if ($method === 'DELETE' && preg_match('#^/cases/(.+)$#', $subPath, $m)) {
  case_delete_controller($m[1]);
  exit;
}

// USERS ROUTES

// GET /users
if ($method === 'GET' && $subPath === '/users') {
  users_list_controller();
  exit;
}

// GET /users/{id}
if ($method === 'GET' && preg_match('#^/users/(\d+)$#', $subPath, $m)) {
  user_get_controller((int)$m[1]);
  exit;
}

// POST /users/create
if ($method === 'POST' && $subPath === '/users/create') {
  user_create_controller();
  exit;
}

// POST /users/{id}/update
if ($method === 'POST' && preg_match('#^/users/(\d+)/update$#', $subPath, $m)) {
  user_update_controller((int)$m[1]);
  exit;
}

// PATCH /users/{id}/toggle-active
if ($method === 'PATCH' && preg_match('#^/users/(\d+)/toggle-active$#', $subPath, $m)) {
  user_toggle_active_controller((int)$m[1]);
  exit;
}

// PROFILE ROUTES

// GET /profile
if ($method === 'GET' && $subPath === '/profile') {
  profile_get_controller();
  exit;
}

// POST /profile/update
if ($method === 'POST' && $subPath === '/profile/update') {
  profile_update_controller();
  exit;
}

// If you already have other routes (auth, etc.),
// keep them below using the same $subPath style.

// Method not allowed example (optional): if endpoint exists but method is wrong
if (
  $subPath === '/courts' ||
  preg_match('#^/courts/[^/]+$#', $subPath) ||
  preg_match('#^/courts/[^/]+/update$#', $subPath) ||
  preg_match('#^/courts/[^/]+/toggle-active$#', $subPath) ||
  $subPath === '/judges' ||
  preg_match('#^/judges/\d+$#', $subPath) ||
  preg_match('#^/judges/\d+/update$#', $subPath) ||
  preg_match('#^/judges/\d+/toggle-active$#', $subPath) ||
  $subPath === '/users' ||
  preg_match('#^/users/\d+$#', $subPath) ||
  preg_match('#^/users/\d+/update$#', $subPath) ||
  preg_match('#^/users/\d+/toggle-active$#', $subPath) ||
  $subPath === '/profile' ||
  $subPath === '/profile/update'
) {
  json_response(['ok' => false, 'error' => 'Method Not Allowed'], 405);
  exit;
}

json_response(['ok' => false, 'error' => 'Not Found', 'path' => $subPath], 404);
