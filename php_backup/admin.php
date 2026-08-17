<?php
// ─── Security headers ──────────────────────────────────────────────────────────
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Cache-Control: no-store, no-cache, must-revalidate, private');

session_start();
require_once 'config.php';

// ─── Auth handling ─────────────────────────────────────────────────────────────
$error = '';
if (isset($_POST['login'])) {
    $now = time();
    if (!isset($_SESSION['login_attempts'])) $_SESSION['login_attempts'] = [];
    $_SESSION['login_attempts'] = array_filter($_SESSION['login_attempts'], fn($t) => $now - $t < 900);
    
    if (count($_SESSION['login_attempts']) >= 10) {
        $error = 'Too many failed attempts. Please wait 15 minutes.';
    } else {
        $user = trim($_POST['username'] ?? '');
        $pass = $_POST['password'] ?? '';
        $db   = getDB();
        
        $authenticated = false;
        if ($db) {
            $stmt = $db->prepare("SELECT * FROM admin_users WHERE username = ? LIMIT 1");
            $stmt->execute([$user]);
            $userData = $stmt->fetch();
            
            if ($userData && password_verify($pass, $userData['password_hash'])) {
                $authenticated = true;
                session_regenerate_id(true);
                $_SESSION['admin_logged_in'] = true;
                $_SESSION['admin_user']      = $userData['username'];
                $_SESSION['admin_name']      = $userData['display_name'];
                $_SESSION['admin_role']      = $userData['role'] ?? 'admin';
                $_SESSION['login_attempts']  = [];
                
                // Update last login
                $db->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = ?")->execute([$userData['id']]);
                header('Location: admin.php');
                exit;
            }
        }
        
        // Legacy fallback
        if (!$authenticated && hash_equals(ADMIN_USERNAME, $user) && hash_equals(ADMIN_PASSWORD, $pass)) {
            session_regenerate_id(true);
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_user']      = ADMIN_USERNAME;
            $_SESSION['admin_name']      = 'Administrator';
            $_SESSION['admin_role']      = 'super_admin';
            $_SESSION['login_attempts']  = [];
            header('Location: admin.php');
            exit;
        }
        
        $_SESSION['login_attempts'][] = $now;
        $error = 'Invalid username or password.';
    }
}
if (isset($_GET['logout'])) {
    session_unset();
    session_destroy();
    header('Location: admin.php');
    exit;
}
$loggedIn = !empty($_SESSION['admin_logged_in']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Admin Dashboard — R. Kasaija &amp; Partners</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&family=Inter+Tight:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --cream:#FBF7EF;--dark:#2A1D10;--darker:#1F1308;
  --gold:#B8956A;--gold-mid:#8B6F47;
  --light:#F6EDDA;--light2:#E8D8B4;
  --border:rgba(139,111,71,.2);
  --ff-serif:'Fraunces',serif;
  --ff-sans:'Inter Tight',system-ui,sans-serif;
  --ff-mono:'JetBrains Mono',monospace;
  --sidebar:240px;
  --red:#EF4444;--green:#22C55E;--amber:#F59E0B;--blue:#3B82F6;
}
body{font-family:var(--ff-sans);background:#F5F1E8;color:var(--dark);-webkit-font-smoothing:antialiased;}
a{color:inherit;text-decoration:none;}
button{font-family:inherit;cursor:pointer;border:none;background:none;}

/* ── Login ── */
.login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,var(--cream),var(--light2));}
.login-card{width:min(420px,calc(100vw-32px));background:white;border-radius:20px;padding:44px;box-shadow:0 20px 60px -16px rgba(42,29,16,.18);}
.login-logo{display:flex;align-items:center;gap:12px;margin-bottom:32px;}
.login-logo-icon{width:48px;height:48px;background:var(--dark);border-radius:50%;display:flex;align-items:center;justify-content:center;overflow:hidden;}
.login-logo-icon img{width:100%;height:100%;object-fit:cover;border-radius:50%;}
.login-title{font-family:var(--ff-serif);font-size:1.9rem;letter-spacing:-.025em;margin-bottom:6px;}
.login-sub{font-size:13px;opacity:.6;margin-bottom:28px;}
.login-input{width:100%;padding:13px 16px;border:1.5px solid var(--border);border-radius:10px;font-size:14px;outline:none;transition:border-color .25s;margin-bottom:12px;}
.login-input:focus{border-color:var(--gold-mid);}
.login-btn{width:100%;padding:14px;background:var(--dark);color:white;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;transition:all .3s;display:flex;align-items:center;justify-content:center;gap:8px;}
.login-btn:hover{transform:translateY(-1px);box-shadow:0 8px 24px -6px rgba(42,29,16,.4);}
.login-err{color:var(--red);font-size:13px;margin-bottom:14px;padding:10px 14px;background:#FEF2F2;border-radius:8px;}
.login-back{display:block;text-align:center;margin-top:20px;font-size:13px;opacity:.55;}
.login-back:hover{opacity:1;}

/* ── Admin Layout ── */
.admin-layout{display:flex;min-height:100vh;}
/* Sidebar */
.sidebar{width:var(--sidebar);background:var(--darker);color:var(--cream);display:flex;flex-direction:column;flex-shrink:0;position:sticky;top:0;height:100vh;overflow:hidden;}
.sidebar-logo{padding:24px 20px;border-bottom:1px solid rgba(184,149,106,.12);display:flex;align-items:center;gap:10px;}
.sidebar-logo-icon{width:36px;height:36px;background:var(--gold-mid);border-radius:50%;display:flex;align-items:center;justify-content:center;overflow:hidden;}
.sidebar-logo-icon img{width:100%;height:100%;object-fit:cover;border-radius:50%;}
.sidebar-firm{font-family:var(--ff-serif);font-size:13px;line-height:1.2;}
.sidebar-firm-sub{font-family:var(--ff-mono);font-size:9px;letter-spacing:.2em;text-transform:uppercase;opacity:.4;margin-top:3px;}
.sidebar-nav{flex:1;padding:16px 10px;}
.sidebar-nav-label{font-family:var(--ff-mono);font-size:9px;letter-spacing:.22em;text-transform:uppercase;opacity:.35;padding:12px 10px 6px;}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;cursor:pointer;font-size:13.5px;transition:all .25s;margin-bottom:2px;color:rgba(251,247,239,.7);}
.nav-item:hover{background:rgba(255,255,255,.06);color:var(--cream);}
.nav-item.active{background:rgba(184,149,106,.15);color:var(--cream);}
.nav-item.active svg{color:var(--gold);}
.nav-item-badge{margin-left:auto;background:var(--red);color:white;font-size:10px;font-weight:700;padding:2px 7px;border-radius:100px;min-width:20px;text-align:center;}
.sidebar-footer{padding:16px 20px;border-top:1px solid rgba(184,149,106,.1);font-size:12px;opacity:.4;}
.sidebar-footer a{display:flex;align-items:center;gap:6px;color:var(--cream);opacity:.5;}
.sidebar-footer a:hover{opacity:1;}

