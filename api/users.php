<?php
header('Content-Type: application/json');

// Allow POST requests only
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Verify admin authentication
session_start();
if (!isset($_SESSION['adminAuth']) || $_SESSION['adminAuth'] !== true) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Get JSON data from request body
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

if ($data === null) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit;
}

// Path to users.json file
$usersFile = __DIR__ . '/../data/users.json';

// Validate the data structure
if (!isset($data['users']) || !is_array($data['users'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid data structure']);
    exit;
}

// Validate each user entry
foreach ($data['users'] as $user) {
    if (!isset($user['username']) || 
        !isset($user['pin']) || 
        !isset($user['subscription_type']) || 
        !isset($user['start_date']) || 
        !isset($user['expiry_date'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid user data structure']);
        exit;
    }
}

try {
    // Create a backup of the current file
    if (file_exists($usersFile)) {
        $backupFile = $usersFile . '.bak.' . date('Y-m-d-H-i-s');
        copy($usersFile, $backupFile);
    }

    // Write the new data
    $success = file_put_contents($usersFile, json_encode($data, JSON_PRETTY_PRINT));
    
    if ($success === false) {
        throw new Exception('Failed to write to users.json');
    }

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
    
    // Restore from backup if available
    if (isset($backupFile) && file_exists($backupFile)) {
        copy($backupFile, $usersFile);
    }
}