import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const glance = [
    { k: 'Founded', v: 'Kampala, Uganda' },
    { k: 'Partners', v: '3 partners + 4 associates' },
    { k: 'Experience', v: '20+ years' },
    { k: 'Memberships', v: 'ULS · EALS · ICAMEK' },
    { k: 'Languages', v: 'English · Runyankore · Luganda' },
    { k: 'Services', v: 'Advocates, Notary, Patent Agents' },
  ];

  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-cream">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="font-mono text-[10px] tracking-widest uppercase text-gold-mid mb-6">§ About the firm</div>
          <h1 className="font-serif text-[clamp(3rem,8vw,7rem)] leading-[0.95] mb-20 tracking-tight">
            An indigenous firm<br />built for <em className="accent">East Africa</em>.
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-16">
          {/* Sidebar */}
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <motion.div 
              className="sticky top-32 p-8 lg:p-10 rounded-2xl bg-light border border-gold/15 shadow-[0_12px_48px_-16px_rgba(42,29,16,0.12)]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="font-mono text-[10px] tracking-widest uppercase opacity-45 mb-8">At a glance</div>
              <div className="space-y-6">
                {glance.map((item, i) => (
                  <div key={i} className="flex justify-between items-start gap-4 pb-4 border-b border-gold/10 last:border-0 hover:bg-gold/5 transition-colors group">
                    <span className="text-[13px] opacity-50 group-hover:opacity-100 transition-opacity">{item.k}</span>
                    <span className="text-[13px] font-medium text-right text-dark">{item.v}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </aside>

          {/* Main Content */}
          <article className="lg:col-span-8 order-1 lg:order-2 space-y-12">
            <motion.div 
              className="space-y-8 text-[17.5px] lg:text-[19px] leading-relaxed text-dark/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <p>R. Kasaija & Partners Advocates is an indigenous, fast-growing law firm in Uganda. The firm provides consultation and legal services across a wide range of matters, with extensive resources and experience to handle substantial and complex transactions.</p>
              <p>Our highly skilled team of lawyers is result-oriented. We provide professional legal services with integrity, an ethical touch, and expertise — prioritising the interests of both our domestic and international clientele. We respond efficiently to complex legal problems with flexible commercial solutions, helping clients achieve their business objectives.</p>
              <p>Amongst the firm's clients are major national and international companies and individuals active in consumer goods, foods and beverages, health and medical, real estate and construction, energy and environment, banking, and project financing.</p>
            </motion.div>

            <motion.div 
              className="pt-12 border-t border-gold/20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="font-mono text-[10px] tracking-widest uppercase text-gold-mid mb-6">§ What we are</div>
              <h2 className="font-serif text-4xl lg:text-5xl mb-8 tracking-tight">A full-service indigenous firm.</h2>
              <div className="space-y-6 text-[16px] lg:text-[17px] opacity-80 leading-relaxed">
                <p>We are a firm of Advocates, Solicitors, Attorneys-at-Law, Legal, Investment and Tax Consultants, Commissioners for Oaths, Notary Public, Trademark and Patent Agents, Receivers, Liquidators, Debt Collectors, and Company Secretaries.</p>
                <p>Our team is well grounded in business and commercial law — covering corporate, mergers and acquisitions, labour and industrial disputes, land conveyance, banking and mortgages, insurance claims, intellectual property, adoption, divorce and child maintenance, inheritance, and investment law.</p>
              </div>
            </motion.div>

            <motion.div 
              className="pt-12 border-t border-gold/20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="font-mono text-[10px] tracking-widest uppercase text-gold-mid mb-6">§ Our approach to disputes</div>
              <h2 className="font-serif text-4xl lg:text-5xl mb-8 tracking-tight">ADR first. Litigation when necessary.</h2>
              <p className="text-[16px] lg:text-[17px] opacity-80 leading-relaxed">
                We believe in alternative dispute resolution. The firm has been involved in substantial arbitration, mediation, and negotiation proceedings, and has secured meaningful out-of-court settlements on behalf of our clients. Our Managing Partner is a member of the International Centre for Arbitration and Mediation in Kampala (ICAMEK).
              </p>
            </motion.div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default About;