/* Admin main */
.admin-main{flex:1;min-width:0;display:flex;flex-direction:column;}
.admin-topbar{background:white;border-bottom:1px solid var(--border);padding:0 28px;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;}
.topbar-title{font-family:var(--ff-serif);font-size:20px;letter-spacing:-.02em;}
.topbar-right{display:flex;align-items:center;gap:16px;}
.notif-btn{position:relative;width:40px;height:40px;border-radius:50%;background:var(--light);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .25s;}
.notif-btn:hover{background:var(--light2);}
.notif-count{position:absolute;top:-2px;right:-2px;width:18px;height:18px;background:var(--red);color:white;font-size:10px;font-weight:700;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;}
.admin-avatar{width:36px;height:36px;background:var(--dark);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--gold);font-size:13px;font-weight:600;}
.logout-btn{font-size:13px;opacity:.5;padding:6px 12px;border-radius:6px;transition:all .25s;}
.logout-btn:hover{background:var(--light);opacity:1;}

.admin-content{flex:1;padding:28px;overflow-y:auto;}

/* ── Stat cards ── */
.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:28px;}
.stat-card{background:white;border-radius:16px;padding:22px 24px;border:1px solid var(--border);}
.stat-card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.stat-icon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;}
.stat-number{font-family:var(--ff-serif);font-size:2.4rem;letter-spacing:-.04em;line-height:1;}
.stat-label{font-size:12px;opacity:.6;margin-top:4px;}
.stat-badge{font-size:11px;font-weight:600;padding:3px 8px;border-radius:100px;}

/* ── Charts ── */
.charts-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px;}
@media(max-width:900px){.charts-grid{grid-template-columns:1fr;}}
.chart-card{background:white;border-radius:16px;padding:22px 24px;border:1px solid var(--border);}
.chart-card-title{font-family:var(--ff-serif);font-size:16px;letter-spacing:-.01em;margin-bottom:20px;}
.chart-wrap{position:relative;height:220px;}

