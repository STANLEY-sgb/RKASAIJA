import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Phone, Mail, MapPin, CheckCircle2, ArrowUpRight, AlertCircle, Clock } from 'lucide-react';
import { PRACTICE_AREAS, STAFF } from '../data/constants';
import { submitAppointmentRequest } from '../utils/api';

const Book = () => {
  const location = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [referenceId, setReferenceId] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    area: '',
    lawyer: '',
    date: '',
    time: '',
    message: '',
    honeypot: ''
  });

  // Pre-fill practice area or lawyer from state if passed from other pages (e.g. Advocate profile cards)
  useEffect(() => {
    if (location.state?.area) {
      setFormData(prev => ({ ...prev, area: location.state.area }));
    }
    if (location.state?.lawyer) {
      setFormData(prev => ({ ...prev, lawyer: location.state.lawyer }));
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const generatedRef = 'RKP-' + Math.floor(100000 + Math.random() * 900000);

    const payload = {
      client_name: formData.name,
      client_email: formData.email,
      client_phone: formData.phone,
      practice_area: formData.area,
      preferred_lawyer: formData.lawyer,
      preferred_date: formData.date,
      preferred_time: formData.time,
      message: formData.message,
      reference_id: generatedRef,
      honeypot: formData.honeypot
    };

    try {
      const res = await submitAppointmentRequest(payload);
      if (res && res.success) {
        setReferenceId(res.refId || generatedRef);
        setSubmitted(true);
      } else {
        setError(res?.error || 'We couldn\'t submit your appointment request right now. Please try again or contact us directly.');
      }
    } catch (err) {
      console.error('Booking submit error:', err);
      setError('We couldn\'t submit your request right now due to a network connection issue. Please try again or call +256 772 418 707.');
    } finally {
      setLoading(false);
    }
  };

  const contactItems = [
    { icon: Calendar, label: "Booking Policy", text: "Appointments are confirmed within 1 business day. Confidentiality assured." },
    { icon: Phone, label: "Direct Phone", text: "+256 772 418 707 | +256 776 044 004" },
    { icon: Mail, label: "Direct Email", text: "kasaijaandpartners@gmail.com" },
    { icon: MapPin, label: "Chambers Address", text: "Plot 75 Kampala Road, E-Tower Building, 4th Floor, Suite D-06, Kampala" },
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
            
            <div className="font-mono text-xs uppercase tracking-widest text-gold-mid mb-2 font-bold">
              Ref ID: {referenceId}
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl mb-4 tracking-tight text-dark font-medium">
              Consultation Request Received
            </h2>
            
            <p className="text-base sm:text-lg text-dark/90 leading-relaxed max-w-lg mx-auto mb-8 font-sans font-medium">
              Your appointment request has been received. Our team will contact you to confirm availability.
            </p>

            <div className="p-4 rounded-xl bg-white/60 border border-gold/20 text-left text-xs font-mono text-dark/80 mb-8 max-w-md mx-auto space-y-1">
              <div><strong>Client Name:</strong> {formData.name}</div>
              <div><strong>Email Address:</strong> {formData.email}</div>
              <div><strong>Practice Area:</strong> {formData.area || 'General Legal Counsel'}</div>
              <div><strong>Requested Advocate:</strong> {formData.lawyer || 'Assigned Specialist'}</div>
              <div><strong>Requested Schedule:</strong> {formData.date || 'Flexible Date'} {formData.time}</div>
            </div>

            <button 
              onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', area: '', lawyer: '', date: '', time: '', message: '', honeypot: '' }); }}
              className="btn-outline border-dark text-dark hover:bg-dark hover:text-cream text-xs"
            >
              Submit Another Booking Request
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
            § Book Appointment
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[0.96] mb-6 tracking-tight text-dark font-medium">
            Schedule a Legal<br /><em className="accent">Consultation.</em>
          </h1>
          <p className="text-base sm:text-lg text-dark/75 leading-relaxed font-sans max-w-2xl">
            Request an in-person appointment at our Kampala chambers or schedule a remote consultation with a specialized advocate.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Information Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            {contactItems.map((item, i) => (
              <motion.div 
                key={i}
                className="flex gap-5 p-6 rounded-2xl bg-white border border-gold/15 shadow-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-11 h-11 rounded-xl bg-gold/15 flex items-center justify-center shrink-0 text-gold-mid">
                  <item.icon size={20} />
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-widest uppercase text-gold-mid font-semibold mb-1">
                    {item.label}
                  </div>
                  <p className="text-[14px] text-dark/80 leading-relaxed font-sans">
                    {item.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form Box */}
          <div className="lg:col-span-7">
            <motion.div 
              className="p-8 sm:p-12 rounded-3xl bg-white border border-gold/20 shadow-xl relative overflow-hidden"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="font-mono text-[10px] tracking-widest uppercase text-gold-mid mb-3 font-semibold">
                § Legal Intake Details
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl mb-8 tracking-tight text-dark font-medium">
                Consultation Request Form
              </h2>
              
              {error && (
                <div className="p-4 mb-6 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 flex flex-col gap-2">
                  <div className="flex items-center gap-2 font-medium">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                  <div className="mt-1 pt-2 border-t border-red-200/60 flex items-center gap-3 text-[11px]">
                    <span>Or email us directly:</span>
                    <a 
                      href={`mailto:kasaijaandpartners@gmail.com?subject=${encodeURIComponent('Appointment Request: ' + (formData.name || 'Client'))}&body=${encodeURIComponent(formData.message || '')}`}
                      className="underline font-semibold hover:text-red-900"
                    >
                      kasaijaandpartners@gmail.com
                    </a>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field for bot protection */}
                <input 
                  type="text" 
                  name="_honey" 
                  tabIndex="-1" 
                  autoComplete="off" 
                  value={formData.honeypot} 
                  onChange={e => setFormData({...formData, honeypot: e.target.value})} 
                  className="hidden" 
                  aria-hidden="true" 
                />

                <div>
                  <label htmlFor="book-name" className="block text-xs font-mono uppercase text-dark/60 mb-1">Full Name *</label>
                  <input 
                    id="book-name"
                    required 
                    placeholder="e.g. Counsel / Mr. John Mugisha" 
                    className="w-full px-4 py-3.5 rounded-xl bg-cream/40 border border-gold/20 focus:border-gold-mid focus:bg-white outline-none text-sm transition-all"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="book-email" className="block text-xs font-mono uppercase text-dark/60 mb-1">Email Address *</label>
                    <input 
                      id="book-email"
                      required 
                      type="email" 
                      placeholder="name@company.com" 
                      className="w-full px-4 py-3.5 rounded-xl bg-cream/40 border border-gold/20 focus:border-gold-mid focus:bg-white outline-none text-sm transition-all"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label htmlFor="book-phone" className="block text-xs font-mono uppercase text-dark/60 mb-1">Phone Number</label>
                    <input 
                      id="book-phone"
                      placeholder="+256 700 000 000" 
                      className="w-full px-4 py-3.5 rounded-xl bg-cream/40 border border-gold/20 focus:border-gold-mid focus:bg-white outline-none text-sm transition-all"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="book-area" className="block text-xs font-mono uppercase text-dark/60 mb-1">Practice Area</label>
                    <select 
                      id="book-area"
                      className="w-full px-4 py-3.5 rounded-xl bg-cream/40 border border-gold/20 focus:border-gold-mid focus:bg-white outline-none text-sm transition-all cursor-pointer"
                      value={formData.area}
                      onChange={e => setFormData({...formData, area: e.target.value})}
                    >
                      <option value="">Select Practice Discipline</option>
                      {PRACTICE_AREAS.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="book-lawyer" className="block text-xs font-mono uppercase text-dark/60 mb-1">Preferred Advocate</label>
                    <select 
                      id="book-lawyer"
                      className="w-full px-4 py-3.5 rounded-xl bg-cream/40 border border-gold/20 focus:border-gold-mid focus:bg-white outline-none text-sm transition-all cursor-pointer"
                      value={formData.lawyer}
                      onChange={e => setFormData({...formData, lawyer: e.target.value})}
                    >
                      <option value="">Any Available Specialist</option>
                      {STAFF.map(s => <option key={s.name} value={s.name}>{s.name} ({s.role.split(' — ')[0]})</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="book-date" className="block text-xs font-mono uppercase text-dark/60 mb-1">Preferred Date</label>
                    <input 
                      id="book-date"
                      type="date" 
                      className="w-full px-4 py-3.5 rounded-xl bg-cream/40 border border-gold/20 focus:border-gold-mid focus:bg-white outline-none text-sm transition-all cursor-pointer"
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label htmlFor="book-time" className="block text-xs font-mono uppercase text-dark/60 mb-1">Preferred Time</label>
                    <input 
                      id="book-time"
                      type="time" 
                      className="w-full px-4 py-3.5 rounded-xl bg-cream/40 border border-gold/20 focus:border-gold-mid focus:bg-white outline-none text-sm transition-all cursor-pointer"
                      value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="book-message" className="block text-xs font-mono uppercase text-dark/60 mb-1">Matter Summary / Message</label>
                  <textarea 
                    id="book-message"
                    placeholder="Briefly describe the key facts or background of your legal matter…" 
                    rows="4" 
                    className="w-full px-4 py-3.5 rounded-xl bg-cream/40 border border-gold/20 focus:border-gold-mid focus:bg-white outline-none text-sm transition-all resize-none"
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full btn-primary justify-center py-4 text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting Request...' : 'Submit Consultation Request'}
                  <ArrowUpRight size={16} />
                </button>
                
                <p className="text-[11px] text-center text-dark/50 mt-3 leading-relaxed font-sans">
                  Submitting this request does not constitute formal legal representation until an advocate confirmation is executed.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book;
