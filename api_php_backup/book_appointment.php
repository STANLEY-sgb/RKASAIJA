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

$name   = trim($input['client_name'] ?? '');
$email  = trim($input['client_email'] ?? '');
$phone  = trim($input['client_phone'] ?? '');
$area   = trim($input['practice_area'] ?? '');
$lawyer = trim($input['preferred_lawyer'] ?? '');
$date   = trim($input['preferred_date'] ?? '');
$time   = trim($input['preferred_time'] ?? '');
$msg    = trim($input['message'] ?? '');

if (!$name || !$email) {
    echo json_encode(['success' => false, 'error' => 'Name and email are required.']); exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => 'Invalid email address.']); exit;
}

$db = getDB();
if (!$db) {
    // Fallback: save to JSON file if DB not available
    $record = compact('name','email','phone','area','lawyer','date','time','msg');
    $record['status'] = 'pending';
    $record['is_read'] = 0;
    $record['created_at'] = date('Y-m-d H:i:s');
    $record['id'] = time();
    $file = '../data/appointments.json';
    @mkdir('../data', 0755, true);
    $existing = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    $existing[] = $record;
    file_put_contents($file, json_encode($existing, JSON_PRETTY_PRINT));
    echo json_encode(['success' => true, 'message' => 'Appointment booked successfully!']);
    exit;
}

try {
    $stmt = $db->prepare("INSERT INTO appointments
        (client_name, client_email, client_phone, practice_area, preferred_lawyer, preferred_date, preferred_time, message)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$name, $email, $phone, $area, $lawyer, $date ?: null, $time, $msg]);
    $appointmentId = $db->lastInsertId();

    // Log the activity
    $db->prepare("INSERT INTO activity_log (action, details) VALUES (?, ?)")
       ->execute(['New Appointment', "Client: $name | Area: $area | Lawyer: $lawyer | Date: $date $time"]);

    // Send email notification to firm (if mail is configured)
    $to = FIRM_EMAIL;
    $subject = "New Appointment Request - $name";
    $body = "A new appointment has been requested.\n\n"
          . "Client: $name\nEmail: $email\nPhone: $phone\n"
          . "Practice Area: $area\nPreferred Lawyer: $lawyer\n"
          . "Date/Time: $date at $time\n\nMessage:\n$msg\n\n"
          . "View in admin: http://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['REQUEST_URI'], 2) . "/admin.php";
    $headers = "From: noreply@kasaija-partners.com\r\nReply-To: $email";
    @mail($to, $subject, $body, $headers);

    echo json_encode([
        'success' => true,
        'id' => $appointmentId,
        'message' => 'Your appointment request has been received. We will confirm within one business day.'
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Could not save appointment. Please call us directly.']);
}
