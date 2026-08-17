import React, { useState, useRef, useEffect } from "react";
import { Scale, Menu, X, ArrowRight, ArrowUpRight, Send, Phone, Mail, MapPin, Linkedin, Twitter, Globe, CheckCircle2, MessageCircle, Calendar, Shield, Award, Users, Briefcase, Sparkles } from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════
//  R. KASAIJA & PARTNERS — Editorial website
// ═══════════════════════════════════════════════════════════════════════

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
  { name: "Robert Kasaija", role: "Managing Partner", focus: "Corporate Finance • Real Estate • Arbitration • Litigation", bio: "Over 20 years in legal practice. Commissioner for Oaths, Notary Public, ICAMEK arbitrator. Represents Shengli Engineering Company and numerous multinationals.", creds: ["LLB (Hons), UCU", "PGD Legal Practice, LDC", "Justice Advocacy Cert. (Canada/USA)", "Member — ICAMEK, ULS, EALS"] },
  { name: "Sharon Murungi", role: "Partner — Head of Litigation", focus: "Commercial • Labour • Tax • Arbitration • Family Law", bio: "Head of Litigation and Dispute Resolution. Former protection manager at HIJRA/UNHCR and legal aid provider with the Uganda Christian Lawyers Fraternity.", creds: ["LLB (Hons), UCU", "PGD Legal Practice, LDC", "Justice Advocacy Cert. (Canada/USA)", "Member — ULS, EALS"] },
  { name: "Joseph Kwesiga", role: "Partner", focus: "Environmental • Land • Procurement • Insurance", bio: "Legal Officer and Head of Prosecutions at the National Forestry Authority. Deep expertise in environmental litigation and procurement law.", creds: ["LLB (Hons), UCU", "PGD Legal Practice, LDC", "Member — ULS, EALS"] },
  { name: "Justin Joseph Kasaija", role: "Associate — Head of Administration", focus: "Corporate Governance • Business Advisory", bio: "Advises national and multinational companies on business planning and risk mitigation. Board member of Sage Buyers, Black Market Entertainment, Inveseed, and Koisan Investments.", creds: ["LLB (Hons)", "LDC (Hons)", "Member — Rotary Kampala Metropolitan"] },
  { name: "Christopher Baluku", role: "Associate", focus: "Submissions • Pleadings • Research", bio: "Well grounded in preparation of submissions and pleadings. Strong research contribution across the firm's litigation portfolio.", creds: ["LLB (Hons)", "LDC (Hons)"] },
  { name: "Fred Asiimwe", role: "Associate", focus: "Civil Litigation • Research", bio: "Extensive experience in civil litigation, research, and preparation of pleadings.", creds: ["LLB (Hons)", "LDC (Hons)"] },
  { name: "Oscar Musiime", role: "Associate", focus: "Companies • Business Startup Advisory", bio: "Runs administration of interning lawyers at the firm. Expert in company formation and business startup advisory.", creds: ["LLB (Hons)", "LDC (Hons)"] },
];

const CLIENTS = ["Shengli Engineering", "H.K Financial Services", "Save and Invest", "S.N Financial Services", "Tin Link Financial", "Twezimbe Investment", "Agwotwe Financial", "National Forestry Authority"];

const SYSTEM_PROMPT = `You are Kasaija AI, the intake assistant for R. Kasaija & Partners Advocates, a law firm in Kampala, Uganda.

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

OFFICE: Plot 75 Kampala Road, E-Tower Building 4th Floor Suite D-06. Email: kasaijaandpartners@gmail.com. Phone: +256 772 418 707.`;

