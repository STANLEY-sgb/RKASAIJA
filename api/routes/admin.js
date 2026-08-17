import express from 'express';
import { promisePool as db } from '../_db.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const applyRLS = (sql, role, user, displayName, tableAlias = 'c') => {
  if (role === 'super_admin') return sql;
  
  // Note: mysql2/promise pool doesn't have .escape() directly.
  // We'll use manual escaping for the RLS string as it's a legacy pattern,
  // but ideally this would use placeholders if the whole query was passed.
  const escapedUser = `'${user.replace(/'/g, "''")}'`;
  const escapedDisplayName = `'${displayName.replace(/'/g, "''")}'`;
  
  const whereClause = ` (${tableAlias}.assigned_lawyer = ${escapedUser} OR ${tableAlias}.assigned_lawyer = ${escapedDisplayName})`;
  
  if (sql.toUpperCase().includes('WHERE')) {
    return sql.replace(/WHERE/i, `WHERE ${whereClause} AND `);
  } else if (sql.toUpperCase().includes('GROUP BY')) {
    return sql.replace(/GROUP BY/i, `WHERE ${whereClause} GROUP BY `);
  } else if (sql.toUpperCase().includes('ORDER BY')) {
    return sql.replace(/ORDER BY/i, `WHERE ${whereClause} ORDER BY `);
  }
  return `${sql} WHERE ${whereClause}`;
};

const nextSequence = async (prefix, table, col) => {
  const year = new Date().getFullYear();
  const like = `${prefix}-${year}-%`;
  const [rows] = await db.query(
    `SELECT MAX(CAST(SUBSTRING_INDEX(${col}, '-', -1) AS UNSIGNED)) as max_n FROM \`${table}\` WHERE \`${col}\` LIKE ?`,
    [like]
  );
  const n = rows[0].max_n || 0;
  return `${prefix}-${year}-${String(n + 1).padStart(3, '0')}`;
};

const logActivity = async (req, action, details) => {
  const user = req.session?.admin?.user || 'admin';
  const ip = req.ip;
  try {
    await db.execute(
      "INSERT INTO activity_log (admin_user, action, details, ip_address) VALUES (?,?,?,?)",
      [user, action, details, ip]
    );
  } catch (e) {
    console.error('Log activity error:', e);
  }
};

// ─── AUTH MIDDLEWARE ──────────────────────────────────────────────────────────

const requireAdmin = (req, res, next) => {
  if (!req.session?.admin) {
    return res.status(401).json({ error: 'Unauthorised' });
  }
  next();
};

// ─── OVERVIEW ─────────────────────────────────────────────────────────────────

router.get('/overview', requireAdmin, async (req, res) => {
  const { role, user, displayName } = req.session.admin;
  
  try {
    const stats = {};
    
    // Appointments
    const [appts] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status='confirmed' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN is_read=0 THEN 1 ELSE 0 END) as unread
      FROM appointments
    `);
    stats.appointments = appts[0];

    // Contacts
    const [contacts] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_read=0 THEN 1 ELSE 0 END) as unread
      FROM contact_submissions
    `);
    stats.contacts = contacts[0];

    // Cases
    const casesSql = applyRLS("SELECT COUNT(*) as total FROM cases c", role, user, displayName);
    const [casesCount] = await db.query(casesSql);
    stats.total_cases = casesCount[0].total;

    // Activity Log
    const [activity] = await db.query('SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 15');
    stats.activity = activity;

    res.json(stats);
  } catch (error) {
    console.error('Overview error:', error);
    res.status(500).json({ error: 'Failed to fetch overview data' });
  }
});

// ─── APPOINTMENTS ─────────────────────────────────────────────────────────────

