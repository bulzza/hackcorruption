<?php
// backend/src/validators.php

function require_string(array $arr, string $key, int $minLen = 1): string {
  if (!isset($arr[$key]) || !is_string($arr[$key])) {
    throw new Exception("Missing or invalid field: {$key}");
  }
  $v = trim($arr[$key]);
  if (mb_strlen($v) < $minLen) {
    throw new Exception("Field too short: {$key}");
  }
  return $v;
}

function optional_string(array $arr, string $key): ?string {
  if (!isset($arr[$key]) || $arr[$key] === null) return null;
  if (!is_string($arr[$key])) throw new Exception("Invalid field: {$key}");
  $v = trim($arr[$key]);
  return $v === '' ? null : $v;
}

function optional_int(array $arr, string $key): ?int {
  if (!isset($arr[$key]) || $arr[$key] === null || $arr[$key] === '') return null;
  if (!is_numeric($arr[$key])) throw new Exception("Invalid int field: {$key}");
  return (int)$arr[$key];
}

function optional_float(array $arr, string $key): ?float {
  if (!isset($arr[$key]) || $arr[$key] === null || $arr[$key] === '') return null;
  if (!is_numeric($arr[$key])) throw new Exception("Invalid number field: {$key}");
  return (float)$arr[$key];
}
?>