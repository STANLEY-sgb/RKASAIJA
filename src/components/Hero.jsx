import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import HeroSlideshow from './HeroSlideshow';

const Hero = ({ onPracticeClick, onChatClick }) => {
  const headline = [
    { words: ["Counsel"], delay: 0 },
    { words: ["that", "moves"], delay: 200, italic: [1] },
    { words: ["with", "your"], delay: 400 },
    { words: ["business."], delay: 600 },
  ];

  const particles = [
    { s: '2px', o: 0.4, d: '22s', delay: '0s', x1: '18px', y1: '-35px', x2: '-12px', y2: '-68px', x3: '8px', y3: '-90px', left: '12%', top: '25%' },
    { s: '3px', o: 0.3, d: '18s', delay: '3s', x1: '-22px', y1: '-28px', x2: '15px', y2: '-55px', x3: '-8px', y3: '-85px', left: '28%', top: '45%' },
    { s: '2px', o: 0.5, d: '25s', delay: '6s', x1: '12px', y1: '-42px', x2: '-18px', y2: '-70px', x3: '6px', y3: '-100px', left: '45%', top: '20%' },
    { s: '4px', o: 0.2, d: '20s', delay: '1.5s', x1: '-15px', y1: '-30px', x2: '20px', y2: '-65px', x3: '-5px', y3: '-95px', left: '68%', top: '35%' },
  ];

  const maxims = [
    "Fiat Justitia Ruat Caelum", "Audi Alteram Partem", "Nemo Judex In Causa Sua", 
    "Lex Scripta & Lex Non Scripta", "Actus Non Facit Reum Nisi Mens Sit Rea", 
    "Ignorantia Juris Non Excusat", "In Dubio Pro Reo", "Pacta Sunt Servanda"
  ];

  return (
    <section id="hero" className="relative min-h-[90vh] bg-[#0A0502] overflow-hidden flex flex-col justify-between pt-24 sm:pt-28 pb-6">
      {/* Background Scales SVG Graphic */}
      <div className="absolute right-[2%] top-1/3 -translate-y-1/2 opacity-[0.05] pointer-events-none z-[1] hidden md:block">
        <svg width="550" height="600" viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        </svg>
      </div>

      {/* Floating Ambient Particles */}
      {particles.map((p, i) => (
        <div 
          key={i} 
          className="hero-particle hidden sm:block" 
          style={{ 
            '--ps': p.s, '--po': p.o, '--pd': p.d, '--pdelay': p.delay, 
            '--px1': p.x1, '--py1': p.y1, '--px2': p.x2, '--py2': p.y2, '--px3': p.x3, '--py3': p.y3,
            left: p.left, top: p.top 
          }} 
        />
      ))}

      {/* 1. Primary Text & Typography Zone */}
      <div className="container-custom relative z-[3] mb-8 sm:mb-12">
        <motion.div 
          className="flex items-center gap-3 mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-gold">Est. Kampala</span>
          <div className="w-8 sm:w-12 h-px bg-gold/50" />
          <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-gold/80">Advocates & Solicitors</span>
        </motion.div>

        <h1 
          className="font-serif leading-[0.96] tracking-tight text-[#FDFBF7] mb-6 sm:mb-8 font-medium max-w-5xl" 
          style={{ fontSize: "clamp(2.2rem, 6.5vw, 5.8rem)" }}
        >
          {headline.map((line, li) => (
            <span key={li} className="block overflow-hidden py-[0.04em]">
              {line.words.map((word, wi) => (
                <span key={wi} className="inline-block">
                  {word.split('').map((char, ci) => (
                    <motion.span 
                      key={ci} 
                      className="inline-block"
                      initial={{ opacity: 0, y: "100%" }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.7, 
                        delay: 0.15 + (li * 0.12) + (wi * 0.07) + (ci * 0.015),
                        ease: [0.22, 1, 0.36, 1]
                      }}
                      style={line.italic?.includes(wi) ? { fontStyle: "italic", color: "#B8956A" } : {}}
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
          className="grid lg:grid-cols-[1fr_auto] gap-6 sm:gap-8 items-end max-w-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <p className="text-[14.5px] sm:text-[16.5px] leading-relaxed text-[#FDFBF7]/80 max-w-[58ch]">
            An indigenous Ugandan firm serving corporate entities, financial institutions, and individuals across banking, corporate, land, and dispute resolution — with a business-minded ADR approach, backed by <em className="accent !text-gold">ICAMEK</em> credentials and two decades of practice.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button onClick={onChatClick} className="btn-primary w-full sm:w-auto">
              <Sparkles size={16} className="text-gold" /> Speak with Kasaija AI
            </button>
            <button onClick={onPracticeClick} className="btn-outline border-[#FDFBF7]/30 text-[#FDFBF7] hover:bg-white/10 w-full sm:w-auto">
              Practice Areas <ArrowUpRight size={15} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* 2. Horizontal Image Marquee Showcase Zone (No Overlap with Text) */}
      <div className="relative z-[3] my-4 sm:my-6 w-full overflow-hidden">
        <HeroSlideshow />
      </div>

      {/* 3. Responsive Stats Banner */}
      <div className="container-custom relative z-[3] mt-6 sm:mt-8">
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 pt-6 border-t border-gold/20"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          {[
            { n: "20+", l: "Years of practice", sub: "Established counsel" },
            { n: "12", l: "Practice areas", sub: "Full-service expertise" },
            { n: "ICAMEK", l: "Accredited Arbitrator", sub: "Managing Partner" },
            { n: "100%", l: "Ethical integrity", sub: "Professional standard" },
          ].map((s, i) => (
            <div key={i} className="group">
              <div className="font-serif text-[clamp(1.75rem,3.5vw,3rem)] leading-tight text-[#FDFBF7] group-hover:text-gold transition-colors duration-300">
                {s.n}
              </div>
              <div className="text-[12px] sm:text-[13px] font-medium text-[#FDFBF7]/80 mt-0.5">{s.l}</div>
              <div className="font-mono text-[9.5px] sm:text-[10px] tracking-widest uppercase opacity-50 text-[#FDFBF7] mt-0.5">{s.sub}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 4. Latin Maxims Marquee Strip at Bottom */}
      <div className="mt-8 h-[34px] overflow-hidden z-[3] pointer-events-none border-t border-gold/15 bg-black/40 backdrop-blur-sm flex items-center">
        <div className="flex whitespace-nowrap animate-marquee w-fit">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              {maxims.map((m, j) => (
                <span key={j} className="inline-flex items-center">
                  <span className="font-mono text-[9px] sm:text-[9.5px] tracking-widest uppercase text-gold/85 px-8 sm:px-10 shrink-0">{m}</span>
                  <span className="text-gold/30 shrink-0">✦</span>
                </span>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
