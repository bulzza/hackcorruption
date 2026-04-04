<?php
declare(strict_types=1);

require_once __DIR__ . '/response.php';

const SITE_ACCESS_SESSION_KEY = 'site_access_granted';
const SITE_ACCESS_EMAIL_SESSION_KEY = 'site_access_email';

function ensure_session_started(): void
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

function has_site_access_session(): bool
{
    ensure_session_started();
    return !empty($_SESSION[SITE_ACCESS_SESSION_KEY]);
}

function has_admin_session(): bool
{
    ensure_session_started();

    $userId = (int)($_SESSION['user_id'] ?? 0);
    if ($userId <= 0) {
        return false;
    }

    $role = strtolower(trim((string)($_SESSION['role'] ?? '')));
    return $role === '' || $role === 'admin';
}

function require_site_or_admin_access(): void
{
    if (has_site_access_session() || has_admin_session()) {
        return;
    }

    json_response(['ok' => false, 'error' => 'Site access required'], 401);
}

function require_admin_access(): void
{
    if (has_admin_session()) {
        return;
    }

    json_response(['ok' => false, 'error' => 'Admin authentication required'], 401);
}

function grant_site_access_session(string $email): void
{
    ensure_session_started();
    $_SESSION[SITE_ACCESS_SESSION_KEY] = true;
    $_SESSION[SITE_ACCESS_EMAIL_SESSION_KEY] = $email;
}

function clear_site_access_session(): void
{
    ensure_session_started();
    unset($_SESSION[SITE_ACCESS_SESSION_KEY], $_SESSION[SITE_ACCESS_EMAIL_SESSION_KEY]);
}

function get_site_access_identity(): array
{
    ensure_session_started();

    return [
        'email' => (string)($_SESSION[SITE_ACCESS_EMAIL_SESSION_KEY] ?? ''),
    ];
}
