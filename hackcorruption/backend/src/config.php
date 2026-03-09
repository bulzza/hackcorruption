<?php
// backend/src/config.php

return [
  'db' => [
    'host' => 'localhost',
    'name' => 'hackcorruption',
    'user' => 'root',
    'pass' => '',
    'charset' => 'utf8mb4',
  ],
  'cors' => [
    // Use '*' to allow all origins. For credentialed requests the server
    // will echo the request's Origin header back instead of using '*'.
    'allowed_origin' => '*',
  ],
];
?>