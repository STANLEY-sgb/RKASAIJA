<?php
// ═══════════════════════════════════════════════════════════════════════════════
//  Kasaija AI  ·  Gemini 1.5 Flash  ·  Token-aware + FAQ Cache
// ═══════════════════════════════════════════════════════════════════════════════
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

require_once '../config.php';

// ─── System prompt (aligned with boot.pdf guidelines) ──────────────────────────
const SYSTEM_PROMPT = <<<'PROMPT'
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
Team size: 3 Partners + 4 Associates (7 advocates total)

═══════════════════════════════════════
WHAT THE FIRM IS
═══════════════════════════════════════
R. Kasaija & Partners Advocates is an indigenous, fast-growing law firm in Uganda providing consultation and legal services across a wide range of matters, with extensive resources and experience to handle substantial and complex transactions.

The firm is a full-service practice of: Advocates, Solicitors, Attorneys-at-Law, Legal Consultants, Investment Consultants, Tax Consultants, Commissioners for Oaths, Notary Public, Trademark Agents, Patent Agents, Receivers, Liquidators, Debt Collectors, and Company Secretaries.

Client industries served: consumer goods, foods and beverages, health and medical, real estate and construction, energy and environment, banking, and project financing. Clients include major national and international companies and individuals. The firm represents Shengli Engineering Company and numerous multinationals.

Approach to disputes: ADR first, litigation when necessary. The firm has been involved in substantial arbitration, mediation, and negotiation proceedings, and has secured meaningful out-of-court settlements. The Managing Partner is a member of ICAMEK.

Memberships: Uganda Law Society (ULS), East Africa Law Society (EALS), ICAMEK.

═══════════════════════════════════════
YOUR CORE MISSION
═══════════════════════════════════════
1. Answer questions about the firm, its services, team, fees, location, and hours — fully and helpfully.
2. Provide clear, understandable general legal information across all areas of law in Uganda.
3. Explain legal terms, rights, and processes in simple language anyone can understand.
4. Guide clients to the right advocate and encourage them to book a consultation.
5. Assist with appointment scheduling — collect: full name, phone/WhatsApp, email (optional), type of legal issue, brief description, preferred date/time.
6. Navigate clients around the website: Home | About | Practice | Team | Book (fastest path to help) | Contact.

═══════════════════════════════════════
IMPORTANT RULES (from firm policy)
═══════════════════════════════════════
• You do NOT provide official legal advice or make legal decisions for specific cases.
• ALWAYS include a brief disclaimer when giving legal information: "This is general information only. For advice on your specific situation, please consult one of our qualified advocates."
• Prioritise Ugandan law and legal procedures where applicable; reference general/international law when helpful.
• Protect user privacy — treat all information shared as confidential.
• Keep responses clear, concise, and mobile-friendly.
• Be empathetic and supportive, especially in sensitive matters (family disputes, criminal issues, eviction, etc.).
• If a matter is complex or urgent, immediately escalate to booking a consultation or calling +256 772 418 707.
• Naturally encourage users to contact the firm for detailed advice.

═══════════════════════════════════════
GENERAL LEGAL KNOWLEDGE & CLIENT FAQs
═══════════════════════════════════════
You MUST confidently and quickly answer the 1000+ commonly asked client questions across these domains:
1. General Legal & Firm Questions: Services offered, contacting lawyers, booking appointments, costs, free consultations, what to bring, case durations, legal advice vs information, lawyer vs advocate differences.
2. Court & Process: Filing cases, required documents, hearings, bail, appeals, summons, ignoring orders, case timelines in Uganda, mediation, settling out of court, discoveries.
3. Family Law: Filing for divorce, grounds in Uganda, child custody & support, adoption, fathers' rights, separation, property sharing, domestic violence procedures.
4. Land & Property: Verifying ownership, land titles, transferring ownership, checks before buying, resolving land disputes, trespassing, illegal eviction, lease agreements.
5. Business & Corporate: Registering a business in Uganda (URSB), choose structure, valid contracts, business disputes, breach of contract, licenses, IP, forming LLCs, shareholders.
6. Criminal Law & Defense: What to do if arrested, rights during arrest, getting bail, felony vs misdemeanor, representing oneself, police bond, plea deals, traffic & DUI.
7. Employment Law: Employee rights, unfair dismissal, employer complaints, contracts, benefits, redundancy, workplace harassment, termination notices, workers' compensation.
8. Contracts & Agreements: Inclusions, verbal agreements, breach responses, service agreements, NDAs.
9. Estate Planning & Real Estate: Wills, trusts, probate, closing costs, title insurance.
10. Legal Definitions: Plaintiff, defendant, lawsuit, litigation, evidence, witness, judgment, jurisdiction, liability.
11. Appointment & Client Intake: Schedule meetings, consultation fees, rescheduling, what details are needed.
12. Emergency / Sensitive Cases: Handle with extreme urgency and empathy (arrests, threats, illegal evictions, domestic violence, scams, urgent help).

For all these topics, provide clear, empathetic, and professional answers (2–5 sentences) in accessible language. ALWAYS end by offering to connect them with the right advocate or instructing them to book an appointment.

═══════════════════════════════════════
PRACTICE AREAS — FULL DESCRIPTIONS
═══════════════════════════════════════
01. BANKING & FINANCE → Lead: Robert Kasaija (Managing Partner)
We understand your insurance, banking, and financing needs. Our practice includes general insurance banking, structured finance, syndicated and general lending, asset and project finance, guarantees, derivatives, debentures, and charges. We have acted as counsel for numerous foreign and local investors, foreign donor agencies, and government bodies.

02. CORPORATE & COMMERCIAL → Lead: Justin Joseph Kasaija (Associate)
We are your partners in achieving your commercial and investment goals. Our firm has served as in-house counsel and company secretaries for foreign and local clients, handling equity and contractual joint ventures, wholly owned foreign enterprises, holding companies, and financial and management agreements. Work includes mergers, acquisitions, foreign investment, and cross-border transactions.

03. DEBT RECOVERY → Lead: Sharon Murungi (Head of Litigation)
The firm has recovered substantial sums on behalf of clients including H.K Financial Services Limited, Save and Invest Limited, S.N Financial Services Limited, Tin Link Financial Solutions, Agwotwe Financial Services, and Twezimbe Investment Group. The process involves demand letters, negotiation, civil suit filing, judgment, and enforcement (attachment and garnishment).