function AIAssistant({ open, onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Good day. I'm Kasaija AI — I help match you to the right advocate at our firm. What brings you here today?\n\n(Note: I handle intake and routing, not legal advice.)" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: SYSTEM_PROMPT, messages: apiMessages }),
      });
      const data = await res.json();
      const reply = data.content?.filter(b => b.type === "text").map(b => b.text).join("\n") || "I'm having trouble right now — please call +256 772 418 707.";
      setMessages(m => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Connection issue. Please call +256 772 418 707 directly." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 w-[min(440px,calc(100vw-2rem))] h-[min(640px,calc(100vh-6rem))] flex flex-col rounded-[20px] shadow-2xl overflow-hidden transition-all duration-500 ${open ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95 pointer-events-none"}`} style={{ background: "#FBF7EF", boxShadow: "0 24px 80px -20px rgba(61, 40, 23, 0.4), 0 0 0 1px rgba(61, 40, 23, 0.08)" }}>
      <div className="relative px-5 py-4 flex items-center justify-between overflow-hidden" style={{ background: "#2A1D10", color: "#FBF7EF" }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 0%, #B8956A 0%, transparent 50%)" }}></div>
        <div className="flex items-center gap-3 relative">
          <div className="w-10 h-10 rounded-full flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, #B8956A, #8B6F47)" }}>
            <Sparkles className="w-5 h-5" style={{ color: "#2A1D10" }} />
            <span className="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full border-2" style={{ background: "#4ADE80", borderColor: "#2A1D10" }}></span>
          </div>
          <div>
            <div className="font-serif text-base leading-tight tracking-tight">Kasaija AI</div>
            <div className="text-[10px] tracking-[0.15em] uppercase opacity-60">Online · Intake only</div>
          </div>
        </div>
        <button onClick={onClose} className="relative w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"><X className="w-4 h-4" /></button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} msg-in`} style={{ animationDelay: `${i * 40}ms` }}>
            <div className={`max-w-[85%] px-4 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "rounded-[18px] rounded-br-[4px]" : "rounded-[18px] rounded-bl-[4px]"}`} style={m.role === "user" ? { background: "#2A1D10", color: "#FBF7EF" } : { background: "white", color: "#2A1D10", boxShadow: "0 1px 2px rgba(61,40,23,0.06)" }}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start msg-in">
            <div className="px-4 py-3 rounded-[18px] rounded-bl-[4px] bg-white flex gap-1" style={{ boxShadow: "0 1px 2px rgba(61,40,23,0.06)" }}>
              <span className="dot-bounce" style={{ background: "#8B6F47" }}></span>
              <span className="dot-bounce" style={{ background: "#8B6F47", animationDelay: "0.15s" }}></span>
              <span className="dot-bounce" style={{ background: "#8B6F47", animationDelay: "0.3s" }}></span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t p-3 bg-white" style={{ borderColor: "#EFE5D2" }}>
        <div className="flex items-end gap-2">
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Describe your situation..." rows={1} className="flex-1 resize-none px-4 py-2.5 text-sm rounded-xl max-h-28 focus:outline-none transition-all" style={{ fontFamily: "inherit", background: "#FBF7EF", border: "1px solid transparent" }} onFocus={e => e.target.style.borderColor = "#8B6F47"} onBlur={e => e.target.style.borderColor = "transparent"} />
          <button onClick={send} disabled={loading || !input.trim()} className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-30 transition-all hover:scale-105 active:scale-95" style={{ background: "linear-gradient(135deg, #3D2817, #2A1D10)", color: "#FBF7EF" }}><Send className="w-4 h-4" /></button>
        </div>
        <p className="text-[10px] tracking-wide opacity-50 mt-2 text-center">Intake & routing only · Not legal advice</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════

export default function Site() {
  const [page, setPage] = useState("home");
  const [chatOpen, setChatOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorHover, setCursorHover] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  useEffect(() => {
    const move = e => setCursorPos({ x: e.clientX, y: e.clientY });
    const over = e => {
      const t = e.target;
      setCursorHover(t.tagName === "BUTTON" || t.tagName === "A" || (t.closest && (t.closest("button") !== null || t.closest("a") !== null)));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); };
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("revealed"); });
    }, { threshold: 0.12, rootMargin: "0px 0px -80px 0px" });
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [page]);

  const nav = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "practice", label: "Practice" },
    { id: "team", label: "Team" },
    { id: "portal", label: "Portal" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen relative" style={{ background: "#FBF7EF", color: "#2A1D10", fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=Inter+Tight:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { -webkit-font-smoothing: antialiased; }
        .font-serif { font-family: 'Fraunces', serif; font-optical-sizing: auto; font-variation-settings: "SOFT" 50; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        @keyframes pageIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .page-in { animation: pageIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }

        @keyframes letterUp { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
        .letter { display: inline-block; opacity: 0; animation: letterUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .line-mask { display: inline-block; overflow: hidden; vertical-align: top; padding: 0.12em 0.02em; margin: -0.12em -0.02em; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) both; }

        .reveal { opacity: 0; transform: translateY(40px); transition: opacity 1s cubic-bezier(0.22, 1, 0.36, 1), transform 1s cubic-bezier(0.22, 1, 0.36, 1); }
        .reveal.revealed { opacity: 1; transform: translateY(0); }
        .reveal-d1 { transition-delay: 0.1s; }
        .reveal-d2 { transition-delay: 0.2s; }
        .reveal-d3 { transition-delay: 0.3s; }

        .grain::after {
          content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
          opacity: 0.07; mix-blend-mode: multiply;
        }

        .link-u { position: relative; }
        .link-u::after { content: ""; position: absolute; left: 0; bottom: -3px; width: 0; height: 1px; background: currentColor; transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
        .link-u:hover::after, .link-u.active::after { width: 100%; }

        .btn-primary { position: relative; overflow: hidden; transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
        .btn-primary::before { content: ""; position: absolute; inset: 0; background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%); transform: translateX(-100%); transition: transform 0.6s; }
        .btn-primary:hover::before { transform: translateX(100%); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 30px -8px rgba(61, 40, 23, 0.5); }

        @keyframes dotBounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-5px); opacity: 1; } }
        .dot-bounce { width: 6px; height: 6px; border-radius: 50%; animation: dotBounce 1.4s infinite; }

        @keyframes msgIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .msg-in { animation: msgIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both; }

        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-track { animation: marquee 40s linear infinite; }

        @keyframes ringPulse { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.8); opacity: 0; } }
        .ring-pulse { animation: ringPulse 2s ease-out infinite; }

        .pcard { position: relative; overflow: hidden; }
        .pcard::before { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 2px; background: #8B6F47; transform: scaleX(0); transform-origin: left; transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
        .pcard:hover::before { transform: scaleX(1); }
        .pcard:hover .pcard-arrow { transform: translate(4px, -4px); }
        .pcard-arrow { transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); }

        .cursor-dot { position: fixed; top: 0; left: 0; width: 8px; height: 8px; border-radius: 50%; background: #2A1D10; pointer-events: none; z-index: 100; transition: width 0.3s, height 0.3s, margin 0.3s; mix-blend-mode: difference; }
        .cursor-dot.hover { width: 40px; height: 40px; background: #B8956A; margin: -16px 0 0 -16px; }

        em.accent { font-style: italic; color: #8B6F47; font-weight: 400; }

        .staff-card { transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
        .staff-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px -20px rgba(61, 40, 23, 0.25); }

        @keyframes scrollDown { 0% { transform: translateY(-100%); } 100% { transform: translateY(200%); } }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <div className={`cursor-dot hidden lg:block ${cursorHover ? "hover" : ""}`} style={{ transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)` }}></div>

      {/* NAV */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl border-b" style={{ background: "rgba(251, 247, 239, 0.82)", borderColor: "rgba(139, 111, 71, 0.15)" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
          <button onClick={() => setPage("home")} className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-full flex items-center justify-center transition-transform group-hover:scale-105" style={{ background: "#2A1D10" }}>
              <Scale className="w-5 h-5 relative z-10" style={{ color: "#B8956A" }} />
            </div>
            <div className="text-left">
              <div className="font-serif text-[17px] leading-none tracking-tight" style={{ color: "#2A1D10" }}>R. Kasaija <em className="accent">&</em> Partners</div>
              <div className="font-mono text-[9px] tracking-[0.25em] uppercase opacity-50 mt-1.5">Advocates · Kampala</div>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-10">
            {nav.map(n => (
              <button key={n.id} onClick={() => setPage(n.id)} className={`text-[13px] link-u transition-opacity ${page === n.id ? "font-medium active" : "opacity-60 hover:opacity-100"}`}>{n.label}</button>
            ))}
            <button onClick={() => setChatOpen(true)} className="btn-primary flex items-center gap-2 pl-5 pr-2 py-2 rounded-full text-[13px]" style={{ background: "#2A1D10", color: "#FBF7EF" }}>
              <Sparkles className="w-3.5 h-3.5" /> Ask Kasaija AI
              <span className="w-7 h-7 rounded-full flex items-center justify-center ml-1" style={{ background: "#B8956A" }}>
                <ArrowRight className="w-3.5 h-3.5" style={{ color: "#2A1D10" }} />
              </span>
            </button>
          </div>

          <button className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center" onClick={() => setMenuOpen(!menuOpen)} style={{ background: "#2A1D10", color: "#FBF7EF" }}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t px-6 py-5 space-y-1" style={{ borderColor: "rgba(139, 111, 71, 0.15)", background: "#FBF7EF" }}>
            {nav.map(n => (
              <button key={n.id} onClick={() => { setPage(n.id); setMenuOpen(false); }} className="block w-full text-left py-2.5 font-serif text-lg">{n.label}</button>
            ))}
            <button onClick={() => { setChatOpen(true); setMenuOpen(false); }} className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm" style={{ background: "#2A1D10", color: "#FBF7EF" }}>
              <Sparkles className="w-4 h-4" /> Ask Kasaija AI
            </button>
          </div>
        )}
      </nav>

      <div key={page} className="page-in">
        {page === "home" && <Home setPage={setPage} setSelectedArea={setSelectedArea} openChat={() => setChatOpen(true)} />}
        {page === "about" && <About />}
        {page === "practice" && <Practice selectedArea={selectedArea} setSelectedArea={setSelectedArea} openChat={() => setChatOpen(true)} />}
        {page === "team" && <Team />}
        {page === "portal" && <Portal />}
        {page === "contact" && <Contact />}
      </div>

      <footer className="relative mt-24 overflow-hidden" style={{ background: "#1F1308", color: "#FBF7EF" }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse at top, #B8956A 0%, transparent 60%)" }}></div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 pb-10 relative">
          <div className="grid lg:grid-cols-12 gap-12 mb-16">
            <div className="lg:col-span-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #B8956A, #8B6F47)" }}>
                  <Scale className="w-6 h-6" style={{ color: "#1F1308" }} />
                </div>
              </div>
              <h3 className="font-serif text-4xl md:text-5xl leading-tight mb-4" style={{ letterSpacing: "-0.02em" }}>Counsel, <em className="accent">considered.</em></h3>
              <p className="text-[15px] opacity-60 leading-relaxed max-w-md">Indigenous Ugandan firm serving domestic and international clientele across East Africa and beyond.</p>
            </div>
            <div className="lg:col-span-2">
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase opacity-50 mb-5">Visit</div>
              <p className="text-sm opacity-90 leading-relaxed">Plot 75 Kampala Road<br />E-Tower Building<br />4th Floor, Suite D-06<br />P.O. Box 70643<br />Kampala, Uganda</p>
            </div>
            <div className="lg:col-span-2">
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase opacity-50 mb-5">Direct</div>
              <div className="space-y-1.5 text-sm">
                <a href="tel:+256772418707" className="block opacity-80 hover:opacity-100 link-u w-fit">+256 772 418 707</a>
                <a href="tel:+256776044004" className="block opacity-80 hover:opacity-100 link-u w-fit">+256 776 044 004</a>
                <a href="mailto:kasaijaandpartners@gmail.com" className="block opacity-80 hover:opacity-100 link-u w-fit mt-3">kasaijaandpartners@gmail.com</a>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase opacity-50 mb-5">Follow</div>
              <div className="space-y-2 text-sm">
                <a href="#" className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity"><Linkedin className="w-4 h-4" />LinkedIn</a>
                <a href="#" className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity"><Twitter className="w-4 h-4" />X/Twitter</a>
                <a href="#" className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity"><Globe className="w-4 h-4" />kasaijaandpartners.com</a>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row justify-between gap-3 text-xs opacity-50 border-t" style={{ borderColor: "rgba(184, 149, 106, 0.15)" }}>
            <div>© 2026 R. Kasaija & Partners Advocates. All rights reserved.</div>
            <div className="font-mono tracking-wider">ULS · EALS · ICAMEK</div>
          </div>
        </div>
      </footer>

      <AIAssistant open={chatOpen} onClose={() => setChatOpen(false)} />

      {!chatOpen && (
        <button onClick={() => setChatOpen(true)} className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 group" style={{ background: "linear-gradient(135deg, #3D2817, #2A1D10)", color: "#FBF7EF", boxShadow: "0 16px 40px -10px rgba(61, 40, 23, 0.5)" }}>
          <span className="absolute inset-0 rounded-full ring-pulse" style={{ background: "#B8956A" }}></span>
          <span className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(135deg, #3D2817, #2A1D10)" }}></span>
          <MessageCircle className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
}

// HOME ─────────────────────────────────────────────────────────────────

function AnimatedHeadline() {
  const lines = [
    { words: ["Counsel"], delay: 0 },
    { words: ["that", "moves"], delay: 200, italic: [1] },
    { words: ["with", "your"], delay: 400 },
    { words: ["business."], delay: 600 },
  ];
  let globalCharIndex = 0;

  return (
    <h1 className="font-serif leading-[0.92]" style={{ fontSize: "clamp(3rem, 9vw, 8.5rem)", letterSpacing: "-0.035em", color: "#2A1D10" }}>
      {lines.map((line, li) => (
        <div key={li} className="line-mask block">
          {line.words.map((word, wi) => {
            const chars = word.split("");
            const isItalic = line.italic?.includes(wi);
            return (
              <span key={wi} className="inline-block" style={isItalic ? { fontStyle: "italic", color: "#8B6F47", fontWeight: 400 } : {}}>
                {chars.map((c, ci) => {
                  const delay = line.delay + (globalCharIndex++ * 18);
                  return <span key={ci} className="letter" style={{ animationDelay: `${delay}ms` }}>{c}</span>;
                })}
                {wi < line.words.length - 1 && <span>&nbsp;</span>}
              </span>
            );
          })}
        </div>
      ))}
    </h1>
  );
}

function Home({ setPage, setSelectedArea, openChat }) {
  return (
    <>
      <section className="relative overflow-hidden grain" style={{ background: "linear-gradient(165deg, #FBF7EF 0%, #F2E7CE 50%, #E8D8B4 100%)" }}>
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 hidden lg:block opacity-[0.05] pointer-events-none">
          <Scale className="w-[700px] h-[700px]" style={{ color: "#2A1D10" }} />
        </div>
        <div className="absolute top-20 right-[15%] w-64 h-64 rounded-full hidden md:block opacity-40" style={{ background: "radial-gradient(circle, #B8956A 0%, transparent 70%)", filter: "blur(40px)" }}></div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24 lg:py-40 relative">
          <div className="fade-up flex items-center gap-3 mb-10" style={{ animationDelay: "0.1s" }}>
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-60">Est. Kampala</span>
            <div className="w-12 h-px" style={{ background: "#8B6F47" }}></div>
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-60">Advocates & Solicitors</span>
          </div>

          <AnimatedHeadline />

          <div className="fade-up grid lg:grid-cols-12 gap-10 mt-14 items-end" style={{ animationDelay: "1.4s" }}>
            <p className="lg:col-span-6 text-[17px] md:text-lg leading-[1.6] opacity-75" style={{ maxWidth: "54ch" }}>
              An indigenous Ugandan firm serving multinationals, financial institutions, and individuals across banking, corporate, land, and dispute resolution — with a business-minded ADR approach, backed by <em className="accent">ICAMEK</em> credentials and two decades of practice.
            </p>
            <div className="lg:col-span-6 flex flex-wrap gap-3 lg:justify-end">
              <button onClick={openChat} className="btn-primary flex items-center gap-3 px-7 py-4 rounded-full text-[14px] font-medium" style={{ background: "#2A1D10", color: "#FBF7EF" }}>
                <Sparkles className="w-4 h-4" /> Speak with Kasaija AI
              </button>
              <button onClick={() => setPage("practice")} className="flex items-center gap-3 px-7 py-4 rounded-full text-[14px] font-medium border-2 transition-all hover:bg-white/40" style={{ borderColor: "#2A1D10", color: "#2A1D10" }}>
                Our practice areas <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="fade-up mt-28 grid grid-cols-2 md:grid-cols-4 gap-10 pt-10 border-t" style={{ borderColor: "rgba(139, 111, 71, 0.3)", animationDelay: "1.7s" }}>
            {[
              { n: "20+", l: "Years of practice", sub: "Since founding" },
              { n: "12", l: "Practice areas", sub: "Full service" },
              { n: "ICAMEK", l: "Arbitrator", sub: "Managing Partner" },
              { n: "100%", l: "Ethical integrity", sub: "Non-negotiable" },
            ].map((s, i) => (
              <div key={i} className="group">
                <div className="font-serif text-5xl md:text-6xl mb-2 transition-colors group-hover:text-[#8B6F47]" style={{ color: "#2A1D10", letterSpacing: "-0.03em" }}>{s.n}</div>
                <div className="text-[13px] font-medium mb-1">{s.l}</div>
                <div className="font-mono text-[10px] tracking-wider uppercase opacity-50">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="font-mono text-[9px] tracking-[0.3em] uppercase">Scroll</div>
          <div className="w-px h-8 relative overflow-hidden" style={{ background: "rgba(42, 29, 16, 0.2)" }}>
            <div className="absolute top-0 w-full h-1/2" style={{ background: "#2A1D10", animation: "scrollDown 2s ease-in-out infinite" }}></div>
          </div>
        </div>
      </section>

      <section className="py-8 border-y overflow-hidden" style={{ background: "#2A1D10", color: "#FBF7EF", borderColor: "#1F1308" }}>
        <div className="flex marquee-track whitespace-nowrap">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-16 pr-16 shrink-0">
              {["Banking & Finance", "Corporate Law", "Debt Recovery", "Land & Conveyancing", "Intellectual Property", "Arbitration", "Family Law", "Criminal Defence", "Tax Advisory"].map((t, j) => (
                <div key={j} className="flex items-center gap-6">
                  <span className="font-serif text-xl md:text-2xl italic" style={{ color: "#B8956A" }}>{t}</span>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#B8956A" }}></span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="py-28 relative">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-3 gap-px" style={{ background: "rgba(139, 111, 71, 0.2)" }}>
            {[
              { h: "Goal", t: "To provide exceptional, affordable, quality legal consultancy and advisory services to our clientele with a diligent and professional touch.", n: "01" },
              { h: "Vision", t: "To be a one-stop centre law firm in East Africa and beyond.", n: "02" },
              { h: "Mission", t: "To provide excellent legal services in a professional manner that meets our clients' needs.", n: "03" },
            ].map((b, i) => (
              <div key={i} className="reveal p-10 md:p-12" style={{ background: "#FBF7EF", transitionDelay: `${i * 0.1}s` }}>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: "#8B6F47" }}>Our {b.h}</span>
                  <span className="font-mono text-xs opacity-40">{b.n}</span>
                </div>
                <p className="font-serif text-[22px] leading-[1.4]" style={{ color: "#2A1D10" }}>{b.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 relative" style={{ background: "#F6EDDA" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="reveal flex items-end justify-between mb-20 flex-wrap gap-6">
            <div>
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: "#8B6F47" }}>§ What we do</div>
              <h2 className="font-serif leading-[0.95]" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.025em" }}>
                Twelve disciplines.<br /><em className="accent">One standard.</em>
              </h2>
            </div>
            <button onClick={() => setPage("practice")} className="flex items-center gap-2 text-sm link-u font-medium">View all practice areas <ArrowUpRight className="w-4 h-4" /></button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "rgba(139, 111, 71, 0.2)" }}>
            {PRACTICE_AREAS.slice(0, 6).map((p, i) => (
              <button key={p.id} onClick={() => { setSelectedArea(p.id); setPage("practice"); }} className="pcard group reveal text-left p-8 lg:p-10 transition-all" style={{ background: "#FBF7EF", transitionDelay: `${(i % 3) * 0.08}s` }}>
                <div className="flex items-start justify-between mb-8">
                  <span className="font-mono text-[11px] tracking-wider opacity-40">{p.num}</span>
                  <ArrowUpRight className="w-4 h-4 pcard-arrow opacity-40" />
                </div>
                <div className="font-serif text-[26px] mb-4 leading-tight" style={{ color: "#2A1D10", letterSpacing: "-0.01em" }}>{p.name}</div>
                <p className="text-[13.5px] opacity-65 leading-relaxed mb-6">{p.desc}</p>
                <div className="pt-5 border-t flex items-center justify-between" style={{ borderColor: "rgba(139, 111, 71, 0.2)" }}>
                  <span className="font-mono text-[10px] tracking-wider uppercase opacity-50">Lead</span>
                  <span className="text-xs font-medium" style={{ color: "#8B6F47" }}>{p.lawyer}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 relative overflow-hidden" style={{ background: "#1F1308", color: "#FBF7EF" }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse at 30% 20%, #B8956A 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, #8B6F47 0%, transparent 50%)" }}></div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative">
          <div className="reveal font-mono text-[10px] tracking-[0.3em] uppercase mb-6 opacity-60">§ Why R. Kasaija & Partners</div>
          <h2 className="reveal reveal-d1 font-serif leading-[0.95] mb-20 max-w-4xl" style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", letterSpacing: "-0.025em" }}>
            Different by <em style={{ color: "#B8956A", fontStyle: "italic", fontWeight: 400 }}>principle,</em><br />not by promise.
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, h: "Ethical Integrity", t: "Professional ethics upheld with timely responses and transparent dealing." },
              { icon: Briefcase, h: "Business Acumen", t: "Cost-conscious, strategic, value-driven — your outcomes are our north star." },
              { icon: Users, h: "ADR-First", t: "Alternative dispute resolution to save you time, money, and reputation." },
              { icon: Award, h: "Collective Responsibility", t: "Team approach with a dedicated expert lead for every matter." },
            ].map((v, i) => (
              <div key={i} className="reveal group" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6 transition-all group-hover:scale-110 group-hover:rotate-6" style={{ background: "linear-gradient(135deg, #B8956A, #8B6F47)" }}>
                  <v.icon className="w-6 h-6" style={{ color: "#1F1308" }} />
                </div>
                <div className="font-serif text-2xl mb-3" style={{ letterSpacing: "-0.01em" }}>{v.h}</div>
                <p className="text-sm opacity-65 leading-relaxed">{v.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="reveal text-center mb-12">
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: "#8B6F47" }}>§ Trusted counsel for</div>
            <h3 className="font-serif text-3xl md:text-4xl" style={{ letterSpacing: "-0.02em" }}>Institutions, investors, individuals.</h3>
          </div>
          <div className="reveal flex flex-wrap justify-center gap-x-12 gap-y-6 max-w-4xl mx-auto">
            {CLIENTS.map((c, i) => (
              <div key={i} className="font-serif text-xl md:text-2xl italic opacity-50 hover:opacity-100 transition-opacity" style={{ color: "#2A1D10" }}>{c}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 relative grain overflow-hidden" style={{ background: "linear-gradient(165deg, #F6EDDA 0%, #E8D8B4 100%)" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center relative">
          <div className="reveal font-mono text-[10px] tracking-[0.3em] uppercase mb-8" style={{ color: "#8B6F47" }}>§ Begin</div>
          <h2 className="reveal reveal-d1 font-serif leading-[0.95] mb-8" style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)", letterSpacing: "-0.03em" }}>
            Ready to discuss<br />your <em className="accent">matter?</em>
          </h2>
          <p className="reveal reveal-d2 text-lg opacity-70 mb-12 max-w-xl mx-auto">Speak with Kasaija AI now for instant intake, or book a consultation directly with the right advocate.</p>
          <div className="reveal reveal-d3 flex flex-wrap gap-4 justify-center">
            <button onClick={openChat} className="btn-primary flex items-center gap-3 px-8 py-4 rounded-full text-sm font-medium" style={{ background: "#2A1D10", color: "#FBF7EF" }}>
              <Sparkles className="w-4 h-4" /> Start with AI Intake
            </button>
            <button onClick={() => setPage("contact")} className="flex items-center gap-3 px-8 py-4 rounded-full text-sm font-medium border-2 hover:bg-white/50 transition-all" style={{ borderColor: "#2A1D10", color: "#2A1D10" }}>
              <Calendar className="w-4 h-4" /> Book Consultation
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

function About() {
  return (
    <section className="pt-20 pb-28">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase mb-6 fade-up" style={{ color: "#8B6F47" }}>§ About the firm</div>
        <h1 className="fade-up font-serif leading-[0.95] mb-16 max-w-5xl" style={{ fontSize: "clamp(3rem, 8vw, 7rem)", letterSpacing: "-0.03em", animationDelay: "0.15s" }}>
          An indigenous firm<br />built for <em className="accent">East Africa</em>.
        </h1>

        <div className="grid lg:grid-cols-12 gap-12">
          <aside className="lg:col-span-4 reveal">
            <div className="sticky top-28 p-8 rounded-2xl" style={{ background: "#F6EDDA" }}>
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-4 opacity-60">At a glance</div>
              <div className="space-y-5">
                {[
                  { k: "Founded", v: "Kampala, Uganda" },
                  { k: "Partners", v: "3 partners + 4 associates" },
                  { k: "Experience", v: "20+ years" },
                  { k: "Memberships", v: "ULS · EALS · ICAMEK" },
                  { k: "Languages", v: "English · Runyankore · Luganda" },
                ].map((r, i) => (
                  <div key={i} className="flex justify-between gap-4 text-sm border-b pb-3 last:border-0" style={{ borderColor: "rgba(139, 111, 71, 0.2)" }}>
                    <span className="opacity-60">{r.k}</span>
                    <span className="font-medium text-right">{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <article className="lg:col-span-8 space-y-7 text-[17.5px] leading-[1.75]" style={{ color: "#2A1D10" }}>
            <p className="reveal">R. Kasaija & Partners Advocates is an indigenous, fast-growing law firm in Uganda. The firm provides consultation and legal services across a wide range of matters, with extensive resources and experience to handle substantial and complex transactions.</p>
            <p className="reveal reveal-d1">Our highly skilled team of lawyers is result-oriented. We provide professional legal services with integrity, an ethical touch, and expertise — prioritising the interests of both our domestic and international clientele. We respond efficiently to complex legal problems with flexible commercial solutions, helping clients achieve their business objectives.</p>
            <p className="reveal reveal-d2">Amongst the firm's clients are major national and international companies and individuals active in consumer goods, foods and beverages, health and medical, real estate and construction, energy and environment, banking, and project financing.</p>

            <div className="reveal pt-10">
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: "#8B6F47" }}>§ What we are</div>
              <h2 className="font-serif text-4xl md:text-5xl mb-6" style={{ color: "#2A1D10", letterSpacing: "-0.02em" }}>A full-service indigenous firm.</h2>
              <p>We are a firm of Advocates, Solicitors, Attorneys-at-Law, Legal, Investment and Tax Consultants, Commissioners for Oaths, Notary Public, Trademark and Patent Agents, Receivers, Liquidators, Debt Collectors, and Company Secretaries.</p>
              <p className="mt-5">Our team is well grounded in business and commercial law — covering corporate, mergers and acquisitions, labour and industrial disputes, land conveyance, banking and mortgages, insurance claims, intellectual property, adoption, divorce and child maintenance, inheritance, and investment law.</p>
            </div>

            <div className="reveal pt-10">
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: "#8B6F47" }}>§ Our approach to disputes</div>
              <h2 className="font-serif text-4xl md:text-5xl mb-6" style={{ color: "#2A1D10", letterSpacing: "-0.02em" }}>ADR first. Litigation when necessary.</h2>
              <p>We believe in alternative dispute resolution. The firm has been involved in substantial arbitration, mediation, and negotiation proceedings, and has secured meaningful out-of-court settlements on behalf of our clients. Our Managing Partner is a member of the International Centre for Arbitration and Mediation in Kampala (ICAMEK).</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function Practice({ selectedArea, setSelectedArea, openChat }) {
  const area = PRACTICE_AREAS.find(p => p.id === selectedArea);

  return (
    <section className="pt-20 pb-28">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase mb-6 fade-up" style={{ color: "#8B6F47" }}>§ What we do</div>
        <h1 className="fade-up font-serif leading-[0.95] mb-20" style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)", letterSpacing: "-0.03em", animationDelay: "0.15s" }}>
          Practice <em className="accent">Areas.</em>
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px mb-16" style={{ background: "rgba(139, 111, 71, 0.2)" }}>
          {PRACTICE_AREAS.map((p, i) => (
            <button key={p.id} onClick={() => setSelectedArea(p.id === selectedArea ? null : p.id)} className={`pcard reveal text-left p-8 lg:p-10 transition-all duration-500 ${p.id === selectedArea ? "z-10" : ""}`} style={{ background: p.id === selectedArea ? "#2A1D10" : "#FBF7EF", color: p.id === selectedArea ? "#FBF7EF" : "#2A1D10", transitionDelay: `${(i % 3) * 0.06}s` }}>
              <div className="flex items-start justify-between mb-8">
                <span className="font-mono text-[11px] tracking-wider opacity-40">{p.num}</span>
                <ArrowUpRight className="w-4 h-4 pcard-arrow opacity-50" />
              </div>
              <div className="font-serif text-[24px] mb-4 leading-tight" style={{ letterSpacing: "-0.01em" }}>{p.name}</div>
              <p className="text-[13px] opacity-65 leading-relaxed mb-6">{p.desc.substring(0, 100)}...</p>
              <div className="pt-5 border-t text-[11px] font-mono tracking-wider uppercase opacity-50 flex justify-between" style={{ borderColor: p.id === selectedArea ? "rgba(251, 247, 239, 0.2)" : "rgba(139, 111, 71, 0.2)" }}>
                <span>Lead</span>
                <span>{p.lawyer.split(" ")[0]}</span>
              </div>
            </button>
          ))}
        </div>

        {area && (
          <div className="reveal revealed p-10 md:p-16 rounded-3xl relative overflow-hidden" style={{ background: "linear-gradient(135deg, #F6EDDA 0%, #E8D8B4 100%)" }}>
            <div className="absolute top-6 right-6 font-serif text-[120px] opacity-10 leading-none" style={{ color: "#2A1D10" }}>{area.num}</div>
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase mb-6" style={{ color: "#8B6F47" }}>§ Practice · {area.num}</div>
            <h2 className="font-serif text-5xl md:text-6xl mb-8 max-w-3xl" style={{ color: "#2A1D10", letterSpacing: "-0.025em" }}>{area.name}</h2>
            <p className="text-lg leading-relaxed mb-10 max-w-3xl opacity-80">{area.long}</p>
            <div className="flex flex-wrap items-center gap-6 pt-8 border-t" style={{ borderColor: "rgba(139, 111, 71, 0.3)" }}>
              <div>
                <div className="font-mono text-[10px] tracking-wider uppercase opacity-60 mb-1">Lead advocate</div>
                <div className="font-serif text-2xl" style={{ color: "#2A1D10" }}>{area.lawyer}</div>
              </div>
              <button onClick={openChat} className="btn-primary ml-auto flex items-center gap-2 px-6 py-3 rounded-full text-sm" style={{ background: "#2A1D10", color: "#FBF7EF" }}>
                <Sparkles className="w-4 h-4" /> Discuss this matter
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Team() {
  return (
    <section className="pt-20 pb-28">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase mb-6 fade-up" style={{ color: "#8B6F47" }}>§ Our people</div>
        <h1 className="fade-up font-serif leading-[0.95] mb-20" style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)", letterSpacing: "-0.03em", animationDelay: "0.15s" }}>
          The team behind<br />every <em className="accent">matter.</em>
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {STAFF.map((s, i) => (
            <div key={i} className="staff-card reveal p-8 lg:p-10 rounded-2xl relative overflow-hidden" style={{ background: "#FBF7EF", border: "1px solid rgba(139, 111, 71, 0.15)", transitionDelay: `${(i % 2) * 0.1}s` }}>
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #8B6F47, transparent)" }}></div>
              <div className="flex items-start gap-5 mb-6 relative">
                <div className="w-20 h-20 rounded-full flex items-center justify-center font-serif text-3xl shrink-0 shadow-lg" style={{ background: "linear-gradient(135deg, #2A1D10, #3D2817)", color: "#B8956A", letterSpacing: "-0.02em" }}>
                  {s.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-[26px] leading-tight mb-1" style={{ color: "#2A1D10", letterSpacing: "-0.01em" }}>{s.name}</div>
                  <div className="text-sm font-medium" style={{ color: "#8B6F47" }}>{s.role}</div>
                </div>
              </div>
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase opacity-50 mb-2">Focus</div>
              <p className="text-[14px] mb-5 font-medium">{s.focus}</p>
              <p className="text-[14px] opacity-75 leading-relaxed mb-6">{s.bio}</p>
              <div className="pt-5 border-t flex flex-wrap gap-2" style={{ borderColor: "rgba(139, 111, 71, 0.15)" }}>
                {s.creds.map((c, j) => (
                  <span key={j} className="text-[11px] px-3 py-1.5 rounded-full font-medium" style={{ background: "#F6EDDA", color: "#3D2817" }}>{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Portal() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) {
    return (
      <section className="py-28 min-h-[70vh] flex items-center">
        <div className="max-w-md mx-auto px-6 w-full">
          <div className="fade-up p-10 rounded-3xl relative overflow-hidden" style={{ background: "#FBF7EF", border: "1px solid rgba(139, 111, 71, 0.15)", boxShadow: "0 20px 60px -20px rgba(61, 40, 23, 0.15)" }}>
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #B8956A, transparent)" }}></div>
            <div className="relative">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6" style={{ background: "linear-gradient(135deg, #B8956A, #8B6F47)" }}>
                <Shield className="w-6 h-6" style={{ color: "#2A1D10" }} />
              </div>
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: "#8B6F47" }}>§ Secure access</div>
              <h1 className="font-serif text-4xl mb-3" style={{ color: "#2A1D10", letterSpacing: "-0.02em" }}>Client Portal</h1>
              <p className="text-sm opacity-70 mb-8 leading-relaxed">View your active matters, download invoices, and securely upload documents.</p>
              <div className="space-y-3">
                <input type="email" placeholder="Email address" className="w-full px-4 py-3.5 rounded-xl border text-sm focus:outline-none transition-colors" style={{ borderColor: "rgba(139, 111, 71, 0.25)", background: "white" }} onFocus={e => e.target.style.borderColor = "#8B6F47"} onBlur={e => e.target.style.borderColor = "rgba(139, 111, 71, 0.25)"} />
                <input type="password" placeholder="Password" className="w-full px-4 py-3.5 rounded-xl border text-sm focus:outline-none transition-colors" style={{ borderColor: "rgba(139, 111, 71, 0.25)", background: "white" }} onFocus={e => e.target.style.borderColor = "#8B6F47"} onBlur={e => e.target.style.borderColor = "rgba(139, 111, 71, 0.25)"} />
                <button onClick={() => setLoggedIn(true)} className="btn-primary w-full py-3.5 rounded-xl text-sm font-medium" style={{ background: "#2A1D10", color: "#FBF7EF" }}>Sign In Securely</button>
              </div>
              <p className="text-xs opacity-50 text-center mt-6">Don't have an account? Contact the firm to request access.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-20 pb-28">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase mb-4 fade-up" style={{ color: "#8B6F47" }}>§ Welcome back</div>
        <h1 className="fade-up font-serif text-5xl md:text-6xl mb-16" style={{ letterSpacing: "-0.025em", animationDelay: "0.15s" }}>Your <em className="accent">matters.</em></h1>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {[
            { label: "Active matters", value: "3", sub: "2 awaiting input" },
            { label: "Documents", value: "27", sub: "12 MB total" },
            { label: "Outstanding", value: "UGX 0", sub: "All settled" },
          ].map((s, i) => (
            <div key={i} className="reveal p-8 rounded-2xl relative overflow-hidden" style={{ background: "#FBF7EF", border: "1px solid rgba(139, 111, 71, 0.15)", transitionDelay: `${i * 0.08}s` }}>
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase opacity-60 mb-3">{s.label}</div>
              <div className="font-serif text-5xl mb-2" style={{ color: "#2A1D10", letterSpacing: "-0.03em" }}>{s.value}</div>
              <div className="text-xs opacity-50">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="reveal p-8 lg:p-10 rounded-2xl mb-4" style={{ background: "#FBF7EF", border: "1px solid rgba(139, 111, 71, 0.15)" }}>
          <div className="flex items-center justify-between mb-6">
            <div className="font-serif text-2xl" style={{ letterSpacing: "-0.01em" }}>Recent Matters</div>
            <button className="text-xs opacity-60 link-u">View all</button>
          </div>
          <div>
            {[
              { ref: "KP/2026/0142", matter: "Corporate restructuring advisory", lead: "Robert Kasaija", status: "In progress", color: "#F2E7CE" },
              { ref: "KP/2026/0131", matter: "Trademark registration — Class 35", lead: "Sharon Murungi", status: "Awaiting URSB", color: "#F6EDDA" },
              { ref: "KP/2025/0998", matter: "Land title verification — Wakiso", lead: "Joseph Kwesiga", status: "Completed", color: "#E8F0E0" },
            ].map((m, i) => (
              <div key={i} className="flex items-center justify-between py-4 group cursor-pointer border-b last:border-0" style={{ borderColor: "rgba(139, 111, 71, 0.15)" }}>
                <div>
                  <div className="font-mono text-[10px] tracking-wider opacity-50 mb-1">{m.ref}</div>
                  <div className="text-sm font-medium group-hover:text-[#8B6F47] transition-colors">{m.matter}</div>
                  <div className="text-xs opacity-60 mt-1">Lead: {m.lead}</div>
                </div>
                <div className="text-[11px] px-3 py-1.5 rounded-full font-medium" style={{ background: m.color, color: "#2A1D10" }}>{m.status}</div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => setLoggedIn(false)} className="text-sm opacity-60 hover:opacity-100 link-u">Sign out</button>
      </div>
    </section>
  );
}

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", area: "", message: "" });

  function submit() {
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  }

  return (
    <section className="pt-20 pb-28">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase mb-6 fade-up" style={{ color: "#8B6F47" }}>§ Get in touch</div>
        <h1 className="fade-up font-serif leading-[0.95] mb-20" style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)", letterSpacing: "-0.03em", animationDelay: "0.15s" }}>
          Book a <em className="accent">consultation.</em>
        </h1>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 reveal space-y-10">
            {[
              { icon: MapPin, label: "Office", content: <>Plot 75 Kampala Road<br />E-Tower Building, 4th Floor, Suite D-06<br />P.O. Box 70643, Kampala, Uganda</> },
              { icon: Phone, label: "Phone", content: <><a href="tel:+256772418707" className="block link-u w-fit">+256 772 418 707</a><a href="tel:+256776044004" className="block link-u w-fit mt-1">+256 776 044 004</a></> },
              { icon: Mail, label: "Email", content: <a href="mailto:kasaijaandpartners@gmail.com" className="link-u">kasaijaandpartners@gmail.com</a> },
              { icon: Globe, label: "Online", content: <a href="#" className="link-u">kasaijaandpartners.com</a> },
            ].map((c, i) => (
              <div key={i} className="flex gap-5 group">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all group-hover:scale-110" style={{ background: "linear-gradient(135deg, #F6EDDA, #E8D8B4)" }}>
                  <c.icon className="w-5 h-5" style={{ color: "#8B6F47" }} />
                </div>
                <div className="pt-1">
                  <div className="font-mono text-[10px] tracking-[0.25em] uppercase opacity-60 mb-2">{c.label}</div>
                  <div className="text-[15px] leading-relaxed opacity-90">{c.content}</div>
                </div>
              </div>
            ))}

            <a href="https://wa.me/256772418707" className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all hover:scale-105" style={{ background: "#25D366", color: "white" }}>
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </a>
          </div>

          <div className="lg:col-span-7 reveal reveal-d1">
            <div className="p-8 lg:p-12 rounded-3xl relative overflow-hidden" style={{ background: "linear-gradient(135deg, #F6EDDA 0%, #E8D8B4 100%)" }}>
              <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #B8956A, transparent)" }}></div>
              <div className="relative">
                {submitted ? (
                  <div className="text-center py-16 fade-up">
                    <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #2A1D10, #3D2817)" }}>
                      <CheckCircle2 className="w-10 h-10" style={{ color: "#B8956A" }} />
                    </div>
                    <h3 className="font-serif text-4xl mb-4" style={{ color: "#2A1D10", letterSpacing: "-0.02em" }}>Thank you, <em className="accent">{form.name.split(" ")[0]}</em>.</h3>
                    <p className="text-[15px] opacity-75 max-w-md mx-auto leading-relaxed">Your enquiry has been received. An advocate will be in touch within one business day.</p>
                  </div>
                ) : (
                  <>
                    <div className="font-mono text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: "#8B6F47" }}>§ Intake form</div>
                    <h3 className="font-serif text-3xl mb-8" style={{ color: "#2A1D10", letterSpacing: "-0.02em" }}>Tell us about your matter.</h3>
                    <div className="space-y-4">
                      <input placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3.5 rounded-xl text-sm focus:outline-none transition-colors" style={{ background: "white", border: "1px solid rgba(139, 111, 71, 0.25)" }} onFocus={e => e.target.style.borderColor = "#8B6F47"} onBlur={e => e.target.style.borderColor = "rgba(139, 111, 71, 0.25)"} />
                      <div className="grid grid-cols-2 gap-3">
                        <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3.5 rounded-xl text-sm focus:outline-none transition-colors" style={{ background: "white", border: "1px solid rgba(139, 111, 71, 0.25)" }} onFocus={e => e.target.style.borderColor = "#8B6F47"} onBlur={e => e.target.style.borderColor = "rgba(139, 111, 71, 0.25)"} />
                        <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3.5 rounded-xl text-sm focus:outline-none transition-colors" style={{ background: "white", border: "1px solid rgba(139, 111, 71, 0.25)" }} onFocus={e => e.target.style.borderColor = "#8B6F47"} onBlur={e => e.target.style.borderColor = "rgba(139, 111, 71, 0.25)"} />
                      </div>
                      <select value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} className="w-full px-4 py-3.5 rounded-xl text-sm focus:outline-none" style={{ background: "white", border: "1px solid rgba(139, 111, 71, 0.25)" }}>
                        <option value="">Select practice area</option>
                        {PRACTICE_AREAS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                      <textarea placeholder="Briefly describe your matter..." rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3.5 rounded-xl text-sm resize-none focus:outline-none transition-colors" style={{ background: "white", border: "1px solid rgba(139, 111, 71, 0.25)", fontFamily: "inherit" }} onFocus={e => e.target.style.borderColor = "#8B6F47"} onBlur={e => e.target.style.borderColor = "rgba(139, 111, 71, 0.25)"} />
                      <button onClick={submit} className="btn-primary w-full py-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2" style={{ background: "#2A1D10", color: "#FBF7EF" }}>
                        Submit Enquiry <ArrowUpRight className="w-4 h-4" />
                      </button>
                      <p className="text-[11px] opacity-60 text-center leading-relaxed pt-2">By submitting, you acknowledge this does not create a solicitor-client relationship until confirmed in writing.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
