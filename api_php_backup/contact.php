<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['error' => 'Method not allowed']); exit; }

require_once '../config.php';

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) $input = $_POST;

$name  = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$phone = trim($input['phone'] ?? '');
$area  = trim($input['area'] ?? '');
$msg   = trim($input['message'] ?? '');

if (!$name || !$email || !$msg) {
    echo json_encode(['success' => false, 'error' => 'Name, email and message are required.']); exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => 'Invalid email address.']); exit;
}

$db = getDB();
if (!$db) {
    $record = compact('name','email','phone','area','msg');
    $record['is_read'] = 0;
    $record['created_at'] = date('Y-m-d H:i:s');
    $record['id'] = time();
    $file = '../data/contacts.json';
    @mkdir('../data', 0755, true);
    $existing = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    $existing[] = $record;
    file_put_contents($file, json_encode($existing, JSON_PRETTY_PRINT));
    echo json_encode(['success' => true, 'message' => 'Your enquiry has been received.']);
    exit;
}

try {
    $stmt = $db->prepare("INSERT INTO contact_submissions (name, email, phone, practice_area, message) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$name, $email, $phone, $area, $msg]);

    $db->prepare("INSERT INTO activity_log (action, details) VALUES (?, ?)")
       ->execute(['New Contact Enquiry', "From: $name | Email: $email | Area: $area"]);

    // Email notification
    $to = FIRM_EMAIL;
    $subject = "New Enquiry from Website - $name";
    $body = "New contact form submission.\n\nName: $name\nEmail: $email\nPhone: $phone\nArea: $area\n\nMessage:\n$msg";
    $headers = "From: noreply@kasaija-partners.com\r\nReply-To: $email";
    @mail($to, $subject, $body, $headers);

    echo json_encode(['success' => true, 'message' => 'Your enquiry has been received. An advocate will be in touch within one business day.']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Could not submit. Please email us directly.']);
}
