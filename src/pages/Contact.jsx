import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, CheckCircle2, ArrowUpRight, MessageCircle } from 'lucide-react';
import { PRACTICE_AREAS } from '../data/constants';
import { apiFetch } from '../utils/api';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', area: '', message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await apiFetch('/contact', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { 
      icon: Phone, 
      label: "Phone", 
      text: "+256 772 418 707",
      subtext: "Main Office Line",
      link: "tel:+256772418707"
    },
    { 
      icon: MessageCircle, 
      label: "WhatsApp", 
      text: "+256 776 044 004",
      subtext: "Instant Messaging",
      link: "https://wa.me/256776044004"
    },
    { 
      icon: Mail, 
      label: "Email", 
      text: "kasaijaandpartners@gmail.com",
      subtext: "General Enquiries",
      link: "mailto:kasaijaandpartners@gmail.com"
    },
    { 
      icon: MapPin, 
      label: "Office", 
      text: "Plot 75 Kampala Road",
      subtext: "E-Tower Building, 4th Floor, Suite D-06, Kampala",
      link: "https://maps.google.com?q=E+Tower+Building+Kampala"
    },
  ];

  if (submitted) {
    return (
      <div className="pt-24 lg:pt-32 pb-24 bg-cream min-h-[80vh] flex items-center">
        <div className="container-custom max-w-2xl">
          <motion.div 
            className="text-center p-12 lg:p-20 rounded-3xl bg-gradient-to-br from-[#F6EDDA] to-[#E8D8B4] border border-gold/20 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 rounded-full bg-dark flex items-center justify-center mx-auto mb-8 shadow-xl">
              <CheckCircle2 size={40} className="text-gold" />
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl mb-6 tracking-tight text-dark">Enquiry <em className="accent">Received.</em></h2>
            <p className="text-lg opacity-70 leading-relaxed max-w-md mx-auto">
              Thank you for reaching out. An advocate will review your matter and contact you within one business day.
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="mt-10 text-sm font-semibold text-gold-mid hover:text-dark transition-colors uppercase tracking-widest"
            >
              Send another message
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-cream min-h-screen">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="font-mono text-[10px] tracking-widest uppercase text-gold-mid mb-6">§ Get in touch</div>
          <h1 className="font-serif text-[clamp(3rem,7vw,6rem)] leading-[0.95] mb-20 tracking-tight">
            Contact the <em className="accent">firm.</em>
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-16">
          {/* Info Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {contactInfo.map((item, i) => (
                <motion.a 
                  key={i}
                  href={item.link}
                  target={item.icon === MapPin || item.icon === MessageCircle ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="p-8 rounded-2xl bg-light border border-gold/10 hover:border-gold/30 hover:bg-white transition-all duration-500 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-10 h-10 rounded-full bg-cream border border-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                    <item.icon className="text-gold-mid" size={18} />
                  </div>
                  <div className="font-mono text-[10px] tracking-widest uppercase text-gold-mid mb-2">{item.label}</div>
                  <div className="text-[17px] font-serif mb-1 text-dark group-hover:text-gold-mid transition-colors">{item.text}</div>
                  <div className="text-[13px] opacity-50">{item.subtext}</div>
                </motion.a>
              ))}
            </div>

            {/* Map Placeholder/Iframe */}
            <motion.div 
              className="rounded-2xl overflow-hidden h-64 border border-gold/10 shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.758265576!2d32.5794!3d0.3136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb945415757d%3A0xc3f1d81f1479269e!2sE-Tower!5e0!3m2!1sen!2sug!4v1700000000000!5m2!1sen!2sug" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location"
              />
            </motion.div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <motion.div 
              className="p-10 lg:p-14 rounded-3xl relative overflow-hidden bg-white border border-gold/15 shadow-[0_20px_64px_-20px_rgba(42,29,16,0.15)]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative z-10">
                <div className="font-mono text-[10px] tracking-widest uppercase text-gold-mid mb-4">§ Enquiry form</div>
                <h3 className="font-serif text-3xl lg:text-4xl mb-10 tracking-tight text-dark">How can we assist?</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="group">
                    <input 
                      required 
                      placeholder="Full name *" 
                      className="w-full px-5 py-4 rounded-xl bg-cream/30 border border-gold/20 focus:border-gold-mid focus:bg-white outline-none text-sm transition-all"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input 
                      required 
                      type="email" 
                      placeholder="Email address *" 
                      className="w-full px-5 py-4 rounded-xl bg-cream/30 border border-gold/20 focus:border-gold-mid focus:bg-white outline-none text-sm transition-all"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                    <input 
                      placeholder="Phone number" 
                      className="w-full px-5 py-4 rounded-xl bg-cream/30 border border-gold/20 focus:border-gold-mid focus:bg-white outline-none text-sm transition-all"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>

                  <select 
                    className="w-full px-5 py-4 rounded-xl bg-cream/30 border border-gold/20 focus:border-gold-mid focus:bg-white outline-none text-sm transition-all appearance-none cursor-pointer"
                    value={formData.area}
                    onChange={e => setFormData({...formData, area: e.target.value})}
                  >
                    <option value="">Select practice area</option>
                    {PRACTICE_AREAS.map(p => <option key={p.id}>{p.name}</option>)}
                  </select>

                  <textarea 
                    required
                    placeholder="Describe your matter in a few sentences…" 
                    rows="6" 
                    className="w-full px-5 py-4 rounded-xl bg-cream/30 border border-gold/20 focus:border-gold-mid focus:bg-white outline-none text-sm transition-all resize-none"
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  />

                  <button type="submit" className="w-full btn-primary justify-center group py-5">
                    Send Enquiry
                    <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                  
                  <p className="text-[11px] text-center opacity-50 mt-4 leading-relaxed italic">
                    All communications are strictly confidential and protected by advocate-client privilege.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
