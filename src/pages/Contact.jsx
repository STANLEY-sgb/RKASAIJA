import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, CheckCircle2, ArrowUpRight, MessageCircle, Clock, Sparkles } from 'lucide-react';
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
      const res = await apiFetch('/contact', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (res && res.success) {
        setSubmitted(true);
      } else {
        setError(res?.error || 'Could not send enquiry. Please call +256 772 418 707.');
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      setError(err.message || 'Server connection error. Please call +256 772 418 707 directly.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { 
      icon: Phone, 
      label: "Main Office Line", 
      text: "+256 772 418 707",
      subtext: "Mon – Fri: 8:00 AM – 5:00 PM EAT",
      link: "tel:+256772418707"
    },
    { 
      icon: MessageCircle, 
      label: "WhatsApp / Fast Line", 
      text: "+256 776 044 004",
      subtext: "Instant Client Enquiries",
      link: "https://wa.me/256776044004"
    },
    { 
      icon: Mail, 
      label: "Official Email", 
      text: "kasaijaandpartners@gmail.com",
      subtext: "Formal Submissions & Counsel Inquiries",
      link: "mailto:kasaijaandpartners@gmail.com"
    },
    { 
      icon: MapPin, 
      label: "Kampala Chambers", 
      text: "Plot 75 Kampala Road, E-Tower",
      subtext: "4th Floor, Suite D-06, P.O. Box 70643, Kampala",
      link: "https://maps.google.com?q=E+Tower+Building+Kampala"
    },
  ];

  if (submitted) {
    return (
      <div className="pt-24 lg:pt-32 pb-24 bg-cream min-h-[80vh] flex items-center">
        <div className="container-custom max-w-2xl">
          <motion.div 
            className="text-center p-10 sm:p-16 rounded-3xl bg-gradient-to-br from-[#F6EDDA] via-[#EFE0C2] to-[#E8D8B4] border border-gold/30 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-dark text-gold flex items-center justify-center mx-auto mb-6 shadow-xl">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl mb-4 tracking-tight text-dark font-medium">
              Enquiry Received
            </h2>
            <p className="text-base sm:text-lg text-dark/80 leading-relaxed max-w-md mx-auto mb-8 font-sans">
              Thank you for reaching out to R. Kasaija & Partners Advocates. An advocate will review your matter and respond within 1 business day.
            </p>
            <button 
              onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', area: '', message: '' }); }}
              className="btn-outline border-dark text-dark hover:bg-dark hover:text-cream text-xs"
            >
              Send Another Enquiry
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-cream min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mb-16"
        >
          <div className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-gold-mid mb-4 font-semibold">
            § Get in Touch
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[0.96] mb-6 tracking-tight text-dark font-medium">
            Contact the <em className="accent">Chambers.</em>
          </h1>
          <p className="text-base sm:text-lg text-dark/75 leading-relaxed font-sans max-w-2xl">
            Reach out directly to our Kampala office or submit an online legal enquiry. All communications are confidential and handled by qualified advocates.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {contactInfo.map((item, i) => (
                <motion.a 
                  key={i}
                  href={item.link}
                  target={item.icon === MapPin || item.icon === MessageCircle ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="p-6 rounded-2xl bg-white border border-gold/15 hover:border-gold/40 hover:shadow-md transition-all duration-300 group flex items-start gap-4"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center shrink-0 text-gold-mid group-hover:bg-gold group-hover:text-dark transition-all">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-widest uppercase text-gold-mid font-semibold mb-0.5">{item.label}</div>
                    <div className="text-[16px] font-serif text-dark font-medium group-hover:text-gold-mid transition-colors">{item.text}</div>
                    <div className="text-[12.5px] text-dark/60 mt-0.5">{item.subtext}</div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Opening Hours Box */}
            <div className="p-6 rounded-2xl bg-light/70 border border-gold/20 flex items-start gap-4 text-xs font-sans">
              <Clock className="text-gold-mid shrink-0 mt-0.5" size={18} />
              <div>
                <div className="font-mono text-[10px] tracking-widest uppercase text-gold-mid font-bold mb-1">Chambers Hours</div>
                <div className="text-dark/80 font-medium">Monday – Friday: 8:00 AM – 5:00 PM EAT</div>
                <div className="text-dark/60">Saturday: 9:00 AM – 1:00 PM (By Appointment)</div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-2xl overflow-hidden h-56 border border-gold/20 shadow-sm">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.758265576!2d32.5794!3d0.3136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb945415757d%3A0xc3f1d81f1479269e!2sE-Tower!5e0!3m2!1sen!2sug!4v1700000000000!5m2!1sen!2sug" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location Map"
              />
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <motion.div 
              className="p-8 sm:p-12 rounded-3xl bg-white border border-gold/20 shadow-xl relative overflow-hidden"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-mono text-[10px] tracking-widest uppercase text-gold-mid font-semibold">
                  § Direct Enquiry Form
                </div>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('open-chat'))}
                  className="flex items-center gap-1.5 text-xs text-gold-mid hover:text-dark font-mono uppercase tracking-wider"
                >
                  <Sparkles size={13} /> Ask AI Instead
                </button>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl mb-8 tracking-tight text-dark font-medium">
                Send Us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-dark/60 mb-1">Full Name *</label>
                  <input 
                    required 
                    placeholder="e.g. Counsel / Mr. John Mugisha" 
                    className="w-full px-4 py-3.5 rounded-xl bg-cream/40 border border-gold/20 focus:border-gold-mid focus:bg-white outline-none text-sm transition-all"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-dark/60 mb-1">Email Address *</label>
                    <input 
                      required 
                      type="email" 
                      placeholder="name@company.com" 
                      className="w-full px-4 py-3.5 rounded-xl bg-cream/40 border border-gold/20 focus:border-gold-mid focus:bg-white outline-none text-sm transition-all"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-dark/60 mb-1">Phone Number</label>
                    <input 
                      placeholder="+256 700 000 000" 
                      className="w-full px-4 py-3.5 rounded-xl bg-cream/40 border border-gold/20 focus:border-gold-mid focus:bg-white outline-none text-sm transition-all"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-dark/60 mb-1">Relevant Practice Area</label>
                  <select 
                    className="w-full px-4 py-3.5 rounded-xl bg-cream/40 border border-gold/20 focus:border-gold-mid focus:bg-white outline-none text-sm transition-all cursor-pointer"
                    value={formData.area}
                    onChange={e => setFormData({...formData, area: e.target.value})}
                  >
                    <option value="">Select Relevant Discipline</option>
                    {PRACTICE_AREAS.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-dark/60 mb-1">Enquiry Message *</label>
                  <textarea 
                    required
                    placeholder="Describe your question or matter in detail…" 
                    rows="5" 
                    className="w-full px-4 py-3.5 rounded-xl bg-cream/40 border border-gold/20 focus:border-gold-mid focus:bg-white outline-none text-sm transition-all resize-none"
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full btn-primary justify-center py-4 text-sm mt-2 disabled:opacity-50"
                >
                  {loading ? 'Sending Enquiry...' : 'Submit Confidential Enquiry'}
                  <ArrowUpRight size={16} />
                </button>
                
                <p className="text-[11px] text-center text-dark/50 mt-3 leading-relaxed font-sans italic">
                  Information sent is protected under advocate-client legal privilege.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