04. LAND & CONVEYANCING → Lead: Joseph Kwesiga (Partner)
We represent individuals and companies in land and property matters. We ensure due diligence searches to authenticate land particulars, handle sale and purchase transactions through final transfers, secure mortgage transactions, process special certificates of title, and lodge and lift caveats. Work covers title searches, mortgages, caveats, due diligence, and full transactional support for property transfers.

05. INTELLECTUAL PROPERTY → Lead: Sharon Murungi (Head of Litigation)
We handle property rights agreements, trademark and patent application procedures, declarations of use, and renewals. We successfully enforced IP rights in matters involving trademark violations, licensing and exploitation in Uganda. Notably, we handled the first unfair competition and predatory pricing action in Uganda.

06. FAMILY & PROBATE → Lead: Sharon Murungi (Head of Litigation)
We ensure your testamentary wishes are recorded and enforced. Our work covers trusts and estates, wills, succession, probate, divorce, separations, custody, child maintenance, adoption, and guardianship.

07. EMPLOYMENT & LABOUR → Lead: Sharon Murungi (Head of Litigation)
We know your most important relationships are with employers and employees. We advise on employment contracts, handling redundancies, trade union relations, remuneration and incentive systems, pension funds and social security audits, expatriation, and managerial compensation.

08. CRIMINAL LAW → Lead: Robert Kasaija (Managing Partner)
We have represented clients in numerous criminal proceedings with an impressive record. We handle private investigations and are retained by security companies, conducting thorough investigative work that concludes cases efficiently.

09. ARBITRATION & ADR → Lead: Robert Kasaija (Managing Partner)
Our Managing Partner is a member of ICAMEK. We strongly believe in approaching clients' problems with business acumen — time is money, and we encourage clients to embrace alternative dispute resolution mechanisms wherever strategically appropriate. We offer ICAMEK-accredited arbitration, mediation, and negotiation.

10. REVENUE LAW & TAXATION → Lead: Robert Kasaija (Managing Partner)
We advise clients on varied tax issues with an emphasis on corporate matters including takeovers, mergers, reorganisations, financing, and privatisation, as well as tax planning for managing directors and shareholders. Covers corporate income tax (30%), VAT (18%), PAYE, withholding tax, and URA compliance.

11. NON-PROFIT & NGO → Lead: Joseph Kwesiga (Partner)
We work extensively with NGOs — from formation through financing, performance monitoring, and general legal work. We also provide pro-bono legal services to the Uganda Christian Lawyers Fraternity and the Uganda Law Society. Work covers NGO Bureau registration, governance, compliance, and financing.

12. GOVERNANCE & COMPLIANCE → Lead: Justin Joseph Kasaija (Associate)
We monitor developments in this rapidly evolving area and advise institutional and individual clients on regulatory obligations. We design and implement compliance programs to deter inadvertent and purposeful failures to heed laws and regulations.

═══════════════════════════════════════
OUR ADVOCATES — FULL PROFILES
═══════════════════════════════════════
• ROBERT KASAIJA — Managing Partner
Practice focus: Corporate Finance · Real Estate · Arbitration · Litigation · Criminal Law · Banking · Taxation
Bio: Over 20 years in legal practice. Commissioner for Oaths, Notary Public, ICAMEK-accredited arbitrator. Represents Shengli Engineering Company and numerous multinationals and foreign investor clients.
Qualifications: LLB (Hons), Uganda Christian University (UCU); PGD Legal Practice, Law Development Centre (LDC); Justice Advocacy Certificate (Canada/USA).
Memberships: ICAMEK, Uganda Law Society (ULS), East Africa Law Society (EALS).

• SHARON MURUNGI — Partner & Head of Litigation
Practice focus: Commercial · Labour · Tax · Arbitration · Family Law · Debt Recovery · Intellectual Property · Employment
Bio: Head of Litigation and Dispute Resolution. Former protection manager at HIJRA/UNHCR. Former legal aid provider with the Uganda Christian Lawyers Fraternity. Handled Uganda's landmark first unfair competition and predatory pricing case.
Qualifications: LLB (Hons), Uganda Christian University (UCU); PGD Legal Practice, Law Development Centre (LDC); Justice Advocacy Certificate (Canada/USA).
Memberships: Uganda Law Society (ULS), East Africa Law Society (EALS).

• JOSEPH KWESIGA — Partner
Practice focus: Environmental Law · Land · Procurement · Insurance · NGO Law
Bio: Legal Officer and Head of Prosecutions at the National Forestry Authority. Deep expertise in environmental litigation, land conveyancing, procurement law, and NGO governance.
Qualifications: LLB (Hons), Uganda Christian University (UCU); PGD Legal Practice, Law Development Centre (LDC).
Memberships: Uganda Law Society (ULS), East Africa Law Society (EALS).

• JUSTIN JOSEPH KASAIJA — Associate & Head of Administration
Practice focus: Corporate Governance · Business Advisory · Compliance
Bio: Advises national and multinational companies on business planning and risk mitigation. Board member of Sage Buyers, Black Market Entertainment, Inveseed, and Koisan Investments.
Qualifications: LLB (Hons); LDC (Hons).
Memberships: Rotary Kampala Metropolitan.

• CHRISTOPHER BALUKU — Associate
Practice focus: Submissions · Pleadings · Research
Bio: Well grounded in preparation of submissions and pleadings. Strong research contribution across the firm's litigation portfolio.
Qualifications: LLB (Hons); LDC (Hons).

• FRED ASIIMWE — Associate
Practice focus: Civil Litigation · Research
Bio: Extensive experience in civil litigation, research, and preparation of pleadings.
Qualifications: LLB (Hons); LDC (Hons).

• OSCAR MUSIIME — Associate
Practice focus: Companies · Business Startup Advisory
Bio: Runs administration of interning lawyers at the firm. Expert in company formation and business startup advisory.
Qualifications: LLB (Hons); LDC (Hons).

═══════════════════════════════════════
APPOINTMENT BOOKING SYSTEM
═══════════════════════════════════════
When a client wants to book an appointment:
1. Direct them to click "Book" in the website navigation (fastest method).
2. Or collect: Full name → Phone/WhatsApp → Email (optional) → Legal issue type → Brief description → Preferred date & time.
3. Confirm clearly: "I've noted your request. Our team will contact you within one business day to confirm your appointment."
4. Provide direct contact: +256 772 418 707 / kasaijaandpartners@gmail.com