router.get('/appointments', requireAdmin, async (req, res) => {
  const { role, user, displayName } = req.session.admin;
  const { status } = req.query;
  
  let sql = 'SELECT * FROM appointments c';
  const params = [];
  
  if (status && ['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
    sql += ' WHERE status = ?';
    params.push(status);
  }
  
  sql = applyRLS(sql, role, user, displayName, 'c');
  if (role !== 'super_admin') {
    sql = sql.replace(/c\.assigned_lawyer/g, 'c.preferred_lawyer');
  }
  
  sql += ' ORDER BY created_at DESC LIMIT 200';
  
  try {
    const [rows] = await db.execute(sql, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/appointments/update', requireAdmin, async (req, res) => {
  const { id, status, notes } = req.body;
  try {
    await db.execute(
      'UPDATE appointments SET status=?, admin_notes=?, is_read=1 WHERE id=?',
      [status, notes || '', id]
    );
    await logActivity(req, 'Appointment Updated', `ID:${id} → ${status}`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── CLIENTS ──────────────────────────────────────────────────────────────────

router.get('/clients', requireAdmin, async (req, res) => {
  const { role, user, displayName } = req.session.admin;
  const { q } = req.query;
  
  let sql = "SELECT c.*, (SELECT COUNT(*) FROM cases WHERE client_id=c.id) as case_count FROM clients c";
  const params = [];
  
  if (q) {
    const like = `%${q}%`;
    sql += " WHERE (c.first_name LIKE ? OR c.last_name LIKE ? OR c.email LIKE ? OR c.phone LIKE ? OR c.company LIKE ?)";
    params.push(like, like, like, like, like);
  }
  
  if (role !== 'super_admin') {
    const escapedUser = `'${user.replace(/'/g, "''")}'`;
    const escapedDisplayName = `'${displayName.replace(/'/g, "''")}'`;
    const rlsCond = ` EXISTS (SELECT 1 FROM cases cs WHERE cs.client_id = c.id AND (cs.assigned_lawyer = ${escapedUser} OR cs.assigned_lawyer = ${escapedDisplayName}))`;
    sql += (sql.includes('WHERE') ? " AND " : " WHERE ") + rlsCond;
  }
  
  sql += " ORDER BY c.last_name, c.first_name LIMIT 200";
  
  try {
    const [rows] = await db.execute(sql, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/clients/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [clients] = await db.execute("SELECT * FROM clients WHERE id=?", [id]);
    if (clients.length === 0) return res.status(404).json({ error: 'Not found' });
    
    const client = clients[0];
    const [cases] = await db.execute(
      "SELECT id, case_number, title, status, priority, practice_area, next_hearing_date, due_date FROM cases WHERE client_id=? ORDER BY created_at DESC",
      [id]
    );
    client.cases = cases;
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/clients', requireAdmin, async (req, res) => {
  const data = req.body;
  if (!data.first_name || !data.last_name) return res.status(400).json({ error: 'Name required' });
  
  try {
    const num = await nextSequence('CLT', 'clients', 'client_number');
    const [result] = await db.execute(
      "INSERT INTO clients (client_number,first_name,last_name,email,phone,phone_alt,address,company,id_type,id_number,date_of_birth,nationality,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [num, data.first_name, data.last_name, data.email||'', data.phone||'', data.phone_alt||'', data.address||'', data.company||'', data.id_type||null, data.id_number||'', data.date_of_birth||null, data.nationality||'', data.notes||'']
    );
    await logActivity(req, 'Client Added', `${data.first_name} ${data.last_name} (CLT#${num})`);
    res.json({ success: true, id: result.insertId, client_number: num });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── CASES ────────────────────────────────────────────────────────────────────

router.get('/cases', requireAdmin, async (req, res) => {
  const { role, user, displayName } = req.session.admin;
  const { status, priority, lawyer, area, q } = req.query;
  
  let sql = "SELECT c.*, cl.first_name, cl.last_name, cl.phone as client_phone FROM cases c LEFT JOIN clients cl ON c.client_id=cl.id";
  const where = [];
  const params = [];
  
  if (status) { where.push("c.status=?"); params.push(status); }
  if (priority) { where.push("c.priority=?"); params.push(priority); }
  if (lawyer) { where.push("c.assigned_lawyer=?"); params.push(lawyer); }
  if (area) { where.push("c.practice_area=?"); params.push(area); }
  if (q) {
    const like = `%${q}%`;
    where.push("(c.title LIKE ? OR c.case_number LIKE ? OR c.opposing_party LIKE ? OR CONCAT(cl.first_name,' ',cl.last_name) LIKE ?)");
    params.push(like, like, like, like);
  }
  
  if (where.length) sql += " WHERE " + where.join(" AND ");
  sql = applyRLS(sql, role, user, displayName, 'c');
  sql += " ORDER BY c.priority DESC, c.due_date ASC, c.created_at DESC LIMIT 300";
  
  try {
    const [rows] = await db.execute(sql, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/cases/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [cases] = await db.execute(
      "SELECT c.*, cl.first_name, cl.last_name, cl.email as client_email, cl.phone as client_phone, cl.client_number FROM cases c LEFT JOIN clients cl ON c.client_id=cl.id WHERE c.id=?",
      [id]
    );
    if (cases.length === 0) return res.status(404).json({ error: 'Not found' });
    
    const caseData = cases[0];
    const [notes] = await db.execute("SELECT * FROM case_notes WHERE case_id=? ORDER BY created_at DESC", [id]);
    caseData.notes = notes;
    const [tasks] = await db.execute("SELECT * FROM tasks WHERE case_id=? ORDER BY due_date ASC", [id]);
    caseData.tasks = tasks;
    
    res.json(caseData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/cases', requireAdmin, async (req, res) => {
  const d = req.body;
  if (!d.title) return res.status(400).json({ error: 'Title required' });
  
  try {
    const num = await nextSequence('KP', 'cases', 'case_number');
    const [result] = await db.execute(
      "INSERT INTO cases (case_number,title,client_id,client_name_override,practice_area,assigned_lawyer,co_counsel,status,priority,description,opposing_party,opposing_counsel,court,court_case_number,next_hearing_date,due_date,filed_date,opened_date,estimated_value) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [num, d.title, d.client_id||null, d.client_name_override||'', d.practice_area||'', d.assigned_lawyer||'', d.co_counsel||'', d.status||'open', d.priority||'medium', d.description||'', d.opposing_party||'', d.opposing_counsel||'', d.court||'', d.court_case_number||'', d.next_hearing_date||null, d.due_date||null, d.filed_date||null, new Date().toISOString().slice(0, 10), d.estimated_value||null]
    );
    await logActivity(req, 'Case Opened', `${d.title} (#${num})`);
    res.json({ success: true, id: result.insertId, case_number: num });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── TASKS ────────────────────────────────────────────────────────────────────

router.get('/tasks', requireAdmin, async (req, res) => {
  const { status, assigned, case_id } = req.query;
  const where = [];
  const params = [];
  
  if (status) { where.push("t.status=?"); params.push(status); }
  if (assigned) { where.push("t.assigned_to=?"); params.push(assigned); }
  if (case_id) { where.push("t.case_id=?"); params.push(case_id); }
  
  let sql = "SELECT t.*, c.case_number, c.title as case_title FROM tasks t LEFT JOIN cases c ON t.case_id=c.id";
  if (where.length) sql += " WHERE " + where.join(" AND ");
  sql += " ORDER BY FIELD(t.priority,'urgent','high','medium','low'), t.due_date ASC LIMIT 300";
  
  try {
    // Auto-mark overdue
    await db.execute("UPDATE tasks SET status='overdue' WHERE status IN ('pending','in_progress') AND due_date < CURDATE()");
    const [rows] = await db.execute(sql, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── BILLING ──────────────────────────────────────────────────────────────────

router.get('/billing', requireAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT b.*, c.case_number, c.title as case_title, cl.first_name, cl.last_name FROM billing b LEFT JOIN cases c ON b.case_id=c.id LEFT JOIN clients cl ON b.client_id=cl.id ORDER BY b.created_at DESC LIMIT 300"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/billing/stats', requireAdmin, async (req, res) => {
  const { role, user, displayName } = req.session.admin;
  try {
    const stats = {};
    const baseSql = "SELECT COALESCE(SUM(amount),0) as val FROM billing c";
    
    const [totalInvoiced] = await db.query(applyRLS(baseSql, role, user, displayName, 'c'));
    stats.total_invoiced = totalInvoiced[0].val;
    
    const [totalPaid] = await db.query(applyRLS(baseSql + " WHERE status='paid'", role, user, displayName, 'c'));
    stats.total_paid = totalPaid[0].val;
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── AI ASSISTANT ─────────────────────────────────────────────────────────────

router.get('/faq', requireAdmin, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, question, response, keywords, use_count, enabled, created_at FROM faq_cache ORDER BY use_count DESC, created_at DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/faq/toggle', requireAdmin, async (req, res) => {
  const { id, enabled } = req.body;
  try {
    await db.execute("UPDATE faq_cache SET enabled=? WHERE id=?", [enabled ? 1 : 0, id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/memory', requireAdmin, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM ai_memory ORDER BY created_at DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/memory', requireAdmin, async (req, res) => {
  const { topic, response } = req.body;
  if (!topic || !response) return res.status(400).json({ error: 'Topic and response required' });
  try {
    const [result] = await db.execute("INSERT INTO ai_memory (topic_keywords, response) VALUES (?,?)", [topic, response]);
    await logActivity(req, 'AI Knowledge Added', `Topic: ${topic}`);
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── REPORTS ──────────────────────────────────────────────────────────────────

router.get('/reports', requireAdmin, async (req, res) => {
  try {
    const reports = {};
    const [areas] = await db.query("SELECT practice_area, COUNT(*) as cnt FROM cases WHERE practice_area!='' GROUP BY practice_area ORDER BY cnt DESC");
    reports.cases_by_area = areas;
    
    const [lawyers] = await db.query("SELECT assigned_lawyer, COUNT(*) as cnt FROM cases WHERE assigned_lawyer!='' GROUP BY assigned_lawyer ORDER BY cnt DESC");
    reports.cases_by_lawyer = lawyers;
    
    const [monthly] = await db.query("SELECT DATE_FORMAT(created_at,'%Y-%m') as month, COUNT(*) as cnt FROM cases WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH) GROUP BY month ORDER BY month ASC");
    reports.cases_monthly = monthly;
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── SETTINGS ─────────────────────────────────────────────────────────────────

router.post('/settings/change-password', requireAdmin, async (req, res) => {
  const { current_password, new_password, confirm_password } = req.body;
  if (!current_password || !new_password) return res.status(400).json({ error: 'All fields required' });
  if (new_password !== confirm_password) return res.status(400).json({ error: 'Passwords do not match' });
  if (new_password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
  
  const username = req.session.admin.user;
  try {
    const [users] = await db.execute("SELECT * FROM admin_users WHERE username=?", [username]);
    const user = users[0];
    
    if (!user || !await bcrypt.compare(current_password, user.password_hash)) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    const hash = await bcrypt.hash(new_password, 12);
    await db.execute("UPDATE admin_users SET password_hash=? WHERE username=?", [hash, username]);
    await logActivity(req, 'Password Changed', `User: ${username}`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── AUTH / LOGIN ─────────────────────────────────────────────────────────────

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await db.execute("SELECT * FROM admin_users WHERE username = ? LIMIT 1", [username]);
    const user = users[0];
    
    if (user && await bcrypt.compare(password, user.password_hash)) {
      req.session.admin = {
        user: user.username,
        name: user.display_name,
        role: user.role || 'admin'
      };
      await db.execute("UPDATE admin_users SET last_login = NOW() WHERE id = ?", [user.id]);
      return res.json({ success: true, user: req.session.admin });
    }
    
    res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/logout', (req, res) => {
  req.session?.destroy();
  res.json({ success: true });
});

export default router;
