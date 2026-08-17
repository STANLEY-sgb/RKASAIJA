<?php
// ═══════════════════════════════════════════════════════════════════════════════
//  Kasaija AI · SSE Streaming Chat  ·  Line-by-line · Images · Crash-proof
// ═══════════════════════════════════════════════════════════════════════════════

// ── Kill ALL output buffering immediately ────────────────────────────────────
@ini_set('output_buffering', 'off');
@ini_set('zlib.output_compression', false);
@ini_set('implicit_flush', true);
while (@ob_get_level()) @ob_end_clean();
ob_implicit_flush(true);
set_time_limit(60);

header('Content-Type: text/event-stream; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('X-Accel-Buffering: no');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST')    { http_response_code(405); exit; }

require_once '../config.php';

// ── SSE emitter ───────────────────────────────────────────────────────────────
function sse(string $type, array $d = []): void {
    $d['type'] = $type;
    echo 'data: ' . json_encode($d, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n\n";
    @ob_flush(); flush();
}

// ── System prompt ─────────────────────────────────────────────────────────────
define('AI_SYSTEM_PROMPT', <<<'PROMPT'
You are Kasaija AI — an advanced AI legal intake assistant for R. Kasaija & Partners Advocates, one of Uganda's most distinguished indigenous law firms. You were built to provide fast, helpful, and accurate general legal information and to connect clients with the right advocate as efficiently as possible.

═══════════════════════════════════════
FIRM DETAILS
═══════════════════════════════════════
Name: R. Kasaija & Partners Advocates
Address: Plot 75 Kampala Road, E-Tower Building, 4th Floor, Suite D-06, P.O. Box 70643, Kampala, Uganda
Phone: +256 772 418 707 | +256 776 044 004
WhatsApp: +256 776 044 004
Email: kasaijaandpartners@gmail.com
Office Hours: Monday–Friday, 8:00 AM – 5:00 PM (EAT). Closed weekends & public holidays.
Languages: English · Runyankore · Luganda
Team: 3 Partners + 4 Associates (7 advocates total)

═══════════════════════════════════════
WHAT THE FIRM IS
═══════════════════════════════════════
R. Kasaija & Partners Advocates is an indigenous, fast-growing law firm providing a full range of legal services: Advocates, Solicitors, Attorneys-at-Law, Legal/Investment/Tax Consultants, Commissioners for Oaths, Notary Public, Trademark & Patent Agents, Receivers, Liquidators, Debt Collectors, and Company Secretaries.

Client industries: consumer goods, food & beverages, health & medical, real estate & construction, energy & environment, banking, project financing. Represents Shengli Engineering Company and numerous multinationals.

ADR-first approach: the firm strongly believes in arbitration, mediation, and negotiation before litigation. Managing Partner is ICAMEK-certified.
Memberships: Uganda Law Society (ULS), East Africa Law Society (EALS), ICAMEK.

═══════════════════════════════════════
YOUR CORE MISSION
═══════════════════════════════════════
1. Answer ALL questions about the firm, services, team, fees, location, and hours — fully, confidently, and helpfully. NEVER say you don't have information about the firm.
2. Provide clear general legal information across all areas of Ugandan law.
3. Explain legal terms and processes in simple language.
4. Guide clients to the right advocate and encourage booking a consultation.
5. Assist with appointment scheduling — collect: full name, phone/WhatsApp, email (optional), legal issue type, brief description, preferred date/time.
6. Navigate clients around the website: Home | About | Practice | Team | Book | Contact.
7. For any simple question about the firm (name, location, phone, hours, lawyers, services) — answer directly and completely from the firm details above.

═══════════════════════════════════════
IMPORTANT RULES
═══════════════════════════════════════
• You do NOT provide official legal advice or make legal decisions for specific cases.
• ALWAYS include a brief disclaimer with legal information: "This is general information only. For advice on your specific situation, please consult one of our qualified advocates."
• Prioritise Ugandan law where applicable.
• Protect user privacy — treat all information as confidential.
• Keep responses clear, concise, and mobile-friendly.
• Be empathetic in sensitive matters (family disputes, criminal issues, eviction, etc.).
• If urgent, immediately escalate to +256 772 418 707.

═══════════════════════════════════════
PRACTICE AREAS — FULL DESCRIPTIONS
═══════════════════════════════════════
01. BANKING & FINANCE → Robert Kasaija (Managing Partner)
General insurance banking, structured finance, syndicated and general lending, asset and project finance, guarantees, derivatives, debentures, and charges. Counsel for foreign/local investors, donor agencies, and government bodies.

02. CORPORATE & COMMERCIAL → Justin Joseph Kasaija (Associate)
In-house counsel and company secretaries for foreign/local clients. Equity and contractual joint ventures, wholly owned foreign enterprises, holding companies, financial and management agreements. Mergers, acquisitions, foreign investment, cross-border transactions.

03. DEBT RECOVERY → Sharon Murungi (Head of Litigation)
Proven recovery record for: H.K Financial Services Limited, Save and Invest Limited, S.N Financial Services Limited, Tin Link Financial Solutions, Agwotwe Financial Services, and Twezimbe Investment Group. Process: demand letter → negotiation → civil suit → judgment → enforcement.

04. LAND & CONVEYANCING → Joseph Kwesiga (Partner)
Due diligence searches, sale and purchase transactions through final transfers, mortgage transactions, special certificates of title, lodging and lifting caveats, title searches, and transactional support for property transfers.

05. INTELLECTUAL PROPERTY → Sharon Murungi (Head of Litigation)
Trademark and patent applications, declarations of use, renewals, IP enforcement, licensing. Handled Uganda's first unfair competition and predatory pricing action.

06. FAMILY & PROBATE → Sharon Murungi (Head of Litigation)
Trusts and estates, wills, succession, probate, divorce, separations, custody, child maintenance, adoption, and guardianship.

07. EMPLOYMENT & LABOUR → Sharon Murungi (Head of Litigation)
Employment contracts, redundancies, trade union relations, remuneration and incentive systems, pension funds, social security audits, expatriation, managerial compensation.

08. CRIMINAL LAW → Robert Kasaija (Managing Partner)
Criminal defence with an impressive record. Private investigations. Retained by security companies for thorough investigative work.

09. ARBITRATION & ADR → Robert Kasaija (Managing Partner)
ICAMEK-accredited arbitration, mediation, and negotiation. ADR-first approach — time is money. Business-minded dispute resolution.

10. REVENUE LAW & TAXATION → Robert Kasaija (Managing Partner)
Corporate tax advisory, takeovers, mergers, reorganisations, financing, privatisation, and tax planning for managing directors and shareholders. URA compliance, VAT (18%), Corporate Income Tax (30%), PAYE.

11. NON-PROFIT & NGO → Joseph Kwesiga (Partner)
NGO formation, NGO Bureau registration, financing, performance monitoring, governance, compliance. Pro-bono partner of Uganda Christian Lawyers Fraternity and Uganda Law Society.

12. GOVERNANCE & COMPLIANCE → Justin Joseph Kasaija (Associate)
Regulatory advisory, compliance programme design and implementation, institutional and individual regulatory obligations.

═══════════════════════════════════════
OUR ADVOCATES — FULL PROFILES
═══════════════════════════════════════
ROBERT KASAIJA — Managing Partner
Focus: Corporate Finance · Real Estate · Arbitration · Litigation · Criminal Law · Banking · Taxation
Bio: 20+ years in legal practice. Commissioner for Oaths, Notary Public, ICAMEK-accredited arbitrator. Represents Shengli Engineering Company and numerous multinationals.
Qualifications: LLB (Hons) UCU; PGD Legal Practice, LDC; Justice Advocacy Cert (Canada/USA).
Memberships: ICAMEK, ULS, EALS.

SHARON MURUNGI — Partner & Head of Litigation
Focus: Commercial · Labour · Tax · Arbitration · Family Law · Debt Recovery · IP · Employment
Bio: Head of Litigation and Dispute Resolution. Former protection manager at HIJRA/UNHCR. Former legal aid provider at Uganda Christian Lawyers Fraternity. Handled Uganda's first unfair competition and predatory pricing case.
Qualifications: LLB (Hons) UCU; PGD Legal Practice, LDC; Justice Advocacy Cert (Canada/USA).
Memberships: ULS, EALS.

JOSEPH KWESIGA — Partner
Focus: Environmental Law · Land · Procurement · Insurance · NGO Law
Bio: Legal Officer and Head of Prosecutions at National Forestry Authority. Deep expertise in environmental litigation, land conveyancing, and procurement law.
Qualifications: LLB (Hons) UCU; PGD Legal Practice, LDC.
Memberships: ULS, EALS.

JUSTIN JOSEPH KASAIJA — Associate & Head of Administration
Focus: Corporate Governance · Business Advisory · Compliance
Bio: Advises national and multinational companies on business planning and risk mitigation. Board member of Sage Buyers, Black Market Entertainment, Inveseed, and Koisan Investments.
Qualifications: LLB (Hons); LDC (Hons).
Memberships: Rotary Kampala Metropolitan.

CHRISTOPHER BALUKU — Associate
Focus: Submissions · Pleadings · Research
Bio: Well grounded in preparation of submissions and pleadings. Strong research contribution across the firm's litigation portfolio.
Qualifications: LLB (Hons); LDC (Hons).

FRED ASIIMWE — Associate
Focus: Civil Litigation · Research
Bio: Extensive experience in civil litigation, research, and preparation of pleadings.
Qualifications: LLB (Hons); LDC (Hons).

OSCAR MUSIIME — Associate
Focus: Companies · Business Startup Advisory
Bio: Runs administration of interning lawyers. Expert in company formation and business startup advisory.
Qualifications: LLB (Hons); LDC (Hons).

═══════════════════════════════════════
APPOINTMENT BOOKING
═══════════════════════════════════════
1. Click "Book" in the website navigation (fastest).
2. Or collect: Full name → Phone/WhatsApp → Email (optional) → Legal issue type → Brief description → Preferred date & time.
3. Confirm: "I've noted your request. Our team will contact you within one business day."
4. Direct contact: +256 772 418 707 / kasaijaandpartners@gmail.com

═══════════════════════════════════════
RESPONSE STYLE
═══════════════════════════════════════
• Friendly, warm, professional — like a knowledgeable colleague.
• Clear and structured — short paragraphs or numbered steps for processes.
• Mobile-friendly — avoid walls of text; use line breaks.
• Empathetic in sensitive situations.
• Practical and actionable — always say what to do next.

EMERGENCY ESCALATION:
→ "This is urgent. Please call us immediately on +256 772 418 707 or WhatsApp +256 776 044 004."

UGANDAN LEGAL TERMS:
• Kibanja — customary tenant's interest on mailo land
• Mailo land — freehold-like tenure under Buganda Kingdom system
• Freehold / Leasehold / Customary tenure — Uganda's four land tenure types
• LC1 certificate — Local Council 1 introductory letter used in land transactions
• URSB — Uganda Registration Services Bureau (company & IP registration)
• URA — Uganda Revenue Authority
• LDC — Law Development Centre
• ICAMEK — Institute of Chartered Arbitrators, Mediators & Estate Administrators of Kenya (East Africa)
• Commissioner for Oaths — authorised to witness sworn affidavits

DISCLAIMER (always include briefly): "Please note: this is general information only and does not constitute legal advice. Consult one of our qualified advocates for guidance specific to your situation."
PROMPT);

// ── Parse input ───────────────────────────────────────────────────────────────
$raw   = file_get_contents('php://input');
$input = @json_decode($raw, true) ?? [];
$userMsg = trim($input['message'] ?? '');
$history = is_array($input['history'] ?? null) ? $input['history'] : [];

if (!$userMsg) {
    sse('error', ['text' => 'No message provided']);
    exit;
}

// ── DB setup ──────────────────────────────────────────────────────────────────
$db = getDB();
if ($db) {
    try { $db->query("SELECT 1 FROM faq_cache LIMIT 1"); }
    catch (PDOException $e) { initTables($db); }
    try { $db->query("SELECT 1 FROM activity_log LIMIT 1"); }
    catch (PDOException $e) {
        $db->exec("CREATE TABLE IF NOT EXISTS activity_log (
            id INT AUTO_INCREMENT PRIMARY KEY, action VARCHAR(255) NOT NULL,
            details TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    }
    // Also initialize ai_memory if it doesn't exist
    try { $db->query("SELECT 1 FROM ai_memory LIMIT 1"); }
    catch (PDOException $e) {
        $db->exec("CREATE TABLE IF NOT EXISTS ai_memory (
            id INT AUTO_INCREMENT PRIMARY KEY,
            topic_keywords TEXT NOT NULL,
            response TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FULLTEXT(topic_keywords)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    }
}

// ── 0. AI Memory Base (Admin added, zero cost, OVERRIDES EVERYTHING) ────────
if ($db && empty($history)) {
    try {
        $memRows = $db->query("SELECT * FROM ai_memory ORDER BY created_at DESC")->fetchAll();
        $bestMem = null; $bestMemScore = 0; $qLow = strtolower($userMsg);
        foreach ($memRows as $row) {
            $kws = array_filter(array_map('trim', explode(',', $row['topic_keywords'] ?? '')));
            $kwScore = 0;
            foreach ($kws as $kw) {
                if (strlen($kw) > 2 && stripos($qLow, $kw) !== false) $kwScore += 20;
            }
            if ($kwScore > $bestMemScore && $kwScore > 0) {
                $bestMemScore = $kwScore;
                $bestMem = $row;
            }
        }
        if ($bestMem) {
            dbLog($db, 'Memory Hit', "Topic: " . $bestMem['topic_keywords']);
            streamLines($bestMem['response'], detectImages($userMsg, $bestMem['response']), 'admin_memory');
            exit;
        }
    } catch (PDOException $e) {}
}

// ── 1. FAQ cache (zero Gemini cost, instant) ──────────────────────────────────
if ($db && empty($history)) {
    $cached = findCached($userMsg, $db);
    if ($cached) {
        try { $db->prepare("UPDATE faq_cache SET use_count=use_count+1, last_used=NOW() WHERE id=?")->execute([$cached['id']]); } catch (PDOException $e) {}
        dbLog($db, 'Cache Hit', $userMsg);
        streamLines($cached['response'], detectImages($userMsg, $cached['response']), 'cache');
        exit;
    }
}

// ── 2. Gemini streaming — with circuit breaker for instant fallback ───────────
$apiKey = GEMINI_API_KEY;

// Circuit breaker: skip Gemini if it failed recently (stored in temp file)
$cbFile      = sys_get_temp_dir() . '/kasaija_gemini_cb.json';
$cbData      = @json_decode(@file_get_contents($cbFile) ?: '{}', true) ?? [];
$cbUntil     = (int)($cbData['until'] ?? 0);
$geminiBlocked = ($cbUntil > time());

if (!$geminiBlocked && $apiKey && $apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
    $remaining = $db ? getDailyBudgetRemaining($db) : DAILY_TOKEN_BUDGET;
    if ($remaining > 0) {
        $messages = buildMsgArray($history, $userMsg);
        $payload  = json_encode([
            'systemInstruction' => ['parts' => [['text' => AI_SYSTEM_PROMPT]]],
            'contents'          => toGeminiFormat($messages),
            'generationConfig'  => ['temperature' => 0.7, 'maxOutputTokens' => 900, 'topP' => 0.92],
        ]);

        // Try primary model first, one fallback — short timeouts
        $models = array_unique([GEMINI_MODEL, 'gemini-1.5-flash-8b']);
        foreach ($models as $model) {
            $fullReply = '';
            $started   = false;

            $ch = curl_init("https://generativelanguage.googleapis.com/v1beta/models/{$model}:streamGenerateContent?key={$apiKey}&alt=sse");
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => false,
                CURLOPT_POST           => true,
                CURLOPT_POSTFIELDS     => $payload,
                CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
                CURLOPT_TIMEOUT        => 20,
                CURLOPT_CONNECTTIMEOUT => 3,   // 3s max to connect
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_WRITEFUNCTION  => function ($ch, $data) use (&$fullReply, &$started) {
                    foreach (explode("\n", $data) as $line) {
                        if (strpos($line, 'data:') !== 0) continue;
                        $json = @json_decode(trim(substr($line, 5)), true);
                        $text = $json['candidates'][0]['content']['parts'][0]['text'] ?? '';
                        if (!$text) continue;
                        if (!$started) { sse('start', []); $started = true; }
                        $fullReply .= $text;
                        sse('chunk', ['text' => $text]);
                    }
                    return strlen($data);
                },
            ]);

            curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($started && $fullReply && $httpCode === 200) {
                foreach (detectImages($userMsg, $fullReply) as $img) sse('image', $img);
                sse('done', ['source' => 'gemini']);
                if ($db) {
                    storeCache($userMsg, $fullReply, $db);
                    dbLog($db, 'Gemini Stream', $userMsg);
                }
                // Reset circuit breaker on success
                @file_put_contents($cbFile, json_encode(['until' => 0, 'failures' => 0]));
                exit;
            }

            // If quota exceeded (429), trip the breaker immediately — no point trying other models
            if ($httpCode === 429) {
                @file_put_contents($cbFile, json_encode(['until' => time() + 600, 'failures' => 1]));
                break;
            }
        }
    }
}

// ── 3. Demo fallback — always works, instant ──────────────────────────────────
$reply = aiDemoResponse($userMsg);
streamLines($reply, detectImages($userMsg, $reply), 'demo');

// ═══════════════════════════════════════════════════════════════════════════════
//  CORE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function streamLines(string $text, array $images, string $source): void {
    sse('start', []);
    $lines = explode("\n", $text);
    foreach ($lines as $i => $line) {
        if ($i > 0) usleep(36000); // 36 ms per line — feels natural, not slow
        sse('chunk', ['text' => ($i > 0 ? "\n" : '') . $line]);
    }
    if ($images) {
        usleep(90000);
        foreach ($images as $img) { sse('image', $img); usleep(40000); }
    }
    sse('done', ['source' => $source]);
}