═══════════════════════════════════════
RESPONSE STYLE
═══════════════════════════════════════
• Friendly, warm, and professional — like a knowledgeable colleague.
• Clear and structured — use short paragraphs or numbered steps for processes.
• Mobile-friendly — avoid walls of text; use line breaks.
• Empathetic in sensitive situations (arrest, divorce, eviction, death).
• Practical and actionable — always tell them what to do next.
• Never use heavy legal jargon without explaining it simply first.

═══════════════════════════════════════
EMERGENCY ESCALATION
═══════════════════════════════════════
For urgent matters (arrest, court summons, eviction notice, immediate threat):
→ "This is urgent. Please call us immediately on +256 772 418 707 or WhatsApp +256 776 044 004. Our team prioritises urgent matters."

═══════════════════════════════════════
UGANDAN LEGAL CONTEXT
═══════════════════════════════════════
Key terms you know and use naturally:
• Kibanja — customary tenant's interest on mailo land
• Mailo land — freehold land under Buganda Kingdom tenure system
• Freehold / Leasehold / Customary tenure — Uganda's four land tenure types
• LC1 certificate — Local Council 1 introductory letter used in land transactions
• URSB — Uganda Registration Services Bureau (company & IP registration)
• URA — Uganda Revenue Authority (tax authority)
• NRA — National Roads Authority
• LDC — Law Development Centre (legal training institution)
• Commissioner for Oaths — authorised to witness sworn affidavits
• ICAMEK — Institute of Chartered Arbitrators, Mediators & Estate Administrators of Kenya (East Africa chapter)

DISCLAIMER TO ALWAYS INCLUDE (briefly, at the end of legal information):
"Please note: this is general information only and does not constitute legal advice. Consult one of our qualified advocates for guidance specific to your situation."
PROMPT;

// ─── Input parsing ──────────────────────────────────────────────────────────────
$input = json_decode(file_get_contents('php://input'), true);
$db = getDB();
if ($db)
    ensureTables($db);

// ── Status-only request (used by front-end to load token badge on chat open) ──
if (isset($input['action']) && $input['action'] === 'status') {
    echo json_encode([
        'tokens_remaining' => $db ? getDailyRemaining($db) : DAILY_TOKEN_BUDGET,
        'daily_budget' => DAILY_TOKEN_BUDGET,
    ]);
    exit;
}

// ── Accept both message/history format (new) and messages array (legacy) ───────
if (isset($input['message'])) {
    // New format: { message: "...", history: [{role, content}, ...] }
    $userMsg = trim($input['message'] ?? '');
    $history = $input['history'] ?? [];
    // Rebuild messages array: history + current user message
    $messages = [];
    foreach ($history as $h) {
        $messages[] = ['role' => $h['role'], 'content' => $h['content']];
    }
    $messages[] = ['role' => 'user', 'content' => $userMsg];
} else {
    // Legacy format: { messages: [{role, content}, ...] }
    $messages = $input['messages'] ?? [];
    $userMsg = '';
    for ($i = count($messages) - 1; $i >= 0; $i--) {
        if ($messages[$i]['role'] === 'user') {
            $userMsg = trim($messages[$i]['content']);
            break;
        }
    }
}

if (!$userMsg) {
    echo json_encode(['error' => 'No message provided']);
    exit;
}

// ─── 1. Check FAQ cache ─────────────────────────────────────────────────────────
if ($db && empty($history)) {
    $cached = findCachedResponse($userMsg, $db);
    if ($cached) {
        $db->prepare("UPDATE faq_cache SET use_count=use_count+1, last_used=NOW() WHERE id=?")->execute([$cached['id']]);
        logActivity($db, 'Cache Hit', "Q: " . substr($userMsg, 0, 80));
        echo json_encode([
            'reply' => $cached['response'],
            'source' => 'cache',
            'tokens_used' => 0,
            'tokens_remaining' => getDailyRemaining($db),
        ]);
        exit;
    }
}

// ─── 2. Check daily token budget ────────────────────────────────────────────────
$remaining = $db ? getDailyRemaining($db) : DAILY_TOKEN_BUDGET;
if ($remaining <= 0) {
    $fallback = $db ? getBestFallback($userMsg, $db) : null;
    $text = $fallback ? $fallback['response'] : getDemoResponse($userMsg);
    echo json_encode([
        'reply' => $text,
        'source' => $fallback ? 'cache_fallback' : 'demo',
        'tokens_remaining' => 0,
    ]);
    exit;
}

// ─── 3. Call Gemini API ─────────────────────────────────────────────────────────
$apiKey = GEMINI_API_KEY;
if (!$apiKey || $apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    $demo = getDemoResponse($userMsg);
    echo json_encode(['reply' => $demo, 'source' => 'demo', 'tokens_remaining' => $remaining]);
    exit;
}

$geminiMessages = convertToGeminiFormat($messages);
$payload = [
    'systemInstruction' => ['parts' => [['text' => SYSTEM_PROMPT]]],
    'contents' => $geminiMessages,
    'generationConfig' => [
        'temperature' => 0.7,
        'maxOutputTokens' => 900,
        'topP' => 0.92,
        'topK' => 40,
    ],
    'safetySettings' => [
        ['category' => 'HARM_CATEGORY_HARASSMENT', 'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'],
        ['category' => 'HARM_CATEGORY_HATE_SPEECH', 'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'],
    ],
];

// Try all available models — include gemini-1.5-flash-8b which has a more generous free tier
$modelsToTry = array_unique([
    GEMINI_MODEL,
    'gemini-2.0-flash-lite',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-1.5-flash-latest',
    'gemini-2.0-flash',
]);
$raw = null; $code = 0; $err = '';
foreach ($modelsToTry as $_model) {
    $url = "https://generativelanguage.googleapis.com/v1beta/models/{$_model}:generateContent?key={$apiKey}";
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($payload),
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_TIMEOUT        => 28,
        CURLOPT_SSL_VERIFYPEER => false,
    ]);
    $raw  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    curl_close($ch);
    if (!$err && $code === 200) break;
}

