import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import GVM from '../components/GVM';
import PracticeGrid from '../components/PracticeGrid';
import WhyUs from '../components/WhyUs';
import { CLIENTS } from '../data/constants';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-cream">
      <Hero 
        onPracticeClick={() => navigate('/practice')} 
        onChatClick={() => window.dispatchEvent(new CustomEvent('open-chat'))} 
      />
      
      <Marquee />
      
      <GVM />

      {/* Practice Preview */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-light to-cream">
        <div className="container-custom">
          <motion.div 
            className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <div className="font-mono text-[10px] tracking-widest uppercase text-gold-mid mb-4">§ What we do</div>
              <h2 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-tight">
                Twelve disciplines.<br /><em className="accent">One standard.</em>
              </h2>
            </div>
            <button 
              onClick={() => navigate('/practice')}
              className="btn-outline border-dark text-dark hover:bg-white/40 group self-start"
            >
              View all practice areas 
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </motion.div>

          <PracticeGrid limit={6} />
        </div>
      </section>

      <WhyUs />

      {/* Trusted Counsel Section */}
      <section className="py-24 lg:py-32">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="font-mono text-[10px] tracking-widest uppercase text-gold-mid mb-3">§ Trusted counsel for</div>
            <h3 className="font-serif text-3xl md:text-4xl tracking-tight text-dark">Institutions, investors, individuals.</h3>
          </motion.div>
          
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 max-w-4xl mx-auto">
            {CLIENTS.map((c, i) => (
              <motion.div 
                key={i} 
                className="font-serif text-xl md:text-2xl italic text-dark/40 hover:text-dark transition-all duration-300 cursor-default"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                {c}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 relative bg-gradient-to-br from-[#F6EDDA] to-[#E8D8B4] overflow-hidden">
        {/* Grain overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")` }} />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="font-mono text-[10px] tracking-widest uppercase text-gold-mid mb-8">§ Begin</div>
            <h2 className="font-serif text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] tracking-tight mb-8">
              Ready to discuss<br />your <em className="accent">matter?</em>
            </h2>
            <p className="text-lg opacity-70 mb-12 max-w-xl mx-auto leading-relaxed">
              Speak with Kasaija AI now for instant intake, or book a consultation directly with the right advocate.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-chat'))}
                className="btn-primary"
              >
                <Sparkles size={16} /> Start with AI Intake
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className="btn-outline border-dark text-dark hover:bg-white/50"
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
