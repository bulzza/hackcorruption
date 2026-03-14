<?php
// backend/src/db.php

declare(strict_types=1);

require_once __DIR__ . '/schema.php';

function db(): PDO {
  static $pdo = null;
  if ($pdo) return $pdo;

  $config = require __DIR__ . '/config.php';
  $db = $config['db'];

  $dsn = "mysql:host={$db['host']};dbname={$db['name']};charset={$db['charset']}";
  $pdo = new PDO($dsn, $db['user'], $db['pass'], [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
  ]);

  schema_bootstrap($pdo);

  return $pdo;
}