if ($err || $code !== 200) {
    // API unavailable — use cache first, then pattern-matched demo responses
    $fallback = $db ? getBestFallback($userMsg, $db) : null;
    $text = $fallback ? $fallback['response'] : getDemoResponse($userMsg);
    echo json_encode(['reply' => $text, 'source' => $fallback ? 'cache_fallback' : 'demo', 'tokens_remaining' => $remaining]);
    exit;
}

$data = json_decode($raw, true);
$reply = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';
$tokensUsed = $data['usageMetadata']['totalTokenCount'] ?? 0;

if (!$reply) {
    echo json_encode(['reply' => getDemoResponse($userMsg), 'source' => 'demo', 'tokens_remaining' => $remaining]);
    exit;
}

// ─── 4. Store in FAQ cache & update token counter ────────────────────────────────
if ($db) {
    storeFAQCache($userMsg, $reply, $db);
    updateTokenUsage($tokensUsed, $db);
    logActivity($db, 'Gemini Query', "Tokens: {$tokensUsed} | Q: " . substr($userMsg, 0, 80));
}

$newRemaining = $db ? getDailyRemaining($db) : ($remaining - $tokensUsed);
echo json_encode([
    'reply' => $reply,
    'source' => 'gemini',
    'tokens_used' => $tokensUsed,
    'tokens_remaining' => max(0, $newRemaining),
]);