/* ── Tables ── */
.table-card{background:white;border-radius:16px;border:1px solid var(--border);overflow:hidden;margin-bottom:20px;}
.table-header{padding:20px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;}
.table-header h3{font-family:var(--ff-serif);font-size:17px;letter-spacing:-.01em;}
.table-filters{display:flex;gap:8px;flex-wrap:wrap;}
.filter-btn{font-size:12px;padding:5px 12px;border-radius:100px;border:1.5px solid var(--border);cursor:pointer;transition:all .25s;}
.filter-btn.active,.filter-btn:hover{background:var(--dark);color:white;border-color:var(--dark);}
.data-table{width:100%;border-collapse:collapse;}
.data-table th{font-size:11px;font-family:var(--ff-mono);letter-spacing:.15em;text-transform:uppercase;opacity:.5;padding:12px 24px;text-align:left;background:var(--light);border-bottom:1px solid var(--border);}
.data-table td{padding:14px 24px;font-size:13.5px;border-bottom:1px solid var(--border);vertical-align:middle;}
.data-table tr:last-child td{border-bottom:none;}
.data-table tr:hover td{background:var(--light);}
.status-badge{font-size:11px;font-weight:600;padding:4px 10px;border-radius:100px;display:inline-block;}
.status-pending{background:#FEF3C7;color:#92400E;}
.status-confirmed{background:#D1FAE5;color:#065F46;}
.status-cancelled{background:#FEE2E2;color:#991B1B;}
.status-completed{background:#E0E7FF;color:#3730A3;}
.action-btn{font-size:11px;padding:4px 10px;border-radius:6px;cursor:pointer;border:1.5px solid var(--border);transition:all .2s;margin-right:4px;}
.action-btn:hover{background:var(--dark);color:white;border-color:var(--dark);}
.action-btn.confirm{border-color:var(--green);color:var(--green);}
.action-btn.confirm:hover{background:var(--green);color:white;}
.action-btn.cancel{border-color:var(--red);color:var(--red);}
.action-btn.cancel:hover{background:var(--red);color:white;}
.empty-state{padding:48px;text-align:center;opacity:.45;font-size:14px;}

/* ── Activity log ── */
.activity-list{padding:0 8px;}
.activity-item{display:flex;gap:12px;padding:12px 16px;border-radius:10px;font-size:13px;transition:background .2s;}
.activity-item:hover{background:var(--light);}
.activity-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:5px;}
.activity-text{flex:1;}
.activity-time{font-family:var(--ff-mono);font-size:10px;opacity:.45;flex-shrink:0;margin-top:2px;}

/* ── Notification panel ── */
.notif-panel{position:fixed;top:64px;right:0;width:360px;background:white;border-left:1px solid var(--border);box-shadow:-8px 0 32px -8px rgba(42,29,16,.1);height:calc(100vh - 64px);z-index:200;overflow-y:auto;transform:translateX(100%);transition:transform .35s cubic-bezier(.22,1,.36,1);}
.notif-panel.open{transform:translateX(0);}
.notif-panel-head{padding:20px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
.notif-panel-title{font-family:var(--ff-serif);font-size:16px;}
.notif-close{width:32px;height:32px;border-radius:50%;background:var(--light);display:flex;align-items:center;justify-content:center;cursor:pointer;}
.notif-item{padding:16px 24px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .2s;}
.notif-item:hover{background:var(--light);}
.notif-item.unread{border-left:3px solid var(--gold);}
.notif-item-title{font-size:13.5px;font-weight:500;margin-bottom:4px;}
.notif-item-body{font-size:12.5px;opacity:.65;line-height:1.5;}
.notif-item-time{font-family:var(--ff-mono);font-size:10px;opacity:.4;margin-top:6px;}

/* ── Modal ── */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:500;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .3s;}
.modal-overlay.open{opacity:1;pointer-events:all;}
.modal{background:white;border-radius:18px;padding:32px;width:min(540px,calc(100vw-32px));max-height:90vh;overflow-y:auto;transform:scale(.96);transition:transform .3s;}
.modal-overlay.open .modal{transform:scale(1);}
.modal-title{font-family:var(--ff-serif);font-size:1.5rem;letter-spacing:-.02em;margin-bottom:20px;}
.modal-field{margin-bottom:14px;}
.modal-label{font-size:11px;font-family:var(--ff-mono);letter-spacing:.15em;text-transform:uppercase;opacity:.55;margin-bottom:6px;}
.modal-value{font-size:14px;line-height:1.55;}
.modal-input{width:100%;padding:10px 14px;border:1.5px solid var(--border);border-radius:8px;font-size:14px;outline:none;transition:border-color .25s;}
.modal-input:focus{border-color:var(--gold-mid);}
.modal-footer{display:flex;gap:10px;margin-top:24px;justify-content:flex-end;}
.modal-btn{padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;transition:all .25s;}
.modal-btn.primary{background:var(--dark);color:white;}
.modal-btn.primary:hover{transform:translateY(-1px);box-shadow:0 6px 18px -4px rgba(42,29,16,.4);}
.modal-btn.secondary{border:1.5px solid var(--border);}
.modal-btn.secondary:hover{background:var(--light);}

/* ── Misc ── */
.search-input{padding:8px 14px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;outline:none;transition:border-color .25s;min-width:200px;}
.search-input:focus{border-color:var(--gold-mid);}
.refresh-btn{width:34px;height:34px;border-radius:8px;background:var(--light);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .25s;}
.refresh-btn:hover{background:var(--light2);transform:rotate(90deg);}
.new-badge{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--red);margin-right:6px;}
@media(max-width:768px){
  .sidebar{display:none;}
  .charts-grid{grid-template-columns:1fr;}
}
@keyframes spin{to{transform:rotate(360deg);}}
.spinner{width:18px;height:18px;border:2px solid rgba(42,29,16,.15);border-top-color:var(--dark);border-radius:50%;animation:spin .7s linear infinite;display:inline-block;}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
.fade-in{animation:fadeIn .4s ease both;}

/* ── Token Usage ── */
.token-hero{background:linear-gradient(135deg,var(--darker),#2A1D10);color:var(--cream);border-radius:16px;padding:28px 32px;margin-bottom:20px;display:flex;align-items:center;gap:28px;flex-wrap:wrap;}
.token-big{font-family:var(--ff-serif);font-size:4rem;letter-spacing:-.04em;line-height:1;}
.token-big span{color:var(--gold);}
.token-meter-wrap{flex:1;min-width:180px;}
.token-meter-label{font-family:var(--ff-mono);font-size:10px;letter-spacing:.2em;text-transform:uppercase;opacity:.5;margin-bottom:8px;}
.token-meter{height:8px;background:rgba(255,255,255,.1);border-radius:100px;overflow:hidden;margin-bottom:6px;}
.token-meter-fill{height:100%;border-radius:100px;background:linear-gradient(90deg,#4ADE80,#22D3EE);transition:width .8s cubic-bezier(.22,1,.36,1);}
.token-meter-fill.warn{background:linear-gradient(90deg,#FBB024,#F59E0B);}
.token-meter-fill.danger{background:linear-gradient(90deg,#EF4444,#DC2626);}
.token-status{font-size:13px;opacity:.65;}
.token-history-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:12px;margin-top:4px;}
.token-day{background:white;border-radius:12px;padding:14px 16px;border:1px solid var(--border);}
.token-day-date{font-family:var(--ff-mono);font-size:9px;letter-spacing:.15em;opacity:.5;margin-bottom:6px;}
.token-day-count{font-family:var(--ff-serif);font-size:1.7rem;letter-spacing:-.03em;}
.token-day-req{font-size:11px;opacity:.55;margin-top:3px;}

/* ── FAQ Cache ── */
.faq-item{background:white;border-radius:12px;border:1px solid var(--border);padding:18px 20px;margin-bottom:10px;transition:box-shadow .25s;}
.faq-item:hover{box-shadow:0 4px 16px -6px rgba(42,29,16,.12);}
.faq-item-head{display:flex;align-items:flex-start;gap:12px;}
.faq-q{font-size:14px;font-weight:500;flex:1;line-height:1.45;}
.faq-meta{display:flex;align-items:center;gap:12px;margin-top:10px;padding-top:10px;border-top:1px solid var(--border);}
.faq-meta-stat{font-family:var(--ff-mono);font-size:10px;letter-spacing:.1em;opacity:.5;}
.faq-toggle{font-size:11px;padding:4px 10px;border-radius:6px;cursor:pointer;border:1.5px solid var(--border);transition:all .2s;}
.faq-toggle.enabled{border-color:var(--green);color:var(--green);}
.faq-toggle.enabled:hover{background:var(--green);color:white;}
.faq-toggle.disabled{border-color:var(--red);color:var(--red);}
.faq-toggle.disabled:hover{background:var(--red);color:white;}
.faq-answer{margin-top:12px;font-size:13px;opacity:.7;line-height:1.55;background:var(--light);border-radius:8px;padding:12px 16px;display:none;}
.faq-item.expanded .faq-answer{display:block;}
</style>
</head>
<body>

<?php if(!$loggedIn): ?>
<!-- ════════════════ LOGIN ════════════════ -->
<div class="login-wrap">
  <div class="login-card fade-in">
    <div class="login-logo">
      <div class="login-logo-icon">
        <img src="assets/img/firm_logo.jpeg" alt="Logo" onerror="this.style.display='none';this.parentElement.innerHTML='<svg width=\'20\' height=\'20\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23B8956A\' stroke-width=\'2\'><path d=\'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\'/></svg>'"/>
      </div>
      <div>
        <div style="font-family:var(--ff-serif);font-size:13px;line-height:1">R. Kasaija &amp; Partners</div>
        <div style="font-family:var(--ff-mono);font-size:9px;letter-spacing:.2em;text-transform:uppercase;opacity:.45;margin-top:3px">Admin Portal</div>
      </div>
    </div>
    <div class="login-title">Welcome back.</div>
    <div class="login-sub">Sign in to access the admin dashboard.</div>
    <?php if($error): ?><div class="login-err"><?= htmlspecialchars($error) ?></div><?php endif; ?>
    <form method="post">
      <input class="login-input" type="text" name="username" placeholder="Username" autocomplete="username" required/>
      <input class="login-input" type="password" name="password" placeholder="Password" autocomplete="current-password" required/>
      <button type="submit" name="login" class="login-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
        Sign In Securely
      </button>
    </form>
    <a href="index.php" class="login-back">← Back to website</a>
  </div>
</div>

<?php else: ?>
<!-- ════════════════ DASHBOARD ════════════════ -->
<div class="admin-layout">
  <!-- Sidebar -->
  <aside class="sidebar">
    <div class="sidebar-logo">
      <div class="sidebar-logo-icon">
        <img src="assets/img/firm_logo.jpeg" alt="Logo" onerror="this.style.display='none';this.parentElement.innerHTML='<svg width=\'18\' height=\'18\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'var(--gold)\' stroke-width=\'2\'><path d=\'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5\'/></svg>'"/>
      </div>
      <div>
        <div class="sidebar-firm">R. Kasaija &amp; Partners</div>
        <div class="sidebar-firm-sub">Admin Portal</div>
      </div>
    </div>
    <nav class="sidebar-nav">
      <div class="sidebar-nav-label">Main</div>
      <div class="nav-item active" onclick="setView('overview')" id="nav-overview">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        Overview
      </div>
      <div class="nav-item" onclick="setView('appointments')" id="nav-appointments">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Appointments
        <span class="nav-item-badge" id="sidebarApptBadge" style="display:none">0</span>
      </div>
      <div class="nav-item" onclick="setView('contacts')" id="nav-contacts">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        Enquiries
        <span class="nav-item-badge" id="sidebarContactBadge" style="display:none">0</span>
      </div>
      <div class="sidebar-nav-label">Activity</div>
      <div class="nav-item" onclick="setView('activity')" id="nav-activity">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        Activity Log
      </div>
      <div class="sidebar-nav-label">AI System</div>
      <div class="nav-item" onclick="setView('memory')" id="nav-memory">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
        AI Memory Storage
      </div>
      <div class="nav-item" onclick="setView('tokens')" id="nav-tokens">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        Token Usage
      </div>
      <div class="nav-item" onclick="setView('faq')" id="nav-faq">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        FAQ Cache
        <span class="nav-item-badge" id="sidebarFaqBadge" style="display:none;background:var(--green)">0</span>
      </div>
    </nav>
    <div class="sidebar-footer">
      <a href="index.php" style="margin-bottom:8px">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        View Website
      </a>
      <a href="?logout=1">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Sign Out
      </a>
    </div>
  </aside>

  <!-- Main content -->
  <div class="admin-main">
    <!-- Topbar -->
    <div class="admin-topbar">
      <div class="topbar-title" id="topbarTitle">Dashboard Overview</div>
      <div class="topbar-right">
        <button class="refresh-btn" onclick="loadData()" title="Refresh data">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--dark)" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.1"/></svg>
        </button>
        <button class="notif-btn" onclick="toggleNotifPanel()" id="notifBtn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--dark)" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span class="notif-count" id="notifCount" style="display:none">0</span>
        </button>
        <div class="admin-avatar">A</div>
        <a href="?logout=1" class="logout-btn">Sign out</a>
      </div>
    </div>

    <div class="admin-content" id="adminContent">
      <div style="text-align:center;padding:80px;opacity:.4"><span class="spinner"></span></div>
    </div>
  </div>

  <!-- Notification Panel -->
  <div class="notif-panel" id="notifPanel">
    <div class="notif-panel-head">
      <span class="notif-panel-title">Notifications</span>
      <div style="display:flex;gap:8px">
        <button onclick="markAllRead()" style="font-size:11px;opacity:.6;padding:4px 8px;border-radius:6px;background:var(--light);cursor:pointer">Mark all read</button>
        <button class="notif-close" onclick="toggleNotifPanel()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>
    <div id="notifList"><div class="empty-state">No notifications</div></div>
  </div>
</div>

<!-- Modal -->
<div class="modal-overlay" id="modalOverlay" onclick="closeModal(event)">
  <div class="modal" id="modalContent"></div>
</div>

<script>
let currentView = 'overview';
let allAppointments = [];
let allContacts = [];
let overviewData = {};
let apptFilter = '';
let notifOpen = false;
let weeklyChart = null;
let areaChart = null;

function setView(v) {
  currentView = v;
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navEl = document.getElementById('nav-' + v);
  if(navEl) navEl.classList.add('active');
  const titles = {overview:'Dashboard Overview', appointments:'Appointments', contacts:'Client Enquiries', activity:'Activity Log', tokens:'AI Token Usage', faq:'FAQ Cache Management', memory:'AI Knowledge Base Memory'};
  document.getElementById('topbarTitle').textContent = titles[v] || v;
  loadData();
}

async function loadData() {
  try {
    if(currentView === 'overview') {
      const r = await fetch('api/admin_data.php?action=overview');
      if(!r.ok) throw new Error('HTTP ' + r.status);
      overviewData = await r.json();
      if(overviewData.error) throw new Error(overviewData.error);
      renderOverview(overviewData);
      updateBadges(overviewData);
      updateNotifPanel(overviewData);
    } else if(currentView === 'appointments') {
      const r = await fetch('api/admin_data.php?action=appointments' + (apptFilter ? '&status=' + apptFilter : ''));
      if(!r.ok) throw new Error('HTTP ' + r.status);
      const d = await r.json();
      allAppointments = Array.isArray(d) ? d : [];
      renderAppointments(allAppointments);
    } else if(currentView === 'contacts') {
      const r = await fetch('api/admin_data.php?action=contacts');
      if(!r.ok) throw new Error('HTTP ' + r.status);
      const d = await r.json();
      allContacts = Array.isArray(d) ? d : [];
      renderContacts(allContacts);
    } else if(currentView === 'activity') {
      const r = await fetch('api/admin_data.php?action=overview');
      if(!r.ok) throw new Error('HTTP ' + r.status);
      const d = await r.json();
      renderActivityPage(d.activity || []);
    } else if(currentView === 'tokens') {
      const r = await fetch('api/admin_data.php?action=token_stats');
      if(!r.ok) throw new Error('HTTP ' + r.status);
      const d = await r.json();
      renderTokens(d);
    } else if(currentView === 'faq') {
      const r = await fetch('api/admin_data.php?action=faq_list');
      if(!r.ok) throw new Error('HTTP ' + r.status);
      const d = await r.json();
      renderFAQ(Array.isArray(d) ? d : []);
    } else if(currentView === 'memory') {
      const r = await fetch('api/admin_data.php?action=memory_list');
      if(!r.ok) throw new Error('HTTP ' + r.status);
      const d = await r.json();
      renderMemory(Array.isArray(d) ? d : []);
    }
  } catch(err) {
    document.getElementById('adminContent').innerHTML =
      `<div style="text-align:center;padding:80px;color:var(--red);font-size:14px">
        Failed to load data — ${esc(err.message||'network error')}.
        <br><br><button onclick="loadData()" style="background:var(--dark);color:white;padding:8px 20px;border-radius:8px;cursor:pointer">Retry</button>
      </div>`;
  }
}

function updateBadges(d) {
  const ab = document.getElementById('sidebarApptBadge');
  const cb = document.getElementById('sidebarContactBadge');
  const nc = document.getElementById('notifCount');
  const unread = (d.unread_appointments || 0) + (d.unread_contacts || 0);
  ab.textContent = d.unread_appointments || 0;
  ab.style.display = d.unread_appointments > 0 ? 'inline-block' : 'none';
  cb.textContent = d.unread_contacts || 0;
  cb.style.display = d.unread_contacts > 0 ? 'inline-block' : 'none';
  nc.textContent = unread;
  nc.style.display = unread > 0 ? 'flex' : 'none';
}

function updateNotifPanel(d) {
  const list = document.getElementById('notifList');
  const appts = allAppointments.filter ? allAppointments.filter(a => !a.is_read) : [];
  list.innerHTML = '';
  if(!d.unread_appointments && !d.unread_contacts) {
    list.innerHTML = '<div class="empty-state">All caught up! No new notifications.</div>';
    return;
  }
  if(d.unread_appointments > 0) {
    const div = document.createElement('div');
    div.className = 'notif-item unread';
    div.innerHTML = `<div class="notif-item-title">📅 ${d.unread_appointments} new appointment request${d.unread_appointments>1?'s':''}</div><div class="notif-item-body">New consultation requests awaiting review.</div><div class="notif-item-time">Now</div>`;
    div.onclick = () => { setView('appointments'); toggleNotifPanel(); };
    list.appendChild(div);
  }
  if(d.unread_contacts > 0) {
    const div = document.createElement('div');
    div.className = 'notif-item unread';
    div.innerHTML = `<div class="notif-item-title">✉️ ${d.unread_contacts} new enquir${d.unread_contacts>1?'ies':'y'}</div><div class="notif-item-body">New contact form submissions waiting.</div><div class="notif-item-time">Now</div>`;
    div.onclick = () => { setView('contacts'); toggleNotifPanel(); };
    list.appendChild(div);
  }
}

function renderOverview(d) {
  const content = document.getElementById('adminContent');
  content.innerHTML = `
    <div class="stats-grid fade-in">
      <div class="stat-card">
        <div class="stat-card-top">
          <div class="stat-icon" style="background:#FEF3C7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
          ${d.unread_appointments > 0 ? `<span class="stat-badge" style="background:#FEF3C7;color:#92400E">${d.unread_appointments} new</span>` : '<span class="stat-badge" style="background:#D1FAE5;color:#065F46">All read</span>'}
        </div>
        <div class="stat-number">${d.total_appointments || 0}</div>
        <div class="stat-label">Total Appointments</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-top">
          <div class="stat-icon" style="background:#FEF3C7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
          <span class="stat-badge" style="background:#FEF3C7;color:#92400E">Pending</span>
        </div>
        <div class="stat-number">${d.pending_appointments || 0}</div>
        <div class="stat-label">Pending Reviews</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-top">
          <div class="stat-icon" style="background:#D1FAE5"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div>
          <span class="stat-badge" style="background:#D1FAE5;color:#065F46">Active</span>
        </div>
        <div class="stat-number">${d.confirmed_appointments || 0}</div>
        <div class="stat-label">Confirmed Appts</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-top">
          <div class="stat-icon" style="background:#EDE9FE"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
          ${d.unread_contacts > 0 ? `<span class="stat-badge" style="background:#EDE9FE;color:#5B21B6">${d.unread_contacts} new</span>` : ''}
        </div>
        <div class="stat-number">${d.total_contacts || 0}</div>
        <div class="stat-label">Total Enquiries</div>
      </div>
    </div>

    <div class="charts-grid fade-in">
      <div class="chart-card">
        <div class="chart-card-title">Appointments This Week</div>
        <div class="chart-wrap"><canvas id="weeklyChart"></canvas></div>
      </div>
      <div class="chart-card">
        <div class="chart-card-title">By Practice Area</div>
        <div class="chart-wrap"><canvas id="areaChart"></canvas></div>
      </div>
    </div>

    <div class="table-card fade-in">
      <div class="table-header">
        <h3>Recent Activity</h3>
        <button onclick="setView('activity')" style="font-size:12px;opacity:.6;cursor:pointer">View all →</button>
      </div>
      <div class="activity-list" id="activityList"></div>
    </div>`;

  // Weekly chart
  const weeklyLabels = (d.weekly || []).map(r => r.day?.slice(5));
  const weeklyData   = (d.weekly || []).map(r => r.cnt);
  if(weeklyChart) weeklyChart.destroy();
  const wCtx = document.getElementById('weeklyChart')?.getContext('2d');
  if(wCtx) {
    weeklyChart = new Chart(wCtx, {
      type: 'bar',
      data: { labels: weeklyLabels, datasets: [{ label:'Appointments', data: weeklyData, backgroundColor:'rgba(184,149,106,.5)', borderColor:'#B8956A', borderWidth:2, borderRadius:6}]},
      options: {responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true, ticks:{stepSize:1}, grid:{color:'rgba(0,0,0,.05)'}}, x:{grid:{display:false}}}}
    });
  }

  // Area chart
  const areaLabels = (d.areas || []).map(r => r.practice_area);
  const areaData   = (d.areas || []).map(r => r.cnt);
  if(areaChart) areaChart.destroy();
  const aCtx = document.getElementById('areaChart')?.getContext('2d');
  if(aCtx) {
    areaChart = new Chart(aCtx, {
      type: 'doughnut',
      data: { labels: areaLabels, datasets:[{data: areaData, backgroundColor:['#B8956A','#8B6F47','#D4A96A','#6B4F2A','#C4875A','#9B7857'], borderWidth:0}]},
      options: {responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom', labels:{font:{size:11}, boxWidth:12, padding:12}}}, cutout:'60%'}
    });
  }

  // Activity
  renderActivity(d.activity || []);
}

function renderActivity(items) {
  const list = document.getElementById('activityList');
  if(!list) return;
  if(!items.length) { list.innerHTML = '<div class="empty-state">No recent activity.</div>'; return; }
  const dotColor = a => a.action.includes('Cache') ? '#22C55E' : a.action.includes('Gemini') ? '#7C3AED' : a.action.includes('Appointment') ? '#F59E0B' : '#3B82F6';
  list.innerHTML = items.map(a => `
    <div class="activity-item">
      <div class="activity-dot" style="background:${dotColor(a)}"></div>
      <div class="activity-text"><strong>${esc(a.action)}</strong> — ${esc(a.details || '')}</div>
      <div class="activity-time">${new Date(a.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</div>
    </div>`).join('');
}

function renderActivityPage(items) {
  const content = document.getElementById('adminContent');
  content.innerHTML = `
    <div class="table-card fade-in">
      <div class="table-header"><h3>Full Activity Log</h3><button class="refresh-btn" onclick="loadData()" title="Refresh"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--dark)" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.1"/></svg></button></div>
      <div class="activity-list" id="activityList"></div>
    </div>`;
  renderActivity(items);
}

function renderTokens(d) {
  const budget = d.daily_budget || 1500;
  const used = d.today_used || 0;
  const remaining = Math.max(0, budget - used);
  const pct = Math.round((remaining / budget) * 100);
  const fillClass = pct < 20 ? 'danger' : pct < 50 ? 'warn' : '';
  const content = document.getElementById('adminContent');
  const history = (d.history || []).map(row => {
    const dayUsed = parseInt(row.tokens_used) || 0;
    const dayPct = Math.min(100, Math.round((dayUsed / budget) * 100));
    return `<div class="token-day">
      <div class="token-day-date">${row.usage_date}</div>
      <div class="token-day-count">${dayUsed.toLocaleString()}</div>
      <div class="token-day-req">${row.requests || 0} requests</div>
      <div style="height:4px;background:rgba(139,111,71,.15);border-radius:100px;margin-top:8px;overflow:hidden">
        <div style="height:100%;width:${dayPct}%;background:var(--gold-mid);border-radius:100px"></div>
      </div>
    </div>`;
  }).join('');

  content.innerHTML = `
    <div class="token-hero fade-in">
      <div>
        <div class="token-big"><span>${remaining.toLocaleString()}</span></div>
        <div style="font-family:var(--ff-mono);font-size:10px;letter-spacing:.2em;opacity:.5;margin-top:4px;text-transform:uppercase">tokens remaining today</div>
      </div>
      <div class="token-meter-wrap">
        <div class="token-meter-label">Daily budget: ${budget.toLocaleString()} tokens</div>
        <div class="token-meter"><div class="token-meter-fill ${fillClass}" style="width:${pct}%"></div></div>
        <div class="token-status">${used.toLocaleString()} used · ${remaining.toLocaleString()} left · ${pct}% available</div>
      </div>
      <div>
        <div style="font-family:var(--ff-mono);font-size:10px;letter-spacing:.2em;opacity:.5;text-transform:uppercase;margin-bottom:8px">Today's requests</div>
        <div style="font-family:var(--ff-serif);font-size:2rem;color:var(--gold)">${d.today_requests || 0}</div>
        <div style="font-size:12px;opacity:.5;margin-top:4px">${d.cache_hits || 0} cache hits</div>
      </div>
    </div>
    <div class="chart-card fade-in" style="margin-bottom:20px">
      <div class="chart-card-title">7-Day Token Usage</div>
      <div class="chart-wrap"><canvas id="tokenChart"></canvas></div>
    </div>
    <div class="chart-card fade-in">
      <div class="chart-card-title">Usage History (last 14 days)</div>
      <div class="token-history-grid">${history || '<div style="opacity:.4;padding:20px">No usage history yet.</div>'}</div>
    </div>`;

  // Token 7-day chart
  const labels = (d.history || []).slice(-7).map(r => r.usage_date?.slice(5));
  const vals   = (d.history || []).slice(-7).map(r => parseInt(r.tokens_used)||0);
  const ctx = document.getElementById('tokenChart')?.getContext('2d');
  if(ctx) {
    new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: [{
        label: 'Tokens Used', data: vals,
        backgroundColor: vals.map(v => v > budget * 0.8 ? 'rgba(239,68,68,.6)' : v > budget * 0.5 ? 'rgba(251,191,36,.6)' : 'rgba(184,149,106,.6)'),
        borderColor: vals.map(v => v > budget * 0.8 ? '#EF4444' : v > budget * 0.5 ? '#F59E0B' : '#B8956A'),
        borderWidth: 2, borderRadius: 6
      }, {
        label: 'Daily Budget', data: vals.map(() => budget),
        type: 'line', borderColor: 'rgba(139,111,71,.3)', borderDash: [4,4],
        pointRadius: 0, fill: false, tension: 0
      }]},
      options: { responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { font: { size: 11 } } } },
        scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,.04)' } }, x: { grid: { display: false } } }
      }
    });
  }
}

function renderFAQ(items) {
  const badge = document.getElementById('sidebarFaqBadge');
  if(badge) { badge.textContent = items.length; badge.style.display = items.length ? 'inline-block' : 'none'; }
  const content = document.getElementById('adminContent');
  if(!items.length) {
    content.innerHTML = `<div class="table-card fade-in"><div class="empty-state" style="padding:60px">No cached FAQ entries yet.<br><small style="opacity:.6;margin-top:8px;display:block">Entries are added automatically when users interact with Kasaija AI.</small></div></div>`;
    return;
  }
  const rows = items.map((q, i) => `
    <div class="faq-item" id="faq-${i}" onclick="toggleFAQItem(${i})">
      <div class="faq-item-head">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold-mid)" stroke-width="2" style="flex-shrink:0;margin-top:2px"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <div class="faq-q">${esc(q.question)}</div>
      </div>
      <div class="faq-answer">${esc(q.response)}</div>
      <div class="faq-meta">
        <span class="faq-meta-stat">Used ${q.use_count || 0} times</span>
        <span class="faq-meta-stat">·</span>
        <span class="faq-meta-stat">Added ${new Date(q.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</span>
        ${q.keywords ? `<span class="faq-meta-stat">· Keywords: ${esc(q.keywords)}</span>` : ''}
        <button class="faq-toggle ${q.enabled ? 'enabled' : 'disabled'}" onclick="toggleFAQEnabled(event,${q.id},${q.enabled})">${q.enabled ? 'Enabled' : 'Disabled'}</button>
        <button class="action-btn cancel" style="margin-left:auto" onclick="deleteFAQ(event,${q.id})">Delete</button>
      </div>
    </div>`).join('');

  content.innerHTML = `
    <div class="fade-in">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px">
        <div>
          <div style="font-family:var(--ff-serif);font-size:1.5rem;letter-spacing:-.02em">${items.length} cached responses</div>
          <div style="font-size:13px;opacity:.55;margin-top:4px">Responses served from cache cost zero tokens.</div>
        </div>
        <button onclick="clearAllFAQ()" style="font-size:12px;padding:8px 16px;border-radius:8px;border:1.5px solid var(--red);color:var(--red);cursor:pointer;transition:all .2s" onmouseover="this.style.background='var(--red)';this.style.color='white'" onmouseout="this.style.background='';this.style.color='var(--red)'">Clear all cache</button>
      </div>
      ${rows}
    </div>`;
}

function toggleFAQItem(i) {
  document.getElementById('faq-' + i)?.classList.toggle('expanded');
}

async function toggleFAQEnabled(e, id, current) {
  e.stopPropagation();
  await fetch('api/admin_data.php?action=faq_toggle&id=' + id + '&enabled=' + (current ? 0 : 1));
  loadData();
}

async function deleteFAQ(e, id) {
  e.stopPropagation();
  if(!confirm('Delete this cached entry?')) return;
  await fetch('api/admin_data.php?action=faq_delete&id=' + id);
  loadData();
}

async function clearAllFAQ() {
  if(!confirm('Clear ALL cached FAQ entries? This cannot be undone.')) return;
  await fetch('api/admin_data.php?action=faq_clear');
  loadData();
}

// ── AI Memory ──
function renderMemory(items) {
  const content = document.getElementById('adminContent');
  const rows = !items.length ? 
    `<div class="empty-state" style="padding:60px">No custom AI memory entries added yet.<br><small style="opacity:.6;margin-top:8px;display:block">Add custom knowledge to instantly answer specific client questions.</small></div>`
    : items.map((m, i) => `
    <div class="faq-item" id="mem-${i}" onclick="document.getElementById('mem-${i}').classList.toggle('expanded')">
      <div class="faq-item-head">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold-mid)" stroke-width="2" style="flex-shrink:0;margin-top:2px"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <div class="faq-q">${esc(m.topic_keywords)}</div>
      </div>
      <div class="faq-answer">${esc(m.response)}</div>
      <div class="faq-meta">
        <span class="faq-meta-stat">Added ${new Date(m.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</span>
        <button class="action-btn cancel" style="margin-left:auto" onclick="deleteMemory(event,${m.id})">Delete</button>
      </div>
    </div>`).join('');

  content.innerHTML = `
    <div class="fade-in">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px">
        <div>
          <div style="font-family:var(--ff-serif);font-size:1.5rem;letter-spacing:-.02em">AI Knowledge Base Memory</div>
          <div style="font-size:13px;opacity:.55;margin-top:4px">Highest priority memory location. The AI will check this first before anything else.</div>
        </div>
        <button onclick="addMemoryModal()" class="login-btn" style="width:auto;padding:10px 20px;border-radius:8px;font-size:13px;display:inline-flex;margin:0">+ Add New Memory</button>
      </div>
      <div class="table-card">${rows}</div>
    </div>`;
}

function addMemoryModal() {
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-title">Add AI Knowledge Override</div>
    <div style="font-size:13px;opacity:.7;margin-bottom:20px">When users ask questions that match this topic or keywords, the AI will bypass Gemini and instantly return this exact response.</div>
    <div class="modal-field">
      <div class="modal-label">Topic / Keywords (Comma separated)</div>
      <input type="text" class="modal-input" id="memTopic" placeholder="e.g. consultation fee, how much to book, pricing"/>
    </div>
    <div class="modal-field">
      <div class="modal-label">Exact Response Content</div>
      <textarea class="modal-input" id="memResponse" rows="6" placeholder="The exact response the AI should give..."></textarea>
    </div>
    <div class="modal-footer">
      <button class="modal-btn secondary" onclick="closeModal()">Cancel</button>
      <button class="modal-btn primary" onclick="saveMemory()">Save to AI Memory</button>
    </div>`;
  document.getElementById('modalOverlay').classList.add('open');
}

async function saveMemory() {
  const topic = document.getElementById('memTopic').value;
  const response = document.getElementById('memResponse').value;
  if(!topic || !response) return alert("Please fill both fields");
  await fetch('api/admin_data.php?action=memory_add', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({topic, response})
  });
  closeModal();
  loadData();
}

async function deleteMemory(e, id) {
  e.stopPropagation();
  if(!confirm('Delete this AI memory rule?')) return;
  await fetch('api/admin_data.php?action=memory_delete&id=' + id);
  loadData();
}

function renderAppointments(items) {
  const content = document.getElementById('adminContent');
  const statusColors = {pending:'status-pending',confirmed:'status-confirmed',cancelled:'status-cancelled',completed:'status-completed'};
  content.innerHTML = `
    <div class="table-card fade-in">
      <div class="table-header">
        <h3>All Appointments</h3>
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">
          <input class="search-input" id="apptSearch" placeholder="Search by name or email…" oninput="filterAppts(this.value)"/>
          <div class="table-filters">
            ${['','pending','confirmed','completed','cancelled'].map(s=>`<button class="filter-btn${apptFilter===s?' active':''}" onclick="apptFilter='${s}';loadData()">${s||'All'}</button>`).join('')}
          </div>
        </div>
      </div>
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead><tr>
            <th>Client</th><th>Practice Area</th><th>Lawyer</th>
            <th>Date / Time</th><th>Status</th><th>Received</th><th>Actions</th>
          </tr></thead>
          <tbody id="apptTbody"></tbody>
        </table>
      </div>
    </div>`;
  renderApptRows(items);
}

function renderApptRows(items) {
  const tbody = document.getElementById('apptTbody');
  if(!tbody) return;
  if(!items.length) { tbody.innerHTML = `<tr><td colspan="7" class="empty-state">No appointments found.</td></tr>`; return; }
  tbody.innerHTML = items.map(a => `
    <tr>
      <td>
        <div style="font-weight:500">${esc(a.client_name)}</div>
        <div style="font-size:12px;opacity:.6">${esc(a.client_email)}</div>
        ${a.client_phone ? `<div style="font-size:12px;opacity:.5">${esc(a.client_phone)}</div>` : ''}
        ${!a.is_read ? '<span class="new-badge"></span>' : ''}
      </td>
      <td>${esc(a.practice_area||'—')}</td>
      <td>${esc(a.preferred_lawyer||'—')}</td>
      <td><div>${esc(a.preferred_date||'—')}</div><div style="font-size:12px;opacity:.6">${esc(a.preferred_time||'')}</div></td>
      <td><span class="status-badge ${statusMap(a.status)}">${a.status}</span></td>
      <td style="font-size:12px;opacity:.6">${new Date(a.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</td>
      <td>
        <button class="action-btn" onclick="viewAppt(${a.id})">View</button>
        ${a.status==='pending' ? `<button class="action-btn confirm" onclick="updateAppt(${a.id},'confirmed')">Confirm</button>` : ''}
        ${a.status!=='cancelled'&&a.status!=='completed' ? `<button class="action-btn cancel" onclick="updateAppt(${a.id},'cancelled')">Cancel</button>` : ''}
      </td>
    </tr>`).join('');
}

function filterAppts(q) {
  if(!q) { renderApptRows(allAppointments); return; }
  q = q.toLowerCase();
  renderApptRows(allAppointments.filter(a =>
    (a.client_name||'').toLowerCase().includes(q) ||
    (a.client_email||'').toLowerCase().includes(q) ||
    (a.practice_area||'').toLowerCase().includes(q)
  ));
}

function renderContacts(items) {
  const content = document.getElementById('adminContent');
  content.innerHTML = `
    <div class="table-card fade-in">
      <div class="table-header">
        <h3>Client Enquiries</h3>
        <input class="search-input" placeholder="Search…" oninput="filterContacts(this.value)"/>
      </div>
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead><tr>
            <th>From</th><th>Practice Area</th><th>Message</th><th>Date</th><th>Status</th>
          </tr></thead>
          <tbody id="contactTbody"></tbody>
        </table>
      </div>
    </div>`;
  renderContactRows(items);
}

function renderContactRows(items) {
  const tbody = document.getElementById('contactTbody');
  if(!tbody) return;
  if(!items.length) { tbody.innerHTML = `<tr><td colspan="5" class="empty-state">No enquiries found.</td></tr>`; return; }
  tbody.innerHTML = items.map(c => `
    <tr onclick="viewContact(${c.id})" style="cursor:pointer">
      <td>
        <div style="font-weight:500">${esc(c.name)}</div>
        <div style="font-size:12px;opacity:.6">${esc(c.email)}</div>
        ${!c.is_read ? '<span class="new-badge"></span>' : ''}
      </td>
      <td>${esc(c.practice_area||'—')}</td>
      <td style="max-width:260px"><div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;opacity:.75">${esc(c.message)}</div></td>
      <td style="font-size:12px;opacity:.6">${new Date(c.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'2-digit'})}</td>
      <td><span class="status-badge ${c.is_read ? 'status-completed' : 'status-pending'}">${c.is_read ? 'Read' : 'New'}</span></td>
    </tr>`).join('');
}

function filterContacts(q) {
  if(!q) { renderContactRows(allContacts); return; }
  q = q.toLowerCase();
  renderContactRows(allContacts.filter(c =>
    (c.name||'').toLowerCase().includes(q) ||
    (c.email||'').toLowerCase().includes(q) ||
    (c.message||'').toLowerCase().includes(q)
  ));
}

function viewAppt(id) {
  const a = allAppointments.find(x => x.id == id);
  if(!a) return;
  fetch(`api/admin_data.php?action=mark_read&type=appointment&id=${id}`);
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-title">Appointment #${a.id}</div>
    <div class="modal-field"><div class="modal-label">Client</div><div class="modal-value"><strong>${esc(a.client_name)}</strong> · ${esc(a.client_email)} · ${esc(a.client_phone||'—')}</div></div>
    <div class="modal-field"><div class="modal-label">Practice Area</div><div class="modal-value">${esc(a.practice_area||'—')}</div></div>
    <div class="modal-field"><div class="modal-label">Preferred Advocate</div><div class="modal-value">${esc(a.preferred_lawyer||'No preference')}</div></div>
    <div class="modal-field"><div class="modal-label">Preferred Date & Time</div><div class="modal-value">${esc(a.preferred_date||'—')} at ${esc(a.preferred_time||'—')}</div></div>
    <div class="modal-field"><div class="modal-label">Message</div><div class="modal-value" style="white-space:pre-wrap;background:var(--light);padding:14px;border-radius:8px;font-size:13px">${esc(a.message||'No message')}</div></div>
    <div class="modal-field"><div class="modal-label">Current Status</div><div class="modal-value"><span class="status-badge ${statusMap(a.status)}">${a.status}</span></div></div>
    <div class="modal-field">
      <div class="modal-label">Update Status</div>
      <select class="modal-input" id="statusSelect">
        ${['pending','confirmed','cancelled','completed'].map(s=>`<option value="${s}"${a.status===s?' selected':''}>${s}</option>`).join('')}
      </select>
    </div>
    <div class="modal-field">
      <div class="modal-label">Admin Notes</div>
      <textarea class="modal-input" id="notesInput" rows="3" placeholder="Internal notes…">${esc(a.admin_notes||'')}</textarea>
    </div>
    <div class="modal-footer">
      <button class="modal-btn secondary" onclick="closeModal()">Cancel</button>
      <button class="modal-btn primary" onclick="saveAppt(${a.id})">Save Changes</button>
    </div>`;
  document.getElementById('modalOverlay').classList.add('open');
}

async function saveAppt(id) {
  const status = document.getElementById('statusSelect').value;
  const notes  = document.getElementById('notesInput').value;
  await fetch('api/admin_data.php?action=update_appointment', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({id, status, notes})
  });
  closeModal();
  loadData();
}

async function updateAppt(id, status) {
  await fetch('api/admin_data.php?action=update_appointment', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({id, status, notes:''})
  });
  loadData();
}