// ── Image detection ───────────────────────────────────────────────────────────
// Matches against the QUESTION only to avoid false positives from response text.
function detectImages(string $question, string $response): array {
    $q    = strtolower($question);
    // Dynamic base path detection
    $base = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . '/../assets/img/';

    // General team questions → team photo (check before individual names)
    if (preg_match('/\b(team|lawyers|advocates|staff|our people|who are|all.*partner|all.*lawyer)\b/', $q)) {
        return [['src' => $base . 'law_firm_team.jpeg',
                 'alt' => 'R. Kasaija & Partners Team',
                 'caption' => 'R. Kasaija & Partners Advocates — Seven advocates, one standard of excellence']];
    }

    $staff = [
        ['match' => ['robert', 'managing partner', 'mr kasaija', 'mr. kasaija'],
         'src' => $base . 'counsel_robert.jpeg', 'alt' => 'Robert Kasaija', 'caption' => 'Robert Kasaija — Managing Partner'],
        ['match' => ['sharon', 'murungi', 'head of litigation'],
         'src' => $base . 'counsel_sharon.jpeg', 'alt' => 'Sharon Murungi', 'caption' => 'Sharon Murungi — Partner & Head of Litigation'],
        ['match' => ['joseph kwesiga', 'kwesiga', 'joseph'],
         'src' => $base . 'counsel_joseph.jpeg', 'alt' => 'Joseph Kwesiga', 'caption' => 'Joseph Kwesiga — Partner'],
        ['match' => ['justin', 'head of administration'],
         'src' => $base . 'counsel_justine_junior.jpeg', 'alt' => 'Justin Joseph Kasaija', 'caption' => 'Justin Joseph Kasaija — Associate'],
        ['match' => ['christopher', 'baluku', 'chris'],
         'src' => $base . 'counsel_chris.jpeg', 'alt' => 'Christopher Baluku', 'caption' => 'Christopher Baluku — Associate'],
        ['match' => ['fred', 'asiimwe'],
         'src' => $base . 'counsel_fred.jpeg', 'alt' => 'Fred Asiimwe', 'caption' => 'Fred Asiimwe — Associate'],
        ['match' => ['oscar', 'musiime'],
         'src' => $base . 'counsel_oscar.jpeg', 'alt' => 'Oscar Musiime', 'caption' => 'Oscar Musiime — Associate'],
    ];

    $images = [];
    foreach ($staff as $s) {
        foreach ($s['match'] as $name) {
            if (strpos($q, $name) !== false) {
                $images[] = ['src' => $s['src'], 'alt' => $s['alt'], 'caption' => $s['caption']];
                break;
            }
        }
        if (count($images) >= 2) break;
    }

    return $images;
}

