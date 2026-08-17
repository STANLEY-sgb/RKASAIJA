<?php
// Auto-init DB on first load — creates all required tables if missing
@include_once 'config.php';
if (function_exists('getDB')) {
  $db = getDB();
  if ($db) {
    try {
      $db->query("SELECT 1 FROM appointments LIMIT 1");
    } catch (PDOException $e) {
      // Tables don't exist yet — create all of them silently
      $db->exec("CREATE TABLE IF NOT EXISTS `appointments` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,`client_name` VARCHAR(255) NOT NULL,
                `client_email` VARCHAR(255) NOT NULL,`client_phone` VARCHAR(60),
                `practice_area` VARCHAR(120),`preferred_lawyer` VARCHAR(120),
                `preferred_date` DATE,`preferred_time` VARCHAR(20),`message` TEXT,
                `status` ENUM('pending','confirmed','cancelled','completed') DEFAULT 'pending',
                `is_read` TINYINT(1) DEFAULT 0,`admin_notes` TEXT,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
      $db->exec("CREATE TABLE IF NOT EXISTS `contact_submissions` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,`name` VARCHAR(255) NOT NULL,
                `email` VARCHAR(255) NOT NULL,`phone` VARCHAR(60),
                `practice_area` VARCHAR(120),`message` TEXT NOT NULL,
                `is_read` TINYINT(1) DEFAULT 0,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
      $db->exec("CREATE TABLE IF NOT EXISTS `activity_log` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,`action` VARCHAR(255) NOT NULL,
                `details` TEXT,`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
      $db->exec("CREATE TABLE IF NOT EXISTS `faq_cache` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,`question` TEXT NOT NULL,
                `response` TEXT NOT NULL,`keywords` VARCHAR(500),
                `use_count` INT DEFAULT 1,`enabled` TINYINT DEFAULT 1,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                `last_used` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FULLTEXT(`keywords`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
      $db->exec("CREATE TABLE IF NOT EXISTS `token_usage` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,`usage_date` DATE NOT NULL UNIQUE,
                `tokens_used` INT DEFAULT 0,`requests` INT DEFAULT 0,
                `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    }
  }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <meta name="description"
    content="R. Kasaija &amp; Partners Advocates — Uganda's leading indigenous law firm in Kampala. Banking, Corporate, Land, Litigation, ADR, and more." />
  <meta name="keywords"
    content="Uganda law firm, Kampala advocates, corporate law Uganda, land conveyancing Kampala, R Kasaija Partners" />
  <meta property="og:title" content="R. Kasaija & Partners Advocates" />
  <meta property="og:description"
    content="An indigenous Ugandan firm serving multinationals, institutions, and individuals across East Africa." />
  <title>R. Kasaija &amp; Partners Advocates | Kampala, Uganda</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,700;1,9..144,400;1,9..144,500&family=Inter+Tight:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
    rel="stylesheet" />
  <style>
    /* ═══ RESET & VARIABLES ═══════════════════════════════════════════════════ */
    *,
    *::before,
    *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :root {
      --cream: #FBF7EF;
      --dark: #2A1D10;
      --darker: #1F1308;
      --gold: #B8956A;
      --gold-mid: #8B6F47;
      --light: #F6EDDA;
      --light2: #E8D8B4;
      --border: rgba(139, 111, 71, 0.2);
      --shadow: rgba(61, 40, 23, 0.15);
      --ff-serif: 'Fraunces', serif;
      --ff-sans: 'Inter Tight', system-ui, sans-serif;
      --ff-mono: 'JetBrains Mono', monospace;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      font-family: var(--ff-sans);
      background: var(--cream);
      color: var(--dark);
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    img {
      max-width: 100%;
      display: block;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    button {
      font-family: inherit;
      cursor: pointer;
      border: none;
      background: none;
    }

    input,
    select,
    textarea {
      font-family: inherit;
    }

    /* ═══ UTILITIES ═══════════════════════════════════════════════════════════ */
    .serif {
      font-family: var(--ff-serif);
      font-optical-sizing: auto;
    }

    .mono {
      font-family: var(--ff-mono);
    }

    .accent {
      font-style: italic;
      color: var(--gold-mid);
      font-weight: 400;
    }

    .accent-light {
      color: var(--gold);
    }

    .label {
      font-family: var(--ff-mono);
      font-size: 10px;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: var(--gold-mid);
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
    }

    @media(min-width:1024px) {
      .container {
        padding: 0 48px;
      }
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
    }

    /* ═══ ANIMATIONS ══════════════════════════════════════════════════════════ */
    @keyframes fadeUp {
      from {
        opacity: 0;
        transform: translateY(28px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }

    @keyframes letterUp {
      from {
        opacity: 0;
        transform: translateY(110%);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes marquee {
      from {
        transform: translateX(0);
      }

      to {
        transform: translateX(-50%);
      }
    }

    @keyframes dotBounce {

      0%,
      60%,
      100% {
        transform: translateY(0);
        opacity: .4;
      }

      30% {
        transform: translateY(-6px);
        opacity: 1;
      }
    }

    @keyframes ringPulse {
      0% {
        transform: scale(1);
        opacity: .6;
      }

      100% {
        transform: scale(1.9);
        opacity: 0;
      }
    }

    @keyframes scrollLine {
      0% {
        transform: translateY(-100%);
      }

      100% {
        transform: translateY(200%);
      }
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(30px);
      }

      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes notifPop {
      0% {
        transform: scale(0);
      }

      70% {
        transform: scale(1.2);
      }

      100% {
        transform: scale(1);
      }
    }

    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }

      100% {
        background-position: 200% 0;
      }
    }

    .fade-up {
      animation: fadeUp .8s cubic-bezier(.22, 1, .36, 1) both;
    }

    .fade-in {
      animation: fadeIn .6s ease both;
    }

    .reveal {
      opacity: 0;
      transform: translateY(36px);
      transition: opacity .9s cubic-bezier(.22, 1, .36, 1), transform .9s cubic-bezier(.22, 1, .36, 1);
    }

    .reveal.in {
      opacity: 1;
      transform: translateY(0);
    }

    .reveal.d1 {
      transition-delay: .1s;
    }

    .reveal.d2 {
      transition-delay: .2s;
    }

    .reveal.d3 {
      transition-delay: .3s;
    }

    /* ═══ CUSTOM CURSOR (desktop) ══════════════════════════════════════════════ */
    .cursor {
      position: fixed;
      top: 0;
      left: 0;
      width: 10px;
      height: 10px;
      background: var(--dark);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transition: width .3s, height .3s, margin .3s, background .3s;
      mix-blend-mode: difference;
    }

    .cursor.hover {
      width: 44px;
      height: 44px;
      background: var(--gold);
      margin: -17px 0 0 -17px;
    }

    @media(max-width:1023px) {
      .cursor {
        display: none;
      }
    }

    /* ═══ NAVIGATION ══════════════════════════════════════════════════════════ */
    #navbar {
      position: sticky;
      top: 0;
      z-index: 400;
      background: rgba(251, 247, 239, .88);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border-bottom: 1px solid var(--border);
    }

    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 0;
    }

    .nav-logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .nav-logo-icon {
      width: 44px;
      height: 44px;
      background: var(--dark);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
    }

    .nav-logo-icon img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }

    .nav-logo-text {
      line-height: 1;
    }

    .nav-logo-text .firm-name {
      font-family: var(--ff-serif);
      font-size: 16px;
      letter-spacing: -.02em;
      color: var(--dark);
    }

    .nav-logo-text .firm-sub {
      font-family: var(--ff-mono);
      font-size: 9px;
      letter-spacing: .24em;
      text-transform: uppercase;
      opacity: .5;
      margin-top: 4px;
    }

    .nav-links {
      display: none;
      align-items: center;
      gap: 36px;
    }

    @media(min-width:1024px) {
      .nav-links {
        display: flex;
      }
    }

    .nav-link {
      font-size: 13px;
      opacity: .6;
      transition: opacity .3s;
      position: relative;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--dark);
    }

    .nav-link::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -3px;
      width: 0;
      height: 1px;
      background: var(--dark);
      transition: width .4s cubic-bezier(.22, 1, .36, 1);
    }

    .nav-link:hover,
    .nav-link.active {
      opacity: 1;
    }

    .nav-link.active::after,
    .nav-link:hover::after {
      width: 100%;
    }

    .nav-ai-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 9px 18px 9px 12px;
      background: var(--dark);
      color: var(--cream);
      border-radius: 100px;
      font-size: 13px;
      transition: all .3s;
      overflow: hidden;
      position: relative;
    }

    .nav-ai-btn::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(120deg, transparent 30%, rgba(255, 255, 255, .12) 50%, transparent 70%);
      transform: translateX(-100%);
      transition: transform .6s;
    }

    .nav-ai-btn:hover::before {
      transform: translateX(100%);
    }

    .nav-ai-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px -8px rgba(42, 29, 16, .5);
    }

    .nav-ai-dot {
      width: 8px;
      height: 8px;
      background: #4ADE80;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .hamburger {
      width: 42px;
      height: 42px;
      background: var(--dark);
      color: var(--cream);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    @media(min-width:1024px) {
      .hamburger {
        display: none;
      }
    }

    .mobile-menu {
      display: none;
      padding: 16px 0 20px;
      border-top: 1px solid var(--border);
    }

    .mobile-menu.open {
      display: block;
    }

    .mobile-menu button {
      display: block;
      width: 100%;
      text-align: left;
      padding: 11px 0;
      font-family: var(--ff-serif);
      font-size: 18px;
      color: var(--dark);
    }

    .mobile-ai-btn {
      margin-top: 12px;
      width: 100%;
      padding: 14px;
      background: var(--dark);
      color: var(--cream);
      border-radius: 12px;
      font-size: 14px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    /* ═══ PAGE SECTIONS ═══════════════════════════════════════════════════════ */
    .page {
      display: none;
    }

    .page.active {
      display: block;
    }

    /* ═══ HERO CINEMATIC ══════════════════════════════════════════════════════ */
    #hero {
      background: #060301;
      position: relative;
      overflow: hidden;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    /* image background */
    .hero-image {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center top;
      z-index: 0;
      opacity: 0;
      pointer-events: none;
      will-change: transform, opacity;
      animation: fadeInBg 2s ease-out forwards, kenBurnsBg 30s ease-in-out 2s infinite alternate;
    }

    @keyframes fadeInBg {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes kenBurnsBg {
      0% {
        transform: scale(1) translate(0, 0);
      }
      100% {
        transform: scale(1.08) translate(-1%, 1%);
      }
    }

    /* dark + warm overlay on top of video */
    #hero::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      background: rgba(0, 0, 0, 0.2);
    }

    .hero-grain::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.6'/%3E%3C/svg%3E");
      opacity: .06;
      mix-blend-mode: screen;
      z-index: 2;
    }

    /* courtroom window light beams */
    @keyframes beamSway {

      0%,
      100% {
        transform: rotate(var(--sa)) skewX(-3deg);
        opacity: var(--mo);
      }

      50% {
        transform: rotate(var(--ea)) skewX(3deg);
        opacity: calc(var(--mo)*0.55);
      }
    }

    .court-beam {
      position: absolute;
      top: -5%;
      width: 120px;
      height: 145%;
      background: linear-gradient(180deg, rgba(184, 149, 106, .18) 0%, rgba(184, 149, 106, .06) 55%, transparent 100%);
      filter: blur(32px);
      pointer-events: none;
      z-index: 2;
      transform-origin: top center;
      animation: beamSway var(--bd, 12s) ease-in-out infinite var(--bdelay, 0s);
    }

    /* scales of justice */
    @keyframes scalesSway {

      0%,
      100% {
        transform: translateY(-50%) rotate(-2.5deg);
      }

      50% {
        transform: translateY(-50%) rotate(2.5deg);
      }
    }

    .hero-scales {
      position: absolute;
      right: 5%;
      top: 50%;
      transform: translateY(-50%);
      opacity: .055;
      pointer-events: none;
      z-index: 3;
      animation: scalesSway 10s ease-in-out infinite;
    }

    .hero-scales svg {
      width: min(600px, 55vw);
      height: auto;
    }

    /* floating Latin maxims */
    @keyframes maximFloat {
      from {
        transform: translateX(0);
      }

      to {
        transform: translateX(-50%);
      }
    }

    .maxim-band {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 38px;
      overflow: hidden;
      z-index: 4;
      pointer-events: none;
      border-top: 1px solid rgba(184, 149, 106, .08);
      background: rgba(0, 0, 0, .25);
      backdrop-filter: blur(4px);
    }

    .maxim-track {
      display: flex;
      white-space: nowrap;
      animation: maximFloat 90s linear infinite;
    }

    .maxim-item {
      font-family: var(--ff-mono);
      font-size: 9.5px;
      letter-spacing: .28em;
      text-transform: uppercase;
      color: rgba(184, 149, 106, .82);
      padding: 11px 56px;
      flex-shrink: 0;
    }

    .maxim-dot {
      color: rgba(184, 149, 106, .18);
      margin: 0 -32px;
    }

    /* golden dust particles */
    @keyframes pDrift {
      0% {
        transform: translate(0, 0) scale(1);
        opacity: var(--po);
      }

      33% {
        transform: translate(var(--px1), var(--py1)) scale(1.4);
        opacity: calc(var(--po)*1.9);
      }

      66% {
        transform: translate(var(--px2), var(--py2)) scale(.8);
        opacity: calc(var(--po)*.35);
      }

      100% {
        transform: translate(var(--px3), var(--py3)) scale(1);
        opacity: var(--po);
      }
    }

    .hero-particle {
      position: absolute;
      border-radius: 50%;
      width: var(--ps, 3px);
      height: var(--ps, 3px);
      background: rgba(184, 149, 106, var(--po, .4));
      pointer-events: none;
      z-index: 3;
      animation: pDrift var(--pd, 18s) ease-in-out infinite var(--pdelay, 0s);
    }

    /* hero inner text sits above all layers */
    .hero-inner {
      position: relative;
      z-index: 4;
      padding: 100px 0 80px;
    }

    @media(min-width:1024px) {
      .hero-inner {
        padding: 140px 0 100px;
      }
    }

    /* text colour overrides for dark background */
    #hero .label {
      color: rgba(184, 149, 106, .85) !important;
    }

    #hero .hero-tag-line {
      background: rgba(184, 149, 106, .45);
    }

    #hero .hero-headline {
      color: #F0E4CE;
    }

    #hero .hero-desc {
      color: rgba(240, 228, 206, .7);
    }

    #hero .stat-n {
      color: #F0E4CE;
    }

    #hero .stat-label {
      color: rgba(240, 228, 206, .7);
    }

    #hero .stat-sub {
      color: rgba(240, 228, 206, .4);
    }

    #hero .hero-stats {
      border-top-color: rgba(184, 149, 106, .18);
    }

    #hero .btn-primary {
      background: linear-gradient(135deg, #C9A67A, #8B6F47);
      color: #1A0F04;
      font-weight: 600;
    }

    #hero .btn-primary:hover {
      box-shadow: 0 14px 40px -8px rgba(184, 149, 106, .5);
    }

    #hero .btn-outline {
      border-color: rgba(240, 228, 206, .35);
      color: #F0E4CE;
    }

    #hero .btn-outline:hover {
      background: rgba(255, 255, 255, .07);
    }

    #hero .scroll-hint {
      opacity: .3;
    }

    #hero .scroll-track {
      background: rgba(240, 228, 206, .12);
    }

    #hero .scroll-bar {
      background: rgba(184, 149, 106, .8);
    }

    #hero .stat-group:hover .stat-n {
      color: var(--gold);
    }

    /* hero background scales (old element kept hidden) */
    .hero-bg-scale {
      display: none;
    }

    .hero-orb {
      display: none;
    }

    .hero-tag {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 36px;
    }

    .hero-tag-line {
      width: 48px;
      height: 1px;
      background: var(--gold-mid);
    }

    .hero-headline {
      font-family: var(--ff-serif);
      font-optical-sizing: auto;
      font-size: clamp(3rem, 9.5vw, 8.5rem);
      line-height: .93;
      letter-spacing: -.038em;
      color: var(--dark);
      overflow: hidden;
    }

    .headline-line {
      display: block;
      overflow: hidden;
      padding: .1em .02em;
      margin: -.1em -.02em;
    }

    .hl-word {
      display: inline-block;
    }

    .hl-char {
      display: inline-block;
      opacity: 0;
      animation: letterUp .8s cubic-bezier(.22, 1, .36, 1) both;
    }

    .hero-body {
      display: grid;
      gap: 32px;
      margin-top: 52px;
    }

    @media(min-width:1024px) {
      .hero-body {
        grid-template-columns: 1fr auto;
        align-items: flex-end;
      }
    }

    .hero-desc {
      font-size: clamp(15px, 1.4vw, 17px);
      line-height: 1.65;
      opacity: .75;
      max-width: 54ch;
    }

    .hero-ctas {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 28px;
      background: var(--dark);
      color: var(--cream);
      border-radius: 100px;
      font-size: 14px;
      font-weight: 500;
      position: relative;
      overflow: hidden;
      transition: all .4s cubic-bezier(.22, 1, .36, 1);
    }

    .btn-primary::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(120deg, transparent 30%, rgba(255, 255, 255, .12) 50%, transparent 70%);
      transform: translateX(-100%);
      transition: transform .6s;
    }

    .btn-primary:hover::before {
      transform: translateX(100%);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 36px -8px rgba(42, 29, 16, .55);
    }

    .btn-outline {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 13px 28px;
      border: 2px solid var(--dark);
      color: var(--dark);
      border-radius: 100px;
      font-size: 14px;
      font-weight: 500;
      transition: all .3s;
    }

    .btn-outline:hover {
      background: rgba(255, 255, 255, .5);
    }

    .hero-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 32px 40px;
      margin-top: 80px;
      padding-top: 40px;
      border-top: 1px solid rgba(139, 111, 71, .3);
    }

    @media(min-width:768px) {
      .hero-stats {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .stat-n {
      font-family: var(--ff-serif);
      font-size: clamp(2.5rem, 5vw, 4.5rem);
      letter-spacing: -.03em;
      color: var(--dark);
      transition: color .3s;
    }

    .stat-group:hover .stat-n {
      color: var(--gold-mid);
    }

    .stat-label {
      font-size: 13px;
      font-weight: 500;
      margin-top: 4px;
    }

    .stat-sub {
      font-family: var(--ff-mono);
      font-size: 10px;
      letter-spacing: .2em;
      text-transform: uppercase;
      opacity: .5;
      margin-top: 3px;
    }

    .scroll-hint {
      position: absolute;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      opacity: .4;
    }

    .scroll-hint-label {
      font-family: var(--ff-mono);
      font-size: 9px;
      letter-spacing: .3em;
      text-transform: uppercase;
    }

    .scroll-track {
      width: 1px;
      height: 32px;
      overflow: hidden;
      background: rgba(42, 29, 16, .15);
    }

    .scroll-bar {
      width: 100%;
      height: 50%;
      background: var(--dark);
      animation: scrollLine 2s ease-in-out infinite;
    }

    /* ═══ MARQUEE ══════════════════════════════════════════════════════════════ */
    .marquee-bar {
      background: var(--dark);
      color: var(--cream);
      padding: 18px 0;
      overflow: hidden;
    }

    .marquee-track {
      display: flex;
      white-space: nowrap;
      animation: marquee 45s linear infinite;
    }

    .marquee-item {
      display: inline-flex;
      align-items: center;
      gap: 24px;
      padding-right: 24px;
      flex-shrink: 0;
    }

    .marquee-text {
      font-family: var(--ff-serif);
      font-size: clamp(16px, 1.8vw, 22px);
      font-style: italic;
      color: var(--gold);
    }

    .marquee-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--gold);
      flex-shrink: 0;
    }

    /* ═══ SECTION VISUAL UPGRADES ═════════════════════════════════════════════ */
    .section {
      padding: 96px 0;
    }

    .section-light {
      background: linear-gradient(160deg, var(--light) 0%, var(--cream) 100%);
    }

    .section-dark {
      background: var(--darker);
      color: var(--cream);
    }

    /* premium section backgrounds */
    #page-about .section:first-child {
      background: linear-gradient(135deg, #F8F3E8 0%, #EFE3CC 100%);
    }

    #page-practice .section {
      background: linear-gradient(160deg, #FDFAF5 0%, #F5EDD8 100%);
    }

    #page-team .section {
      background: linear-gradient(160deg, #F8F3E8 0%, #F0E5CE 100%);
    }

    /* about section glance panel elevation */
    .about-glance {
      background: linear-gradient(145deg, var(--light) 0%, var(--light2) 100%);
      border-radius: 20px;
      padding: 32px;
      box-shadow: 0 8px 32px -12px rgba(61, 40, 23, .15);
      border: 1px solid rgba(139, 111, 71, .12);
    }

    /* elevated practice cards */
    .pcard {
      box-shadow: 0 2px 8px -4px rgba(42, 29, 16, .08);
    }

    .pcard:hover {
      box-shadow: 0 12px 32px -12px rgba(42, 29, 16, .18);
      z-index: 1;
      position: relative;
    }

    /* elevated team cards */
    .team-card {
      box-shadow: 0 4px 24px -8px rgba(42, 29, 16, .1);
    }

    .team-card:hover {
      box-shadow: 0 24px 56px -16px rgba(42, 29, 16, .22);
    }

    /* appointment + contact form wrap */
    .appt-form-wrap {
      box-shadow: 0 12px 48px -16px rgba(42, 29, 16, .18);
      border: 1px solid rgba(139, 111, 71, .1);
    }

    .section-head {
      margin-bottom: 72px;
    }

    .section-title {
      font-family: var(--ff-serif);
      font-size: clamp(2.2rem, 5.5vw, 5rem);
      line-height: .96;
      letter-spacing: -.025em;
    }

    .section-sub {
      font-size: 15px;
      opacity: .7;
      margin-top: 16px;
      max-width: 48ch;
      line-height: 1.6;
    }

    /* ═══ PRACTICE GRID ═══════════════════════════════════════════════════════ */
    .practice-grid {
      display: grid;
      gap: 1px;
      background: var(--border);
    }

    @media(min-width:640px) {
      .practice-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media(min-width:1024px) {
      .practice-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .pcard {
      background: var(--cream);
      padding: 32px 36px;
      text-align: left;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: background .4s, color .4s;
    }

    .pcard::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 3px;
      background: var(--gold-mid);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform .5s cubic-bezier(.22, 1, .36, 1);
    }

    .pcard:hover::after,
    .pcard.selected::after {
      transform: scaleX(1);
    }

    .pcard.selected {
      background: var(--dark);
      color: var(--cream);
    }

    .pcard-num {
      font-family: var(--ff-mono);
      font-size: 11px;
      letter-spacing: .2em;
      opacity: .4;
      margin-bottom: 28px;
    }

    .pcard-name {
      font-family: var(--ff-serif);
      font-size: 22px;
      letter-spacing: -.01em;
      margin-bottom: 12px;
      line-height: 1.15;
    }

    .pcard-desc {
      font-size: 13px;
      opacity: .65;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .pcard-foot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid var(--border);
      font-family: var(--ff-mono);
      font-size: 10px;
      letter-spacing: .2em;
      text-transform: uppercase;
      opacity: .5;
    }

    .pcard.selected .pcard-foot {
      border-color: rgba(251, 247, 239, .15);
    }

    .pcard-arrow {
      position: absolute;
      top: 28px;
      right: 28px;
      opacity: .4;
      transition: transform .4s cubic-bezier(.22, 1, .36, 1);
    }

    .pcard:hover .pcard-arrow {
      transform: translate(4px, -4px);
    }

    .area-detail {
      padding: 48px 56px;
      border-radius: 24px;
      background: linear-gradient(135deg, var(--light), var(--light2));
      position: relative;
      overflow: hidden;
      margin-top: 12px;
    }

    .area-detail-num {
      position: absolute;
      top: 24px;
      right: 36px;
      font-family: var(--ff-serif);
      font-size: 140px;
      opacity: .08;
      line-height: 1;
      color: var(--dark);
    }

    .area-detail-name {
      font-family: var(--ff-serif);
      font-size: clamp(2rem, 4vw, 3.5rem);
      letter-spacing: -.02em;
      color: var(--dark);
      margin-bottom: 24px;
    }

    .area-detail-text {
      font-size: 16px;
      line-height: 1.75;
      opacity: .8;
      max-width: 680px;
      margin-bottom: 32px;
    }

    .area-detail-foot {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 24px;
      padding-top: 24px;
      border-top: 1px solid rgba(139, 111, 71, .25);
    }

    .area-detail-lawyer-label {
      font-family: var(--ff-mono);
      font-size: 10px;
      letter-spacing: .2em;
      text-transform: uppercase;
      opacity: .6;
      margin-bottom: 4px;
    }

    .area-detail-lawyer {
      font-family: var(--ff-serif);
      font-size: 22px;
      color: var(--dark);
    }

    /* ═══ TEAM ════════════════════════════════════════════════════════════════ */
    .team-grid {
      display: grid;
      gap: 28px;
    }

    @media(min-width:560px) {
      .team-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media(min-width:1024px) {
      .team-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .team-card {
      background: white;
      border: 1px solid rgba(139, 111, 71, .12);
      border-radius: 20px;
      overflow: hidden;
      position: relative;
      transition: transform .45s cubic-bezier(.22, 1, .36, 1), box-shadow .45s;
      display: flex;
      flex-direction: column;
    }

    .team-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 28px 64px -20px rgba(42, 29, 16, .22);
    }

    /* Photo banner */
    .team-photo-wrap {
      position: relative;
      width: 100%;
      padding-top: 75%;
      overflow: hidden;
      background: #000;
      flex-shrink: 0;
    }

    .team-photo {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center top;
      transition: transform .6s cubic-bezier(.22, 1, .36, 1);
    }

    .team-card:hover .team-photo {
      transform: scale(1.05);
    }

    .team-photo-gradient {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 55%;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%);
      pointer-events: none;
    }

    .team-photo-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(184, 149, 106, .9);
      color: #1A0F04;
      font-size: 9.5px;
      font-weight: 700;
      letter-spacing: .15em;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 100px;
    }

    .team-name-over {
      position: absolute;
      bottom: 14px;
      left: 16px;
      right: 16px;
    }

    .team-name-over .team-name {
      font-family: var(--ff-serif);
      font-size: 19px;
      letter-spacing: -.01em;
      line-height: 1.15;
      color: white;
      text-shadow: 0 2px 8px rgba(0, 0, 0, .5);
    }

    .team-name-over .team-role {
      font-size: 11.5px;
      color: rgba(184, 149, 106, .9);
      font-weight: 500;
      margin-top: 3px;
    }

    /* Initials fallback */
    .team-initials {
      position: absolute;
      inset: 0;
      background: transparent;
      color: var(--gold);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--ff-serif);
      font-size: 52px;
      opacity: .85;
    }

    /* Card body */
    .team-card-body {
      padding: 20px 20px 22px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .team-focus-label {
      font-family: var(--ff-mono);
      font-size: 9px;
      letter-spacing: .22em;
      text-transform: uppercase;
      opacity: .45;
      margin-bottom: 5px;
    }

    .team-focus {
      font-size: 13px;
      font-weight: 600;
      color: var(--dark);
      margin-bottom: 10px;
      line-height: 1.4;
    }

    .team-bio {
      font-size: 13px;
      opacity: .68;
      line-height: 1.6;
      margin-bottom: 16px;
      flex: 1;
    }

    .team-creds {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding-top: 14px;
      border-top: 1px solid rgba(139, 111, 71, .1);
    }

    .cred-tag {
      font-size: 10.5px;
      padding: 4px 10px;
      border-radius: 100px;
      background: rgba(184, 149, 106, .1);
      color: #3D2817;
      font-weight: 500;
    }

    /* ═══ ABOUT ═══════════════════════════════════════════════════════════════ */
    .about-grid {
      display: grid;
      gap: 40px;
    }

    @media(min-width:1024px) {
      .about-grid {
        grid-template-columns: 1fr 2fr;
        gap: 64px;
      }
    }

    .about-aside {
      position: sticky;
      top: 96px;
    }

    .about-glance {
      background: var(--light);
      border-radius: 20px;
      padding: 32px;
    }

    .glance-row {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      font-size: 13px;
      padding: 12px 0;
      border-bottom: 1px solid var(--border);
    }

    .glance-row:last-child {
      border-bottom: none;
    }

    .glance-key {
      opacity: .6;
    }

    .glance-val {
      font-weight: 500;
      text-align: right;
    }

    .about-body p {
      font-size: 17px;
      line-height: 1.78;
      color: var(--dark);
      margin-bottom: 28px;
    }

    .about-block {
      padding-top: 40px;
      margin-top: 16px;
      border-top: 1px solid var(--border);
    }

    .about-block-title {
      font-family: var(--ff-serif);
      font-size: clamp(1.8rem, 3.5vw, 2.8rem);
      letter-spacing: -.02em;
      margin-bottom: 20px;
    }

    /* ═══ GOAL / VISION / MISSION CARDS ══════════════════════════════════════ */
    .gvm-grid {
      display: grid;
      gap: 1px;
      background: var(--border);
    }

    @media(min-width:640px) {
      .gvm-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .gvm-card {
      background: var(--cream);
      padding: 40px 44px;
    }

    .gvm-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .gvm-text {
      font-family: var(--ff-serif);
      font-size: clamp(1.1rem, 1.8vw, 1.4rem);
      line-height: 1.5;
      color: var(--dark);
    }

    /* ═══ WHY US ══════════════════════════════════════════════════════════════ */
    .why-grid {
      display: grid;
      gap: 40px;
    }

    @media(min-width:640px) {
      .why-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media(min-width:1024px) {
      .why-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .why-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--gold), var(--gold-mid));
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      transition: transform .4s;
    }

    .why-card:hover .why-icon {
      transform: scale(1.1) rotate(6deg);
    }

    .why-title {
      font-family: var(--ff-serif);
      font-size: 22px;
      letter-spacing: -.01em;
      margin-bottom: 10px;
    }

    .why-text {
      font-size: 14px;
      opacity: .65;
      line-height: 1.65;
    }

    /* ═══ APPOINTMENTS ════════════════════════════════════════════════════════ */
    .appt-grid {
      display: grid;
      gap: 48px;
    }

    @media(min-width:1024px) {
      .appt-grid {
        grid-template-columns: 1fr 1.6fr;
      }
    }

    .appt-info {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .appt-info-item {
      display: flex;
      gap: 20px;
    }

    .appt-icon-wrap {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--light), var(--light2));
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: transform .3s;
    }

    .appt-info-item:hover .appt-icon-wrap {
      transform: scale(1.1);
    }

    .appt-form-wrap {
      background: linear-gradient(135deg, var(--light) 0%, var(--light2) 100%);
      border-radius: 24px;
      padding: 40px 44px;
      position: relative;
      overflow: hidden;
    }

    .appt-form-orb {
      position: absolute;
      top: -80px;
      right: -80px;
      width: 240px;
      height: 240px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(184, 149, 106, .25), transparent);
      pointer-events: none;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 16px;
    }

    .form-input {
      width: 100%;
      padding: 14px 18px;
      background: white;
      border: 1.5px solid rgba(139, 111, 71, .25);
      border-radius: 12px;
      font-size: 14px;
      color: var(--dark);
      transition: border-color .25s;
      outline: none;
    }

    .form-input:focus {
      border-color: var(--gold-mid);
    }

    select.form-input {
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238B6F47' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 16px center;
    }

    textarea.form-input {
      resize: vertical;
      min-height: 110px;
    }

    .form-submit {
      width: 100%;
      padding: 16px;
      background: var(--dark);
      color: var(--cream);
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: all .3s;
    }

    .form-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px -8px rgba(42, 29, 16, .5);
    }

    .form-submit:disabled {
      opacity: .6;
      cursor: not-allowed;
    }

    .form-note {
      font-size: 11px;
      text-align: center;
      opacity: .55;
      margin-top: 12px;
      line-height: 1.5;
    }

    .form-success {
      text-align: center;
      padding: 48px 0;
    }

    .success-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, var(--dark), #3D2817);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }

    .success-title {
      font-family: var(--ff-serif);
      font-size: 2.5rem;
      letter-spacing: -.02em;
      margin-bottom: 16px;
    }

    .success-text {
      font-size: 15px;
      opacity: .72;
      max-width: 38ch;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* ═══ CONTACT ═════════════════════════════════════════════════════════════ */
    .contact-grid {
      display: grid;
      gap: 48px;
    }

    @media(min-width:1024px) {
      .contact-grid {
        grid-template-columns: 1fr 1.5fr;
      }
    }

    .map-container {
      border-radius: 16px;
      overflow: hidden;
      height: 320px;
      border: 1px solid var(--border);
    }

    .map-container iframe {
      width: 100%;
      height: 100%;
      border: 0;
    }

    .wa-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px;
      background: #25D366;
      color: white;
      border-radius: 100px;
      font-size: 14px;
      font-weight: 500;
      transition: transform .3s;
    }

    .wa-btn:hover {
      transform: scale(1.04);
    }

    /* ═══ CLIENTS ═════════════════════════════════════════════════════════════ */
    .clients-wrap {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 16px 40px;
    }

    .client-name {
      font-family: var(--ff-serif);
      font-size: clamp(16px, 2vw, 22px);
      font-style: italic;
      opacity: .45;
      transition: opacity .3s;
      color: var(--dark);
    }

    .client-name:hover {
      opacity: 1;
    }

    /* ═══ FOOTER ══════════════════════════════════════════════════════════════ */
    footer {
      background: var(--darker);
      color: var(--cream);
      padding: 80px 0 40px;
      position: relative;
      overflow: hidden;
    }

    footer::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at top, rgba(184, 149, 106, .04) 0%, transparent 60%);
      pointer-events: none;
    }

    .footer-grid {
      display: grid;
      gap: 48px;
      margin-bottom: 60px;
    }

    @media(min-width:1024px) {
      .footer-grid {
        grid-template-columns: 2fr 1fr 1fr 1fr;
      }
    }

    .footer-tagline {
      font-family: var(--ff-serif);
      font-size: clamp(2.2rem, 5vw, 3.8rem);
      line-height: 1;
      letter-spacing: -.025em;
      margin-bottom: 16px;
    }

    .footer-desc {
      font-size: 14px;
      opacity: .55;
      line-height: 1.6;
      max-width: 38ch;
    }

    .footer-col-label {
      font-family: var(--ff-mono);
      font-size: 10px;
      letter-spacing: .25em;
      text-transform: uppercase;
      opacity: .45;
      margin-bottom: 20px;
    }

    .footer-links {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .footer-link {
      font-size: 13.5px;
      opacity: .75;
      transition: opacity .25s;
      width: fit-content;
      position: relative;
    }

    .footer-link::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -2px;
      width: 0;
      height: 1px;
      background: var(--cream);
      transition: width .35s cubic-bezier(.22, 1, .36, 1);
    }

    .footer-link:hover {
      opacity: 1;
    }

    .footer-link:hover::after {
      width: 100%;
    }

    .footer-social {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .footer-social a {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      opacity: .7;
      transition: opacity .25s;
    }

    .footer-social a:hover {
      opacity: 1;
    }

    .footer-bottom {
      padding-top: 28px;
      border-top: 1px solid rgba(184, 149, 106, .12);
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 12px;
      font-size: 12px;
      opacity: .45;
    }

    .footer-bottom .mono {
      letter-spacing: .16em;
    }

    /* ═══ AI CHAT WIDGET ══════════════════════════════════════════════════════ */
    .chat-fab {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 500;
      width: 62px;
      height: 62px;
      border-radius: 50%;
      background: linear-gradient(145deg, #4a2010, var(--dark));
      color: var(--cream);
      box-shadow: 0 8px 32px -6px rgba(42, 29, 16, .6), 0 0 0 1px rgba(184, 149, 106, .2);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform .3s, box-shadow .3s;
    }

    .chat-fab:hover {
      transform: scale(1.1) translateY(-2px);
      box-shadow: 0 16px 44px -8px rgba(42, 29, 16, .65), 0 0 0 1px rgba(184, 149, 106, .3);
    }

    .chat-fab-ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: var(--gold);
      animation: ringPulse 2.4s ease-out infinite;
    }

    .chat-fab-icon {
      position: relative;
      z-index: 1;
      transition: transform .3s;
    }

    .chat-fab:hover .chat-fab-icon {
      transform: scale(1.1);
    }

    .chat-fab-label {
      position: absolute;
      bottom: calc(100% + 10px);
      right: 0;
      background: var(--dark);
      color: var(--cream);
      font-size: 12px;
      padding: 6px 12px;
      border-radius: 8px;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(42, 29, 16, .3);
      pointer-events: none;
      opacity: 0;
      transform: translateY(4px);
      transition: opacity .2s, transform .2s;
    }

    .chat-fab:hover .chat-fab-label {
      opacity: 1;
      transform: translateY(0);
    }

    .chat-window {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 500;
      width: min(420px, calc(100vw - 20px));
      height: min(640px, calc(100vh - 72px));
      display: flex;
      flex-direction: column;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 32px 80px -16px rgba(42, 29, 16, .5), 0 0 0 1px rgba(184, 149, 106, .12);
      background: #F8F4EE;
      transition: all .4s cubic-bezier(.22, 1, .36, 1);
    }

    .chat-window.hidden {
      opacity: 0;
      transform: translateY(20px) scale(.95);
      pointer-events: none;
    }

    /* Header */
    .chat-header {
      background: linear-gradient(155deg, #3D2010 0%, #2A1D10 60%, #1e140a 100%);
      color: var(--cream);
      padding: 0;
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
    }

    .chat-header::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 20% -20%, rgba(184, 149, 106, .35) 0%, transparent 60%), radial-gradient(ellipse at 80% 120%, rgba(139, 111, 71, .2) 0%, transparent 50%);
      pointer-events: none;
    }

    .chat-header-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 18px 12px;
      position: relative;
      z-index: 1;
    }

    .chat-header-bottom {
      padding: 0 18px 14px;
      position: relative;
      z-index: 1;
    }

    .chat-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(145deg, #c8a06a, #a07040);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, .25);
    }

    .chat-avatar-dot {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 13px;
      height: 13px;
      background: #22C55E;
      border-radius: 50%;
      border: 2.5px solid #2A1D10;
      box-shadow: 0 0 6px rgba(34, 197, 94, .5);
    }

    .chat-header-info {
      flex: 1;
      margin-left: 12px;
    }

    .chat-title {
      font-family: var(--ff-serif);
      font-size: 16px;
      line-height: 1.15;
      letter-spacing: -.01em;
    }

    .chat-subtitle {
      font-size: 11px;
      opacity: .6;
      margin-top: 3px;
      letter-spacing: .02em;
    }

    .chat-status-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 10px;
      background: rgba(34, 197, 94, .15);
      color: #4ADE80;
      border-radius: 100px;
      padding: 3px 9px;
      border: 1px solid rgba(34, 197, 94, .2);
    }

    .chat-status-dot {
      width: 6px;
      height: 6px;
      background: #22C55E;
      border-radius: 50%;
      animation: statusPulse 2s ease-in-out infinite;
    }

    @keyframes statusPulse {

      0%,
      100% {
        opacity: 1
      }

      50% {
        opacity: .4
      }
    }

    .chat-close {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, .6);
      transition: all .2s;
      flex-shrink: 0;
    }

    .chat-close:hover {
      background: rgba(255, 255, 255, .12);
      color: white;
    }

    /* Quick chips */
    .chat-quick-bar {
      padding: 10px 14px;
      background: rgba(184, 149, 106, .06);
      border-bottom: 1px solid rgba(184, 149, 106, .12);
      display: flex;
      gap: 7px;
      overflow-x: auto;
      flex-shrink: 0;
      scrollbar-width: none;
    }

    .chat-quick-bar::-webkit-scrollbar {
      display: none;
    }

    .chat-quick-chip {
      white-space: nowrap;
      padding: 6px 13px;
      background: white;
      border: 1.5px solid rgba(139, 111, 71, .2);
      border-radius: 100px;
      font-size: 12px;
      color: var(--dark);
      cursor: pointer;
      transition: all .2s;
      flex-shrink: 0;
    }

    .chat-quick-chip:hover {
      background: var(--dark);
      color: var(--cream);
      border-color: var(--dark);
      transform: translateY(-1px);
    }

    /* Messages */
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scroll-behavior: smooth;
      background: linear-gradient(180deg, #F2EDE4 0%, #F8F4EE 100%);
    }

    .chat-messages::-webkit-scrollbar {
      width: 3px;
    }

    .chat-messages::-webkit-scrollbar-thumb {
      background: rgba(139, 111, 71, .2);
      border-radius: 4px;
    }

    .msg {
      display: flex;
      animation: fadeUp .35s cubic-bezier(.22, 1, .36, 1) both;
      align-items: flex-end;
      gap: 8px;
    }

    .msg.user {
      justify-content: flex-end;
    }

    .msg-avatar-sm {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(145deg, #c8a06a, #a07040);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-bottom: 2px;
    }

    .msg.user .msg-avatar-sm {
      display: none;
    }

    .msg-content {
      display: flex;
      flex-direction: column;
      max-width: 83%;
    }

    .msg.user .msg-content {
      align-items: flex-end;
    }

    .msg-bubble {
      padding: 11px 16px;
      font-size: 14px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .msg.assistant .msg-bubble {
      background: white;
      color: var(--dark);
      border-radius: 16px 16px 16px 4px;
      box-shadow: 0 2px 8px rgba(42, 29, 16, .07), 0 0 0 1px rgba(139, 111, 71, .06);
    }

    .msg.user .msg-bubble {
      background: linear-gradient(145deg, #3D2010, var(--dark));
      color: var(--cream);
      border-radius: 16px 16px 4px 16px;
      box-shadow: 0 4px 12px rgba(42, 29, 16, .25);
    }

    .msg-time {
      font-size: 10px;
      opacity: .4;
      margin-top: 4px;
      padding: 0 4px;
    }

    .chat-typing {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 12px 16px;
      background: white;
      border-radius: 16px 16px 16px 4px;
      width: fit-content;
      box-shadow: 0 2px 8px rgba(42, 29, 16, .07);
    }

    .dot-b {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--gold-mid);
      animation: dotBounce 1.4s infinite;
    }

    /* Input area */
    .chat-input-area {
      border-top: 1px solid rgba(139, 111, 71, .12);
      padding: 12px 14px;
      background: white;
      flex-shrink: 0;
    }

    .chat-input-row {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      background: #F2EDE4;
      border-radius: 14px;
      padding: 6px 6px 6px 14px;
      border: 1.5px solid transparent;
      transition: border-color .25s;
    }

    .chat-input-row:focus-within {
      border-color: rgba(184, 149, 106, .5);
    }

    .chat-input {
      flex: 1;
      padding: 6px 0;
      background: transparent;
      border: none;
      font-size: 14px;
      resize: none;
      max-height: 100px;
      outline: none;
      line-height: 1.5;
      color: var(--dark);
    }

    .chat-input::placeholder {
      color: rgba(42, 29, 16, .38);
    }

    .chat-send {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(145deg, #4a2010, var(--dark));
      color: var(--cream);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all .2s;
      flex-shrink: 0;
    }

    .chat-send:hover:not(:disabled) {
      transform: scale(1.08);
      box-shadow: 0 4px 12px rgba(42, 29, 16, .35);
    }

    .chat-send:disabled {
      opacity: .3;
    }

    .chat-footer-note {
      font-size: 10px;
      text-align: center;
      color: rgba(42, 29, 16, .35);
      margin-top: 8px;
      letter-spacing: .02em;
    }

    /* ═══ STREAMING CHAT ANIMATIONS ══════════════════════════════════════════ */
    @keyframes msgLineIn {
      0%   { opacity: 0; transform: translateY(7px); filter: blur(1.5px); }
      60%  { opacity: 1; filter: blur(0); }
      100% { opacity: 1; transform: translateY(0); filter: blur(0); }
    }
    @keyframes imgReveal {
      from { opacity: 0; transform: scale(0.96) translateY(8px); }
      to   { opacity: 1; transform: scale(1)    translateY(0); }
    }
    @keyframes cursorBlink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0; }
    }
    @keyframes msgIn {
      from { opacity: 0; transform: translateY(10px) scale(0.98); }
      to   { opacity: 1; transform: translateY(0)    scale(1); }
    }
    .msg { animation: msgIn 0.22s cubic-bezier(0.22,1,0.36,1) both; }
    .msg-line {
      display: block;
      animation: msgLineIn 0.19s cubic-bezier(0.22,1,0.36,1) both;
      line-height: 1.68;
      min-height: 1px;
    }
    .msg-line-gap { display: block; height: 0.42em; }
    .stream-bubble { min-height: 14px; }
    .stream-bubble.typing::after {
      content: '▋';
      display: inline-block;
      animation: cursorBlink 0.65s steps(1) infinite;
      color: var(--gold);
      font-size: 0.8em;
      margin-left: 1px;
      vertical-align: text-bottom;
    }
    .chat-img-wrap {
      display: block;
      margin-top: 10px;
      border-radius: 10px;
      overflow: hidden;
      animation: imgReveal 0.32s cubic-bezier(0.22,1,0.36,1) both;
      border: 1px solid var(--border);
      background: var(--light);
    }
    .chat-img-wrap img {
      width: 100%;
      display: block;
      max-height: 210px;
      object-fit: cover;
      object-position: top center;
    }
    .chat-img-caption {
      padding: 6px 10px;
      font-size: 10px;
      font-family: var(--ff-mono);
      letter-spacing: 0.06em;
      color: var(--gold-mid);
      background: rgba(139,111,71,.06);
      text-transform: uppercase;
    }

    /* ═══ LOADING SPINNER ═════════════════════════════════════════════════════ */
    .spinner {
      width: 20px;
      height: 20px;
      border: 2.5px solid rgba(255, 255, 255, .3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin .7s linear infinite;
      display: inline-block;
    }

    .spinner-dark {
      border-color: rgba(42, 29, 16, .2);
      border-top-color: var(--dark);
    }

    /* ═══ RESPONSIVE HELPERS ══════════════════════════════════════════════════ */
    @media(max-width:991px) {
      .hero-inner {
        padding: 60px 0 40px;
      }

      .hero-stats {
        margin-top: 40px;
        padding-top: 24px;
        gap: 24px 20px;
      }

      .hero-body {
        margin-top: 32px;
        gap: 24px;
      }

      .stat-n {
        font-size: 2.2rem;
      }

      .hero-desc {
        font-size: 15px;
      }

      .hero-image {
        object-fit: contain;
        /* Ensures the photo is viewed entirely on small screens */
        object-position: center center;
        /* Keeps it centered */
      }

      #hero {
        align-items: stretch;
      }

      .btn-primary,
      .btn-outline {
        padding: 12px 20px;
      }
    }

    @media(max-width:639px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .appt-form-wrap {
        padding: 28px 20px;
      }

      .section {
        padding: 56px 0;
      }

      .area-detail {
        padding: 24px 20px;
      }

      .hero-inner {
        padding: 40px 0 30px;
      }

      .hero-stats {
        grid-template-columns: repeat(2, 1fr);
        margin-top: 30px;
        padding-top: 20px;
        gap: 20px 16px;
      }

      .hero-ctas {
        flex-direction: column;
        gap: 10px;
      }

      .btn-primary,
      .btn-outline {
        width: 100%;
        justify-content: center;
      }

      .stat-n {
        font-size: 1.8rem;
      }

      .hero-tag {
        margin-bottom: 20px;
        flex-wrap: wrap;
      }

      .hero-headline {
        font-size: clamp(2.5rem, 10vw, 3.5rem);
      }

      .team-grid {
        grid-template-columns: 1fr;
      }

      .gvm-grid {
        grid-template-columns: 1fr;
      }

      .why-grid {
        grid-template-columns: 1fr;
      }

      .footer-bottom {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
    }

    /* ═══ REDUCED MOTION ══════════════════════════════════════════════════════ */
    @media(prefers-reduced-motion:reduce) {

      *,
      *::before,
      *::after {
        animation-duration: .01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: .01ms !important;
      }
    }

    /* ═══ NOTIFICATION BADGE ══════════════════════════════════════════════════ */
    .notif-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 18px;
      height: 18px;
      background: #EF4444;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
      color: white;
      animation: notifPop .4s cubic-bezier(.22, 1, .36, 1);
    }

    /* ═══ TEAM PHOTO SECTION ══════════════════════════════════════════════════ */
    .team-photo-section {
      margin-bottom: 56px;
      border-radius: 20px;
      overflow: hidden;
      max-height: 460px;
      position: relative;
    }

    .team-photo-section img {
      width: 100%;
      height: auto;
      object-fit: contain;
    }

    .team-photo-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 50%);
      display: flex;
      align-items: flex-end;
      padding: 32px;
    }

    .team-photo-caption {
      color: white;
    }

    .team-photo-caption h3 {
      font-family: var(--ff-serif);
      font-size: clamp(1.8rem, 3.5vw, 3rem);
      letter-spacing: -.02em;
    }

    .team-photo-caption p {
      font-size: 14px;
      opacity: .8;
      margin-top: 6px;
    }

    /* ═══ SKELETONS ═══════════════════════════════════════════════════════════ */
    .skeleton {
      background: linear-gradient(90deg, var(--border) 25%, rgba(139, 111, 71, .08) 50%, var(--border) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 6px;
    }

    /* ══════════════════════════════════════════════════════════════════════════
       VISUAL EXCELLENCE — Premium polish
    ══════════════════════════════════════════════════════════════════════════ */

    /* ─── Body: warm micro-texture ─────────────────────────────────────────── */
    body {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='.022'/%3E%3C/svg%3E");
    }

    /* ─── Navbar: elevated on scroll ───────────────────────────────────────── */
    #navbar { transition: background .4s ease, box-shadow .4s ease, border-color .4s ease; }
    #navbar.scrolled {
      background: rgba(253, 249, 242, .99);
      box-shadow: 0 2px 40px -6px rgba(42, 29, 16, .14);
      border-bottom-color: rgba(139, 111, 71, .22);
    }

    /* ─── Nav: gold underline accent ───────────────────────────────────────── */
    .nav-link::after { background: var(--gold-mid); height: 1.5px; }
    .nav-link.active { font-weight: 500; }

    /* ─── AI dot: live pulse ────────────────────────────────────────────────── */
    @keyframes aiPulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(74,222,128,.5); }
      60%      { box-shadow: 0 0 0 7px rgba(74,222,128,0); }
    }
    .nav-ai-dot { animation: aiPulse 2.4s ease-in-out infinite; }

    /* ─── Hero: richer cinematic gradient ──────────────────────────────────── */
    #hero::before {
      background: linear-gradient(165deg,rgba(4,2,1,.5) 0%,rgba(0,0,0,.16) 55%,rgba(20,11,3,.55) 100%);
    }

    /* ─── Hero headline: tighter on mobile ─────────────────────────────────── */
    @media(max-width:640px) { .hero-headline { line-height: .97; } }

    /* ─── Hero stats: gold glow on hover ───────────────────────────────────── */
    #hero .stat-group:hover .stat-n {
      color: var(--gold);
      text-shadow: 0 0 40px rgba(184,149,106,.45);
    }

    /* ─── Marquee: pause on hover ──────────────────────────────────────────── */
    .marquee-bar:hover .marquee-track { animation-play-state: paused; }
    .maxim-band:hover .maxim-track   { animation-play-state: paused; }

    /* ─── Buttons: premium gradient & depth ────────────────────────────────── */
    .btn-primary {
      background: linear-gradient(135deg, #3D2815 0%, var(--dark) 100%);
      font-weight: 600;
      letter-spacing: .015em;
    }
    .btn-primary:hover {
      box-shadow: 0 18px 52px -10px rgba(42,29,16,.58);
      background: linear-gradient(135deg, var(--dark) 0%, #3D2815 100%);
    }
    .btn-outline {
      border-width: 1.5px;
      transition: all .4s cubic-bezier(.22,1,.36,1);
    }
    .btn-outline:hover {
      border-color: var(--gold-mid);
      background: rgba(184,149,106,.07);
      box-shadow: 0 4px 20px -6px rgba(42,29,16,.14);
    }

    /* ─── Practice cards: gold number & lift ───────────────────────────────── */
    .pcard { transition: background .4s, transform .4s cubic-bezier(.22,1,.36,1), box-shadow .4s; }
    .pcard:hover { transform: translateY(-3px); }
    .pcard:hover .pcard-num { opacity: 1; color: var(--gold-mid); }
    .pcard:hover .pcard-arrow { opacity: .9; color: var(--gold-mid); }
    .pcard:hover .pcard-name { color: inherit; }

    /* ─── Section dark: richer gradient ────────────────────────────────────── */
    .section-dark { background: linear-gradient(148deg,#1D1007 0%,#0D0804 55%,#1B1005 100%); }

    /* ─── Team cards: lifted glow on hover ─────────────────────────────────── */
    .team-card { transition: transform .5s cubic-bezier(.22,1,.36,1), box-shadow .5s, border-color .4s; }
    .team-card:hover {
      transform: translateY(-9px) scale(1.012);
      border-color: rgba(184,149,106,.32);
      box-shadow: 0 32px 72px -22px rgba(42,29,16,.28), 0 0 0 1px rgba(184,149,106,.14);
    }
    .cred-tag { transition: background .3s, color .3s; }
    .team-card:hover .cred-tag { background: rgba(184,149,106,.2); }

    /* ─── GVM cards: gold reveal on hover ──────────────────────────────────── */
    .gvm-card {
      transition: border-top-color .35s, background .35s;
      border-top: 3px solid transparent;
      background: var(--cream);
    }
    .gvm-card:hover { border-top-color: var(--gold-mid); background: rgba(251,247,239,.6); }

    /* ─── Why cards: translate + glow ──────────────────────────────────────── */
    .why-card { transition: transform .4s cubic-bezier(.22,1,.36,1); }
    .why-card:hover { transform: translateY(-5px); }
    .why-icon { box-shadow: 0 8px 24px -8px rgba(184,149,106,.45); transition: transform .4s, box-shadow .4s; }
    .why-card:hover .why-icon { box-shadow: 0 16px 40px -10px rgba(184,149,106,.6); }

    /* ─── About glance panel: more depth ───────────────────────────────────── */
    .about-glance {
      background: linear-gradient(145deg, var(--light) 0%, var(--light2) 100%);
      border: 1px solid rgba(139,111,71,.15);
      box-shadow: 0 12px 48px -16px rgba(42,29,16,.12);
    }
    .glance-row { transition: background .2s, padding-left .2s; }
    .glance-row:hover { background: rgba(184,149,106,.07); padding-left: 5px; }

    /* ─── Form inputs: focus glow ───────────────────────────────────────────── */
    .form-input { transition: border-color .3s, box-shadow .3s; }
    .form-input:focus {
      box-shadow: 0 0 0 3px rgba(139,111,71,.12), 0 2px 8px -4px rgba(42,29,16,.08);
    }

    /* ─── Appointment form wrap: premium ───────────────────────────────────── */
    .appt-form-wrap {
      box-shadow: 0 20px 64px -20px rgba(42,29,16,.2);
      border: 1px solid rgba(139,111,71,.13);
    }

    /* ─── Chat window: premium shadow ──────────────────────────────────────── */
    .chat-window { box-shadow: 0 24px 80px -16px rgba(42,29,16,.4), 0 0 0 1px rgba(139,111,71,.1); }

    /* ─── Footer: gold link underline on hover ─────────────────────────────── */
    .footer-link:hover { color: var(--gold) !important; opacity: 1 !important; }
    .footer-link::after { background: var(--gold); }

    /* ─── Map container: shadow ─────────────────────────────────────────────── */
    .map-container { box-shadow: 0 8px 32px -12px rgba(42,29,16,.12); border-color: rgba(139,111,71,.22); }

    /* ─── Page section: smooth fade transition ─────────────────────────────── */
    .page.active { animation: pgFade .45s cubic-bezier(.22,1,.36,1) both; }
    @keyframes pgFade {
      from { opacity: .65; transform: translateY(10px); }
      to   { opacity: 1;   transform: translateY(0);    }
    }

    /* ─── Scroll-to-top button ──────────────────────────────────────────────── */
    #scrollTopBtn {
      position: fixed;
      bottom: 100px;
      right: 24px;
      width: 46px;
      height: 46px;
      background: var(--dark);
      color: var(--cream);
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 350;
      opacity: 0;
      transform: translateY(14px) scale(.9);
      transition: opacity .4s cubic-bezier(.22,1,.36,1), transform .4s cubic-bezier(.22,1,.36,1), background .3s, box-shadow .3s;
      box-shadow: 0 8px 28px -8px rgba(42,29,16,.48);
      pointer-events: none;
    }
    #scrollTopBtn.visible { opacity: 1; transform: translateY(0) scale(1); pointer-events: all; }
    #scrollTopBtn:hover { background: var(--gold-mid); box-shadow: 0 12px 36px -8px rgba(184,149,106,.55); transform: translateY(-3px) scale(1); }

    /* ─── Member badges: hover ring ─────────────────────────────────────────── */
    .member-badge { transition: all .3s; }
    .member-badge:hover { border-color: var(--gold-mid) !important; background: rgba(184,149,106,.07) !important; }

    /* ─── Success icon: depth shadow ───────────────────────────────────────── */
    .success-icon { box-shadow: 0 14px 44px -12px rgba(42,29,16,.42); }

    /* ─── Smooth reveal stagger: extra delays ──────────────────────────────── */
    .reveal.d4 { transition-delay: .4s; }
    .reveal.d5 { transition-delay: .5s; }
  </style>
</head>

<body>

  <!-- ── Custom cursor ───────────────────────────────────────────────── -->
  <div class="cursor" id="cursor"></div>

  <!-- ════════════════════════════════════════════════════════════════════
     NAVIGATION
     ════════════════════════════════════════════════════════════════════ -->
  <nav id="navbar">
    <div class="container">
      <div class="nav-inner">
        <button class="nav-logo" onclick="showPage('home')" aria-label="Home">
          <div class="nav-logo-icon">
            <img src="FIRM%20LOGO.jpeg" alt="R. Kasaija & Partners Logo"
              onerror="this.style.display='none';this.parentElement.innerHTML='<svg width=\'22\' height=\'22\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23B8956A\' stroke-width=\'1.8\'><path d=\'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5\'/></svg>'" />
          </div>
          <div class="nav-logo-text">
            <div class="firm-name">R. Kasaija <em class="accent">&amp;</em> Partners</div>
            <div class="firm-sub">Advocates · Kampala</div>
          </div>
        </button>

        <div class="nav-links">
          <button class="nav-link active" onclick="showPage('home')" data-page="home">Home</button>
          <button class="nav-link" onclick="showPage('about')" data-page="about">About</button>
          <button class="nav-link" onclick="showPage('practice')" data-page="practice">Practice</button>
          <button class="nav-link" onclick="showPage('team')" data-page="team">Team</button>
          <button class="nav-link" onclick="showPage('appointments')" data-page="appointments">Book</button>
          <button class="nav-link" onclick="showPage('contact')" data-page="contact">Contact</button>
          <button class="nav-ai-btn" onclick="openChat()">
            <span class="nav-ai-dot"></span>
            Ask Kasaija AI
          </button>
        </div>

        <button class="hamburger" id="hamburger" aria-label="Menu" onclick="toggleMenu()">
          <svg id="ham-icon" width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round">
            <line x1="0" y1="2" x2="18" y2="2" />
            <line x1="0" y1="7" x2="18" y2="7" />
            <line x1="0" y1="12" x2="18" y2="12" />
          </svg>
        </button>
      </div>

      <div class="mobile-menu" id="mobileMenu">
        <button onclick="showPage('home');closeMenu()">Home</button>
        <button onclick="showPage('about');closeMenu()">About</button>
        <button onclick="showPage('practice');closeMenu()">Practice Areas</button>
        <button onclick="showPage('team');closeMenu()">Our Team</button>
        <button onclick="showPage('appointments');closeMenu()">Book Appointment</button>
        <button onclick="showPage('contact');closeMenu()">Contact</button>
        <button class="mobile-ai-btn" onclick="openChat();closeMenu()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2a5 5 0 0 1 5 5v1a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z" />
            <path d="M9 13h6l3 8H6l3-8z" />
          </svg>
          Ask Kasaija AI
        </button>
      </div>
    </div>
  </nav>

  <!-- ════════════════════════════════════════════════════════════════════
     PAGE: HOME
     ════════════════════════════════════════════════════════════════════ -->
  <main>
    <div id="page-home" class="page active">

      <!-- Hero -->
      <section id="hero" class="hero-grain">

        <!-- Background image (animated) -->
        <img src="LAW FIRM TEAM.jpeg" class="hero-image" alt="Law Firm Team" fetchpriority="high" aria-hidden="true">

        <!-- Courtroom window light beams -->
        <div class="court-beam" style="--sa:-8deg;--ea:-4deg;--mo:.9;--bd:14s;--bdelay:0s;left:5%;"></div>
        <div class="court-beam" style="--sa:-4deg;--ea:-1deg;--mo:.6;--bd:11s;--bdelay:2.5s;left:18%;"></div>
        <div class="court-beam" style="--sa:0deg;--ea:3deg;--mo:.75;--bd:16s;--bdelay:1s;left:38%;"></div>
        <div class="court-beam" style="--sa:2deg;--ea:5deg;--mo:.5;--bd:13s;--bdelay:4s;left:58%;"></div>
        <div class="court-beam" style="--sa:4deg;--ea:8deg;--mo:.65;--bd:9s;--bdelay:1.8s;left:75%;"></div>

        <!-- Scales of Justice SVG (background) -->
        <div class="hero-scales">
          <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Beam -->
            <rect x="99" y="10" width="2" height="145" fill="rgba(184,149,106,0.9)" />
            <!-- Top knob -->
            <circle cx="100" cy="10" r="5" fill="rgba(184,149,106,0.9)" />
            <!-- Centre fulcrum diamond -->
            <polygon points="100,42 108,50 100,58 92,50" fill="rgba(184,149,106,0.7)" />
            <!-- Left arm -->
            <line x1="100" y1="50" x2="35" y2="65" stroke="rgba(184,149,106,0.8)" stroke-width="1.5" />
            <!-- Right arm -->
            <line x1="100" y1="50" x2="165" y2="65" stroke="rgba(184,149,106,0.8)" stroke-width="1.5" />
            <!-- Left pan chains -->
            <line x1="35" y1="65" x2="25" y2="95" stroke="rgba(184,149,106,0.6)" stroke-width="1" />
            <line x1="35" y1="65" x2="45" y2="95" stroke="rgba(184,149,106,0.6)" stroke-width="1" />
            <!-- Left pan -->
            <path d="M18 95 Q35 110 52 95" stroke="rgba(184,149,106,0.85)" stroke-width="1.8" fill="none" />
            <!-- Right pan chains -->
            <line x1="165" y1="65" x2="155" y2="95" stroke="rgba(184,149,106,0.6)" stroke-width="1" />
            <line x1="165" y1="65" x2="175" y2="95" stroke="rgba(184,149,106,0.6)" stroke-width="1" />
            <!-- Right pan -->
            <path d="M148 95 Q165 110 182 95" stroke="rgba(184,149,106,0.85)" stroke-width="1.8" fill="none" />
            <!-- Base -->
            <rect x="85" y="155" width="30" height="3" rx="1.5" fill="rgba(184,149,106,0.7)" />
            <rect x="75" y="158" width="50" height="4" rx="2" fill="rgba(184,149,106,0.6)" />
          </svg>
        </div>

        <!-- Golden dust particles -->
        <div class="hero-particle"
          style="--ps:2px;--po:.5;--pd:22s;--pdelay:0s;--px1:18px;--py1:-35px;--px2:-12px;--py2:-68px;--px3:8px;--py3:-90px;left:12%;top:35%;">
        </div>
        <div class="hero-particle"
          style="--ps:3px;--po:.35;--pd:18s;--pdelay:3s;--px1:-22px;--py1:-28px;--px2:15px;--py2:-55px;--px3:-8px;--py3:-85px;left:28%;top:55%;">
        </div>
        <div class="hero-particle"
          style="--ps:2px;--po:.6;--pd:25s;--pdelay:6s;--px1:12px;--py1:-42px;--px2:-18px;--py2:-70px;--px3:6px;--py3:-100px;left:45%;top:28%;">
        </div>
        <div class="hero-particle"
          style="--ps:4px;--po:.25;--pd:20s;--pdelay:1.5s;--px1:-15px;--py1:-30px;--px2:20px;--py2:-65px;--px3:-5px;--py3:-95px;left:68%;top:45%;">
        </div>
        <div class="hero-particle"
          style="--ps:2px;--po:.45;--pd:16s;--pdelay:8s;--px1:20px;--py1:-25px;--px2:-10px;--py2:-50px;--px3:14px;--py3:-80px;left:82%;top:62%;">
        </div>
        <div class="hero-particle"
          style="--ps:3px;--po:.3;--pd:28s;--pdelay:4s;--px1:-8px;--py1:-38px;--px2:16px;--py2:-72px;--px3:-12px;--py3:-105px;left:55%;top:72%;">
        </div>
        <div class="hero-particle"
          style="--ps:2px;--po:.55;--pd:19s;--pdelay:11s;--px1:10px;--py1:-20px;--px2:-20px;--py2:-48px;--px3:5px;--py3:-75px;left:35%;top:80%;">
        </div>

        <!-- Scrolling Latin maxims band -->
        <div class="maxim-band">
          <div class="maxim-track">
            <span class="maxim-item">Fiat Justitia Ruat Caelum</span><span class="maxim-dot">✦</span>
            <span class="maxim-item">Audi Alteram Partem</span><span class="maxim-dot">✦</span>
            <span class="maxim-item">Nemo Judex In Causa Sua</span><span class="maxim-dot">✦</span>
            <span class="maxim-item">Lex Scripta &amp; Lex Non Scripta</span><span class="maxim-dot">✦</span>
            <span class="maxim-item">Actus Non Facit Reum Nisi Mens Sit Rea</span><span class="maxim-dot">✦</span>
            <span class="maxim-item">Ignorantia Juris Non Excusat</span><span class="maxim-dot">✦</span>
            <span class="maxim-item">In Dubio Pro Reo</span><span class="maxim-dot">✦</span>
            <span class="maxim-item">Pacta Sunt Servanda</span><span class="maxim-dot">✦</span>
            <!-- duplicate for seamless loop -->
            <span class="maxim-item">Fiat Justitia Ruat Caelum</span><span class="maxim-dot">✦</span>
            <span class="maxim-item">Audi Alteram Partem</span><span class="maxim-dot">✦</span>
            <span class="maxim-item">Nemo Judex In Causa Sua</span><span class="maxim-dot">✦</span>
            <span class="maxim-item">Lex Scripta &amp; Lex Non Scripta</span><span class="maxim-dot">✦</span>
            <span class="maxim-item">Actus Non Facit Reum Nisi Mens Sit Rea</span><span class="maxim-dot">✦</span>
            <span class="maxim-item">Ignorantia Juris Non Excusat</span><span class="maxim-dot">✦</span>
            <span class="maxim-item">In Dubio Pro Reo</span><span class="maxim-dot">✦</span>
            <span class="maxim-item">Pacta Sunt Servanda</span><span class="maxim-dot">✦</span>
          </div>
        </div>

        <div class="container hero-inner">
          <div class="hero-tag fade-up" style="animation-delay:.1s">
            <span class="label" style="color:var(--gold-mid)">Est. Kampala</span>
            <div class="hero-tag-line"></div>
            <span class="label" style="color:var(--gold-mid)">Advocates &amp; Solicitors</span>
          </div>

          <div class="hero-headline" id="heroHeadline">
            <span class="headline-line"><span class="hl-word" id="hw0">Counsel</span></span>
            <span class="headline-line"><span class="hl-word" id="hw1"
                style="font-style:italic;color:var(--gold-mid)">that</span> <span class="hl-word"
                id="hw2">moves</span></span>
            <span class="headline-line"><span class="hl-word" id="hw3">with</span> <span class="hl-word"
                id="hw4">your</span></span>
            <span class="headline-line"><span class="hl-word" id="hw5">business.</span></span>
          </div>

          <div class="hero-body fade-up" style="animation-delay:1.3s">
            <p class="hero-desc">An indigenous Ugandan firm serving multinationals, financial institutions, and
              individuals across banking, corporate, land, and dispute resolution — with a business-minded ADR approach,
              backed by <em class="accent">ICAMEK</em> credentials and two decades of practice.</p>
            <div class="hero-ctas">
              <button class="btn-primary" onclick="openChat()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Speak with Kasaija AI
              </button>
              <button class="btn-outline" onclick="showPage('practice')">
                Our Practice Areas
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </button>
            </div>
          </div>

          <div class="hero-stats fade-up" style="animation-delay:1.6s">
            <div class="stat-group">
              <div class="stat-n">20+</div>
              <div class="stat-label">Years of practice</div>
              <div class="stat-sub">Since founding</div>
            </div>
            <div class="stat-group">
              <div class="stat-n">12</div>
              <div class="stat-label">Practice areas</div>
              <div class="stat-sub">Full service</div>
            </div>
            <div class="stat-group">
              <div class="stat-n">ICAMEK</div>
              <div class="stat-label">Arbitrator</div>
              <div class="stat-sub">Managing Partner</div>
            </div>
            <div class="stat-group">
              <div class="stat-n">100%</div>
              <div class="stat-label">Ethical integrity</div>
              <div class="stat-sub">Non-negotiable</div>
            </div>
          </div>
        </div>
        <div class="scroll-hint">
          <span class="scroll-hint-label">Scroll</span>
          <div class="scroll-track">
            <div class="scroll-bar"></div>
          </div>
        </div>
      </section>

      <!-- Marquee -->
      <div class="marquee-bar">
        <div class="marquee-track">
          <?php
          $items = ["Banking & Finance", "Corporate Law", "Debt Recovery", "Land & Conveyancing", "Intellectual Property", "Arbitration", "Family Law", "Criminal Defence", "Tax Advisory", "Employment Law", "NGO / Non-Profit", "Governance & Compliance"];
          for ($i = 0; $i < 3; $i++) {
            foreach ($items as $item) {
              echo '<div class="marquee-item"><span class="marquee-text">' . $item . '</span><span class="marquee-dot"></span></div>';
            }
          }
          ?>
        </div>
      </div>

      <!-- Goal / Vision / Mission -->
      <section class="section">
        <div class="container">
          <div class="gvm-grid reveal">
            <div class="gvm-card">
              <div class="gvm-label"><span class="label">Our Goal</span><span
                  style="font-family:var(--ff-mono);font-size:12px;opacity:.4">01</span></div>
              <p class="gvm-text">To provide exceptional, affordable, quality legal consultancy and advisory services to
                our clientele with a diligent and professional touch.</p>
            </div>
            <div class="gvm-card">
              <div class="gvm-label"><span class="label">Our Vision</span><span
                  style="font-family:var(--ff-mono);font-size:12px;opacity:.4">02</span></div>
              <p class="gvm-text">To be a one-stop centre law firm in East Africa and beyond.</p>
            </div>
            <div class="gvm-card">
              <div class="gvm-label"><span class="label">Our Mission</span><span
                  style="font-family:var(--ff-mono);font-size:12px;opacity:.4">03</span></div>
              <p class="gvm-text">To provide excellent legal services in a professional manner that meets our clients'
                needs.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Practice preview -->
      <section class="section section-light">
        <div class="container">
          <div class="section-head reveal">
            <div class="label" style="margin-bottom:16px">§ What we do</div>
            <div class="section-title">Twelve disciplines.<br /><em class="accent">One standard.</em></div>
          </div>
          <div class="practice-grid reveal d1" id="homePracticeGrid"></div>
          <div style="margin-top:32px;text-align:center" class="reveal d2">
            <button class="btn-outline" onclick="showPage('practice')">View all 12 practice areas
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <!-- Why us -->
      <section class="section section-dark">
        <div class="container">
          <div class="section-head reveal">
            <div class="label" style="margin-bottom:16px;color:var(--gold)">§ Why R. Kasaija &amp; Partners</div>
            <div class="section-title" style="color:var(--cream)">Different by <em
                style="color:var(--gold);font-style:italic">principle,</em><br />not by promise.</div>
          </div>
          <div class="why-grid">
            <div class="why-card reveal">
              <div class="why-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--darker)" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div class="why-title" style="color:var(--cream)">Ethical Integrity</div>
              <div class="why-text">Professional ethics upheld with timely responses and transparent dealing at every
                stage.</div>
            </div>
            <div class="why-card reveal d1">
              <div class="why-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--darker)" stroke-width="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <div class="why-title" style="color:var(--cream)">Business Acumen</div>
              <div class="why-text">Cost-conscious, strategic, value-driven — your outcomes are our north star, not
                billable hours.</div>
            </div>
            <div class="why-card reveal d2">
              <div class="why-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--darker)" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div class="why-title" style="color:var(--cream)">ADR-First</div>
              <div class="why-text">Alternative dispute resolution to save you time, money, and reputation. Litigation
                when necessary.</div>
            </div>
            <div class="why-card reveal d3">
              <div class="why-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--darker)" stroke-width="2">
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                </svg>
              </div>
              <div class="why-title" style="color:var(--cream)">Collective Responsibility</div>
              <div class="why-text">Team approach with a dedicated expert lead for every matter — no silos, no dropped
                balls.</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Clients -->
      <section class="section">
        <div class="container">
          <div class="reveal" style="text-align:center;margin-bottom:40px">
            <div class="label" style="margin-bottom:12px">§ Trusted counsel for</div>
            <div class="section-title" style="font-size:clamp(1.8rem,3.5vw,3rem)">Institutions, investors, <em
                class="accent">individuals.</em></div>
          </div>
          <div class="clients-wrap reveal d1">
            <?php $clients = ["Shengli Engineering", "H.K Financial Services", "Save and Invest", "S.N Financial Services", "Tin Link Financial", "Twezimbe Investment", "Agwotwe Financial", "National Forestry Authority"];
            foreach ($clients as $c): ?>
              <div class="client-name"><?= htmlspecialchars($c) ?></div>
            <?php endforeach; ?>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="section section-light" style="text-align:center">
        <div class="container">
          <div class="reveal">
            <div class="label" style="margin-bottom:24px">§ Begin</div>
          </div>
          <div class="section-title reveal d1" style="max-width:640px;margin:0 auto 24px">Ready to discuss<br />your <em
              class="accent">matter?</em></div>
          <p class="reveal d2" style="font-size:17px;opacity:.7;max-width:44ch;margin:0 auto 40px;line-height:1.6">Speak
            with Kasaija AI now for instant intake, or book a consultation directly with the right advocate.</p>
          <div class="reveal d3" style="display:flex;flex-wrap:wrap;gap:14px;justify-content:center">
            <button class="btn-primary" onclick="openChat()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Start with AI Intake
            </button>
            <button class="btn-outline" onclick="showPage('appointments')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Book Consultation
            </button>
          </div>
        </div>
      </section>
    </div><!-- /page-home -->

    <!-- ════════════════════════════════════════════════════════════════════
     PAGE: ABOUT
     ════════════════════════════════════════════════════════════════════ -->
    <div id="page-about" class="page">
      <section class="section" style="padding-top:64px">
        <div class="container">
          <div class="label fade-up" style="margin-bottom:20px">§ About the firm</div>
          <h1 class="section-title fade-up"
            style="font-size:clamp(3rem,8vw,7rem);margin-bottom:72px;animation-delay:.15s">An indigenous firm<br />built
            for <em class="accent">East Africa</em>.</h1>
          <div class="about-grid">
            <aside class="about-aside reveal">
              <div class="about-glance">
                <div class="label" style="margin-bottom:20px">At a glance</div>
                <?php $glance = [['Founded', 'Kampala, Uganda'], ['Partners', '3 partners + 4 associates'], ['Experience', '20+ years'], ['Memberships', 'ULS · EALS · ICAMEK'], ['Languages', 'English · Runyankore · Luganda'], ['Services', 'Advocates, Notary, Patent Agents, Company Secretaries']];
                foreach ($glance as [$k, $v]): ?>
                  <div class="glance-row"><span class="glance-key"><?= $k ?></span><span
                      class="glance-val"><?= $v ?></span></div>
                <?php endforeach; ?>
              </div>
            </aside>
            <article class="about-body">
              <p class="reveal">R. Kasaija &amp; Partners Advocates is an indigenous, fast-growing law firm in Uganda.
                The firm provides consultation and legal services across a wide range of matters, with extensive
                resources and experience to handle substantial and complex transactions.</p>
              <p class="reveal d1">Our highly skilled team of lawyers is result-oriented. We provide professional legal
                services with integrity, an ethical touch, and expertise — prioritising the interests of both our
                domestic and international clientele. We respond efficiently to complex legal problems with flexible
                commercial solutions, helping clients achieve their business objectives.</p>
              <p class="reveal d2">Amongst the firm's clients are major national and international companies and
                individuals active in consumer goods, foods and beverages, health and medical, real estate and
                construction, energy and environment, banking, and project financing.</p>
              <div class="about-block reveal">
                <div class="label" style="margin-bottom:16px">§ What we are</div>
                <div class="about-block-title">A full-service indigenous firm.</div>
                <p>We are a firm of Advocates, Solicitors, Attorneys-at-Law, Legal, Investment and Tax Consultants,
                  Commissioners for Oaths, Notary Public, Trademark and Patent Agents, Receivers, Liquidators, Debt
                  Collectors, and Company Secretaries.</p>
                <p style="margin-top:20px">Our team is well grounded in business and commercial law — covering
                  corporate, mergers and acquisitions, labour and industrial disputes, land conveyance, banking and
                  mortgages, insurance claims, intellectual property, adoption, divorce and child maintenance,
                  inheritance, and investment law.</p>
              </div>
              <div class="about-block reveal d1">
                <div class="label" style="margin-bottom:16px">§ Our approach to disputes</div>
                <div class="about-block-title">ADR first. Litigation when necessary.</div>
                <p>We believe in alternative dispute resolution. The firm has been involved in substantial arbitration,
                  mediation, and negotiation proceedings, and has secured meaningful out-of-court settlements on behalf
                  of our clients. Our Managing Partner is a member of the International Centre for Arbitration and
                  Mediation in Kampala (ICAMEK).</p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div><!-- /page-about -->

    <!-- ════════════════════════════════════════════════════════════════════
     PAGE: PRACTICE AREAS
     ════════════════════════════════════════════════════════════════════ -->
    <div id="page-practice" class="page">
      <section class="section" style="padding-top:64px">
        <div class="container">
          <div class="label fade-up" style="margin-bottom:20px">§ What we do</div>
          <h1 class="section-title fade-up"
            style="font-size:clamp(3rem,8vw,6.5rem);margin-bottom:64px;animation-delay:.15s">Practice <em
              class="accent">Areas.</em></h1>
          <div class="practice-grid" id="fullPracticeGrid"></div>
          <div id="areaDetail" style="display:none;margin-top:12px"></div>
        </div>
      </section>
    </div>

    <!-- ════════════════════════════════════════════════════════════════════
     PAGE: TEAM
     ════════════════════════════════════════════════════════════════════ -->
    <div id="page-team" class="page">
      <section class="section" style="padding-top:64px">
        <div class="container">
          <div class="label fade-up" style="margin-bottom:20px">§ Our people</div>
          <h1 class="section-title fade-up"
            style="font-size:clamp(3rem,8vw,6.5rem);margin-bottom:56px;animation-delay:.15s">The team behind<br />every
            <em class="accent">matter.</em>
          </h1>

          <div class="team-photo-section reveal">
            <img src="law_firm_team.jpeg" alt="R. Kasaija &amp; Partners Team" loading="lazy"
              onerror="this.parentElement.style.display='none'" />
            <div class="team-photo-overlay">
              <div class="team-photo-caption">
                <h3>Our Team</h3>
                <p>Seven advocates. One standard of excellence.</p>
              </div>
            </div>
          </div>

          <div class="team-grid" id="teamGrid"></div>
        </div>
      </section>
    </div>

    <!-- ════════════════════════════════════════════════════════════════════
     PAGE: APPOINTMENTS
     ════════════════════════════════════════════════════════════════════ -->
    <div id="page-appointments" class="page">
      <section class="section" style="padding-top:64px">
        <div class="container">
          <div class="label fade-up" style="margin-bottom:20px">§ Schedule a consultation</div>
          <h1 class="section-title fade-up"
            style="font-size:clamp(2.5rem,7vw,6rem);margin-bottom:64px;animation-delay:.15s">Book your <em
              class="accent">appointment.</em></h1>
          <div class="appt-grid">
            <div class="appt-info reveal">
              <div class="appt-info-item">
                <div class="appt-icon-wrap"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="var(--gold-mid)" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg></div>
                <div>
                  <div class="label" style="margin-bottom:6px">Book Online</div>
                  <div style="font-size:14px;opacity:.75;line-height:1.6">Select your lawyer and preferred date. We'll
                    confirm within one business day.</div>
                </div>
              </div>
              <div class="appt-info-item">
                <div class="appt-icon-wrap"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="var(--gold-mid)" stroke-width="2">
                    <path
                      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.91 5.91l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg></div>
                <div>
                  <div class="label" style="margin-bottom:6px">Call Directly</div>
                  <div style="font-size:14px;opacity:.75;line-height:1.6"><a href="tel:+256772418707"
                      style="display:block;font-weight:500">+256 772 418 707</a><a href="tel:+256776044004"
                      style="display:block;margin-top:4px">+256 776 044 004</a></div>
                </div>
              </div>
              <div class="appt-info-item">
                <div class="appt-icon-wrap"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="var(--gold-mid)" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg></div>
                <div>
                  <div class="label" style="margin-bottom:6px">Email</div>
                  <div style="font-size:14px"><a href="mailto:kasaijaandpartners@gmail.com"
                      style="opacity:.75">kasaijaandpartners@gmail.com</a></div>
                </div>
              </div>
              <div class="appt-info-item">
                <div class="appt-icon-wrap"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="var(--gold-mid)" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg></div>
                <div>
                  <div class="label" style="margin-bottom:6px">Visit Us</div>
                  <div style="font-size:14px;opacity:.75;line-height:1.65">Plot 75 Kampala Road<br />E-Tower Building,
                    4th Floor, Suite D-06<br />Kampala, Uganda</div>
                </div>
              </div>
              <a href="https://wa.me/256772418707" target="_blank" class="wa-btn" style="align-self:flex-start">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path
                    d="M12 0C5.373 0 0 5.373 0 12c0 2.123.557 4.116 1.527 5.844L.057 23.929l6.291-1.638A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.007-1.372l-.359-.213-3.731.97.998-3.63-.234-.374A9.762 9.762 0 0 1 2.182 12c0-5.422 4.396-9.818 9.818-9.818 5.422 0 9.818 4.396 9.818 9.818 0 5.422-4.396 9.818-9.818 9.818z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>

            <div class="appt-form-wrap reveal d1">
              <div class="appt-form-orb"></div>
              <div id="apptFormInner">
                <div class="label" style="margin-bottom:12px">§ Intake form</div>
                <div
                  style="font-family:var(--ff-serif);font-size:1.9rem;letter-spacing:-.02em;margin-bottom:28px;color:var(--dark)">
                  Tell us about your matter.</div>
                <form id="appointmentForm" onsubmit="submitAppointment(event)">
                  <div class="form-group"><input class="form-input" name="client_name" placeholder="Full name *"
                      required /></div>
                  <div class="form-row">
                    <input class="form-input" name="client_email" type="email" placeholder="Email address *" required />
                    <input class="form-input" name="client_phone" placeholder="Phone number" />
                  </div>
                  <div class="form-row">
                    <select class="form-input" name="practice_area">
                      <option value="">Practice area</option>
                      <?php $areas = ["Banking & Finance", "Corporate & Commercial", "Debt Recovery", "Land & Conveyancing", "Intellectual Property", "Family & Probate", "Employment & Labour", "Criminal Law", "Arbitration & ADR", "Revenue Law & Taxation", "Non-Profit & NGO", "Governance & Compliance"];
                      foreach ($areas as $a): ?>
                        <option><?= $a ?></option><?php endforeach; ?>
                    </select>
                    <select class="form-input" name="preferred_lawyer">
                      <option value="">Preferred advocate</option>
                      <?php $lawyers = ["Robert Kasaija", "Sharon Murungi", "Joseph Kwesiga", "Justin Joseph Kasaija", "Christopher Baluku", "Fred Asiimwe", "Oscar Musiime", "No preference"];
                      foreach ($lawyers as $l): ?>
                        <option><?= $l ?></option><?php endforeach; ?>
                    </select>
                  </div>
                  <div class="form-row">
                    <input class="form-input" name="preferred_date" type="date"
                      min="<?= date('Y-m-d', strtotime('+1 day')) ?>" />
                    <select class="form-input" name="preferred_time">
                      <option value="">Preferred time</option>
                      <?php for ($h = 8; $h <= 16; $h++) {
                        echo '<option>' . sprintf('%02d', $h) . ':00</option>';
                        if ($h < 16)
                          echo '<option>' . sprintf('%02d', $h) . ':30</option>';
                      } ?>
                    </select>
                  </div>
                  <div class="form-group"><textarea class="form-input" name="message"
                      placeholder="Briefly describe your matter…" rows="4"></textarea></div>
                  <button type="submit" class="form-submit" id="apptSubmitBtn">
                    <span id="apptBtnText">Request Appointment</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </button>
                  <p class="form-note">By submitting, you acknowledge this does not create a solicitor-client
                    relationship until confirmed in writing.</p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- ════════════════════════════════════════════════════════════════════
     PAGE: CONTACT
     ════════════════════════════════════════════════════════════════════ -->
    <div id="page-contact" class="page">
      <section class="section" style="padding-top:64px">
        <div class="container">
          <div class="label fade-up" style="margin-bottom:20px">§ Get in touch</div>
          <h1 class="section-title fade-up"
            style="font-size:clamp(2.5rem,7vw,6rem);margin-bottom:64px;animation-delay:.15s">Send us a <em
              class="accent">message.</em></h1>
          <div class="contact-grid">
            <div class="reveal">
              <div style="display:flex;flex-direction:column;gap:28px;margin-bottom:32px">
                <?php
                $contacts = [
                  ['icon' => '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>', 'label' => 'Office', 'text' => 'Plot 75 Kampala Road<br/>E-Tower Building, 4th Floor, Suite D-06<br/>P.O. Box 70643, Kampala, Uganda'],
                  ['icon' => '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.91 5.91l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>', 'label' => 'Phone', 'text' => '<a href="tel:+256772418707">+256 772 418 707</a><br/><a href="tel:+256776044004">+256 776 044 004</a>'],
                  ['icon' => '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>', 'label' => 'Email', 'text' => '<a href="mailto:kasaijaandpartners@gmail.com">kasaijaandpartners@gmail.com</a>'],
                ];
                foreach ($contacts as $c): ?>
                  <div style="display:flex;gap:18px">
                    <div class="appt-icon-wrap" style="flex-shrink:0"><svg width="20" height="20" viewBox="0 0 24 24"
                        fill="none" stroke="var(--gold-mid)" stroke-width="2"><?= $c['icon'] ?></svg></div>
                    <div>
                      <div class="label" style="margin-bottom:6px"><?= $c['label'] ?></div>
                      <div style="font-size:14px;opacity:.8;line-height:1.7"><?= $c['text'] ?></div>
                    </div>
                  </div>
                <?php endforeach; ?>
              </div>
              <a href="https://wa.me/256772418707" target="_blank" class="wa-btn"
                style="margin-bottom:32px;display:inline-flex">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path
                    d="M12 0C5.373 0 0 5.373 0 12c0 2.123.557 4.116 1.527 5.844L.057 23.929l6.291-1.638A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.007-1.372l-.359-.213-3.731.97.998-3.63-.234-.374A9.762 9.762 0 0 1 2.182 12c0-5.422 4.396-9.818 9.818-9.818 5.422 0 9.818 4.396 9.818 9.818 0 5.422-4.396 9.818-9.818 9.818z" />
                </svg>
                Chat on WhatsApp
              </a>
              <div class="map-container">
                <iframe
                  src="https://maps.google.com/maps?q=E+Tower+Building+Kampala+Road+Kampala+Uganda&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                  title="R. Kasaija &amp; Partners Office Location"></iframe>
              </div>
            </div>

            <div class="appt-form-wrap reveal d1">
              <div class="appt-form-orb"></div>
              <div id="contactFormInner">
                <div class="label" style="margin-bottom:12px">§ Enquiry form</div>
                <div
                  style="font-family:var(--ff-serif);font-size:1.9rem;letter-spacing:-.02em;margin-bottom:28px;color:var(--dark)">
                  Tell us about your matter.</div>
                <form id="contactForm" onsubmit="submitContact(event)">
                  <div class="form-group"><input class="form-input" name="name" placeholder="Full name *" required />
                  </div>
                  <div class="form-row">
                    <input class="form-input" name="email" type="email" placeholder="Email *" required />
                    <input class="form-input" name="phone" placeholder="Phone" />
                  </div>
                  <div class="form-group">
                    <select class="form-input" name="area">
                      <option value="">Select practice area</option>
                      <?php foreach ($areas as $a): ?>
                        <option><?= $a ?></option><?php endforeach; ?>
                    </select>
                  </div>
                  <div class="form-group"><textarea class="form-input" name="message"
                      placeholder="Describe your matter…" rows="5" required></textarea></div>
                  <button type="submit" class="form-submit" id="contactSubmitBtn">
                    <span id="contactBtnText">Submit Enquiry</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </button>
                  <p class="form-note">By submitting, you acknowledge this does not create a solicitor-client
                    relationship until confirmed in writing.</p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>

  <!-- ════════════════════════════════════════════════════════════════════
     FOOTER
     ════════════════════════════════════════════════════════════════════ -->
  <footer>
    <div class="container">
      <div class="footer-grid">
        <div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
            <div
              style="width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold-mid));display:flex;align-items:center;justify-content:center;overflow:hidden">
              <img src="FIRM%20LOGO.jpeg" alt="Logo" style="width:100%;height:100%;object-fit:cover;border-radius:50%"
                onerror="this.style.display='none';this.parentElement.innerHTML='<svg width=\'26\' height=\'26\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'var(--darker)\' stroke-width=\'1.8\'><path d=\'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5\'/></svg>'" />
            </div>
          </div>
          <div class="footer-tagline">Counsel, <em style="color:var(--gold);font-style:italic">considered.</em></div>
          <p class="footer-desc">Indigenous Ugandan firm serving domestic and international clientele across East Africa
            and beyond.</p>
        </div>
        <div>
          <div class="footer-col-label">Visit</div>
          <p style="font-size:13.5px;opacity:.85;line-height:1.75">Plot 75 Kampala Road<br />E-Tower Building<br />4th
            Floor, Suite D-06<br />P.O. Box 70643<br />Kampala, Uganda</p>
        </div>
        <div>
          <div class="footer-col-label">Direct</div>
          <div class="footer-links">
            <a href="tel:+256772418707" class="footer-link">+256 772 418 707</a>
            <a href="tel:+256776044004" class="footer-link">+256 776 044 004</a>
            <a href="mailto:kasaijaandpartners@gmail.com" class="footer-link"
              style="margin-top:8px">kasaijaandpartners@gmail.com</a>
          </div>
        </div>
        <div>
          <div class="footer-col-label">Quick Links</div>
          <div class="footer-social">
            <button onclick="showPage('about')"
              style="color:var(--cream);font-size:13px;opacity:.7;text-align:left;cursor:pointer;transition:opacity .25s"
              onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='.7'">About the Firm</button>
            <button onclick="showPage('practice')"
              style="color:var(--cream);font-size:13px;opacity:.7;text-align:left;cursor:pointer;transition:opacity .25s"
              onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='.7'">Practice Areas</button>
            <button onclick="showPage('team')"
              style="color:var(--cream);font-size:13px;opacity:.7;text-align:left;cursor:pointer;transition:opacity .25s"
              onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='.7'">Our Team</button>
            <button onclick="showPage('appointments')"
              style="color:var(--cream);font-size:13px;opacity:.7;text-align:left;cursor:pointer;transition:opacity .25s"
              onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='.7'">Book Appointment</button>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 R. Kasaija &amp; Partners Advocates. All rights reserved.</span>
        <span class="mono">ULS · EALS · ICAMEK</span>
      </div>
    </div>
  </footer>

  <!-- ════════════════════════════════════════════════════════════════════
     AI CHAT WIDGET
     ════════════════════════════════════════════════════════════════════ -->
  <div class="chat-window hidden" id="chatWindow">
    <!-- Header -->
    <div class="chat-header">
      <div class="chat-header-top">
        <div style="display:flex;align-items:center;">
          <div class="chat-avatar" style="overflow:hidden">
            <img src="assets/img/firm_logo.jpeg" style="width:100%;height:100%;object-fit:cover;" alt="Logo" />
            <div class="chat-avatar-dot"></div>
          </div>
          <div class="chat-header-info">
            <div class="chat-title">Kasaija AI</div>
            <div class="chat-subtitle">R. Kasaija &amp; Partners Advocates</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;position:relative;z-index:1;">
          <div class="chat-status-pill"><span class="chat-status-dot"></span>Online</div>
          <button class="chat-close" onclick="closeChat()" aria-label="Close chat">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
      <div class="chat-header-bottom">
        <div style="font-size:11.5px;opacity:.55;line-height:1.4;">Your legal intake assistant — ask me anything about
          our services, team, or how to get help.</div>
      </div>
    </div>
    <!-- Quick suggestion chips -->
    <div class="chat-quick-bar" id="chatQuickBar">
      <button class="chat-quick-chip" onclick="quickAsk('What services do you offer?')">Our Services</button>
      <button class="chat-quick-chip" onclick="quickAsk('How do I book a consultation?')">Book a Consultation</button>
      <button class="chat-quick-chip" onclick="quickAsk('I have a land dispute')">Land Dispute</button>
      <button class="chat-quick-chip" onclick="quickAsk('I need help with a business matter')">Business Law</button>
      <button class="chat-quick-chip" onclick="quickAsk('Where are you located?')">Location &amp; Hours</button>
      <button class="chat-quick-chip" onclick="quickAsk('I need urgent legal help')">Urgent Help</button>
    </div>
    <!-- Messages -->
    <div class="chat-messages" id="chatMessages"></div>
    <!-- Input -->
    <div class="chat-input-area">
      <div class="chat-input-row">
        <textarea class="chat-input" id="chatInput" placeholder="Type your question or describe your situation…"
          rows="1" onkeydown="chatKeyDown(event)"></textarea>
        <button class="chat-send" id="chatSend" onclick="sendChatMessage()" disabled aria-label="Send">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
      <div class="chat-footer-note">Confidential intake only · Not a substitute for legal advice</div>
    </div>
  </div>

  <!-- Scroll-to-top -->
  <button id="scrollTopBtn" onclick="window.scrollTo({top:0,behavior:'smooth'})" aria-label="Back to top">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
  </button>

  <button class="chat-fab" id="chatFab" onclick="openChat()" aria-label="Open AI Chat">
    <span class="chat-fab-ring"></span>
    <span class="chat-fab-icon">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </span>
    <span class="chat-fab-label">Ask Kasaija AI</span>
  </button>

  <!-- ════════════════════════════════════════════════════════════════════
     JAVASCRIPT
     ════════════════════════════════════════════════════════════════════ -->
  <script>
    // ─── Data ─────────────────────────────────────────────────────────────────────
    const PRACTICE_AREAS = [
      { id: "banking", num: "01", name: "Banking & Finance", desc: "Structured finance, syndicated lending, e-banking, insurance claims, and project financing across East Africa.", lawyer: "Robert Kasaija", long: "We understand your insurance, banking and financing needs. Our practice includes general insurance banking, structured finance, syndicated and general lending, asset and project finance, guarantees, derivatives, debentures and charges. We have acted as counsel for numerous foreign and local investors, foreign donor agencies and government bodies." },
      { id: "corporate", num: "02", name: "Corporate & Commercial", desc: "Mergers, acquisitions, foreign investment, company secretarial work, and cross-border transactions.", lawyer: "Justin Joseph Kasaija", long: "We are your partners in achieving your commercial and investment goals. Our firm has served as in-house counsel and company secretaries for foreign and local clients, handling equity and contractual joint ventures, wholly owned foreign enterprises, holding companies, and financial and management agreements." },
      { id: "debt", num: "03", name: "Debt Recovery", desc: "Proven recovery record for H.K Financial Services, Save and Invest, S.N Financial Services, and Twezimbe Investment Group.", lawyer: "Sharon Murungi", long: "The firm has recovered substantial sums on behalf of clients including H.K Financial Services Limited, Save and Invest Limited, S.N Financial Services Limited, Tin Link Financial Solutions, Agwotwe Financial Services, and Twezimbe Investment Group." },
      { id: "land", num: "04", name: "Land & Conveyancing", desc: "Title searches, mortgages, caveats, due diligence, and full transactional support for property transfers.", lawyer: "Joseph Kwesiga", long: "We represent individuals and companies in land and property matters. We ensure due diligence searches to authenticate land particulars, handle sale and purchase transactions through final transfers, secure mortgage transactions, process special certificates of title, and lodge and lift caveats." },
      { id: "ip", num: "05", name: "Intellectual Property", desc: "Trademark and patent registration, enforcement, and Uganda's first unfair competition and predatory pricing action.", lawyer: "Sharon Murungi", long: "We handle property rights agreements, trademark and patent application procedures, declarations of use, and renewals. We successfully enforced IP rights in matters involving trademark violations, licensing and exploitation in Uganda, and handled the first unfair competition and predatory pricing action in the country." },
      { id: "family", num: "06", name: "Family & Probate", desc: "Divorce, custody, child maintenance, adoption, guardianship, wills, and succession.", lawyer: "Sharon Murungi", long: "We ensure your testamentary wishes are recorded and enforced. Our work covers trusts and estates, wills, succession, probate, divorce, separations, custody, child maintenance, adoption, and guardianship." },
      { id: "employment", num: "07", name: "Employment & Labour", desc: "Employment contracts, redundancies, trade union relations, pension audits, and managerial compensation.", lawyer: "Sharon Murungi", long: "We know your most important relationships are with employers and employees. We advise on employment contracts, handling redundancies, trade union relations, remuneration and incentive systems, pension funds and social security audits, expatriation, and managerial compensation." },
      { id: "criminal", num: "08", name: "Criminal Law", desc: "Criminal defence, private investigations, and retained partnerships with leading security firms.", lawyer: "Robert Kasaija", long: "We have represented clients in numerous criminal proceedings with an impressive record. We handle private investigations and are retained by security companies, conducting thorough investigative work that concludes cases efficiently." },
      { id: "adr", num: "09", name: "Arbitration & ADR", desc: "ICAMEK-accredited arbitration, mediation, and negotiation. Business-minded resolution over costly litigation.", lawyer: "Robert Kasaija", long: "Our Managing Partner is a member of ICAMEK. We strongly believe in approaching clients' problems with business acumen — time is money, and we encourage clients to embrace alternative dispute resolution mechanisms wherever strategically appropriate." },
      { id: "tax", num: "10", name: "Revenue Law & Taxation", desc: "Corporate tax advisory, takeovers, reorganisations, and strategic tax planning for directors and shareholders.", lawyer: "Robert Kasaija", long: "We advise clients on varied tax issues with an emphasis on corporate matters including takeovers, mergers, reorganisations, financing, and privatisation, as well as tax planning for managing directors and shareholders." },
      { id: "ngo", num: "11", name: "Non-Profit & NGO", desc: "NGO formation, compliance, financing, and governance. Pro-bono partner of Uganda Christian Lawyers Fraternity.", lawyer: "Joseph Kwesiga", long: "We work extensively with NGOs — from formation through financing, performance monitoring, and general legal work. We also provide pro-bono legal services to the Uganda Christian Lawyers Fraternity and the Uganda Law Society." },
      { id: "compliance", num: "12", name: "Governance & Compliance", desc: "Compliance programs, regulatory advisory, and integration of governance with operational requirements.", lawyer: "Justin Joseph Kasaija", long: "We monitor developments in this rapidly evolving area and advise institutional and individual clients on regulatory obligations. We design and implement compliance programs to deter inadvertent and purposeful failures to heed laws and regulations." },
    ];

    const STAFF = [
      { name: "Robert Kasaija", role: "Managing Partner", focus: "Corporate Finance · Real Estate · Arbitration · Litigation", bio: "Over 20 years in legal practice. Commissioner for Oaths, Notary Public, ICAMEK arbitrator. Represents Shengli Engineering Company and numerous multinationals.", creds: ["LLB (Hons), UCU", "PGD Legal Practice, LDC", "Justice Advocacy Cert. (Canada/USA)", "Member — ICAMEK, ULS, EALS"], photo: "assets/img/counsel_robert.jpeg" },
      { name: "Sharon Murungi", role: "Partner — Head of Litigation", focus: "Commercial · Labour · Tax · Arbitration · Family Law", bio: "Head of Litigation and Dispute Resolution. Former protection manager at HIJRA/UNHCR and legal aid provider with the Uganda Christian Lawyers Fraternity.", creds: ["LLB (Hons), UCU", "PGD Legal Practice, LDC", "Justice Advocacy Cert. (Canada/USA)", "Member — ULS, EALS"], photo: "assets/img/counsel_sharon.jpeg" },
      { name: "Joseph Kwesiga", role: "Partner", focus: "Environmental · Land · Procurement · Insurance", bio: "Legal Officer and Head of Prosecutions at the National Forestry Authority. Deep expertise in environmental litigation and procurement law.", creds: ["LLB (Hons), UCU", "PGD Legal Practice, LDC", "Member — ULS, EALS"], photo: "assets/img/counsel_joseph.jpeg" },
      { name: "Justin Joseph Kasaija", role: "Associate — Head of Administration", focus: "Corporate Governance · Business Advisory", bio: "Advises national and multinational companies on business planning and risk mitigation. Board member of Sage Buyers, Black Market Entertainment, Inveseed, and Koisan Investments.", creds: ["LLB (Hons)", "LDC (Hons)", "Member — Rotary Kampala Metropolitan"], photo: "assets/img/counsel_justine_junior.jpeg" },
      { name: "Christopher Baluku", role: "Associate", focus: "Submissions · Pleadings · Research", bio: "Well grounded in preparation of submissions and pleadings. Strong research contribution across the firm's litigation portfolio.", creds: ["LLB (Hons)", "LDC (Hons)"], photo: "assets/img/counsel_chris.jpeg" },
      { name: "Fred Asiimwe", role: "Associate", focus: "Civil Litigation · Research", bio: "Extensive experience in civil litigation, research, and preparation of pleadings.", creds: ["LLB (Hons)", "LDC (Hons)"], photo: "assets/img/counsel_fred.jpeg" },
      { name: "Oscar Musiime", role: "Associate", focus: "Companies · Business Startup Advisory", bio: "Runs administration of interning lawyers at the firm. Expert in company formation and business startup advisory.", creds: ["LLB (Hons)", "LDC (Hons)"], photo: "assets/img/counsel_oscar.jpeg" },
    ];

    // ─── Page navigation ──────────────────────────────────────────────────────────
    let currentPage = 'home';
    function showPage(id) {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      const el = document.getElementById('page-' + id);
      if (el) { el.classList.add('active'); }
      document.querySelectorAll('.nav-link[data-page]').forEach(b => {
        b.classList.toggle('active', b.dataset.page === id);
      });
      currentPage = id;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(initReveal, 100);
      if (id === 'team' && !document.getElementById('teamGrid').children.length) buildTeam();
      if (id === 'practice' && !document.getElementById('fullPracticeGrid').children.length) buildPractice();
    }

    // ─── Build Practice grid ──────────────────────────────────────────────────────
    function buildPracticeHome() {
      const g = document.getElementById('homePracticeGrid');
      if (!g || g.children.length) return;
      PRACTICE_AREAS.slice(0, 6).forEach(p => g.appendChild(createPCard(p, false)));
    }
    function buildPractice() {
      const g = document.getElementById('fullPracticeGrid');
      if (!g) return;
      g.innerHTML = '';
      PRACTICE_AREAS.forEach(p => g.appendChild(createPCard(p, true)));
    }
    function createPCard(p, clickable) {
      const d = document.createElement('button');
      d.className = 'pcard reveal';
      d.innerHTML = `
    <div class="pcard-num">${p.num}</div>
    <svg class="pcard-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
    <div class="pcard-name">${p.name}</div>
    <div class="pcard-desc">${p.desc}</div>
    <div class="pcard-foot"><span>Lead</span><span>${p.lawyer.split(' ')[0]}</span></div>`;
      if (clickable) {
        d.onclick = () => toggleAreaDetail(p, d);
      } else {
        d.onclick = () => { showPage('practice'); setTimeout(() => toggleAreaDetail(p, null), 200); };
      }
      return d;
    }
    let selectedAreaId = null;
    function toggleAreaDetail(p, btn) {
      const det = document.getElementById('areaDetail');
      if (!det) return;
      document.querySelectorAll('#fullPracticeGrid .pcard').forEach(c => c.classList.remove('selected'));
      if (selectedAreaId === p.id) {
        selectedAreaId = null;
        det.style.display = 'none';
        return;
      }
      selectedAreaId = p.id;
      if (btn) btn.classList.add('selected');
      det.style.display = 'block';
      det.innerHTML = `
    <div class="area-detail">
      <div class="area-detail-num">${p.num}</div>
      <div class="label" style="margin-bottom:16px">§ Practice · ${p.num}</div>
      <div class="area-detail-name">${p.name}</div>
      <p class="area-detail-text">${p.long}</p>
      <div class="area-detail-foot">
        <div><div class="area-detail-lawyer-label">Lead advocate</div><div class="area-detail-lawyer">${p.lawyer}</div></div>
        <button class="btn-primary" onclick="openChat()" style="margin-left:auto">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          Discuss this matter
        </button>
      </div>
    </div>`;
      det.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // ─── Build Team grid ───────────────────────────────────────────────────────────
    function buildTeam() {
      const g = document.getElementById('teamGrid');
      if (!g) return;
      // Build complete HTML in one pass — avoids the innerHTML+= loop that destroys
      // and recreates DOM nodes on every iteration, cancelling in-flight image loads.
      const parts = STAFF.map((s, i) => {
        const initials = s.name.split(' ').slice(0, 2).map(n => n[0]).join('');
        const roleParts = s.role.split(' — ');
        const badge = roleParts.length > 1 ? roleParts[1] : roleParts[0];
        return `
      <div class="team-card reveal" style="animation-delay:${i * 60}ms">
        <div class="team-photo-wrap">
          <div class="team-initials">${initials}</div>
          <img class="team-photo" src="${s.photo}" alt="${s.name}" loading="eager" decoding="async"
            onload="this.previousElementSibling.style.display='none'"
            onerror="this.style.display='none'"/>
          <div class="team-photo-gradient"></div>
          <div class="team-photo-badge">${badge}</div>
          <div class="team-name-over">
            <div class="team-name">${s.name}</div>
            <div class="team-role">${roleParts[0]}</div>
          </div>
        </div>
        <div class="team-card-body">
          <div class="team-focus-label">Practice Focus</div>
          <div class="team-focus">${s.focus}</div>
          <div class="team-bio">${s.bio}</div>
          <div class="team-creds">${s.creds.map(c => `<span class="cred-tag">${c}</span>`).join('')}</div>
        </div>
      </div>`;
      });
      g.innerHTML = parts.join('');
      setTimeout(initReveal, 80);
    }

    // ─── Scroll reveal ─────────────────────────────────────────────────────────────
    function initReveal() {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: .1, rootMargin: '0px 0px -60px 0px' });
      document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));
    }

    // ─── Headline animation ────────────────────────────────────────────────────────
    function animateHeadline() {
      const delays = [0, 200, 260, 400, 460, 600];
      ['hw0', 'hw1', 'hw2', 'hw3', 'hw4', 'hw5'].forEach((id, wi) => {
        const el = document.getElementById(id);
        if (!el) return;
        const word = el.textContent;
        el.innerHTML = '';
        word.split('').forEach((ch, ci) => {
          const s = document.createElement('span');
          s.className = 'hl-char';
          s.textContent = ch === ' ' ? '\u00A0' : ch;
          s.style.animationDelay = (delays[wi] + ci * 18) + 'ms';
          el.appendChild(s);
        });
      });
    }

    // ─── Mobile menu ───────────────────────────────────────────────────────────────
    function toggleMenu() {
      document.getElementById('mobileMenu').classList.toggle('open');
    }
    function closeMenu() {
      document.getElementById('mobileMenu').classList.remove('open');
    }

    // ─── Custom cursor ─────────────────────────────────────────────────────────────
    const cursor = document.getElementById('cursor');
    if (window.innerWidth >= 1024) {
      document.addEventListener('mousemove', e => {
        cursor.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
      });
      document.addEventListener('mouseover', e => {
        const t = e.target;
        cursor.classList.toggle('hover', !!(t.closest('button') || t.closest('a') || t.closest('.pcard')));
      });
    }

    // ─── Shared utility ───────────────────────────────────────────────────────────
    function safeHtml(s) {
      return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    // ─── AI Chat — SSE Streaming Engine ──────────────────────────────────────────
    let chatMessages = [];
    let chatLoading  = false;

    const chatTime = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    // ── Open / close ──────────────────────────────────────────────────────────
    function openChat() {
      document.getElementById('chatWindow').classList.remove('hidden');
      document.getElementById('chatFab').style.display = 'none';
      if (chatMessages.length === 0) {
        streamGreeting("Good day! I am Kasaija AI, your legal intake assistant for R. Kasaija & Partners Advocates.\n\nHow may I assist you today?\n• General legal questions about Ugandan law\n• Information about our services and team\n• Book a consultation\n• Find our office & contact details");
      }
      setTimeout(() => document.getElementById('chatInput').focus(), 320);
    }

    function closeChat() {
      document.getElementById('chatWindow').classList.add('hidden');
      document.getElementById('chatFab').style.display = 'flex';
    }

    function quickAsk(text) {
      const inp = document.getElementById('chatInput');
      inp.value = text;
      document.getElementById('chatSend').disabled = false;
      sendChatMessage();
      const bar = document.getElementById('chatQuickBar');
      if (bar) { bar.style.transition = 'all .35s ease'; bar.style.maxHeight = '0'; bar.style.padding = '0'; bar.style.overflow = 'hidden'; }
    }

    // ── Simple message for user side & errors ─────────────────────────────────
    function addChatMessage(role, text) {
      chatMessages.push({ role, content: text });
      const wrap = document.getElementById('chatMessages');
      const d    = document.createElement('div');
      d.className = `msg ${role === 'assistant' ? 'assistant' : 'user'}`;
      const lines = text.split('\n');
      const linesHtml = lines.map((l, i) =>
        `<span class="msg-line" style="animation-delay:${i * 36}ms">${l === '' ? '&nbsp;' : escHtml(l)}</span>`
      ).join('');
      if (role === 'assistant') {
        d.innerHTML = `
          <div class="msg-avatar-sm" style="overflow:hidden">
            <img src="FIRM%20LOGO.jpeg" style="width:100%;height:100%;object-fit:cover;" alt="Kasaija AI"
                 onerror="this.style.display='none'"/>
          </div>
          <div class="msg-content">
            <div class="msg-bubble">${linesHtml}</div>
            <div class="msg-time">${chatTime()}</div>
          </div>`;
      } else {
        d.innerHTML = `
          <div class="msg-content">
            <div class="msg-bubble">${linesHtml}</div>
            <div class="msg-time">${chatTime()}</div>
          </div>`;
      }
      wrap.appendChild(d);
      wrap.scrollTop = wrap.scrollHeight;
    }

    // ── Animated greeting on first open (no network call needed) ─────────────
    function streamGreeting(text) {
      chatMessages.push({ role: 'assistant', content: text });
      const wrap = document.getElementById('chatMessages');
      const d    = document.createElement('div');
      d.className = 'msg assistant';
      d.innerHTML = `
        <div class="msg-avatar-sm" style="overflow:hidden">
          <img src="FIRM%20LOGO.jpeg" style="width:100%;height:100%;object-fit:cover;" alt="Kasaija AI"
               onerror="this.style.display='none'"/>
        </div>
        <div class="msg-content">
          <div class="msg-bubble" id="greetBubble"></div>
          <div class="msg-time">${chatTime()}</div>
        </div>`;
      wrap.appendChild(d);
      const bubble = document.getElementById('greetBubble');
      const renderer = makeRenderer(bubble, wrap);
      const lines = text.split('\n');
      lines.forEach((line, i) => setTimeout(() => { renderer.line(line); }, i * 52));
    }

    // ── Typing indicator ──────────────────────────────────────────────────────
    function showTyping() {
      const wrap = document.getElementById('chatMessages');
      const d    = document.createElement('div');
      d.className = 'msg assistant';
      d.id = 'typingIndicator';
      d.innerHTML = `
        <div class="msg-avatar-sm" style="overflow:hidden">
          <img src="FIRM%20LOGO.jpeg" style="width:100%;height:100%;object-fit:cover;" alt="Kasaija AI"
               onerror="this.style.display='none'"/>
        </div>
        <div class="msg-content">
          <div class="chat-typing">
            <span class="dot-b"></span>
            <span class="dot-b" style="animation-delay:.15s"></span>
            <span class="dot-b" style="animation-delay:.3s"></span>
          </div>
        </div>`;
      wrap.appendChild(d);
      wrap.scrollTop = wrap.scrollHeight;
    }
    function hideTyping() {
      document.getElementById('typingIndicator')?.remove();
    }

    // ── Per-message line renderer (closure, no shared state) ─────────────────
    function makeRenderer(bubble, wrap) {
      let currentSpan = null;
      let firstLine   = true;

      return {
        line(text) {
          if (!firstLine) {
            if (text === '') {
              const gap = document.createElement('span');
              gap.className = 'msg-line-gap';
              bubble.appendChild(gap);
              currentSpan = null;
            } else {
              currentSpan = document.createElement('span');
              currentSpan.className = 'msg-line';
              currentSpan.textContent = text;
              bubble.appendChild(currentSpan);
            }
          } else {
            currentSpan = document.createElement('span');
            currentSpan.className = 'msg-line';
            currentSpan.textContent = text;
            bubble.appendChild(currentSpan);
            firstLine = false;
          }
          wrap.scrollTop = wrap.scrollHeight;
        },
        append(text) {
          // Append to current span (for mid-sentence Gemini chunks)
          if (!currentSpan) { this.line(text); return; }
          currentSpan.textContent += text;
          wrap.scrollTop = wrap.scrollHeight;
        },
        newline() {
          currentSpan = null;
        },
        image(ev) {
          const imgWrap = document.createElement('div');
          imgWrap.className = 'chat-img-wrap';
          imgWrap.innerHTML = `<img src="${ev.src}" alt="${escHtml(ev.alt || '')}" loading="lazy"
            onerror="this.closest('.chat-img-wrap').style.display='none'"/>
            ${ev.caption ? `<div class="chat-img-caption">${escHtml(ev.caption)}</div>` : ''}`;
          bubble.appendChild(imgWrap);
          wrap.scrollTop = wrap.scrollHeight;
        },
        setCursor(on) {
          if (on) bubble.classList.add('typing');
          else    bubble.classList.remove('typing');
        }
      };
    }

    // ── Main send — SSE streaming ─────────────────────────────────────────────
    async function sendChatMessage() {
      const inp  = document.getElementById('chatInput');
      const text = inp.value.trim();
      if (!text || chatLoading) return;

      inp.value = '';
      inp.style.height = 'auto';
      document.getElementById('chatSend').disabled = true;
      chatLoading = true;

      addChatMessage('user', text);
      showTyping();

      const wrap      = document.getElementById('chatMessages');
      let msgBubble   = null;
      let renderer    = null;
      let fullText    = '';
      let lineBuffer  = '';   // accumulates chars until \n for line renderer

      const controller = new AbortController();
      const watchdog   = setTimeout(() => controller.abort(), 35000);

      try {
        const history = chatMessages.slice(0, -1).map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          content: m.content
        }));

        const resp = await fetch('api/chat_stream.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, history }),
          signal: controller.signal
        });

        clearTimeout(watchdog);

        if (!resp.ok || !resp.body) throw new Error(`HTTP ${resp.status}`);

        const reader  = resp.body.getReader();
        const decoder = new TextDecoder();
        let sseBuf    = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          sseBuf += decoder.decode(value, { stream: true });

          // Process complete SSE events separated by \n\n
          let boundary;
          while ((boundary = sseBuf.indexOf('\n\n')) !== -1) {
            const block = sseBuf.slice(0, boundary);
            sseBuf = sseBuf.slice(boundary + 2);

            for (const line of block.split('\n')) {
              if (!line.startsWith('data: ')) continue;
              let ev;
              try { ev = JSON.parse(line.slice(6)); } catch { continue; }

              if (ev.type === 'start') {
                hideTyping();
                // Create the streaming message bubble
                const d = document.createElement('div');
                d.className = 'msg assistant streaming';
                d.innerHTML = `
                  <div class="msg-avatar-sm" style="overflow:hidden">
                    <img src="FIRM%20LOGO.jpeg" style="width:100%;height:100%;object-fit:cover;" alt="Kasaija AI"
                         onerror="this.style.display='none'"/>
                  </div>
                  <div class="msg-content">
                    <div class="msg-bubble stream-bubble"></div>
                    <div class="msg-time">${chatTime()}</div>
                  </div>`;
                wrap.appendChild(d);
                wrap.scrollTop = wrap.scrollHeight;
                msgBubble = d.querySelector('.stream-bubble');
                renderer  = makeRenderer(msgBubble, wrap);
                renderer.setCursor(true);
              }

              if (ev.type === 'chunk' && renderer) {
                const txt = ev.text || '';
                fullText += txt;
                // Split on \n and feed line-by-line into renderer
                const parts = txt.split('\n');
                if (parts.length === 1) {
                  // No newline — append to current line
                  if (lineBuffer === '' && parts[0] !== '') {
                    renderer.line(parts[0]);
                    lineBuffer = parts[0];
                  } else {
                    renderer.append(parts[0]);
                    lineBuffer += parts[0];
                  }
                } else {
                  // Has newlines — flush current line then start new ones
                  parts.forEach((part, i) => {
                    if (i === 0) {
                      if (lineBuffer === '' && part !== '') renderer.line(part);
                      else renderer.append(part);
                      lineBuffer = part;
                    } else {
                      renderer.newline();
                      lineBuffer = '';
                      if (part === '') {
                        renderer.line('');
                      } else {
                        renderer.line(part);
                        lineBuffer = part;
                      }
                    }
                  });
                }
              }

              if (ev.type === 'image' && renderer) {
                renderer.image(ev);
              }

              if (ev.type === 'done') {
                renderer?.setCursor(false);
                msgBubble?.closest('.msg')?.classList.remove('streaming');
                chatMessages.push({ role: 'assistant', content: fullText });
              }

              if (ev.type === 'error') {
                hideTyping();
                addChatMessage('assistant', ev.text || 'An error occurred. Please call +256 772 418 707.');
              }
            }
          }
        }

        // If stream closed without a 'done' event (network cut mid-stream)
        if (renderer) {
          renderer.setCursor(false);
          if (fullText && !chatMessages.find(m => m.content === fullText)) {
            chatMessages.push({ role: 'assistant', content: fullText });
          }
        }
        if (!msgBubble && !fullText) throw new Error('No response');

      } catch (err) {
        clearTimeout(watchdog);
        hideTyping();
        if (!fullText) {
          addChatMessage('assistant',
            'I apologise — a connectivity issue occurred.\n\n' +
            'Please contact us directly:\n' +
            '📞 +256 772 418 707\n' +
            '📱 WhatsApp: +256 776 044 004\n' +
            '✉️ kasaijaandpartners@gmail.com'
          );
        } else {
          renderer?.setCursor(false);
        }
      } finally {
        chatLoading = false;
        document.getElementById('chatSend').disabled = false;
        document.getElementById('chatInput').focus();
      }
    }

    function escHtml(s) {
      return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    function chatKeyDown(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); }
    }

    document.getElementById('chatInput').addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 100) + 'px';
      document.getElementById('chatSend').disabled = !this.value.trim();
    });

    // ─── Appointment form ──────────────────────────────────────────────────────────
    async function submitAppointment(e) {
      e.preventDefault();
      const form = document.getElementById('appointmentForm');
      const btn = document.getElementById('apptSubmitBtn');
      const btnText = document.getElementById('apptBtnText');
      btn.disabled = true;
      btnText.innerHTML = '<span class="spinner" style="width:16px;height:16px"></span> Submitting…';
      const data = Object.fromEntries(new FormData(form));
      try {
        const r = await fetch('api/book_appointment.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        const res = await r.json();
        if (res.success) {
          document.getElementById('apptFormInner').innerHTML = `
        <div class="form-success fade-in">
          <div class="success-icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div>
          <div class="success-title">Thank you, <em class="accent">${safeHtml(data.client_name.split(' ')[0])}</em>.</div>
          <p class="success-text">${res.message || 'Your appointment request has been received. An advocate will be in touch within one business day.'}</p>
          <button class="btn-outline" onclick="resetAppointmentForm()" style="margin-top:28px">Book another</button>
        </div>`;
        } else {
          alert(res.error || 'Submission failed. Please try again.');
          btn.disabled = false;
          btnText.textContent = 'Request Appointment';
        }
      } catch (err) {
        alert('Network error. Please call +256 772 418 707 directly.');
        btn.disabled = false;
        btnText.textContent = 'Request Appointment';
      }
    }
    function resetAppointmentForm() {
      showPage('appointments');
    }

    // ─── Contact form ──────────────────────────────────────────────────────────────
    async function submitContact(e) {
      e.preventDefault();
      const form = document.getElementById('contactForm');
      const btn = document.getElementById('contactSubmitBtn');
      const btnText = document.getElementById('contactBtnText');
      btn.disabled = true;
      btnText.innerHTML = '<span class="spinner" style="width:16px;height:16px"></span> Sending…';
      const data = Object.fromEntries(new FormData(form));
      try {
        const r = await fetch('api/contact.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        const res = await r.json();
        if (res.success) {
          document.getElementById('contactFormInner').innerHTML = `
        <div class="form-success fade-in">
          <div class="success-icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div>
          <div class="success-title">Thank you, <em class="accent">${safeHtml(data.name.split(' ')[0])}</em>.</div>
          <p class="success-text">${res.message || 'Your enquiry has been received. An advocate will be in touch within one business day.'}</p>
          <button class="btn-outline" onclick="showPage('contact')" style="margin-top:28px">Send another</button>
        </div>`;
        } else {
          alert(res.error || 'Submission failed. Please try again.');
          btn.disabled = false;
          btnText.textContent = 'Submit Enquiry';
        }
      } catch (err) {
        alert('Network error. Please email kasaijaandpartners@gmail.com directly.');
        btn.disabled = false;
        btnText.textContent = 'Submit Enquiry';
      }
    }

    // ─── Init ──────────────────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
      animateHeadline();
      buildPracticeHome();
      setTimeout(initReveal, 300);
      // Ensure hero video plays (some browsers require explicit play call)
      const heroVid = document.querySelector('.hero-video');
      if (heroVid) {
        heroVid.muted = true;
        const p = heroVid.play();
        if (p && typeof p.then === 'function') {
          p.catch(() => {
            // Autoplay blocked — video stays hidden gracefully; static gradient bg shows
            heroVid.style.opacity = '0';
          });
        }
      }
    });
    window.addEventListener('scroll', initReveal, { passive: true });

    // ─── Navbar elevation on scroll ───────────────────────────────────────────
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 72);
      document.getElementById('scrollTopBtn').classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
  </script>
</body>

</html>