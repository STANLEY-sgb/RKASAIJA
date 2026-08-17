import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Phone, Mail, MapPin, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { PRACTICE_AREAS } from '../data/constants';
import { apiFetch } from '../utils/api';

const Book = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', area: '', lawyer: '', date: '', time: '', message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      client_name: formData.name,
      client_email: formData.email,
      client_phone: formData.phone,
      practice_area: formData.area,
      preferred_lawyer: formData.lawyer,
      preferred_date: formData.date,
      preferred_time: formData.time,
      message: formData.message
    };

    try {
      await apiFetch('/book', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Could not save appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactItems = [
    { icon: Calendar, label: "Book Online", text: "Select your lawyer and preferred date. We'll confirm within one business day." },
    { icon: Phone, label: "Call Directly", text: "+256 772 418 707 | +256 776 044 004" },
    { icon: Mail, label: "Email", text: "kasaijaandpartners@gmail.com" },
    { icon: MapPin, label: "Visit Us", text: "Plot 75 Kampala Road, E-Tower Building, 4th Floor, Suite D-06, Kampala" },
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
            <h2 className="font-serif text-4xl lg:text-5xl mb-6 tracking-tight text-dark">Thank you, <em className="accent">{formData.name.split(' ')[0]}</em>.</h2>
            <p className="text-lg opacity-70 leading-relaxed max-w-md mx-auto">
              Your consultation request has been received. Our team will contact you within one business day to confirm your appointment.
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="mt-10 text-sm font-semibold text-gold-mid hover:text-dark transition-colors uppercase tracking-widest"
            >
              Request another booking
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
          <div className="font-mono text-[10px] tracking-widest uppercase text-gold-mid mb-6">§ Schedule a consultation</div>
          <h1 className="font-serif text-[clamp(3rem,7vw,6rem)] leading-[0.95] mb-20 tracking-tight">
            Book your <em className="accent">appointment.</em>
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-16">
          {/* Info Column */}
          <div className="lg:col-span-5 space-y-12">
            {contactItems.map((item, i) => (
              <motion.div 
                key={i}
                className="flex gap-6 group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-light to-light2 border border-gold/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                  <item.icon className="text-gold-mid" size={20} />
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-widest uppercase text-gold-mid mb-2">{item.label}</div>
                  <p className="text-[14px] lg:text-[15px] opacity-75 leading-relaxed group-hover:opacity-100 transition-opacity">
                    {item.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <motion.div 
              className="p-10 lg:p-14 rounded-3xl relative overflow-hidden bg-gradient-to-br from-light to-light2 border border-gold/15 shadow-[0_20px_64px_-20px_rgba(42,29,16,0.2)]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Decorative orb */}
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gold/10 blur-3xl" />
              
              <div className="relative z-10">
                <div className="font-mono text-[10px] tracking-widest uppercase text-gold-mid mb-4">§ Intake form</div>
                <h3 className="font-serif text-3xl lg:text-4xl mb-10 tracking-tight text-dark">Tell us about your matter.</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input 
                    required 
                    placeholder="Full name *" 
                    className="w-full px-5 py-4 rounded-xl bg-white border border-gold/25 focus:border-gold-mid outline-none text-sm transition-all"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input 
                      required 
                      type="email" 
                      placeholder="Email address *" 
                      className="w-full px-5 py-4 rounded-xl bg-white border border-gold/25 focus:border-gold-mid outline-none text-sm transition-all"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                    <input 
                      placeholder="Phone number" 
                      className="w-full px-5 py-4 rounded-xl bg-white border border-gold/25 focus:border-gold-mid outline-none text-sm transition-all"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <select 
                      className="w-full px-5 py-4 rounded-xl bg-white border border-gold/25 focus:border-gold-mid outline-none text-sm transition-all appearance-none cursor-pointer"
                      value={formData.area}
                      onChange={e => setFormData({...formData, area: e.target.value})}
                    >
                      <option value="">Practice area</option>
                      {PRACTICE_AREAS.map(p => <option key={p.id}>{p.name}</option>)}
                    </select>
                    <select 
                      className="w-full px-5 py-4 rounded-xl bg-white border border-gold/25 focus:border-gold-mid outline-none text-sm transition-all appearance-none cursor-pointer"
                      value={formData.lawyer}
                      onChange={e => setFormData({...formData, lawyer: e.target.value})}
                    >
                      <option value="">Preferred advocate</option>
                      <option>Robert Kasaija</option>
                      <option>Sharon Murungi</option>
                      <option>Joseph Kwesiga</option>
                      <option>Justin Joseph Kasaija</option>
                    </select>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <input 
                      type="date" 
                      className="w-full px-5 py-4 rounded-xl bg-white border border-gold/25 focus:border-gold-mid outline-none text-sm transition-all cursor-pointer"
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                    <input 
                      type="time" 
                      className="w-full px-5 py-4 rounded-xl bg-white border border-gold/25 focus:border-gold-mid outline-none text-sm transition-all cursor-pointer"
                      value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                    />
                  </div>

                  <textarea 
                    placeholder="Briefly describe your matter…" 
                    rows="4" 
                    className="w-full px-5 py-4 rounded-xl bg-white border border-gold/25 focus:border-gold-mid outline-none text-sm transition-all resize-none"
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  />

                  <button type="submit" className="w-full btn-primary justify-center group py-5">
                    Request Appointment
                    <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                  
                  <p className="text-[11px] text-center opacity-50 mt-4 leading-relaxed">
                    By submitting, you acknowledge this does not create a solicitor-client relationship until confirmed in writing.
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

export default Book;
