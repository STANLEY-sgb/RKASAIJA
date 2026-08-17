<?php
// ─── Admin Data API ───────────────────────────────────────────────────────────
// All endpoints require active admin session.
// Mutation endpoints require valid X-CSRF-Token header.

header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, no-cache');

session_start();
require_once '../config.php';

// ── Auth check ────────────────────────────────────────────────────────────────
if (empty($_SESSION['admin_logged_in'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorised']);
    exit;
}

// Session timeout check
if (!empty($_SESSION['last_activity']) && (time() - $_SESSION['last_activity']) > SESSION_TIMEOUT) {
    session_unset(); session_destroy();
    http_response_code(401);
    echo json_encode(['error' => 'Session expired']);
    exit;
}
$_SESSION['last_activity'] = time();

// ── CSRF check for mutations ──────────────────────────────────────────────────
$method = $_SERVER['REQUEST_METHOD'];
if (in_array($method, ['POST', 'PUT', 'DELETE', 'PATCH'])) {
    $csrfHeader = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (empty($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $csrfHeader)) {
        http_response_code(403);
        echo json_encode(['error' => 'Invalid CSRF token']);
        exit;
    }
}

$db  = getDB();
$action = $_GET['action'] ?? 'overview';
$role   = $_SESSION['admin_role'] ?? 'admin';
$user   = $_SESSION['admin_user'] ?? 'admin';
$displayName = $_SESSION['admin_name'] ?? $user;
$ip = $_SERVER['HTTP_X_FORWARDED_FOR']
    ? explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0]
    : ($_SERVER['REMOTE_ADDR'] ?? '');

// Helper to apply RLS to SQL
function applyRLS(string $sql, string $role, string $user, string $displayName, string $tableAlias = 'c'): string {
    if ($role === 'super_admin') return $sql;
    
    $whereClause = " ($tableAlias.assigned_lawyer = " . getDB()->quote($user) . " OR $tableAlias.assigned_lawyer = " . getDB()->quote($displayName) . ")";
    if (strpos(strtoupper($sql), 'WHERE') !== false) {
        return preg_replace('/WHERE/i', 'WHERE ' . $whereClause . ' AND ', $sql, 1);
    } else if (strpos(strtoupper($sql), 'GROUP BY') !== false) {
        return preg_replace('/GROUP BY/i', 'WHERE ' . $whereClause . ' GROUP BY ', $sql, 1);
    } else if (strpos(strtoupper($sql), 'ORDER BY') !== false) {
        return preg_replace('/ORDER BY/i', 'WHERE ' . $whereClause . ' ORDER BY ', $sql, 1);
    }
    return $sql . " WHERE " . $whereClause;
}

if (!$db) {
    echo json_encode(['error' => 'Database unavailable']);
    exit;
}

// ── Ensure new tables exist (safe re-run) ─────────────────────────────────────
$db->exec("CREATE TABLE IF NOT EXISTS `ai_memory` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `topic_keywords` TEXT NOT NULL,
    `response` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FULLTEXT(`topic_keywords`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

// ── Helpers ───────────────────────────────────────────────────────────────────
function logActivity(PDO $db, string $action, string $details, string $ip = ''): void {
    global $_SESSION;
    try {
        $db->prepare("INSERT INTO activity_log (admin_user, action, details, ip_address) VALUES (?,?,?,?)")
           ->execute([$_SESSION['admin_user'] ?? 'admin', $action, $details, $ip]);
    } catch (PDOException $e) {}
}

function readInput(): array {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

function nextSequence(PDO $db, string $prefix, string $table, string $col): string {
    $year  = date('Y');
    $like  = "$prefix-$year-%";
    $stmt  = $db->prepare("SELECT MAX(CAST(SUBSTRING_INDEX($col, '-', -1) AS UNSIGNED)) FROM `$table` WHERE `$col` LIKE ?");
    $stmt->execute([$like]);
    $n = (int)$stmt->fetchColumn();
    return sprintf("$prefix-$year-%03d", $n + 1);
}

// ══════════════════════════════════════════════════════════════════════════════
switch ($action) {
// ═════════════════════════════════════════════════════════════════════════════
// OVERVIEW / DASHBOARD
// ═════════════════════════════════════════════════════════════════════════════
case 'overview':
    $s = [];
    try {
        // Appointments
        $s['total_appointments']     = (int)$db->query("SELECT COUNT(*) FROM appointments")->fetchColumn();
        $s['pending_appointments']   = (int)$db->query("SELECT COUNT(*) FROM appointments WHERE status='pending'")->fetchColumn();
        $s['confirmed_appointments'] = (int)$db->query("SELECT COUNT(*) FROM appointments WHERE status='confirmed'")->fetchColumn();
        $s['unread_appointments']    = (int)$db->query("SELECT COUNT(*) FROM appointments WHERE is_read=0")->fetchColumn();
        // Contacts
        $s['total_contacts']  = (int)$db->query("SELECT COUNT(*) FROM contact_submissions")->fetchColumn();
        $s['unread_contacts'] = (int)$db->query("SELECT COUNT(*) FROM contact_submissions WHERE is_read=0")->fetchColumn();
        // Cases
        $s['total_cases']    = (int)$db->query(applyRLS("SELECT COUNT(*) FROM cases c", $role, $user, $displayName))->fetchColumn();
        $s['open_cases']     = (int)$db->query(applyRLS("SELECT COUNT(*) FROM cases c WHERE status NOT IN ('closed','won','lost')", $role, $user, $displayName))->fetchColumn();
        $s['urgent_cases']   = (int)$db->query(applyRLS("SELECT COUNT(*) FROM cases c WHERE priority='urgent' AND status NOT IN ('closed','won','lost')", $role, $user, $displayName))->fetchColumn();
        // Clients (Clients are shared or should we RLS them too? Let's keep shared for now but restrict cases)
        $s['total_clients']  = (int)$db->query("SELECT COUNT(*) FROM clients")->fetchColumn();
        // Tasks
        $s['tasks_pending']  = (int)$db->query(applyRLS("SELECT COUNT(*) FROM tasks c", $role, $user, $displayName, 'c'))->fetchColumn(); // tasks table uses assigned_to, but let's assume assigned_lawyer for now or add a custom RLS for tasks
        $s['tasks_overdue']  = (int)$db->query(applyRLS("SELECT COUNT(*) FROM tasks c WHERE status NOT IN ('completed') AND due_date < CURDATE()", $role, $user, $displayName, 'c'))->fetchColumn();
        // Billing
        $s['invoiced_total'] = (float)($db->query(applyRLS("SELECT COALESCE(SUM(amount),0) FROM billing c WHERE status IN ('sent','paid') AND YEAR(issue_date)=YEAR(CURDATE())", $role, $user, $displayName, 'c'))->fetchColumn() ?? 0);
        $s['paid_total']     = (float)($db->query(applyRLS("SELECT COALESCE(SUM(amount),0) FROM billing c WHERE status='paid' AND YEAR(issue_date)=YEAR(CURDATE())", $role, $user, $displayName, 'c'))->fetchColumn() ?? 0);
        // Charts
        $s['cases_by_status']  = $db->query(applyRLS("SELECT status, COUNT(*) as cnt FROM cases c GROUP BY status", $role, $user, $displayName))->fetchAll();
        $s['cases_by_area']    = $db->query(applyRLS("SELECT practice_area, COUNT(*) as cnt FROM cases c WHERE practice_area!='' GROUP BY practice_area ORDER BY cnt DESC LIMIT 8", $role, $user, $displayName))->fetchAll();
        $s['weekly_appts']     = $db->query("SELECT DATE(created_at) as day, COUNT(*) as cnt FROM appointments WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) GROUP BY DATE(created_at) ORDER BY day ASC")->fetchAll();
        // Upcoming hearings
        $s['upcoming_hearings'] = $db->query(applyRLS("SELECT c.id, c.case_number, c.title, c.next_hearing_date, c.assigned_lawyer, cl.first_name, cl.last_name FROM cases c LEFT JOIN clients cl ON c.client_id=cl.id WHERE c.next_hearing_date >= CURDATE() AND c.next_hearing_date <= DATE_ADD(CURDATE(), INTERVAL 14 DAY) ORDER BY c.next_hearing_date ASC LIMIT 10", $role, $user, $displayName))->fetchAll();
        // Due today tasks
        $s['tasks_today'] = $db->query(applyRLS("SELECT t.*, c.case_number FROM tasks t LEFT JOIN cases c ON t.case_id=c.id WHERE t.due_date = CURDATE() AND t.status != 'completed' ORDER BY t.priority DESC LIMIT 8", $role, $user, $displayName, 'c'))->fetchAll();
        // Activity
        $s['activity'] = $db->query("SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 15")->fetchAll();
    } catch (PDOException $e) {}
    echo json_encode($s);
    break;

// ═════════════════════════════════════════════════════════════════════════════
// APPOINTMENTS
// ═════════════════════════════════════════════════════════════════════════════
case 'appointments':
    $status = $_GET['status'] ?? '';
    $sql = "SELECT * FROM appointments c";
    $params = [];
    if ($status && in_array($status, ['pending','confirmed','cancelled','completed'])) {
        $sql .= " WHERE status = ?"; $params[] = $status;
    }
    $sql = applyRLS($sql, $role, $user, $displayName, 'c');
    if ($role !== 'super_admin') {
         $sql = preg_replace('/c.assigned_lawyer/i', 'c.preferred_lawyer', $sql);
    }
    $sql .= " ORDER BY created_at DESC LIMIT 200";
    $stmt = $db->prepare($sql); $stmt->execute($params);
    echo json_encode($stmt->fetchAll());
    break;

case 'update_appointment':
    $in = readInput();
    $id = intval($in['id'] ?? 0);
    $status = $in['status'] ?? '';
    $notes  = trim($in['notes'] ?? '');
    if (!$id || !in_array($status, ['pending','confirmed','cancelled','completed'])) {
        echo json_encode(['error'=>'Invalid input']); break;
    }
    $db->prepare("UPDATE appointments SET status=?, admin_notes=?, is_read=1 WHERE id=?")->execute([$status,$notes,$id]);
    logActivity($db, 'Appointment Updated', "ID:$id → $status", $ip);
    echo json_encode(['success'=>true]);
    break;

case 'mark_read':
    $type = $_GET['type'] ?? 'appointment';
    $id   = intval($_GET['id'] ?? 0);
    if ($type === 'appointment') {
        $db->prepare("UPDATE appointments SET is_read=1 WHERE id=?")->execute([$id]);
    } else {
        $db->prepare("UPDATE contact_submissions SET is_read=1 WHERE id=?")->execute([$id]);
    }
    echo json_encode(['success'=>true]);
    break;

case 'mark_all_read':
    $db->exec("UPDATE appointments SET is_read=1");
    $db->exec("UPDATE contact_submissions SET is_read=1");
    echo json_encode(['success'=>true]);
    break;

// ═════════════════════════════════════════════════════════════════════════════
// CONTACTS
// ═════════════════════════════════════════════════════════════════════════════
case 'contacts':
    $sql = "SELECT * FROM contact_submissions c";
    // For now, contacts are firm-wide as they don't have a 'lawyer' column in the schema yet.
    // If you add one later, applyRLS will work here.
    $sql .= " ORDER BY created_at DESC LIMIT 200";
    $rows = $db->query($sql)->fetchAll();
    echo json_encode($rows);
    break;

// ═════════════════════════════════════════════════════════════════════════════
// CLIENTS
// ═════════════════════════════════════════════════════════════════════════════
case 'clients_list':
    $q = trim($_GET['q'] ?? '');
    $sql = "SELECT c.*, (SELECT COUNT(*) FROM cases WHERE client_id=c.id) as case_count FROM clients c";
    $params = [];
    if ($q) {
        $like = "%$q%";
        $sql .= " WHERE (c.first_name LIKE ? OR c.last_name LIKE ? OR c.email LIKE ? OR c.phone LIKE ? OR c.company LIKE ?)";
        $params = [$like,$like,$like,$like,$like];
    }
    
    // RLS for clients
    if ($role !== 'super_admin') {
        $rlsCond = " EXISTS (SELECT 1 FROM cases cs WHERE cs.client_id = c.id AND (cs.assigned_lawyer = " . $db->quote($user) . " OR cs.assigned_lawyer = " . $db->quote($displayName) . "))";
        $sql .= (strpos(strtoupper($sql), 'WHERE') !== false) ? " AND $rlsCond" : " WHERE $rlsCond";
    }
    
    $sql .= " ORDER BY c.last_name, c.first_name LIMIT 200";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    echo json_encode($stmt->fetchAll());
    break;

case 'clients_get':
    $id = intval($_GET['id'] ?? 0);
    if (!$id) { echo json_encode(['error'=>'ID required']); break; }
    $client = $db->prepare("SELECT * FROM clients WHERE id=?");
    $client->execute([$id]);
    $row = $client->fetch();
    if (!$row) { echo json_encode(['error'=>'Not found']); break; }
    $cases = $db->prepare("SELECT id, case_number, title, status, priority, practice_area, next_hearing_date, due_date FROM cases WHERE client_id=? ORDER BY created_at DESC");
    $cases->execute([$id]);
    $row['cases'] = $cases->fetchAll();
    echo json_encode($row);
    break;

case 'clients_add':
    $in = readInput();
    $fn = trim($in['first_name'] ?? '');
    $ln = trim($in['last_name']  ?? '');
    if (!$fn || !$ln) { echo json_encode(['error'=>'First and last name required']); break; }
    $num = nextSequence($db, 'CLT', 'clients', 'client_number');
    $db->prepare("INSERT INTO clients (client_number,first_name,last_name,email,phone,phone_alt,address,company,id_type,id_number,date_of_birth,nationality,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)")
       ->execute([$num,$fn,$ln,trim($in['email']??''),trim($in['phone']??''),trim($in['phone_alt']??''),trim($in['address']??''),trim($in['company']??''),$in['id_type']??null,trim($in['id_number']??''),$in['date_of_birth']??null,trim($in['nationality']??''),trim($in['notes']??'')]);
    $newId = $db->lastInsertId();
    logActivity($db, 'Client Added', "$fn $ln (CLT#$num)", $ip);
    echo json_encode(['success'=>true,'id'=>$newId,'client_number'=>$num]);
    break;

case 'clients_update':
    $in = readInput();
    $id = intval($in['id'] ?? 0);
    if (!$id) { echo json_encode(['error'=>'ID required']); break; }
    $db->prepare("UPDATE clients SET first_name=?,last_name=?,email=?,phone=?,phone_alt=?,address=?,company=?,id_type=?,id_number=?,date_of_birth=?,nationality=?,notes=?,updated_at=NOW() WHERE id=?")
       ->execute([trim($in['first_name']??''),trim($in['last_name']??''),trim($in['email']??''),trim($in['phone']??''),trim($in['phone_alt']??''),trim($in['address']??''),trim($in['company']??''),$in['id_type']??null,trim($in['id_number']??''),$in['date_of_birth']??null,trim($in['nationality']??''),trim($in['notes']??''),$id]);
    logActivity($db, 'Client Updated', "ID:$id", $ip);
    echo json_encode(['success'=>true]);
    break;

case 'clients_delete':
    $id = intval(readInput()['id'] ?? 0);
    if (!$id) { echo json_encode(['error'=>'ID required']); break; }
    $db->prepare("DELETE FROM clients WHERE id=?")->execute([$id]);
    logActivity($db, 'Client Deleted', "ID:$id", $ip);
    echo json_encode(['success'=>true]);
    break;

// ═════════════════════════════════════════════════════════════════════════════
// CASES
// ═════════════════════════════════════════════════════════════════════════════
case 'cases_list':
    $where = []; $params = [];
    if (!empty($_GET['status']))   { $where[] = 'c.status=?';         $params[] = $_GET['status']; }
    if (!empty($_GET['priority'])) { $where[] = 'c.priority=?';       $params[] = $_GET['priority']; }
    if (!empty($_GET['lawyer']))   { $where[] = 'c.assigned_lawyer=?'; $params[] = $_GET['lawyer']; }
    if (!empty($_GET['area']))     { $where[] = 'c.practice_area=?';   $params[] = $_GET['area']; }
    if (!empty($_GET['q'])) {
        $like = '%' . $_GET['q'] . '%';
        $where[] = '(c.title LIKE ? OR c.case_number LIKE ? OR c.opposing_party LIKE ? OR CONCAT(cl.first_name," ",cl.last_name) LIKE ?)';
        $params = array_merge($params, [$like,$like,$like,$like]);
    }
    $sql  = "SELECT c.*, cl.first_name, cl.last_name, cl.phone as client_phone FROM cases c LEFT JOIN clients cl ON c.client_id=cl.id";
    if ($where) $sql .= " WHERE " . implode(' AND ', $where);
    $sql  = applyRLS($sql, $role, $user, $displayName);
    $sql .= " ORDER BY c.priority DESC, c.due_date ASC, c.created_at DESC LIMIT 300";
    $stmt = $db->prepare($sql); $stmt->execute($params);
    echo json_encode($stmt->fetchAll());
    break;

case 'cases_get':
    $id = intval($_GET['id'] ?? 0);
    if (!$id) { echo json_encode(['error'=>'ID required']); break; }
    $stmt = $db->prepare("SELECT c.*, cl.first_name, cl.last_name, cl.email as client_email, cl.phone as client_phone, cl.client_number FROM cases c LEFT JOIN clients cl ON c.client_id=cl.id WHERE c.id=?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) { echo json_encode(['error'=>'Not found']); break; }
    $notes = $db->prepare("SELECT * FROM case_notes WHERE case_id=? ORDER BY created_at DESC");
    $notes->execute([$id]);
    $row['notes'] = $notes->fetchAll();
    $tasks = $db->prepare("SELECT * FROM tasks WHERE case_id=? ORDER BY due_date ASC");
    $tasks->execute([$id]);
    $row['tasks'] = $tasks->fetchAll();
    echo json_encode($row);
    break;

case 'cases_add':
    $in = readInput();
    $title = trim($in['title'] ?? '');
    if (!$title) { echo json_encode(['error'=>'Title required']); break; }
    $num = nextSequence($db, 'KP', 'cases', 'case_number');
    $db->prepare("INSERT INTO cases (case_number,title,client_id,client_name_override,practice_area,assigned_lawyer,co_counsel,status,priority,description,opposing_party,opposing_counsel,court,court_case_number,next_hearing_date,due_date,filed_date,opened_date,estimated_value) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
       ->execute([$num,$title,$in['client_id']??null,trim($in['client_name_override']??''),trim($in['practice_area']??''),trim($in['assigned_lawyer']??''),trim($in['co_counsel']??''),trim($in['status']??'open'),trim($in['priority']??'medium'),trim($in['description']??''),trim($in['opposing_party']??''),trim($in['opposing_counsel']??''),trim($in['court']??''),trim($in['court_case_number']??''),$in['next_hearing_date']??null,$in['due_date']??null,$in['filed_date']??null,date('Y-m-d'),$in['estimated_value']??null]);
    $newId = $db->lastInsertId();
    logActivity($db, 'Case Opened', "$title (#$num)", $ip);
    echo json_encode(['success'=>true,'id'=>$newId,'case_number'=>$num]);
    break;

case 'cases_update':
    $in = readInput();
    $id = intval($in['id'] ?? 0);
    if (!$id) { echo json_encode(['error'=>'ID required']); break; }
    $closedDate = in_array($in['status']??'', ['closed','won','lost']) ? date('Y-m-d') : null;
    $db->prepare("UPDATE cases SET title=?,client_id=?,client_name_override=?,practice_area=?,assigned_lawyer=?,co_counsel=?,status=?,priority=?,description=?,opposing_party=?,opposing_counsel=?,court=?,court_case_number=?,next_hearing_date=?,due_date=?,filed_date=?,estimated_value=?,closed_date=?,updated_at=NOW() WHERE id=?")
       ->execute([trim($in['title']??''),$in['client_id']??null,trim($in['client_name_override']??''),trim($in['practice_area']??''),trim($in['assigned_lawyer']??''),trim($in['co_counsel']??''),trim($in['status']??'open'),trim($in['priority']??'medium'),trim($in['description']??''),trim($in['opposing_party']??''),trim($in['opposing_counsel']??''),trim($in['court']??''),trim($in['court_case_number']??''),$in['next_hearing_date']??null,$in['due_date']??null,$in['filed_date']??null,$in['estimated_value']??null,$closedDate,$id]);
    logActivity($db, 'Case Updated', "ID:$id status=" . ($in['status']??''), $ip);
    echo json_encode(['success'=>true]);
    break;

case 'cases_delete':
    $id = intval(readInput()['id'] ?? 0);
    if (!$id) { echo json_encode(['error'=>'ID required']); break; }
    $db->prepare("DELETE FROM cases WHERE id=?")->execute([$id]);
    logActivity($db, 'Case Deleted', "ID:$id", $ip);
    echo json_encode(['success'=>true]);
    break;

case 'case_note_add':
    $in = readInput();
    $caseId  = intval($in['case_id'] ?? 0);
    $content = trim($in['content'] ?? '');
    $type    = $in['note_type'] ?? 'note';
    if (!$caseId || !$content) { echo json_encode(['error'=>'Case ID and content required']); break; }
    $db->prepare("INSERT INTO case_notes (case_id, author, note_type, content) VALUES (?,?,?,?)")
       ->execute([$caseId, $_SESSION['admin_user'] ?? 'Admin', $type, $content]);
    logActivity($db, 'Case Note Added', "Case ID:$caseId", $ip);
    echo json_encode(['success'=>true,'id'=>$db->lastInsertId()]);
    break;

case 'case_note_delete':
    $id = intval(readInput()['id'] ?? 0);
    if ($id) $db->prepare("DELETE FROM case_notes WHERE id=?")->execute([$id]);
    echo json_encode(['success'=>true]);
    break;

// ═════════════════════════════════════════════════════════════════════════════
// TASKS
// ═════════════════════════════════════════════════════════════════════════════
case 'tasks_list':
    $where = []; $params = [];
    if (!empty($_GET['status']))   { $where[] = 't.status=?';      $params[] = $_GET['status']; }
    if (!empty($_GET['assigned'])) { $where[] = 't.assigned_to=?'; $params[] = $_GET['assigned']; }
    if (!empty($_GET['case_id']))  { $where[] = 't.case_id=?';     $params[] = intval($_GET['case_id']); }
    $sql = "SELECT t.*, c.case_number, c.title as case_title FROM tasks t LEFT JOIN cases c ON t.case_id=c.id";
    if ($where) $sql .= " WHERE " . implode(' AND ', $where);
    $sql .= " ORDER BY FIELD(t.priority,'urgent','high','medium','low'), t.due_date ASC LIMIT 300";
    $stmt = $db->prepare($sql); $stmt->execute($params);
    // Auto-mark overdue
    $db->exec("UPDATE tasks SET status='overdue' WHERE status IN ('pending','in_progress') AND due_date < CURDATE()");
    echo json_encode($stmt->fetchAll());
    break;

case 'tasks_add':
    $in = readInput();
    $title = trim($in['title'] ?? '');
    if (!$title) { echo json_encode(['error'=>'Title required']); break; }
    $db->prepare("INSERT INTO tasks (case_id,title,description,assigned_to,priority,status,due_date) VALUES (?,?,?,?,?,?,?)")
       ->execute([$in['case_id']??null,$title,trim($in['description']??''),trim($in['assigned_to']??''),trim($in['priority']??'medium'),'pending',$in['due_date']??null]);
    logActivity($db, 'Task Added', $title, $ip);
    echo json_encode(['success'=>true,'id'=>$db->lastInsertId()]);
    break;

case 'tasks_update':
    $in = readInput();
    $id = intval($in['id'] ?? 0);
    if (!$id) { echo json_encode(['error'=>'ID required']); break; }
    $completed = ($in['status'] ?? '') === 'completed' ? date('Y-m-d H:i:s') : null;
    $db->prepare("UPDATE tasks SET title=?,description=?,assigned_to=?,priority=?,status=?,due_date=?,completed_at=? WHERE id=?")
       ->execute([trim($in['title']??''),trim($in['description']??''),trim($in['assigned_to']??''),trim($in['priority']??'medium'),trim($in['status']??'pending'),$in['due_date']??null,$completed,$id]);
    echo json_encode(['success'=>true]);
    break;

case 'tasks_delete':
    $id = intval(readInput()['id'] ?? 0);
    if ($id) $db->prepare("DELETE FROM tasks WHERE id=?")->execute([$id]);
    echo json_encode(['success'=>true]);
    break;

// ═════════════════════════════════════════════════════════════════════════════
// BILLING
// ═════════════════════════════════════════════════════════════════════════════
case 'billing_list':
    $stmt = $db->query("SELECT b.*, c.case_number, c.title as case_title, cl.first_name, cl.last_name FROM billing b LEFT JOIN cases c ON b.case_id=c.id LEFT JOIN clients cl ON b.client_id=cl.id ORDER BY b.created_at DESC LIMIT 300");
    echo json_encode($stmt->fetchAll());
    break;

case 'billing_stats':
    $s = [];
    $s['total_invoiced'] = (float)$db->query(applyRLS("SELECT COALESCE(SUM(amount),0) FROM billing c", $role, $user, $displayName, 'c'))->fetchColumn();
    $s['total_paid']     = (float)$db->query(applyRLS("SELECT COALESCE(SUM(amount),0) FROM billing c WHERE status='paid'", $role, $user, $displayName, 'c'))->fetchColumn();
    $s['total_overdue']  = (float)$db->query(applyRLS("SELECT COALESCE(SUM(amount),0) FROM billing c WHERE status='overdue' OR (status='sent' AND due_date < CURDATE())", $role, $user, $displayName, 'c'))->fetchColumn();
    $s['count_draft']    = (int)$db->query(applyRLS("SELECT COUNT(*) FROM billing c WHERE status='draft'", $role, $user, $displayName, 'c'))->fetchColumn();
    $s['this_month']     = (float)$db->query(applyRLS("SELECT COALESCE(SUM(amount),0) FROM billing c WHERE status='paid' AND MONTH(paid_date)=MONTH(CURDATE()) AND YEAR(paid_date)=YEAR(CURDATE())", $role, $user, $displayName, 'c'))->fetchColumn();
    echo json_encode($s);
    break;

case 'billing_add':
    $in = readInput();
    $amount = floatval($in['amount'] ?? 0);
    if ($amount <= 0) { echo json_encode(['error'=>'Amount required']); break; }
    $num = nextSequence($db, 'INV', 'billing', 'invoice_number');
    $db->prepare("INSERT INTO billing (invoice_number,case_id,client_id,description,amount,currency,status,issue_date,due_date,notes) VALUES (?,?,?,?,?,?,?,?,?,?)")
       ->execute([$num,$in['case_id']??null,$in['client_id']??null,trim($in['description']??''),$amount,trim($in['currency']??'UGX'),trim($in['status']??'draft'),date('Y-m-d'),$in['due_date']??null,trim($in['notes']??'')]);
    logActivity($db, 'Invoice Created', "INV#$num " . number_format($amount), $ip);
    echo json_encode(['success'=>true,'id'=>$db->lastInsertId(),'invoice_number'=>$num]);
    break;

case 'billing_update':
    $in = readInput();
    $id = intval($in['id'] ?? 0);
    if (!$id) { echo json_encode(['error'=>'ID required']); break; }
    $paidDate = ($in['status'] ?? '') === 'paid' ? ($in['paid_date'] ?? date('Y-m-d')) : null;
    $db->prepare("UPDATE billing SET case_id=?,client_id=?,description=?,amount=?,currency=?,status=?,due_date=?,paid_date=?,notes=? WHERE id=?")
       ->execute([$in['case_id']??null,$in['client_id']??null,trim($in['description']??''),floatval($in['amount']??0),trim($in['currency']??'UGX'),trim($in['status']??'draft'),$in['due_date']??null,$paidDate,trim($in['notes']??''),$id]);
    logActivity($db, 'Invoice Updated', "ID:$id → " . ($in['status']??''), $ip);
    echo json_encode(['success'=>true]);
    break;

case 'billing_delete':
    $id = intval(readInput()['id'] ?? 0);
    if ($id) $db->prepare("DELETE FROM billing WHERE id=?")->execute([$id]);
    echo json_encode(['success'=>true]);
    break;

// ═════════════════════════════════════════════════════════════════════════════
// AI ASSISTANT
// ═════════════════════════════════════════════════════════════════════════════
case 'token_stats':
    if ($role !== 'super_admin') { echo json_encode(['error'=>'Access denied']); break; }
    $t = [];
    $row = $db->query("SELECT tokens_used, requests FROM token_usage WHERE usage_date=CURDATE()")->fetch();
    $t['today_used']     = $row ? (int)$row['tokens_used'] : 0;
    $t['today_requests'] = $row ? (int)$row['requests'] : 0;
    $t['daily_budget']   = DAILY_TOKEN_BUDGET;
    $t['cache_hits']     = (int)$db->query("SELECT COUNT(*) FROM activity_log WHERE action='Cache Hit' AND DATE(created_at)=CURDATE()")->fetchColumn();
    $t['history']        = array_reverse($db->query("SELECT usage_date, tokens_used, requests FROM token_usage ORDER BY usage_date DESC LIMIT 14")->fetchAll());
    echo json_encode($t);
    break;

case 'faq_list':
    echo json_encode($db->query("SELECT id, question, response, keywords, use_count, enabled, created_at FROM faq_cache ORDER BY use_count DESC, created_at DESC")->fetchAll());
    break;

case 'faq_toggle':
    $id = intval($_GET['id'] ?? 0);
    $enabled = intval($_GET['enabled'] ?? 1);
    if ($id) $db->prepare("UPDATE faq_cache SET enabled=? WHERE id=?")->execute([$enabled ? 1 : 0, $id]);
    echo json_encode(['success'=>true]);
    break;

case 'faq_delete':
    $id = intval(readInput()['id'] ?? $_GET['id'] ?? 0);
    if ($id) $db->prepare("DELETE FROM faq_cache WHERE id=?")->execute([$id]);
    echo json_encode(['success'=>true]);
    break;

case 'faq_clear':
    try { $db->exec("TRUNCATE TABLE faq_cache"); } catch (PDOException $e) { $db->exec("DELETE FROM faq_cache"); }
    echo json_encode(['success'=>true]);
    break;

case 'memory_list':
    echo json_encode($db->query("SELECT * FROM ai_memory ORDER BY created_at DESC")->fetchAll());
    break;

case 'memory_add':
    $in = readInput();
    $topic    = trim($in['topic'] ?? '');
    $response = trim($in['response'] ?? '');
    if (!$topic || !$response) { echo json_encode(['error'=>'Topic and response required']); break; }
    $db->prepare("INSERT INTO ai_memory (topic_keywords, response) VALUES (?,?)")->execute([$topic, $response]);
    logActivity($db, 'AI Knowledge Added', "Topic: $topic", $ip);
    echo json_encode(['success'=>true,'id'=>$db->lastInsertId()]);
    break;

case 'memory_update':
    $in = readInput();
    $id = intval($in['id'] ?? 0);
    if (!$id) { echo json_encode(['error'=>'ID required']); break; }
    $db->prepare("UPDATE ai_memory SET topic_keywords=?, response=?, updated_at=NOW() WHERE id=?")->execute([trim($in['topic']??''),trim($in['response']??''),$id]);
    logActivity($db, 'AI Knowledge Updated', "ID:$id", $ip);
    echo json_encode(['success'=>true]);
    break;

case 'memory_delete':
    $id = intval(readInput()['id'] ?? 0);
    if ($id) {
        $db->prepare("DELETE FROM ai_memory WHERE id=?")->execute([$id]);
        logActivity($db, 'AI Knowledge Deleted', "ID:$id", $ip);
    }
    echo json_encode(['success'=>true]);
    break;

// ═════════════════════════════════════════════════════════════════════════════
// REPORTS
// ═════════════════════════════════════════════════════════════════════════════
case 'reports':
    $r = [];
    $r['cases_by_area']    = $db->query("SELECT practice_area, COUNT(*) as cnt FROM cases WHERE practice_area!='' GROUP BY practice_area ORDER BY cnt DESC")->fetchAll();
    $r['cases_by_lawyer']  = $db->query("SELECT assigned_lawyer, COUNT(*) as cnt FROM cases WHERE assigned_lawyer!='' GROUP BY assigned_lawyer ORDER BY cnt DESC")->fetchAll();
    $r['cases_by_status']  = $db->query("SELECT status, COUNT(*) as cnt FROM cases GROUP BY status")->fetchAll();
    $r['cases_monthly']    = $db->query("SELECT DATE_FORMAT(created_at,'%Y-%m') as month, COUNT(*) as cnt FROM cases WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH) GROUP BY month ORDER BY month ASC")->fetchAll();
    $r['appts_monthly']    = $db->query("SELECT DATE_FORMAT(created_at,'%Y-%m') as month, COUNT(*) as cnt FROM appointments WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH) GROUP BY month ORDER BY month ASC")->fetchAll();
    $r['billing_monthly']  = $db->query("SELECT DATE_FORMAT(issue_date,'%Y-%m') as month, SUM(amount) as total, SUM(CASE WHEN status='paid' THEN amount ELSE 0 END) as paid FROM billing WHERE issue_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH) GROUP BY month ORDER BY month ASC")->fetchAll();
    echo json_encode($r);
    break;

// ═════════════════════════════════════════════════════════════════════════════
// SETTINGS
// ═════════════════════════════════════════════════════════════════════════════
case 'change_password':
    $in = readInput();
    $current = $in['current_password'] ?? '';
    $newPass = $in['new_password'] ?? '';
    $confirm = $in['confirm_password'] ?? '';
    if (!$current || !$newPass) { echo json_encode(['error'=>'All fields required']); break; }
    if ($newPass !== $confirm)  { echo json_encode(['error'=>'Passwords do not match']); break; }
    if (strlen($newPass) < 8)   { echo json_encode(['error'=>'Password must be at least 8 characters']); break; }
    $username = $_SESSION['admin_user'] ?? 'admin';
    $user = $db->prepare("SELECT * FROM admin_users WHERE username=?");
    $user->execute([$username]);
    $row = $user->fetch();
    if (!$row || !password_verify($current, $row['password_hash'])) {
        // Fallback to config password check
        if (!defined('ADMIN_PASSWORD') || $current !== ADMIN_PASSWORD) {
            echo json_encode(['error'=>'Current password is incorrect']); break;
        }
    }
    $hash = password_hash($newPass, PASSWORD_BCRYPT, ['cost'=>12]);
    if ($row) {
        $db->prepare("UPDATE admin_users SET password_hash=? WHERE username=?")->execute([$hash, $username]);
    } else {
        $db->prepare("INSERT INTO admin_users (username,password_hash,display_name) VALUES (?,?,?) ON DUPLICATE KEY UPDATE password_hash=?")->execute([$username,$hash,'Administrator',$hash]);
    }
    logActivity($db, 'Password Changed', "User: $username", $ip);
    echo json_encode(['success'=>true]);
    break;

default:
    echo json_encode(['error'=>'Unknown action']);
}
