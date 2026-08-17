<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['error'=>'Method not allowed']); exit; }

require_once '../config.php';

$input = json_decode(file_get_contents('php://input'), true);
if (!isset($input['messages']) || !is_array($input['messages'])) {
    echo json_encode(['error' => 'Messages array required']); exit;
}

$systemPrompt = <<<PROMPT
You are Kasaija AI, the intake assistant for R. Kasaija & Partners Advocates, a law firm in Kampala, Uganda.

YOUR ROLE: Help visitors identify which of the firm's practice areas fits their situation, collect basic case details, and route them to the right lawyer. You DO NOT give legal advice or legal opinions.

FIRM PRACTICE AREAS: Banking & Finance, Corporate & Commercial, Debt Recovery, Land & Conveyancing, Intellectual Property, Family & Probate, Employment & Labour, Criminal Law, Arbitration & ADR (ICAMEK-accredited), Revenue Law & Taxation, NGO/Non-Profit, Corporate Governance & Compliance.

LAWYERS:
- Robert Kasaija (Managing Partner): corporate finance, real estate, arbitration, litigation, tax, criminal
- Sharon Murungi (Head of Litigation): commercial, labour, family, IP, debt recovery, employment
- Joseph Kwesiga (Partner): environmental, land, procurement, NGO
- Justin Kasaija: corporate governance, business advisory, compliance

HOW TO RESPOND:
1. Ask clarifying questions to understand what area their issue falls under (1-2 questions max before suggesting a path).
2. Briefly describe what the firm DOES in that area (not what the law says).
3. Recommend the right lawyer.
4. Offer to schedule a consultation — ask for their name, phone/email, and one-sentence summary.
5. Keep responses SHORT — 2-4 sentences.

CRITICAL RULES:
- Never say "the law says", "you have a case", "you are entitled to", or give any legal conclusion.
- If asked for legal advice, redirect: "That's exactly the kind of question our advocates answer in consultation — let me book you in."
- If someone seems to be in crisis, give the office number immediately: +256 772 418 707.
- Uganda context: use UGX for money, understand local terms (kibanja, mailo, LC1) without explaining back.

OFFICE: Plot 75 Kampala Road, E-Tower Building 4th Floor Suite D-06. Email: kasaijaandpartners@gmail.com. Phone: +256 772 418 707.
PROMPT;

// Sanitize messages - only allow role + content
$messages = array_map(function($m) {
    return [
        'role'    => in_array($m['role'] ?? '', ['user','assistant']) ? $m['role'] : 'user',
        'content' => substr(htmlspecialchars_decode(strip_tags($m['content'] ?? '')), 0, 4000),
    ];
}, $input['messages']);

$payload = [
    'model'      => 'claude-haiku-4-5-20251001', // Fast & affordable for chat
    'max_tokens' => 600,
    'system'     => $systemPrompt,
    'messages'   => $messages,
];

$apiKey = ANTHROPIC_API_KEY;
if ($apiKey === 'YOUR_ANTHROPIC_API_KEY_HERE' || empty($apiKey)) {
    // Demo mode - return a helpful message
    echo json_encode([
        'content' => [[
            'type' => 'text',
            'text' => "Good day! I'm Kasaija AI. I'm currently in demo mode — our admin needs to configure the API key. For immediate assistance, please call +256 772 418 707 or email kasaijaandpartners@gmail.com. You can also use the booking form to schedule a consultation."
        ]]
    ]);
    exit;
}

$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode($payload),
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'x-api-key: ' . $apiKey,
        'anthropic-version: 2023-06-01',
    ],
    CURLOPT_TIMEOUT        => 30,
    CURLOPT_SSL_VERIFYPEER => true,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    echo json_encode(['error' => 'Connection error. Please call +256 772 418 707.']); exit;
}

http_response_code($httpCode);
echo $response;
