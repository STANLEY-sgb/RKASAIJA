import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import GVM from '../components/GVM';
import PracticeGrid from '../components/PracticeGrid';
import WhyUs from '../components/WhyUs';
import TeamSectionShowcase from '../components/TeamSectionShowcase';
import { CLIENTS } from '../data/constants';

const Home = () => {
  const navigate = useNavigate();

  const handleOpenChat = () => {
    window.dispatchEvent(new CustomEvent('open-chat'));
  };

  return (
    <div className="bg-cream">
      {/* 1. Hero Section */}
      <Hero 
        onPracticeClick={() => navigate('/practice')} 
        onChatClick={handleOpenChat} 
      />
      
      {/* 2. Continuous Practice Ticker */}
      <Marquee />
      
      {/* 3. Goal, Vision, Mission */}
      <GVM />

      {/* 4. Practice Areas Preview Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-light/40 to-cream border-y border-gold/15">
        <div className="container-custom">
          <motion.div 
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div>
              <div className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-gold-mid mb-3">
                § What We Do
              </div>
              <h2 className="font-serif text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.96] tracking-tight text-dark">
                Twelve disciplines.<br /><em className="accent">One standard.</em>
              </h2>
            </div>
            <button 
              onClick={() => navigate('/practice')}
              className="btn-outline border-dark text-dark hover:bg-dark hover:text-cream group self-start cursor-pointer"
            >
              View All Practice Areas 
              <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </motion.div>

          <PracticeGrid limit={6} />
        </div>
      </section>

      {/* 5. Why Choose Us */}
      <WhyUs />

      {/* 6. Official Firm Team & Advocates Showcase */}
      <TeamSectionShowcase isFullPage={false} />


      {/* 6. Trusted Counsel / Representative Clients */}
      <section className="py-20 lg:py-28 bg-cream border-b border-gold/15">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-gold-mid mb-3">
              § Trusted Counsel For
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl tracking-tight text-dark font-medium">
              Institutions, Investors, and Individuals Across East Africa
            </h3>
          </motion.div>
          
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6 max-w-5xl mx-auto">
            {CLIENTS.map((client, i) => (
              <motion.div 
                key={i} 
                className="font-serif text-lg sm:text-xl md:text-2xl italic text-dark/40 hover:text-dark transition-colors duration-300 cursor-default px-3 py-1"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                {client}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Conversion CTA Section */}
      <section className="py-24 sm:py-32 relative bg-gradient-to-br from-[#F6EDDA] via-[#EFE0C2] to-[#E5CF9F] overflow-hidden">
        {/* Subtle grain texture overlay */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")` }} 
        />
        
        <div className="container-custom max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-gold-mid mb-6 font-semibold">
              § Begin Legal Consultation
            </div>
            <h2 className="font-serif text-[clamp(2.4rem,6vw,5rem)] leading-[0.96] tracking-tight mb-6 text-dark font-medium">
              Ready to discuss<br />your <em className="accent">legal matter?</em>
            </h2>
            <p className="text-base sm:text-lg text-dark/75 mb-10 max-w-xl mx-auto leading-relaxed">
              Interact with Kasaija AI for instant knowledge intake, or book a consultation directly with our legal advocates.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={handleOpenChat}
                className="btn-primary w-full sm:w-auto"
              >
                <Sparkles size={16} className="text-gold" /> Start with AI Intake
              </button>
              <button 
                onClick={() => navigate('/book')}
                className="btn-outline border-dark text-dark hover:bg-dark hover:text-cream w-full sm:w-auto"
              >
                <Calendar size={16} /> Book Consultation
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
