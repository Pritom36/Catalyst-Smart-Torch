<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Start session at the beginning
session_start();

// Allow POST requests only
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get JSON data from request body
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

if ($data === null || !isset($data['username']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request data',
        'debug' => ['received_data' => $data]
    ]);
    exit;
}

// Fixed admin credentials with pre-computed hash
$ADMIN_CREDENTIALS = [
    'username' => 'admin',
    // Hash for 'admin123' - This is a fixed hash that will work with the password
    'password_hash' => '$2y$10$wk2qEX2ZdgZ0.SeVaXm3p.Aa7gvQUX6iD6qGdcNzc17O6dF9yBK/K'
];

// Debug logging
error_log('Attempting admin login for username: ' . $data['username']);

// Verify credentials
$usernameMatch = $data['username'] === $ADMIN_CREDENTIALS['username'];
$passwordVerified = password_verify($data['password'], $ADMIN_CREDENTIALS['password_hash']);

if ($usernameMatch && $passwordVerified) {
    $_SESSION['adminAuth'] = true;
    $_SESSION['adminUsername'] = $data['username'];
    
    // Debug logging
    error_log('Admin login successful for: ' . $data['username']);
    
    echo json_encode([
        'success' => true,
        'message' => 'Login successful'
    ]);
} else {
    // Debug logging
    error_log('Admin login failed. Username match: ' . ($usernameMatch ? 'yes' : 'no'));
    
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid credentials'
    ]);
}