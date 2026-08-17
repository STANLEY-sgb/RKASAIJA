import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Users, Scale, ArrowUpRight, CheckCircle2, Building2, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { IMAGES, handleImageError } from '../data/images';
import { STAFF } from '../data/constants';

const About = () => {
  const navigate = useNavigate();

  const glance = [
    { k: 'Firm Name', v: 'R. Kasaija & Partners Advocates' },
    { k: 'Headquarters', v: 'Kampala Road, E-Tower, 4th Floor' },
    { k: 'Practice Scope', v: 'Uganda, East Africa & International' },
    { k: 'Legal Team', v: '3 Partners + 4 Senior Associates' },
    { k: 'Practice History', v: 'Over 20 Years of Legal Excellence' },
    { k: 'Accreditation', v: 'ULS · EALS · ICAMEK Arbitrators' },
    { k: 'Languages', v: 'English · Runyankore · Luganda' },
    { k: 'Special Roles', v: 'Notary Public, Patent & Trademark Agents' },
  ];

  const coreValues = [
    {
      title: "Ethical Integrity",
      desc: "Strict adherence to legal ethics, client confidentiality, transparent billing, and honest advocacy in every case.",
      icon: Shield
    },
    {
      title: "Commercial Acumen",
      desc: "Pragmatic, value-driven advice tailored to market dynamics, risk mitigation, and commercial growth.",
      icon: Building2
    },
    {
      title: "ADR Leadership",
      desc: "ICAMEK-accredited expertise in mediation and arbitration to resolve disputes swiftly and cost-effectively.",
      icon: Scale
    },
    {
      title: "Collective Rigour",
      desc: "Partner-led strategy with specialist associate support ensuring thorough legal research and execution.",
      icon: Users
    }
  ];

  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-cream min-h-screen">
      <div className="container-custom">
        {/* Page Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mb-16"
        >
          <div className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-gold-mid mb-4 font-semibold">
            § About R. Kasaija & Partners Advocates
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[0.96] tracking-tight text-dark font-medium mb-6">
            An indigenous Ugandan firm<br />built for <em className="accent">East Africa</em>.
          </h1>
          <p className="text-lg sm:text-xl text-dark/75 leading-relaxed font-sans max-w-3xl">
            Established over two decades ago in Kampala, we provide strategic legal counsel to commercial enterprises, financial institutions, state corporations, non-governmental bodies, and individuals across East Africa.
          </p>
        </motion.div>

        {/* Main Grid: Sidebar & Content */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Sidebar - At A Glance Card */}
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <motion.div 
              className="sticky top-28 p-6 sm:p-8 rounded-3xl bg-light/70 border border-gold/20 shadow-md"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="font-mono text-[10px] tracking-widest uppercase text-gold-mid mb-6 font-semibold flex items-center justify-between">
                <span>Firm Profile</span>
                <span className="w-2 h-2 rounded-full bg-gold-mid" />
              </div>
              
              <div className="space-y-4">
                {glance.map((item, i) => (
                  <div key={i} className="pb-3 border-b border-gold/15 last:border-0">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-dark/50 mb-0.5">{item.k}</div>
                    <div className="text-[14px] font-medium text-dark">{item.v}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gold/20 flex flex-col gap-3">
                <Link to="/book" className="btn-primary w-full text-center justify-center text-xs">
                  Schedule Consultation
                </Link>
                <Link to="/contact" className="btn-outline border-dark text-dark hover:bg-dark hover:text-cream w-full text-center justify-center text-xs">
                  Contact Office
                </Link>
              </div>
            </motion.div>
          </aside>

          {/* Main Article Body */}
          <article className="lg:col-span-8 order-1 lg:order-2 space-y-16">
            
            {/* 1. Firm Introduction */}
            <motion.section 
              className="space-y-6 text-[16.5px] sm:text-[18px] leading-relaxed text-dark/85"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-3xl sm:text-4xl text-dark tracking-tight font-medium mb-4">
                Trusted Advocates, Solicitors & Legal Consultants
              </h2>
              <p>
                R. Kasaija & Partners Advocates is a premier indigenous Ugandan law firm headquartered on Kampala Road. Our legal team brings deep institutional experience handling complex cross-border transactions, multi-jurisdictional litigation, structured corporate financing, property acquisitions, and regulatory compliance.
              </p>
              <p>
                Our firm represents leading regional institutions, including Shengli Engineering Company, H.K Financial Services, Save and Invest Limited, S.N Financial Services, Twezimbe Investment Group, and the National Forestry Authority.
              </p>
            </motion.section>

            {/* 2. Core Values Grid */}
            <motion.section 
              className="pt-8 border-t border-gold/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="font-mono text-[10px] tracking-widest uppercase text-gold-mid mb-3 font-semibold">
                § Guiding Principles
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-dark tracking-tight mb-8">
                How We Deliver Legal Excellence
              </h2>

              <div className="grid sm:grid-cols-2 gap-6">
                {coreValues.map((val, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-white border border-gold/15 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center mb-4 text-gold-mid">
                      <val.icon size={20} />
                    </div>
                    <h3 className="font-serif text-xl text-dark mb-2 font-medium">{val.title}</h3>
                    <p className="text-[14px] text-dark/70 leading-relaxed">{val.desc}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* 3. ADR & Dispute Resolution Approach */}
            <motion.section 
              className="p-8 sm:p-10 rounded-3xl bg-dark text-cream relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="font-mono text-[10px] tracking-widest uppercase text-gold mb-3">
                § Dispute Resolution Philosophy
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#FDFBF7] mb-6 tracking-tight">
                ADR-First. Cost-Conscious. Results-Driven.
              </h2>
              <p className="text-base sm:text-lg text-cream/80 leading-relaxed mb-6">
                We strongly believe in Alternative Dispute Resolution (ADR) wherever strategically appropriate. Commercial disputes consume valuable time and capital; our Managing Partner, Robert Kasaija, is an accredited arbitrator with the International Centre for Arbitration and Mediation in Kampala (ICAMEK).
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-mono text-gold/90">
                <span className="px-3 py-1 bg-gold/15 border border-gold/30 rounded-full">✓ ICAMEK Accredited</span>
                <span className="px-3 py-1 bg-gold/15 border border-gold/30 rounded-full">✓ Out-of-Court Settlements</span>
                <span className="px-3 py-1 bg-gold/15 border border-gold/30 rounded-full">✓ High Court Trial Practice</span>
              </div>
            </motion.section>

            {/* 4. Leadership / Partner Preview */}
            <motion.section 
              className="pt-8 border-t border-gold/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="font-mono text-[10px] tracking-widest uppercase text-gold-mid mb-2">
                    § Firm Leadership
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl text-dark tracking-tight">
                    Meet Our Partners
                  </h2>
                </div>
                <Link to="/team" className="btn-outline border-dark text-dark text-xs px-4 py-2 hover:bg-dark hover:text-cream">
                  All Team Members <ArrowUpRight size={13} />
                </Link>
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                {STAFF.slice(0, 3).map((partner, i) => (
                  <div key={i} className="group bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <div className="aspect-[4/5] relative overflow-hidden bg-dark">
                      <img 
                        src={partner.photo} 
                        alt={partner.name}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => handleImageError(e, partner.fallback || IMAGES.patterns.remove)}
                        className="w-full h-full object-cover object-[center_15%] group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-lg text-dark font-medium">{partner.name}</h3>
                      <div className="text-[11px] font-mono uppercase text-gold-mid mt-0.5">{partner.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

          </article>
        </div>

        {/* Bottom CTA Banner */}
        <motion.div 
          className="mt-24 p-10 sm:p-16 rounded-3xl bg-gradient-to-br from-light to-light2 border border-gold/20 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-3xl sm:text-4xl text-dark mb-4 tracking-tight">
            Need Expert Legal Representation?
          </h2>
          <p className="text-dark/75 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Discuss your legal or commercial matter directly with our advocates or interact with Kasaija AI for intake.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/book" className="btn-primary">
              Book a Consultation
            </Link>
            <Link to="/contact" className="btn-outline border-dark text-dark hover:bg-dark hover:text-cream">
              Contact Our Office
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
