import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowUpRight } from 'lucide-react';

const Hero = ({ onPracticeClick, onChatClick }) => {
  const headline = [
    { words: ["Counsel"], delay: 0 },
    { words: ["that", "moves"], delay: 200, italic: [1] },
    { words: ["with", "your"], delay: 400 },
    { words: ["business."], delay: 600 },
  ];

  const particles = [
    { s: '2px', o: 0.5, d: '22s', delay: '0s', x1: '18px', y1: '-35px', x2: '-12px', y2: '-68px', x3: '8px', y3: '-90px', left: '12%', top: '35%' },
    { s: '3px', o: 0.35, d: '18s', delay: '3s', x1: '-22px', y1: '-28px', x2: '15px', y2: '-55px', x3: '-8px', y3: '-85px', left: '28%', top: '55%' },
    { s: '2px', o: 0.6, d: '25s', delay: '6s', x1: '12px', y1: '-42px', x2: '-18px', y2: '-70px', x3: '6px', y3: '-100px', left: '45%', top: '28%' },
    { s: '4px', o: 0.25, d: '20s', delay: '1.5s', x1: '-15px', y1: '-30px', x2: '20px', y2: '-65px', x3: '-5px', y3: '-95px', left: '68%', top: '45%' },
    { s: '2px', o: 0.45, d: '16s', delay: '8s', x1: '20px', y1: '-25px', x2: '-10px', y2: '-50px', x3: '14px', y3: '-80px', left: '82%', top: '62%' },
  ];

  const beams = [
    { sa: '-8deg', ea: '-4deg', mo: 0.9, bd: '14s', delay: '0s', left: '5%' },
    { sa: '-4deg', ea: '-1deg', mo: 0.6, bd: '11s', delay: '2.5s', left: '18%' },
    { sa: '0deg', ea: '3deg', mo: 0.75, bd: '16s', delay: '1s', left: '38%' },
    { sa: '2deg', ea: '5deg', mo: 0.5, bd: '13s', delay: '4s', left: '58%' },
    { sa: '4deg', ea: '8deg', mo: 0.65, bd: '9s', delay: '1.8s', left: '75%' },
  ];

  const maxims = [
    "Fiat Justitia Ruat Caelum", "Audi Alteram Partem", "Nemo Judex In Causa Sua", 
    "Lex Scripta & Lex Non Scripta", "Actus Non Facit Reum Nisi Mens Sit Rea", 
    "Ignorantia Juris Non Excusat", "In Dubio Pro Reo", "Pacta Sunt Servanda"
  ];

  return (
    <section id="hero" className="relative min-h-screen bg-[#060301] overflow-hidden flex flex-col justify-center">
      {/* Background Image with Ken Burns */}
      <motion.img 
        src="/assets/img/law_firm_team.jpeg" 
        className="absolute inset-0 w-full h-full object-cover object-top opacity-0"
        initial={{ opacity: 0, scale: 1 }}
        animate={{ 
          opacity: 1, 
          scale: [1, 1.08],
          transition: { 
            opacity: { duration: 2, ease: "easeOut" },
            scale: { duration: 30, ease: "easeInOut", repeat: Infinity, repeatType: "alternate" }
          }
        }}
        aria-hidden="true"
      />

      {/* Overlays */}
      <div className="absolute inset-0 z-[1] bg-black/20 pointer-events-none" />
      <div className="absolute inset-0 z-[2] opacity-[0.06] mix-blend-screen pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.6'/%3E%3C/svg%3E")` }} />

      {/* Beams */}
      {beams.map((b, i) => (
        <div 
          key={i} 
          className="court-beam" 
          style={{ 
            '--sa': b.sa, '--ea': b.ea, '--mo': b.mo, '--bd': b.bd, '--bdelay': b.delay, left: b.left 
          }} 
        />
      ))}

      {/* Scales SVG Background */}
      <div className="absolute right-[5%] top-1/2 -translate-y-1/2 opacity-[0.055] pointer-events-none z-[3] animate-[scalesSway_10s_ease-in-out_infinite]">
        <svg width="600" height="660" viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="99" y="10" width="2" height="145" fill="#B8956A" />
          <circle cx="100" cy="10" r="5" fill="#B8956A" />
          <polygon points="100,42 108,50 100,58 92,50" fill="#B8956A" opacity="0.7" />
          <line x1="100" y1="50" x2="35" y2="65" stroke="#B8956A" strokeWidth="1.5" />
          <line x1="100" y1="50" x2="165" y2="65" stroke="#B8956A" strokeWidth="1.5" />
          <line x1="35" y1="65" x2="25" y2="95" stroke="#B8956A" strokeWidth="1" opacity="0.6" />
          <line x1="35" y1="65" x2="45" y2="95" stroke="#B8956A" strokeWidth="1" opacity="0.6" />
          <path d="M18 95 Q35 110 52 95" stroke="#B8956A" strokeWidth="1.8" fill="none" />
          <line x1="165" y1="65" x2="155" y2="95" stroke="#B8956A" strokeWidth="1" opacity="0.6" />
          <line x1="165" y1="65" x2="175" y2="95" stroke="#B8956A" strokeWidth="1" opacity="0.6" />
          <path d="M148 95 Q165 110 182 95" stroke="#B8956A" strokeWidth="1.8" fill="none" />
          <rect x="85" y="155" width="30" height="3" rx="1.5" fill="#B8956A" opacity="0.7" />
          <rect x="75" y="158" width="50" height="4" rx="2" fill="#B8956A" opacity="0.6" />
        </svg>
      </div>

      {/* Particles */}
      {particles.map((p, i) => (
        <div 
          key={i} 
          className="hero-particle" 
          style={{ 
            '--ps': p.s, '--po': p.o, '--pd': p.d, '--pdelay': p.delay, 
            '--px1': p.x1, '--py1': p.y1, '--px2': p.x2, '--py2': p.y2, '--px3': p.x3, '--py3': p.y3,
            left: p.left, top: p.top 
          }} 
        />
      ))}

      {/* Latin Maxims Marquee */}
      <div className="absolute bottom-0 left-0 right-0 h-[38px] overflow-hidden z-[4] pointer-events-none border-t border-gold/10 bg-black/25 backdrop-blur-sm">
        <div className="flex whitespace-nowrap animate-marquee w-fit">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              {maxims.map((m, j) => (
                <span key={j} className="inline-flex items-center">
                  <span className="font-mono text-[9.5px] tracking-widest uppercase text-gold/80 px-14 py-3 shrink-0">{m}</span>
                  <span className="text-gold/20 -ml-8 shrink-0">✦</span>
                </span>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container-custom relative z-[4] pt-24 lg:pt-36 pb-20 lg:pb-24">
        <motion.div 
          className="flex items-center gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <span className="font-mono text-[10px] tracking-widest uppercase text-gold/85">Est. Kampala</span>
          <div className="w-12 h-px bg-gold/45" />
          <span className="font-mono text-[10px] tracking-widest uppercase text-gold/85">Advocates & Solicitors</span>
        </motion.div>

        <h1 className="font-serif leading-[0.93] tracking-[-0.038em] text-[#F0E4CE] overflow-hidden" style={{ fontSize: "clamp(3rem, 9.5vw, 8.5rem)" }}>
          {headline.map((line, li) => (
            <span key={li} className="block overflow-hidden py-[0.1em] -my-[0.1em]">
              {line.words.map((word, wi) => (
                <span key={wi} className="inline-block">
                  {word.split('').map((char, ci) => (
                    <motion.span 
                      key={ci} 
                      className="inline-block"
                      initial={{ opacity: 0, y: "110%" }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.8, 
                        delay: 0.4 + (li * 0.2) + (wi * 0.1) + (ci * 0.02),
                        ease: [0.22, 1, 0.36, 1]
                      }}
                      style={line.italic?.includes(wi) ? { fontStyle: "italic", color: "#B8956A", fontWeight: 400 } : {}}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                  {wi < line.words.length - 1 && <span>&nbsp;</span>}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <motion.div 
          className="grid lg:grid-cols-[1fr_auto] gap-8 mt-14 items-end"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <p className="text-[15px] lg:text-[17px] leading-relaxed text-[#F0E4CE]/70 max-w-[54ch]">
            An indigenous Ugandan firm serving multinationals, financial institutions, and individuals across banking, corporate, land, and dispute resolution — with a business-minded ADR approach, backed by <em className="accent !text-gold">ICAMEK</em> credentials and two decades of practice.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={onChatClick} className="btn-primary">
              <Sparkles size={16} /> Speak with Kasaija AI
            </button>
            <button onClick={onPracticeClick} className="btn-outline border-[#F0E4CE]/35 text-[#F0E4CE] hover:bg-white/10">
              Our Practice Areas <ArrowUpRight size={14} />
            </button>
          </div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-10 pt-10 mt-20 border-t border-gold/18"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          {[
            { n: "20+", l: "Years of practice", sub: "Since founding" },
            { n: "12", l: "Practice areas", sub: "Full service" },
            { n: "ICAMEK", l: "Arbitrator", sub: "Managing Partner" },
            { n: "100%", l: "Ethical integrity", sub: "Non-negotiable" },
          ].map((s, i) => (
            <div key={i} className="group">
              <div className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-tight tracking-tight text-[#F0E4CE] group-hover:text-gold group-hover:[text-shadow:0_0_40px_rgba(184,149,106,0.45)] transition-all duration-300">
                {s.n}
              </div>
              <div className="text-[13px] font-medium mt-1 text-[#F0E4CE]/70">{s.l}</div>
              <div className="font-mono text-[10px] tracking-widest uppercase opacity-40 mt-1 text-[#F0E4CE]/40">{s.sub}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Hint */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <span className="font-mono text-[9px] tracking-widest uppercase text-[#F0E4CE]">Scroll</span>
        <div className="w-px h-8 bg-[#F0E4CE]/12 relative overflow-hidden">
          <div className="absolute top-0 w-full h-1/2 bg-gold/80 animate-[scrollLine_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