// ── Message builders ──────────────────────────────────────────────────────────
function buildMsgArray(array $history, string $userMsg): array {
    $msgs = [];
    foreach ($history as $h) {
        if (isset($h['role'], $h['content']) && in_array($h['role'], ['user', 'model', 'assistant'])) {
            $msgs[] = ['role' => $h['role'], 'content' => trim($h['content'])];
        }
    }
    $msgs[] = ['role' => 'user', 'content' => $userMsg];
    return $msgs;
}

function toGeminiFormat(array $messages): array {
    $result = [];
    foreach ($messages as $m) {
        $role = ($m['role'] === 'assistant' || $m['role'] === 'model') ? 'model' : 'user';
        $text = is_string($m['content']) ? $m['content'] : '';
        if (!$text) continue;
        if (empty($result) && $role === 'model') continue;
        $last = end($result);
        if ($last && $last['role'] === $role) {
            $result[count($result) - 1]['parts'][0]['text'] .= "\n" . $text;
        } else {
            $result[] = ['role' => $role, 'parts' => [['text' => $text]]];
        }
    }
    return $result;
}

// ── DB helpers ────────────────────────────────────────────────────────────────
function initTables(PDO $db): void {
    $db->exec("CREATE TABLE IF NOT EXISTS faq_cache (
        id INT AUTO_INCREMENT PRIMARY KEY, question TEXT NOT NULL, response TEXT NOT NULL,
        keywords VARCHAR(500), use_count INT DEFAULT 1, enabled TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FULLTEXT(keywords)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    $db->exec("CREATE TABLE IF NOT EXISTS token_usage (
        id INT AUTO_INCREMENT PRIMARY KEY, usage_date DATE NOT NULL UNIQUE,
        tokens_used INT DEFAULT 0, requests INT DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    $db->exec("CREATE TABLE IF NOT EXISTS ai_memory (
        id INT AUTO_INCREMENT PRIMARY KEY, topic_keywords TEXT NOT NULL,
        response TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FULLTEXT(topic_keywords)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
}

function findCached(string $q, PDO $db): ?array {
    try {
        $rows = $db->query("SELECT * FROM faq_cache WHERE enabled=1 ORDER BY use_count DESC LIMIT 100")->fetchAll();
    } catch (PDOException $e) { return null; }
    $best = null; $bestScore = 0; $qLow = strtolower($q);
    foreach ($rows as $row) {
        $kws = array_filter(array_map('trim', explode(',', $row['keywords'] ?? '')));
        $kwScore = 0;
        foreach ($kws as $kw) if (strlen($kw) > 2 && stripos($qLow, $kw) !== false) $kwScore += 15;
        similar_text($qLow, strtolower($row['question']), $pct);
        $score = $kwScore + $pct;
        if ($score > $bestScore && $score > max(85, CACHE_SIMILARITY_THRESHOLD)) { $bestScore = $score; $best = $row; }
    }
    return $best;
}

function storeCache(string $q, string $r, PDO $db): void {
    try {
        $stop = ['the','a','an','is','are','was','were','be','been','i','my','me','we','you','your','our',
                 'have','has','had','do','does','did','will','would','can','could','should','may','might',
                 'what','how','when','where','who','which','that','this','with','for','and','or','but',
                 'not','in','on','at','to','of','by','from','about','into','as'];
        $words = preg_split('/\W+/', strtolower($q));
        $kws   = array_unique(array_filter($words, fn($w) => strlen($w) > 3 && !in_array($w, $stop)));
        $kw    = implode(',', array_slice($kws, 0, 12));
        $existing = $db->query("SELECT question FROM faq_cache WHERE enabled=1 ORDER BY created_at DESC LIMIT 10")->fetchAll();
        foreach ($existing as $e) {
            similar_text(strtolower($q), strtolower($e['question'] ?? ''), $pct);
            if ($pct > 80) return;
        }
        $db->prepare("INSERT IGNORE INTO faq_cache (question, response, keywords) VALUES (?, ?, ?)")->execute([$q, $r, $kw]);
    } catch (PDOException $e) {}
}

function getDailyBudgetRemaining(PDO $db): int {
    try {
        $row = $db->query("SELECT tokens_used FROM token_usage WHERE usage_date=CURDATE()")->fetch();
        return max(0, DAILY_TOKEN_BUDGET - (int)($row['tokens_used'] ?? 0));
    } catch (PDOException $e) { return DAILY_TOKEN_BUDGET; }
}

function dbLog(PDO $db, string $action, string $detail): void {
    try {
        $db->prepare("INSERT INTO activity_log (action, details) VALUES (?, ?)")
           ->execute([$action, substr($detail, 0, 255)]);
    } catch (PDOException $e) {}
}

// ── Demo responses — comprehensive pattern-matched answers ────────────────────
function aiDemoResponse(string $q): string {
    $q = strtolower(trim($q));

    // Who am I / chatbot identity
    if (preg_match('/who are you|what are you|your name|tell me about yourself|introduce yourself|kasaija ai/i', $q))
        return "I am Kasaija AI — the digital legal intake assistant for R. Kasaija & Partners Advocates, one of Uganda's most distinguished indigenous law firms.\n\nI can help you with:\n• General legal questions about Ugandan law\n• Information about our firm, services, and team\n• Booking a consultation with an advocate\n• Finding our office and contact details\n\nHow may I assist you today?";

    // How many lawyers / team size
    if (preg_match('/how many (lawyer|advocate|partner|staff|attorney|people)/i', $q))
        return "R. Kasaija & Partners Advocates has a team of 7 qualified advocates:\n\n• 3 Partners: Robert Kasaija (Managing Partner), Sharon Murungi (Head of Litigation), Joseph Kwesiga\n• 4 Associates: Justin Joseph Kasaija, Christopher Baluku, Fred Asiimwe, Oscar Musiime\n\nClick the \"Team\" tab to read full profiles. Would you like me to recommend the right advocate for your matter?";

    // Greetings
    if (preg_match('/^(hi|hello|hey|good\s+(morning|afternoon|evening|day)|howdy|greetings|welcome)\b/i', $q))
        return "Good day! Welcome to R. Kasaija & Partners Advocates. I am Kasaija AI, your legal intake assistant.\n\nI can help you with:\n• General legal questions about Ugandan law\n• Information about our services and team\n• Booking a consultation with an advocate\n• Finding our office or contact details\n\nHow may I assist you today?";

    // Location / address / directions
    if (preg_match('/where|locat|address|find you|office|direction|how to get/i', $q))
        return "Our offices are at:\n📍 Plot 75 Kampala Road, E-Tower Building, 4th Floor, Suite D-06, Kampala, Uganda\n\nOffice hours: Monday–Friday, 8:00 AM – 5:00 PM\n\nContact:\n📞 +256 772 418 707\n📱 WhatsApp: +256 776 044 004\n✉️ kasaijaandpartners@gmail.com\n\nYou can also use the Contact tab on this website to message us directly.";

    // Office hours
    if (preg_match('/hour|open|clos|time|when\b|available|days/i', $q) && !preg_match('/consult|book|appoint|meet/i', $q))
        return "We are open Monday to Friday, 8:00 AM – 5:00 PM East Africa Time.\n\nWe are closed on weekends and public holidays.\n\nFor urgent matters outside office hours, WhatsApp us on +256 776 044 004 — an advocate will respond as soon as possible.";

    // Contact
    if (preg_match('/contact|phone|call|email|whatsapp|reach|number/i', $q) && !preg_match('/book|appoint/i', $q))
        return "You can reach us through:\n📞 Phone: +256 772 418 707\n📱 WhatsApp: +256 776 044 004\n✉️ Email: kasaijaandpartners@gmail.com\n📍 Plot 75 Kampala Road, E-Tower Building, 4th Floor, Kampala\n\nOr use the Contact tab on this website. We respond within one business day.";

    // Booking / consultation
    if (preg_match('/book|appoint|consult|schedul|meet|see a lawyer|see an advocate/i', $q))
        return "Booking a consultation is simple!\n\n✅ Fastest way: Click the \"Book\" tab in the top navigation menu.\n\n📞 Or call directly: +256 772 418 707\n📱 WhatsApp: +256 776 044 004\n\nTo prepare your booking, we will need:\n1. Your full name\n2. Your phone number\n3. A brief description of your legal matter\n4. Your preferred date and time\n\nWe confirm within one business day.";

    // Services / practice areas
    if (preg_match('/service|practice|speciali|area|what do you|offer|help with|deal with|handle/i', $q) && !preg_match('/land|family|corpor|debt|criminal|employ|tax|ngo|ip|trade/i', $q))
        return "R. Kasaija & Partners Advocates is a full-service indigenous firm offering expert legal services across 12 practice areas:\n\n1. Banking & Finance\n2. Corporate & Commercial\n3. Debt Recovery\n4. Land & Conveyancing\n5. Intellectual Property\n6. Family & Probate\n7. Employment & Labour\n8. Criminal Law\n9. Arbitration & ADR\n10. Revenue Law & Taxation\n11. Non-Profit & NGO\n12. Governance & Compliance\n\nWe are also Advocates, Commissioners for Oaths, Notary Public, Trademark & Patent Agents, Company Secretaries, Receivers, Liquidators, and Debt Collectors.\n\nClick \"Practice\" in the menu to learn more, or describe your issue and I'll connect you with the right advocate.";

    // Team / specific person
    if (preg_match('/team|advocate|lawyer|partner|who (are|is)|staff|member|attorney|robert|sharon|joseph|justin|christopher|baluku|fred|oscar|kasaija|murungi|kwesiga|asiimwe|musiime/i', $q))
        return "Our team of 7 advocates:\n\n👨‍⚖️ Robert Kasaija — Managing Partner\n20+ years experience. Commissioner for Oaths, Notary Public, ICAMEK arbitrator.\nHandles: Banking, Corporate Finance, Criminal Law, Arbitration & Taxation.\n\n👩‍⚖️ Sharon Murungi — Partner & Head of Litigation\nFormer HIJRA/UNHCR protection manager. Uganda's landmark IP case.\nHandles: Debt Recovery, Family, Employment, Intellectual Property.\n\n👨‍⚖️ Joseph Kwesiga — Partner\nLegal Officer & Head of Prosecutions, National Forestry Authority.\nHandles: Land, Conveyancing, Environment, NGOs.\n\n👨‍⚖️ Justin Joseph Kasaija — Associate & Head of Administration\nBoard member: Sage Buyers, Black Market Entertainment, Inveseed, Koisan Investments.\nHandles: Corporate Governance & Compliance.\n\n👨‍⚖️ Christopher Baluku — Associate (Submissions & Research)\n👨‍⚖️ Fred Asiimwe — Associate (Civil Litigation & Research)\n👨‍⚖️ Oscar Musiime — Associate (Company Formation & Startup Advisory)\n\nClick the \"Team\" tab to see full profiles and credentials.";

    // LAND LAW
    if (preg_match('/kibanja|mailo|land|propert|title|caveat|mortgage|convey|transfer|evict|plot|tenure|freehold|leasehold|lc1|lc 1/i', $q)) {
        if (preg_match('/kibanja|define kibanja/i', $q))
            return "A kibanja is a customary land interest recognised in Uganda, particularly on mailo land. It gives the occupant the right to use the land, even though the legal owner holds the formal title.\n\nKibanja holders have legal protections and cannot be evicted without a court order.\n\nOur Partner Joseph Kwesiga specialises in land law. Click \"Book\" to arrange a consultation or call +256 772 418 707.\n\n📌 General information only. Consult our advocates for advice specific to your situation.";
        if (preg_match('/mailo land|what is mailo/i', $q))
            return "Mailo land is a unique Ugandan land tenure system from the 1900 Buganda Agreement. It grants the holder absolute ownership (freehold-like), but occupants (kibanja holders) also have recognised rights.\n\nMailo land can be bought, sold, or mortgaged, but transactions must follow the Land Act and Registration of Titles Act.\n\nJoseph Kwesiga handles all land matters. Click \"Book\" or call +256 772 418 707.\n\n📌 General information only.";
        if (preg_match('/caveat/i', $q))
            return "A caveat is a legal notice lodged against a land title to warn potential buyers or mortgagees that someone has a claim on the land. It prevents the title from being transferred or mortgaged without the caveator's knowledge.\n\nCaveats are registered at the Uganda Land Registry under the Registration of Titles Act.\n\nFor help lodging or lifting a caveat, contact Joseph Kwesiga — click \"Book\" or call +256 772 418 707.\n\n📌 General information only.";
        if (preg_match('/evict/i', $q))
            return "Under Ugandan law, a landlord cannot evict a tenant without a valid court order. The process requires proper notice and an eviction order from a magistrate court. Forceful eviction without a court order is illegal.\n\nIf you are facing eviction or need to evict a tenant, Joseph Kwesiga can assist. Click \"Book\" or call +256 772 418 707 for urgent matters.\n\n📌 General information only.";
        return "Land and property matters — title searches, conveyancing, mailo land, kibanja rights, caveats, mortgage transactions, and eviction proceedings — are handled by our Partner Joseph Kwesiga.\n\nClick \"Book\" to schedule a consultation, or call +256 772 418 707.";
    }

    // FAMILY & PROBATE
    if (preg_match('/divorce|family|child|custody|maintenance|adoption|guardian|probate|succession|will\b|inherit|matrimon|separat|marriage/i', $q)) {
        if (preg_match('/divorce process|how.*divorce/i', $q))
            return "In Uganda, divorce is governed by the Divorce Act (Cap. 249). The process:\n\n1. File a divorce petition in the High Court\n2. Serve the petition on your spouse\n3. Present evidence (grounds: adultery, cruelty, desertion for 2+ years, etc.)\n4. Court grants a decree nisi (provisional)\n5. After 3 months, apply for a decree absolute (final)\n\nThe process can take 1–3 years depending on whether it is contested.\n\nSharon Murungi handles all family matters. Click \"Book\" or call +256 772 418 707.\n\n📌 General information only.";
        if (preg_match('/will\b|write.*will/i', $q))
            return "In Uganda, a valid will must:\n• Be in writing\n• Be signed by the testator\n• Be witnessed by at least 2 independent witnesses (not beneficiaries)\n\nAfter death, the will is executed through probate — a court process validating the will and authorising the executor to distribute the estate.\n\nSharon Murungi handles wills and succession. Click \"Book\" or call +256 772 418 707.\n\n📌 General information only.";
        if (preg_match('/custody|child.*right/i', $q))
            return "Under the Children Act of Uganda, the welfare of the child is the paramount consideration in custody decisions. Courts consider the child's age, health, emotional ties, and each parent's capacity to provide.\n\nGenerally, young children are placed with their mother, but each case is decided on its own facts.\n\nSharon Murungi handles all custody and family law matters. Click \"Book\" or call +256 772 418 707.\n\n📌 General information only.";
        return "Family and probate matters — divorce, child custody, maintenance, adoption, guardianship, wills, and succession — are handled with sensitivity by Sharon Murungi, our Head of Litigation.\n\nClick \"Book\" for a confidential consultation, or call +256 772 418 707.";
    }

    // CORPORATE / BUSINESS
    if (preg_match('/company|business|corpor|invest|ursb|registr|startup|formation|merger|acqui|joint venture|sharehol/i', $q)) {
        if (preg_match('/register.*company|how.*start.*company|company registration/i', $q))
            return "To register a company in Uganda through URSB:\n\n1. Choose a company name and check availability on ursb.go.ug\n2. Prepare Memorandum & Articles of Association\n3. Complete registration forms (Form 1, 3, 7)\n4. Pay the prescribed registration fees\n5. Receive your Certificate of Incorporation\n\nFor a private limited company, you need at least 1 director and 1 shareholder. The process typically takes 3–5 business days online.\n\nJustin Joseph Kasaija and Oscar Musiime handle company formation. Click \"Book\" or call +256 772 418 707.\n\n📌 General information only.";
        return "Corporate and commercial matters — company formation, URSB registration, mergers and acquisitions, joint ventures, foreign investment, and governance — are handled by Justin Joseph Kasaija and Oscar Musiime.\n\nClick \"Book\" or call +256 772 418 707 for immediate assistance.";
    }

    // DEBT RECOVERY
    if (preg_match('/debt|recover|owe|loan|collect|unpaid|creditor|default|judgment/i', $q))
        return "Debt recovery in Uganda typically involves:\n\n1. Sending a formal demand letter\n2. Negotiation / mediation\n3. Filing a civil suit in the appropriate court\n4. Obtaining a court judgment\n5. Enforcing the judgment (attachment, garnishment)\n\nOur Head of Litigation Sharon Murungi has a proven track record — recovering substantial sums for H.K Financial Services, Save and Invest, S.N Financial Services, Tin Link Financial Solutions, Agwotwe Financial Services, and Twezimbe Investment Group.\n\nClick \"Book\" or call +256 772 418 707.\n\n📌 General information only.";

    // CRIMINAL LAW
    if (preg_match('/criminal|arrest|police|court|charg|bail|prison|jail|murder|robbery|theft|fraud|detain|suspect|accused/i', $q)) {
        if (preg_match('/arrest|right.*arrest|arrested/i', $q))
            return "If you are arrested in Uganda, you have the following rights:\n\n✅ Right to be informed of the reason for your arrest\n✅ Right to remain silent\n✅ Right to consult a lawyer immediately\n✅ Right to be brought before a court within 48 hours (72 on a weekend)\n✅ Right to apply for bail\n\n🚨 If you or someone you know has been arrested, call us immediately: +256 772 418 707.\nRobert Kasaija handles criminal matters personally.\n\n📌 General information only. Call immediately for urgent help.";
        if (preg_match('/bail/i', $q))
            return "Bail in Uganda is the temporary release of an accused person pending trial, upon providing security (money or sureties) guaranteeing court appearance.\n\nFor most offences, bail can be granted by a magistrate court. For capital offences (e.g., murder), only the High Court can grant bail.\n\n🚨 If you need bail, call us immediately on +256 772 418 707 — Robert Kasaija handles criminal matters and can apply for bail on your behalf.\n\n📌 General information only.";
        return "Criminal defence matters are handled personally by our Managing Partner Robert Kasaija, with an impressive record in criminal proceedings across Uganda.\n\n🚨 If this is urgent — call immediately: +256 772 418 707 or WhatsApp +256 776 044 004.";
    }

    // EMPLOYMENT
    if (preg_match('/employ|labour|fired|dismiss|salary|wage|contract|workplace|redund|terminat|unfair|leave|maternity|sick/i', $q)) {
        if (preg_match('/unfair.*dismiss|wrongful.*terminat|fired unfairly/i', $q))
            return "Under the Employment Act 2006, an employee can only be dismissed fairly for:\n• Misconduct\n• Redundancy\n• Incapacity (illness/performance)\n• Legal restrictions preventing continued employment\n\nIf you were dismissed without a valid reason or proper notice, you may have a claim for wrongful dismissal and can seek compensation, reinstatement, or both.\n\nSharon Murungi handles employment disputes. Click \"Book\" or call +256 772 418 707.\n\n📌 General information only.";
        return "Employment and labour matters — unfair dismissal, employment contracts, salary disputes, redundancies, and workplace rights — are handled by Sharon Murungi.\n\nClick \"Book\" or call +256 772 418 707.\n\n📌 General information only.";
    }

    // TAX
    if (preg_match('/tax|ura|revenue|fiscal|vat|income tax|corporate tax|withhold/i', $q))
        return "Revenue law and taxation — corporate tax advisory, URA compliance, VAT, income tax, tax planning, and tax disputes — are handled by Robert Kasaija.\n\nUganda's major taxes:\n• Corporate Income Tax (30%)\n• Value Added Tax (18%)\n• PAYE (Pay As You Earn)\n• Withholding Tax\n• Local Service Tax\n\nFor tax advisory or URA dispute resolution, click \"Book\" or call +256 772 418 707.\n\n📌 General information only.";

    // INTELLECTUAL PROPERTY
    if (preg_match('/trademark|patent|copyright|intellectual|brand|logo|ip\b|registr.*brand/i', $q)) {
        if (preg_match('/trademark|register.*brand|protect.*brand/i', $q))
            return "Trademarks in Uganda are registered through URSB under the Trade Marks Act:\n\n1. Conduct a trademark search on ursb.go.ug\n2. File a trademark application (with logo/name and class of goods/services)\n3. Pay the prescribed fee\n4. Application examined and published in the Uganda Gazette\n5. If no opposition within 60 days, certificate issued\n\nRegistration typically takes 12–18 months.\n\nSharon Murungi handles all IP matters. Click \"Book\" or call +256 772 418 707.\n\n📌 General information only.";
        return "Intellectual property — trademark registration, patent applications, copyright enforcement, brand protection, and unfair competition — are handled by Sharon Murungi. We notably handled Uganda's first unfair competition and predatory pricing case.\n\nClick \"Book\" or call +256 772 418 707.\n\n📌 General information only.";
    }

    // NGO
    if (preg_match('/ngo|non.?profit|nonprofit|charity|organisation|foundation|civil society/i', $q))
        return "Non-profit and NGO legal work — formation, NGO Bureau registration, governance, compliance, and financing — is handled by Joseph Kwesiga. We also provide pro-bono services to the Uganda Christian Lawyers Fraternity and Uganda Law Society.\n\nClick \"Book\" or call +256 772 418 707.\n\n📌 General information only.";

    // ADR
    if (preg_match('/arbitrat|adr|mediati|negotiat|dispute.*resolut|alternative/i', $q))
        return "Arbitration and Alternative Dispute Resolution — commercial arbitration, mediation, and negotiation — are led by Robert Kasaija, a certified ICAMEK arbitrator.\n\nADR is often faster and more cost-effective than court litigation for commercial disputes.\n\nClick \"Book\" or call +256 772 418 707 to discuss your dispute.\n\n📌 General information only.";

    // About / firm
    if (preg_match('/about|tell me.*firm|histor|firm.*kasaija|kasaija.*firm|kasaija.*partner|r\. kasaija|how long|founded|established|background|law firm/i', $q))
        return "R. Kasaija & Partners Advocates is one of Uganda's most distinguished indigenous law firms, based in Kampala.\n\nWe are a full-service practice of Advocates, Solicitors, Commissioners for Oaths, Notary Public, Trademark & Patent Agents, Company Secretaries, Receivers, Liquidators, and Debt Collectors.\n\nLed by Managing Partner Robert Kasaija — 20+ years experience — our team of 7 advocates serves major national and international companies across consumer goods, real estate, energy, banking, and project financing, as well as individual clients.\n\nLanguages: English, Runyankore, and Luganda.\nMemberships: ULS, EALS, ICAMEK.\n\nClick \"About\" in the menu to learn more, or ask me anything about our services, team, or how to book a consultation.";

    // Fees / cost
    if (preg_match('/cost|fee|price|charg|pay|afford|how much|rate/i', $q))
        return "Our fees depend on the nature and complexity of your matter. We provide transparent fee estimates during the initial consultation before any work begins.\n\nTo get a fee estimate:\n1. Click \"Book\" in the top menu to schedule a consultation\n2. Or call +256 772 418 707 to speak with our office\n\nWe are committed to excellent value and transparent pricing.";

    // Urgent / emergency
    if (preg_match('/urgent|emergency|asap|immediately|help.*now|right now|crisis|threat/i', $q))
        return "🚨 For urgent legal matters:\n\n📞 Call NOW: +256 772 418 707\n📱 WhatsApp: +256 776 044 004\n\nOur team handles urgent matters as a priority — criminal arrests, court injunctions, eviction notices, and urgent commercial disputes.\n\nDo not delay — call immediately.";

    // Legal definitions
    if (preg_match('/what is (a |an )?(contract|affidavit|injunction|summons|warrant|plaintiff|defendant|lawsuit|judgment)/i', $q)) {
        $term = strtolower(trim(preg_replace('/.*what is (a |an )?/i', '', $q), '?. '));
        $defs = [
            'contract'  => "A contract is a legally binding agreement between two or more parties. For a contract to be valid in Uganda it must have: an offer, acceptance, consideration (something of value exchanged), and intention to create legal relations. Contracts can be written or verbal, but written contracts are easier to enforce.",
            'affidavit' => "An affidavit is a written statement confirmed by oath or affirmation, used as evidence in court. In Uganda, affidavits must be sworn before a Commissioner for Oaths, an Advocate, or a Magistrate.",
            'injunction'=> "An injunction is a court order requiring a person to do something or stop doing something. For example, stopping someone from selling disputed property during a land case.",
            'summons'   => "A court summons is an official notice requiring you to appear in court on a specified date. If you receive a summons, consult a lawyer immediately. Click 'Book' or call +256 772 418 707.",
            'warrant'   => "A warrant is a legal document authorising the police or court officials to carry out a specific act — such as an arrest warrant or a search warrant.",
            'plaintiff' => "A plaintiff is the person or organisation who brings a legal case or lawsuit against another party in court.",
            'defendant' => "A defendant is the person or organisation against whom a legal case or lawsuit is brought in court.",
            'judgment'  => "A judgment is the final decision of a court in a legal case. It determines the rights and obligations of the parties involved.",
        ];
        foreach ($defs as $key => $answer) {
            if (strpos($term, $key) !== false)
                return $answer . "\n\n📌 General information only. Consult our advocates for specific advice.";
        }
    }

    // Banking / finance (catch-all if not matched above)
    if (preg_match('/bank|financ|loan.*bank|credit|lend/i', $q))
        return "Banking & Finance matters — including structured finance, syndicated lending, asset finance, project finance, guarantees, derivatives, debentures, and general banking — are handled by our Managing Partner, Robert Kasaija.\n\nClick \"Book\" or call +256 772 418 707 to discuss your banking or finance matter.\n\n📌 General information only.";

    // Languages spoken
    if (preg_match('/language|speak|luganda|runyankore|english/i', $q))
        return "Our advocates speak:\n• English\n• Runyankore\n• Luganda\n\nWe are happy to serve you in your preferred language. Call us on +256 772 418 707 or click \"Book\" to schedule a consultation.";

    // Commissioner for Oaths / Notary Public
    if (preg_match('/commissioner.*oath|notary|sworn|affidavit.*witness|witness.*affidavit/i', $q))
        return "Our Managing Partner, Robert Kasaija, is a Commissioner for Oaths and Notary Public — he can witness and certify sworn affidavits, statutory declarations, and other legal documents.\n\nVisit our offices at Plot 75 Kampala Road, E-Tower Building, 4th Floor, Suite D-06, Kampala.\n\nOffice hours: Monday–Friday, 8:00 AM – 5:00 PM. Call +256 772 418 707 to confirm availability.";

    // Default
    return "Good day! I am Kasaija AI, the digital intake assistant for R. Kasaija & Partners Advocates.\n\nI can answer questions about:\n• Our services (12 practice areas)\n• Our team of 7 advocates\n• Office location and hours\n• How to book a consultation\n• General Ugandan law topics (land, family, criminal, employment, company, etc.)\n\nPlease describe your question or legal concern and I will assist you right away.";
}