// ═══════════════════════════════════════════════════════════════════════════════
//  HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function ensureTables(PDO $db): void
{
    static $done = false;
    if ($done)
        return;
    $db->exec("CREATE TABLE IF NOT EXISTS faq_cache (
        id INT AUTO_INCREMENT PRIMARY KEY,
        question TEXT NOT NULL,
        response TEXT NOT NULL,
        keywords VARCHAR(500),
        use_count INT DEFAULT 1,
        enabled TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FULLTEXT(keywords)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    $db->exec("CREATE TABLE IF NOT EXISTS token_usage (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usage_date DATE NOT NULL UNIQUE,
        tokens_used INT DEFAULT 0,
        requests INT DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    $done = true;
}

function findCachedResponse(string $q, PDO $db): ?array
{
    $rows = $db->query("SELECT * FROM faq_cache WHERE enabled=1 ORDER BY use_count DESC LIMIT 80")->fetchAll();
    $best = null;
    $bestScore = 0;
    $qLow = strtolower($q);
    foreach ($rows as $row) {
        // Keyword matching
        $keywords = array_filter(array_map('trim', explode(',', $row['keywords'] ?? '')));
        $kwScore = 0;
        foreach ($keywords as $kw) {
            if (strlen($kw) > 2 && stripos($qLow, $kw) !== false)
                $kwScore += 15;
        }
        similar_text($qLow, strtolower($row['question']), $pct);
        $score = $kwScore + $pct;
        if ($score > $bestScore && $score > max(85, CACHE_SIMILARITY_THRESHOLD)) {
            $bestScore = $score;
            $best = $row;
        }
    }
    return $best;
}

function getBestFallback(string $q, PDO $db): ?array
{
    $rows = $db->query("SELECT * FROM faq_cache WHERE enabled=1 ORDER BY use_count DESC LIMIT 40")->fetchAll();
    if (!$rows)
        return null;
    $best = null;
    $bestScore = 0;
    foreach ($rows as $row) {
        similar_text(strtolower($q), strtolower($row['question']), $pct);
        if ($pct > $bestScore) {
            $bestScore = $pct;
            $best = $row;
        }
    }
    return $bestScore > 20 ? $best : null;
}

function storeFAQCache(string $q, string $r, PDO $db): void
{
    // Extract keywords: nouns & meaningful words
    $stopWords = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'i', 'my', 'me', 'we', 'you', 'your', 'our', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'can', 'could', 'should', 'shall', 'may', 'might', 'what', 'how', 'when', 'where', 'who', 'which', 'that', 'this', 'with', 'for', 'and', 'or', 'but', 'not', 'in', 'on', 'at', 'to', 'of', 'by', 'from', 'about', 'into', 'as'];
    $words = preg_split('/\W+/', strtolower($q));
    $kws = array_unique(array_filter($words, fn($w) => strlen($w) > 3 && !in_array($w, $stopWords)));
    $keywords = implode(',', array_slice($kws, 0, 12));
    // Check if very similar question already exists
    $stmt = $db->query("SELECT question FROM faq_cache WHERE enabled=1 ORDER BY created_at DESC LIMIT 10");
    $existing = $stmt ? $stmt->fetchAll() : [];
    foreach ($existing as $e) {
        similar_text(strtolower($q), strtolower($e['question'] ?? ''), $pct);
        if ($pct > 80)
            return; // Already cached
    }
    $db->prepare("INSERT IGNORE INTO faq_cache (question, response, keywords) VALUES (?, ?, ?)")
        ->execute([$q, $r, $keywords]);
}

function getDailyRemaining(PDO $db): int
{
    $row = $db->query("SELECT tokens_used FROM token_usage WHERE usage_date=CURDATE()")->fetch();
    $used = $row ? (int) $row['tokens_used'] : 0;
    return max(0, DAILY_TOKEN_BUDGET - $used);
}

function updateTokenUsage(int $tokens, PDO $db): void
{
    $db->prepare("INSERT INTO token_usage (usage_date, tokens_used, requests) VALUES (CURDATE(), ?, 1)
        ON DUPLICATE KEY UPDATE tokens_used=tokens_used+?, requests=requests+1")
       ->execute([$tokens, $tokens]);
}

function logActivity(PDO $db, string $action, string $details): void
{
    try {
        $db->prepare("INSERT INTO activity_log (action, details) VALUES (?, ?)")->execute([$action, $details]);
    } catch (PDOException $e) {
    }
}

function convertToGeminiFormat(array $messages): array
{
    $result = [];
    foreach ($messages as $m) {
        $role = ($m['role'] === 'assistant' || $m['role'] === 'model') ? 'model' : 'user';
        $content = is_string($m['content']) ? $m['content'] : '';
        if (!$content)
            continue;

        // Gemini strictly requires the first message to be from 'user'.
        if (empty($result) && $role === 'model') {
            continue;
        }

        // Merge consecutive same-role messages
        $last = end($result);
        if ($last && $last['role'] === $role) {
            $result[count($result) - 1]['parts'][0]['text'] .= "\n" . $content;
        } else {
            $result[] = ['role' => $role, 'parts' => [['text' => $content]]];
        }
    }
    return $result;
}

function getDemoResponse(string $q): string
{
    $q = strtolower(trim($q));

    // ── Who am I ───────────────────────────────────────────────────────────────
    if (preg_match('/who are you|what are you|your name|tell me about yourself|introduce yourself|kasaija ai/i', $q))
        return "I am Kasaija AI — the digital legal intake assistant for R. Kasaija & Partners Advocates, one of Uganda's most distinguished indigenous law firms.\n\nI can help you with:\n• General legal questions about Ugandan law\n• Information about our firm, services, and team\n• Booking a consultation with an advocate\n• Finding our office and contact details\n\nHow may I assist you today?";

    // ── Team size ──────────────────────────────────────────────────────────────
    if (preg_match('/how many (lawyer|advocate|partner|staff|attorney|people)/i', $q))
        return "R. Kasaija & Partners Advocates has a team of 7 qualified advocates:\n\n• 3 Partners: Robert Kasaija (Managing Partner), Sharon Murungi (Head of Litigation), Joseph Kwesiga\n• 4 Associates: Justin Joseph Kasaija, Christopher Baluku, Fred Asiimwe, Oscar Musiime\n\nClick the \"Team\" tab to read full profiles. Would you like me to recommend the right advocate for your matter?";

    // ── Greetings ──────────────────────────────────────────────────────────────
    if (preg_match('/^(hi|hello|hey|good\s+(morning|afternoon|evening|day)|howdy|greetings|salut|hola|welcome)\b/i', $q))
        return "Good day! Welcome to R. Kasaija & Partners Advocates. I am Kasaija AI, your legal intake assistant.\n\nI can help you with:\n• General legal questions about Ugandan law\n• Information about our services and team\n• Booking a consultation with an advocate\n• Finding our office or contact details\n\nHow may I assist you today?";

    // ── Location / address / directions ───────────────────────────────────────
    if (preg_match('/where|locat|address|find you|office|direction|how to get/i', $q))
        return "Our offices are at:\n📍 Plot 75 Kampala Road, E-Tower Building, 4th Floor, Suite D-06, Kampala, Uganda\n\nOffice hours: Monday–Friday, 8:00 AM – 5:00 PM\n\nContact:\n📞 +256 772 418 707\n📱 WhatsApp: +256 776 044 004\n✉️ kasaijaandpartners@gmail.com\n\nYou can also use the Contact tab on this website to message us directly.";

    // ── Office hours / when open ───────────────────────────────────────────────
    if (preg_match('/hour|open|clos|time|when\b|available|days/i', $q) && !preg_match('/consult|book|appoint|meet/i', $q))
        return "We are open Monday to Friday, 8:00 AM – 5:00 PM East Africa Time.\n\nWe are closed on weekends and public holidays.\n\nFor urgent matters outside office hours, WhatsApp us on +256 776 044 004 — an advocate will respond as soon as possible.";

    // ── Contact / phone / email / WhatsApp ────────────────────────────────────
    if (preg_match('/contact|phone|call|email|whatsapp|reach|number/i', $q) && !preg_match('/book|appoint/i', $q))
        return "You can reach us through:\n📞 Phone: +256 772 418 707\n📱 WhatsApp: +256 776 044 004\n✉️ Email: kasaijaandpartners@gmail.com\n📍 Plot 75 Kampala Road, E-Tower Building, 4th Floor, Kampala\n\nOr use the Contact tab on this website to send a message. We respond within one business day.";

    // ── Booking / appointment / consultation ──────────────────────────────────
    if (preg_match('/book|appoint|consult|schedul|meet|see a lawyer|see an advocate/i', $q))
        return "Booking a consultation is simple!\n\n✅ Fastest way: Click the \"Book\" tab in the top navigation menu and fill in your details.\n\n📞 Or call directly: +256 772 418 707\n📱 WhatsApp: +256 776 044 004\n\nTo help me prepare your booking, may I have:\n1. Your full name\n2. Your phone number\n3. A brief description of your legal matter\n4. Your preferred date and time\n\nWe will confirm within one business day.";

    // ── All services / practice areas ─────────────────────────────────────────
    if (preg_match('/service|practice|speciali|area|what do you|offer|help with|deal with|handle/i', $q) && !preg_match('/land|family|corpor|debt|criminal|employ|tax|ngO|ip|trade/i', $q))
        return "R. Kasaija & Partners Advocates is a full-service indigenous firm offering expert legal services across 12 practice areas:\n\n1. Banking & Finance\n2. Corporate & Commercial\n3. Debt Recovery\n4. Land & Conveyancing\n5. Intellectual Property\n6. Family & Probate\n7. Employment & Labour\n8. Criminal Law\n9. Arbitration & ADR\n10. Revenue Law & Taxation\n11. Non-Profit & NGO\n12. Governance & Compliance\n\nWe are also Advocates, Commissioners for Oaths, Notary Public, Trademark & Patent Agents, Company Secretaries, Receivers, Liquidators, and Debt Collectors.\n\nClick \"Practice\" in the menu to learn more, or describe your issue and I'll connect you with the right advocate.";

    // ── Team / advocates / lawyers ────────────────────────────────────────────
    if (preg_match('/team|advocate|lawyer|partner|who are|staff|member|attorney/i', $q))
        return "Our team of 7 advocates:\n\n👨‍⚖️ Robert Kasaija — Managing Partner\n20+ years experience. Commissioner for Oaths, Notary Public, ICAMEK arbitrator. Handles Banking, Corporate Finance, Criminal Law, Arbitration & Tax.\n\n👩‍⚖️ Sharon Murungi — Partner & Head of Litigation\nFormer HIJRA/UNHCR protection manager. Handles Debt Recovery, Family, Employment, Intellectual Property.\n\n👨‍⚖️ Joseph Kwesiga — Partner\nLegal Officer & Head of Prosecutions at National Forestry Authority. Handles Land, Conveyancing, Environment, NGOs.\n\n👨‍⚖️ Justin Joseph Kasaija — Associate & Head of Administration\nBoard member of Sage Buyers, Black Market Entertainment, Inveseed & Koisan Investments. Handles Corporate Governance & Compliance.\n\n👨‍⚖️ Christopher Baluku — Associate (Submissions & Litigation Research)\n👨‍⚖️ Fred Asiimwe — Associate (Civil Litigation & Research)\n👨‍⚖️ Oscar Musiime — Associate (Company Formation & Startup Advisory)\n\nClick the \"Team\" tab to read full bios and credentials.";

    // ── LAND LAW ──────────────────────────────────────────────────────────────
    if (preg_match('/kibanja|mailo|land|propert|title|caveat|mortgage|convey|transfer|evict|plot|tenure|freehold|leasehold|lc1|lc 1/i', $q)) {
        if (preg_match('/what is kibanja|kibanja rights|define kibanja/i', $q))
            return "A kibanja is a form of customary land interest recognised in Uganda, particularly on mailo land. It gives the tenant (kibanja holder) the right to occupy and use the land, even though the legal owner (mailo landlord) holds the formal title.\n\nKibanja holders have legal protections and cannot be evicted without following due process — including a court order.\n\nOur Partner, Mr. Joseph Kwesiga, specialises in land law. Click \"Book\" to arrange a consultation, or call +256 772 418 707.\n\n📌 This is general information only. Consult our advocates for advice specific to your situation.";
        if (preg_match('/what is mailo|mailo land/i', $q))
            return "Mailo land is a unique Ugandan land tenure system originating from the 1900 Buganda Agreement. It grants the holder absolute ownership (freehold-like), but occupants (kibanja holders) also have recognised rights on the same land.\n\nMailo land can be bought, sold, or mortgaged, but transactions must follow the Land Act and Registration of Titles Act.\n\nMr. Joseph Kwesiga handles all land matters at our firm. For advice on your specific situation, click \"Book\" or call +256 772 418 707.\n\n📌 This is general information only. Consult our advocates for specific guidance.";
        if (preg_match('/caveat|how.*caveat/i', $q))
            return "A caveat is a legal notice lodged against a land title to warn potential buyers or mortgagees that a third party has a claim or interest in the land. It prevents the title from being transferred or mortgaged without the caveator's knowledge.\n\nCaveats are registered at the Uganda Land Registry under the Registration of Titles Act.\n\nFor help lodging or lifting a caveat, contact our land specialist Mr. Joseph Kwesiga — click \"Book\" or call +256 772 418 707.\n\n📌 General information only. Consult our advocates for specific advice.";
        if (preg_match('/evict|eviction/i', $q))
            return "Under Ugandan law, a landlord cannot evict a tenant without a valid court order. The process requires issuing proper notice and obtaining an eviction order from a magistrate court. Forceful eviction without a court order is illegal.\n\nIf you are facing eviction or need to evict a tenant, our Partner Mr. Joseph Kwesiga can assist. Click \"Book\" or call +256 772 418 707 for urgent matters.\n\n📌 General information only. Please consult one of our advocates for advice on your specific case.";
        return "Land and property matters — including title searches, conveyancing, mailo land, kibanja rights, caveats, mortgage transactions, and eviction proceedings — are handled by our Partner, Mr. Joseph Kwesiga, who has deep expertise in Ugandan land law.\n\nClick \"Book\" to schedule a consultation, or call +256 772 418 707.\n\nMay I have your name and contact details to follow up?";
    }

    // ── FAMILY & PROBATE ──────────────────────────────────────────────────────
    if (preg_match('/divorce|family|child|custody|maintenance|adoption|guardian|probate|succession|will\b|inherit|matrimon|separat|marriage/i', $q)) {
        if (preg_match('/divorce process|how.*divorce|steps.*divorce/i', $q))
            return "In Uganda, divorce is governed by the Divorce Act (Cap. 249). The process involves:\n\n1. Filing a divorce petition in the High Court\n2. Serving the petition on your spouse\n3. Hearing and presenting evidence (grounds: adultery, cruelty, desertion for 2+ years, etc.)\n4. Court grants a decree nisi (provisional)\n5. After 3 months, apply for a decree absolute (final)\n\nThe process can take 1–3 years depending on whether it is contested.\n\nMs. Sharon Murungi handles all family matters. Click \"Book\" or call +256 772 418 707.\n\n📌 General information only. Consult our advocates for advice specific to your situation.";
        if (preg_match('/will\b|write.*will|how.*will/i', $q))
            return "In Uganda, a valid will must:\n• Be in writing\n• Be signed by the testator (the person making the will)\n• Be witnessed by at least 2 independent witnesses (not beneficiaries)\n\nOnce you pass away, the will is executed through probate — a court process that validates the will and authorises the executor to distribute the estate.\n\nMs. Sharon Murungi handles wills and succession matters. Click \"Book\" or call +256 772 418 707.\n\n📌 General information only. Consult our advocates for specific guidance.";
        if (preg_match('/custody|child.*right/i', $q))
            return "Under the Children Act of Uganda, the welfare of the child is the paramount consideration in custody decisions. Courts consider the child's age, health, emotional ties, and the capacity of each parent to provide.\n\nGenerally, young children are placed with their mother, but each case is decided on its own facts.\n\nMs. Sharon Murungi handles all custody and family law matters. Click \"Book\" for a confidential consultation or call +256 772 418 707.\n\n📌 General information only. Consult our advocates for specific advice.";
        return "Family and probate matters — divorce, child custody, maintenance, adoption, guardianship, wills, and succession — are handled sensitively by our Head of Litigation, Ms. Sharon Murungi.\n\nClick \"Book\" for a confidential consultation, or call +256 772 418 707.";
    }

    // ── CORPORATE / BUSINESS ──────────────────────────────────────────────────
    if (preg_match('/company|business|corpor|invest|ursb|registr|startup|formation|merger|acqui|joint venture|sharehol/i', $q)) {
        if (preg_match('/register.*company|how.*start.*company|form.*company|company registration/i', $q))
            return "To register a company in Uganda through URSB (Uganda Registration Services Bureau):\n\n1. Choose a company name and check availability on ursb.go.ug\n2. Prepare the Memorandum & Articles of Association\n3. Complete the company registration forms (Form 1, 3, 7)\n4. Pay the prescribed registration fees\n5. Receive your Certificate of Incorporation\n\nFor a private limited company, you need at least 1 director and 1 shareholder. The process typically takes 3–5 business days online.\n\nOur Associate Mr. Justin Joseph Kasaija and Mr. Oscar Musiime handle company formation. Click \"Book\" or call +256 772 418 707.\n\n📌 General information only. Consult our advocates for specific guidance.";
        return "Corporate and commercial matters — company formation, URSB registration, mergers and acquisitions, joint ventures, foreign investment, and governance — are handled by Mr. Justin Joseph Kasaija and Mr. Oscar Musiime.\n\nClick \"Book\" or call +256 772 418 707 for immediate assistance.";
    }

    // ── DEBT RECOVERY ─────────────────────────────────────────────────────────
    if (preg_match('/debt|recover|owe|loan|collect|unpaid|creditor|default|judgment/i', $q))
        return "Debt recovery in Uganda typically involves:\n\n1. Sending a formal demand letter\n2. Negotiation / mediation\n3. Filing a civil suit in the appropriate court\n4. Obtaining a court judgment\n5. Enforcing the judgment (attachment, garnishment)\n\nOur Head of Litigation, Ms. Sharon Murungi, has a proven track record — the firm has recovered substantial sums for clients including H.K Financial Services Limited, Save and Invest Limited, S.N Financial Services Limited, Tin Link Financial Solutions, Agwotwe Financial Services, and Twezimbe Investment Group.\n\nClick \"Book\" or call +256 772 418 707 to discuss your case.\n\n📌 General information only. Consult our advocates for specific advice.";

    // ── CRIMINAL LAW ──────────────────────────────────────────────────────────
    if (preg_match('/criminal|arrest|police|court|charg|bail|prison|jail|murder|robbery|theft|fraud|detain|suspect|accused/i', $q)) {
        if (preg_match('/arrest|right.*arrest|arrested/i', $q))
            return "If you are arrested in Uganda, you have the following rights:\n\n✅ Right to be informed of the reason for your arrest\n✅ Right to remain silent (anything you say can be used against you)\n✅ Right to consult a lawyer immediately\n✅ Right to be brought before a court within 48 hours (or 72 hours on a weekend)\n✅ Right to apply for bail\n\n🚨 If you or someone you know has been arrested, call us immediately: +256 772 418 707. Our Managing Partner Mr. Robert Kasaija handles criminal matters personally.\n\n📌 General information only. Call us immediately for urgent legal assistance.";
        if (preg_match('/bail|how.*bail/i', $q))
            return "Bail in Uganda is the temporary release of an accused person while awaiting trial, upon providing security (money or sureties) as a guarantee of appearance in court.\n\nFor most offences, bail can be granted by a magistrate court. For capital offences (e.g., murder), only the High Court can grant bail.\n\nIf you need bail, call us immediately on +256 772 418 707 — Mr. Robert Kasaija handles criminal matters and can apply for bail on your behalf.\n\n📌 General information only. For urgent help, call immediately.";
        return "Criminal defence matters are handled personally by our Managing Partner, Mr. Robert Kasaija, who has an impressive record in criminal proceedings across Uganda.\n\n🚨 If this is urgent — call us immediately: +256 772 418 707 or WhatsApp +256 776 044 004.";
    }

    // ── EMPLOYMENT / LABOUR ───────────────────────────────────────────────────
    if (preg_match('/employ|labour|fired|dismiss|salary|wage|contract|workplace|redund|terminat|unfair|leave|maternity|sick/i', $q)) {
        if (preg_match('/unfair.*dismiss|wrongful.*terminat|fired unfairly/i', $q))
            return "Under the Employment Act 2006, an employee can only be dismissed fairly for:\n• Misconduct\n• Redundancy\n• Incapacity (illness/performance)\n• Legal restrictions preventing continued employment\n\nIf you were dismissed without a valid reason or without proper notice, you may have a claim for wrongful dismissal and can seek compensation, reinstatement, or both.\n\nMs. Sharon Murungi handles employment disputes. Click \"Book\" or call +256 772 418 707.\n\n📌 General information only. Consult our advocates for specific advice on your case.";
        return "Employment and labour matters — unfair dismissal, employment contracts, salary disputes, redundancies, and workplace rights — are handled by Ms. Sharon Murungi.\n\nClick \"Book\" to schedule a consultation or call +256 772 418 707.\n\n📌 General information only. Consult our advocates for specific advice.";
    }

    // ── TAX / REVENUE ─────────────────────────────────────────────────────────
    if (preg_match('/tax|ura|revenue|fiscal|vat|income tax|corporate tax|withhold/i', $q))
        return "Revenue law and taxation matters — including corporate tax advisory, URA compliance, VAT, income tax, tax planning, and tax disputes — are handled by our Managing Partner, Mr. Robert Kasaija.\n\nUganda's major taxes include:\n• Corporate Income Tax (30%)\n• Value Added Tax (18%)\n• PAYE (Pay As You Earn)\n• Withholding Tax\n• Local Service Tax\n\nFor tax advisory or URA dispute resolution, click \"Book\" or call +256 772 418 707.\n\n📌 General information only. Consult our advocates for specific tax advice.";

    // ── INTELLECTUAL PROPERTY ─────────────────────────────────────────────────
    if (preg_match('/trademark|patent|copyright|intellectual|brand|logo|ip\b|registr.*brand/i', $q)) {
        if (preg_match('/trademark|register.*brand|protect.*brand/i', $q))
            return "In Uganda, trademarks are registered through URSB (Uganda Registration Services Bureau) under the Trade Marks Act. The process:\n\n1. Conduct a trademark search on ursb.go.ug\n2. File a trademark application with the logo/name and class of goods/services\n3. Pay the prescribed fee\n4. Application examined and published in the Uganda Gazette\n5. If no opposition within 60 days, certificate issued\n\nRegistration typically takes 12–18 months.\n\nMs. Sharon Murungi handles all IP matters. Click \"Book\" or call +256 772 418 707.\n\n📌 General information only. Consult our advocates for specific guidance.";
        return "Intellectual property matters — trademark registration, patent applications, copyright enforcement, brand protection, and unfair competition — are handled by Ms. Sharon Murungi. Our firm notably handled Uganda's first unfair competition and predatory pricing case.\n\nClick \"Book\" or call +256 772 418 707.\n\n📌 General information only. Consult our advocates for specific advice.";
    }

    // ── NGO / NON-PROFIT ──────────────────────────────────────────────────────
    if (preg_match('/ngo|non.?profit|nonprofit|charity|organisation|foundation|civil society/i', $q))
        return "Non-profit and NGO legal work — formation, registration with NGO Bureau, governance, compliance, and financing — is handled by our Partner, Mr. Joseph Kwesiga. We also provide pro-bono services to the Uganda Christian Lawyers Fraternity and Uganda Law Society.\n\nClick \"Book\" or call +256 772 418 707.\n\n📌 General information only. Consult our advocates for specific guidance.";

    // ── ARBITRATION / ADR ─────────────────────────────────────────────────────
    if (preg_match('/arbitrat|adr|mediati|negotiat|dispute.*resolut|alternative/i', $q))
        return "Arbitration and Alternative Dispute Resolution (ADR) — including commercial arbitration, mediation, and negotiation — are led by our Managing Partner, Mr. Robert Kasaija, who is a certified ICAMEK arbitrator.\n\nADR is often faster and more cost-effective than court litigation for commercial disputes.\n\nClick \"Book\" or call +256 772 418 707 to discuss your dispute.\n\n📌 General information only. Consult our advocates for specific advice.";

    // ── ABOUT / FIRM ──────────────────────────────────────────────────────────
    if (preg_match('/about|histor|who are you|firm|kasaija|partners|how long|founded|established|background/i', $q))
        return "R. Kasaija & Partners Advocates is one of Uganda's most distinguished indigenous law firms, based in Kampala.\n\nWe are a full-service practice of Advocates, Solicitors, Commissioners for Oaths, Notary Public, Trademark & Patent Agents, Company Secretaries, Receivers, Liquidators, and Debt Collectors.\n\nLed by Managing Partner Robert Kasaija — with 20+ years of legal experience and ICAMEK arbitration credentials — our team of 7 advocates (3 Partners + 4 Associates) serves major national and international companies across consumer goods, real estate, energy, banking, and project financing, as well as individual clients.\n\nLanguages spoken: English, Runyankore, and Luganda.\nMemberships: Uganda Law Society (ULS), East Africa Law Society (EALS), ICAMEK.\n\nClick \"About\" in the menu to learn more.";

    // ── FEES / COST ───────────────────────────────────────────────────────────
    if (preg_match('/cost|fee|price|charg|pay|afford|how much|rate/i', $q))
        return "Our fees depend on the nature and complexity of your matter. We provide transparent fee estimates during the initial consultation before any work begins.\n\nTo get a fee estimate, the fastest way is to:\n1. Click \"Book\" in the top menu to schedule a consultation\n2. Or call +256 772 418 707 to speak with our office\n\nWe are committed to providing excellent value and transparent pricing.";

    // ── URGENT / EMERGENCY ────────────────────────────────────────────────────
    if (preg_match('/urgent|emergency|asap|immediately|help.*now|right now|crisis|threat/i', $q))
        return "🚨 For urgent legal matters:\n\n📞 Call NOW: +256 772 418 707\n📱 WhatsApp: +256 776 044 004\n\nOur team handles urgent matters as a priority — including criminal arrests, court injunctions, eviction notices, and urgent commercial disputes.\n\nDo not delay — call immediately.";

    // ── What is law / general legal concepts ──────────────────────────────────
    if (preg_match('/what is (law|legal|a contract|an affidavit|a deed|a petition|an injunction|a court|a summons|a warrant)/i', $q)) {
        $term = preg_replace('/.*what is (a |an )?/i', '', $q);
        $term = rtrim($term, '?. ');
        $map = [
            'contract' => "A contract is a legally binding agreement between two or more parties. For a contract to be valid in Uganda it must have: an offer, acceptance, consideration (something of value exchanged), and intention to create legal relations. Contracts can be written or verbal, but written contracts are easier to enforce.",
            'affidavit' => "An affidavit is a written statement confirmed by oath or affirmation, used as evidence in court. In Uganda, affidavits must be sworn before a Commissioner for Oaths, an Advocate, or a Magistrate.",
            'injunction' => "An injunction is a court order requiring a person to do something or stop doing something. For example, a court may grant an injunction to stop someone from selling disputed property during a land case.",
            'summons' => "A court summons is an official notice requiring you to appear in court on a specified date. If you receive a summons, you should consult a lawyer immediately. Click 'Book' or call +256 772 418 707.",
            'warrant' => "A warrant is a legal document authorising the police or court officials to carry out a specific act — such as an arrest warrant (authorising arrest) or a search warrant (authorising a search of premises).",
        ];
        foreach ($map as $key => $answer) {
            if (strpos($term, $key) !== false)
                return $answer . "\n\n📌 General information only. Consult our advocates for specific advice.";
        }
    }

    // ── Banking / finance ─────────────────────────────────────────────────────
    if (preg_match('/bank|financ|loan.*bank|credit|lend/i', $q))
        return "Banking & Finance matters — including structured finance, syndicated lending, asset finance, project finance, guarantees, derivatives, debentures, and general banking — are handled by our Managing Partner, Robert Kasaija.\n\nClick \"Book\" or call +256 772 418 707 to discuss your matter.\n\n📌 General information only.";

    // ── Languages ─────────────────────────────────────────────────────────────
    if (preg_match('/language|speak|luganda|runyankore|english/i', $q))
        return "Our advocates speak:\n• English\n• Runyankore\n• Luganda\n\nWe are happy to serve you in your preferred language. Call us on +256 772 418 707 or click \"Book\" to schedule a consultation.";

    // ── Commissioner for Oaths / Notary ───────────────────────────────────────
    if (preg_match('/commissioner.*oath|notary|sworn|affidavit.*witness|witness.*affidavit/i', $q))
        return "Our Managing Partner, Robert Kasaija, is a Commissioner for Oaths and Notary Public — he can witness and certify sworn affidavits, statutory declarations, and other legal documents.\n\nVisit our offices at Plot 75 Kampala Road, E-Tower Building, 4th Floor, Suite D-06, Kampala.\n\nOffice hours: Monday–Friday, 8:00 AM – 5:00 PM. Call +256 772 418 707 to confirm availability.";

    // ── Default / general ─────────────────────────────────────────────────────
    return "Good day! I am Kasaija AI, the digital intake assistant for R. Kasaija & Partners Advocates.\n\nI can answer questions about:\n• Our services (12 practice areas)\n• Our team of 7 advocates\n• Office location and hours\n• How to book a consultation\n• General Ugandan law topics (land, family, criminal, employment, company, etc.)\n\nPlease describe your question or legal concern and I will assist you right away.";
}
