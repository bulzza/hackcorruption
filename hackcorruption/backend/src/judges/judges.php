<?php
// backend/src/judges/judges.php

declare(strict_types=1);

require_once __DIR__ . '/../response.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/judges_repo.php';

/**
 * Convert php.ini size strings like "8M", "2G", "512K" to bytes.
 */
function ini_size_to_bytes(string $value): int
{
    $trimmed = trim($value);
    if ($trimmed === '') return 0;

    $unit = strtolower(substr($trimmed, -1));
    $number = (float)$trimmed;

    switch ($unit) {
        case 'g':
            return (int)($number * 1024 * 1024 * 1024);
        case 'm':
            return (int)($number * 1024 * 1024);
        case 'k':
            return (int)($number * 1024);
        default:
            return (int)$number;
    }
}

/**
 * Maximum bytes allowed for a POST upload (min of post_max_size and upload_max_filesize).
 */
function max_upload_bytes(): int
{
    $postMax = ini_size_to_bytes((string)ini_get('post_max_size'));
    $uploadMax = ini_size_to_bytes((string)ini_get('upload_max_filesize'));

    if ($postMax <= 0) return $uploadMax;
    if ($uploadMax <= 0) return $postMax;

    return min($postMax, $uploadMax);
}

function upload_size_label(int $bytes): string
{
    if ($bytes <= 0) return '';
    $mb = (int)ceil($bytes / (1024 * 1024));
    return $mb . ' MB';
}

function upload_too_large_message(int $maxBytes): string
{
    $label = upload_size_label($maxBytes);
    if ($label === '') return 'Photo is too large.';
    return "Photo must be {$label} or less.";
}

function log_error(string $message): void
{
    // If you have a custom logger, use it; otherwise use error_log.
    if (function_exists('console_error')) {
        console_error($message);
        return;
    }
    error_log($message);
}

function get_pdo(): PDO
{
    // Supports either $pdo global or db() function (adjust if your db.php differs)
    if (function_exists('db')) {
        $pdo = db();
        if ($pdo instanceof PDO) return $pdo;
    }

    if (isset($GLOBALS['pdo']) && $GLOBALS['pdo'] instanceof PDO) {
        return $GLOBALS['pdo'];
    }

    throw new RuntimeException("PDO connection not found. Adjust get_pdo() in src/judges/judges.php");
}

/**
 * Detects the scenario where PHP discards the body because it exceeded post_max_size,
 * resulting in empty $_POST and $_FILES.
 */
function fail_if_body_too_large(): ?array
{
    $maxBytes = max_upload_bytes();
    $contentLength = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);

    // Only meaningful for requests that can carry a body
    $method = $_SERVER['REQUEST_METHOD'] ?? '';
    if (!in_array($method, ['POST', 'PUT', 'PATCH'], true)) return null;

    // If body was too large, PHP often gives empty $_POST/$_FILES.
    if (empty($_POST) && empty($_FILES) && $maxBytes > 0 && $contentLength > $maxBytes) {
        return ['status' => 413, 'message' => upload_too_large_message($maxBytes)];
    }

    // Even if not empty, still allow early check by content-length
    if ($maxBytes > 0 && $contentLength > $maxBytes) {
        return ['status' => 413, 'message' => upload_too_large_message($maxBytes)];
    }

    return null;
}

/**
 * GET /judges
 */
function judges_list_controller(): void
{
    $pdo = get_pdo();
    $rows = judges_list($pdo);

    foreach ($rows as &$r) {
        $r['photo_url'] = $r['has_photo']
            ? ("/hackcorruption/backend/api/judges_photo.php?id=" . $r['id'])
            : null;

        // If your repo returns is_active, this makes status always available.
        $r['status'] = ((int)($r['is_active'] ?? 0) === 1) ? 'Active' : 'Inactive';
    }

    json_response(['ok' => true, 'data' => $rows], 200);
}

/**
 * GET /judges/{id}
 */
function judge_get_controller(int $id): void
{
    $pdo = get_pdo();
    $data = judge_get($pdo, $id);

    if (!$data) {
        json_response(['ok' => false, 'error' => 'Judge not found'], 404);
        return;
    }

    json_response(['ok' => true, 'data' => $data], 200);
}

/**
 * POST /judges/create
 * multipart/form-data:
 * - data: JSON string
 * - photo: file (optional)
 */