function viewContact(id) {
  const c = allContacts.find(x => x.id == id);
  if(!c) return;
  fetch(`api/admin_data.php?action=mark_read&type=contact&id=${id}`);
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-title">Enquiry from ${esc(c.name)}</div>
    <div class="modal-field"><div class="modal-label">Contact</div><div class="modal-value"><strong>${esc(c.name)}</strong> · ${esc(c.email)} · ${esc(c.phone||'—')}</div></div>
    <div class="modal-field"><div class="modal-label">Practice Area</div><div class="modal-value">${esc(c.practice_area||'—')}</div></div>
    <div class="modal-field"><div class="modal-label">Message</div><div class="modal-value" style="white-space:pre-wrap;background:var(--light);padding:14px;border-radius:8px;font-size:13px">${esc(c.message)}</div></div>
    <div class="modal-field"><div class="modal-label">Received</div><div class="modal-value">${new Date(c.created_at).toLocaleString('en-GB')}</div></div>
    <div class="modal-footer">
      <button class="modal-btn secondary" onclick="closeModal()">Close</button>
      <a class="modal-btn primary" href="mailto:${esc(c.email)}?subject=Re: Your Enquiry to R. Kasaija & Partners&body=Dear ${esc(c.name)}," style="display:inline-flex;align-items:center;gap:8px">Reply by Email</a>
    </div>`;
  document.getElementById('modalOverlay').classList.add('open');
  // Mark as read in local data
  const idx = allContacts.findIndex(x => x.id == id);
  if(idx !== -1) allContacts[idx].is_read = 1;
  renderContactRows(allContacts);
}

function closeModal(e) {
  if(e && e.target !== document.getElementById('modalOverlay')) return;
  document.getElementById('modalOverlay').classList.remove('open');
}

function toggleNotifPanel() {
  notifOpen = !notifOpen;
  document.getElementById('notifPanel').classList.toggle('open', notifOpen);
}

async function markAllRead() {
  await fetch('api/admin_data.php?action=mark_all_read');
  loadData();
}

function statusMap(s) {
  return {pending:'status-pending',confirmed:'status-confirmed',cancelled:'status-cancelled',completed:'status-completed'}[s] || 'status-pending';
}
function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Init + polling
loadData();
setInterval(() => {
  fetch('api/admin_data.php?action=overview').then(r=>r.json()).then(d => {
    updateBadges(d);
    updateNotifPanel(d);
    // Show browser notification if there are new ones
    const total = (d.unread_appointments||0) + (d.unread_contacts||0);
    if(total > 0 && document.hidden) {
      document.title = `(${total}) Admin — R. Kasaija & Partners`;
    } else {
      document.title = 'Admin Dashboard — R. Kasaija & Partners';
    }
  });
}, 30000); // Poll every 30 seconds
</script>
<?php endif; ?>
</body>
</html>