function judge_create_controller(): void
{
    $tooLarge = fail_if_body_too_large();
    if ($tooLarge) {
        json_response(['ok' => false, 'error' => $tooLarge['message']], (int)$tooLarge['status']);
        return;
    }

    $pdo = get_pdo();

    $raw = $_POST['data'] ?? '';
    if (!is_string($raw) || trim($raw) === '') {
        json_response(['ok' => false, 'error' => 'Missing data payload'], 400);
        return;
    }

    $payload = json_decode($raw, true);
    if (!is_array($payload)) {
        json_response(['ok' => false, 'error' => 'Invalid JSON in data'], 400);
        return;
    }

    $photoBlob = null;
    $photoMime = null;

    // Handle file upload errors explicitly
    if (isset($_FILES['photo']) && is_array($_FILES['photo'])) {
        $err = (int)($_FILES['photo']['error'] ?? UPLOAD_ERR_OK);

        if ($err !== UPLOAD_ERR_OK) {
            $maxBytes = max_upload_bytes();
            if ($err === UPLOAD_ERR_INI_SIZE || $err === UPLOAD_ERR_FORM_SIZE) {
                json_response(['ok' => false, 'error' => upload_too_large_message($maxBytes)], 413);
                return;
            }
            json_response(['ok' => false, 'error' => 'Failed to upload photo'], 400);
            return;
        }

        if (isset($_FILES['photo']['tmp_name']) && is_uploaded_file($_FILES['photo']['tmp_name'])) {
            $photoBlob = file_get_contents($_FILES['photo']['tmp_name']);
            $photoMime = $_FILES['photo']['type'] ?: null;

            if ($photoBlob === false) {
                json_response(['ok' => false, 'error' => 'Failed to read uploaded photo'], 400);
                return;
            }
        }
    }

    try {
        // IMPORTANT: repo-level function should be DB-only and accept blob+mime
        $created = judge_create($pdo, $payload, $photoBlob, $photoMime);
        json_response(['ok' => true, 'data' => $created], 201);
    } catch (InvalidArgumentException $e) {
        json_response(['ok' => false, 'error' => $e->getMessage()], 400);
    } catch (Throwable $e) {
        log_error("judge_create_controller error: " . $e->getMessage());
        log_error($e->getTraceAsString());

        // DEV: return real message
        json_response(['ok' => false, 'error' => $e->getMessage()], 500);
    }

}

/**
 * POST /judges/{id}/update
 * multipart/form-data:
 * - data: JSON string
 * - photo: file (optional)
 * - If photo is not sent, keep existing photo (repo controls behavior via $photoProvided flag)
 */
function judge_update_controller(int $id): void
{
    $tooLarge = fail_if_body_too_large();
    if ($tooLarge) {
        json_response(['ok' => false, 'error' => $tooLarge['message']], (int)$tooLarge['status']);
        return;
    }

    if ($id <= 0) {
        json_response(['ok' => false, 'error' => 'Invalid judge id'], 400);
        return;
    }

    $pdo = get_pdo();

    $raw = $_POST['data'] ?? '';
    if (!is_string($raw) || trim($raw) === '') {
        json_response(['ok' => false, 'error' => 'Missing data payload'], 400);
        return;
    }

    $payload = json_decode($raw, true);
    if (!is_array($payload)) {
        json_response(['ok' => false, 'error' => 'Invalid JSON in data'], 400);
        return;
    }

    $photoBlob = null;
    $photoMime = null;
    $photoProvided = false;

    if (isset($_FILES['photo']) && is_array($_FILES['photo'])) {
        $err = (int)($_FILES['photo']['error'] ?? UPLOAD_ERR_OK);

        if ($err !== UPLOAD_ERR_OK) {
            $maxBytes = max_upload_bytes();
            if ($err === UPLOAD_ERR_INI_SIZE || $err === UPLOAD_ERR_FORM_SIZE) {
                json_response(['ok' => false, 'error' => upload_too_large_message($maxBytes)], 413);
                return;
            }
            json_response(['ok' => false, 'error' => 'Failed to upload photo'], 400);
            return;
        }

        if (isset($_FILES['photo']['tmp_name']) && is_uploaded_file($_FILES['photo']['tmp_name'])) {
            $photoProvided = true;
            $photoBlob = file_get_contents($_FILES['photo']['tmp_name']);
            $photoMime = $_FILES['photo']['type'] ?: null;

            if ($photoBlob === false) {
                json_response(['ok' => false, 'error' => 'Failed to read uploaded photo'], 400);
                return;
            }
        }
    }

    try {
        // NOTE: judge_update must exist in judges_repo.php with this signature:
        // judge_update(PDO $pdo, int $id, array $payload, ?string $photoBlob, ?string $photoMime, bool $photoProvided): array
        $updated = judge_update($pdo, $id, $payload, $photoBlob, $photoMime, $photoProvided);
        json_response(['ok' => true, 'data' => $updated], 200);
    } catch (InvalidArgumentException $e) {
        json_response(['ok' => false, 'error' => $e->getMessage()], 400);
    } catch (Throwable $e) {
        json_response(['ok' => false, 'error' => 'Server error'], 500);
        log_error($e->getMessage());
    }
}

/**
 * PATCH /judges/{id}/toggle-active
 */
function judge_toggle_active_controller(int $id): void
{
    if ($id <= 0) {
        json_response(['ok' => false, 'error' => 'Invalid judge id'], 400);
        return;
    }

    $pdo = get_pdo();

    try {
        $updated = judge_toggle_active($pdo, $id);
        if (!$updated) {
            json_response(['ok' => false, 'error' => 'Judge not found'], 404);
            return;
        }

        $updated['photo_url'] = $updated['has_photo']
            ? ("/hackcorruption/backend/api/judges_photo.php?id=" . $updated['id'])
            : null;

        $updated['status'] = ((int)($updated['is_active'] ?? 0) === 1) ? 'Active' : 'Inactive';

        json_response(['ok' => true, 'data' => $updated], 200);
    } catch (InvalidArgumentException $e) {
        json_response(['ok' => false, 'error' => $e->getMessage()], 400);
    } catch (Throwable $e) {
        json_response(['ok' => false, 'error' => 'Server error'], 500);
        log_error($e->getMessage());
    }
}
