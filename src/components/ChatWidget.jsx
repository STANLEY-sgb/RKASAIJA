import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Copy, Check, RotateCcw, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IMAGES, handleImageError } from '../data/images';
import { apiFetch } from '../utils/api';

const ChatWidget = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-chat', handleOpenChat);
    return () => window.removeEventListener('open-chat', handleOpenChat);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsThinking(true);
      setTimeout(() => {
        setIsThinking(false);
        const welcome = "Good day! I am Kasaija AI, legal assistant for R. Kasaija & Partners Advocates in Kampala.\n\nHow may I assist you today?\n• Learn about our 12 legal practice areas\n• Meet our team of advocates & partners\n• Book a legal consultation\n• Access office contacts & location";
        setMessages([{ 
          role: 'assistant', 
          content: welcome, 
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          actions: [
            { label: "Book Consultation", path: "/book" },
            { label: "Practice Areas", path: "/practice" },
            { label: "Our Team", path: "/team" }
          ]
        }]);
      }, 350);
    }
  }, [isOpen]);

  const handleSend = async (textToSend = null) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || isThinking) return;
    
    const userMsg = { 
      role: 'user', 
      content: messageText, 
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) 
    };
    
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    if (!textToSend) setInput("");
    setIsThinking(true);

    const historyPayload = updatedHistory.map(m => ({ role: m.role, content: m.content }));

    // Create 10-second timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await apiFetch('/chat', {
        method: 'POST',
        signal: controller.signal,
        body: JSON.stringify({
          message: messageText,
          messages: historyPayload
        })
      });

      clearTimeout(timeoutId);
      setIsThinking(false);

      if (res && res.text) {
        setMessages(prev => [
          ...prev, 
          {
            role: 'assistant',
            content: res.text,
            actions: res.actions || [],
            time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error('Invalid server response format.');
      }
    } catch (err) {
      clearTimeout(timeoutId);
      setIsThinking(false);

      console.warn('[AI CHAT TIMEOUT/NETWORK FALLBACK]', err.message);

      // Graceful fallback message with quick navigation actions
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "Thank you for reaching out to R. Kasaija & Partners Advocates. We are ready to assist you with your legal needs. You can schedule a consultation with our advocates directly online or by calling +256 772 418 707.",
          actions: [
            { label: "Book Consultation", path: "/book" },
            { label: "Contact Us", path: "/contact" },
            { label: "Practice Areas", path: "/practice" }
          ],
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const handleActionClick = (action) => {
    if (action.path) {
      navigate(action.path);
      setIsOpen(false);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleReset = () => {
    setMessages([]);
    setInput("");
  };

  const quickAsks = [
    "What legal services do you offer?",
    "How do I book a consultation?",
    "Who are the law partners?",
    "Where is your office located?"
  ];

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          aria-label="Open Kasaija AI Chat Assistant"
          className="fixed bottom-6 right-6 z-[500] w-14 h-14 sm:w-[62px] sm:h-[62px] rounded-full bg-dark text-cream shadow-2xl flex items-center justify-center group hover:scale-110 hover:-translate-y-1 transition-all duration-300 border border-gold/30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <div className="absolute inset-0 rounded-full bg-gold animate-pulse opacity-40" />
          <MessageCircle className="relative z-10 text-gold group-hover:rotate-12 transition-transform" size={24} />
          <span className="absolute bottom-[calc(100%+10px)] right-0 bg-dark text-cream text-[12px] px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-md font-mono border border-gold/20">
            Ask Kasaija AI
          </span>
        </button>
      )}

      {/* Chat Window Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[501] w-[calc(100vw-32px)] sm:w-[420px] h-[min(640px,calc(100vh-80px))] flex flex-col rounded-3xl overflow-hidden bg-cream shadow-2xl border border-gold/30"
          >
            {/* Header */}
            <div className="bg-dark p-4 relative overflow-hidden shrink-0 border-b border-gold/20 text-cream">
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center overflow-hidden shrink-0">
                    <img 
                      src={IMAGES.logo.src} 
                      alt="Kasaija AI" 
                      onError={(e) => handleImageError(e, IMAGES.logo.fallback)}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <div className="font-serif text-cream text-[16px] font-medium flex items-center gap-1.5">
                      <span>Kasaija AI</span>
                      <Sparkles size={13} className="text-gold" />
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
                      <span className="text-[10px] text-cream/70 uppercase tracking-widest font-mono">Online · Website Intake</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={handleReset}
                    title="Clear Conversation"
                    aria-label="Clear Conversation"
                    className="w-9 h-9 rounded-full text-cream/70 hover:text-cream hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer"
                  >
                    <RotateCcw size={15} />
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    aria-label="Close Chat Window"
                    className="w-9 h-9 rounded-full text-cream/70 hover:text-cream hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Suggestions Chips Bar */}
            <div className="flex gap-2 p-3 bg-light/50 border-b border-gold/15 overflow-x-auto no-scrollbar shrink-0">
              {quickAsks.map((q, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(q)}
                  disabled={isThinking}
                  className="whitespace-nowrap px-3 py-1.5 bg-white border border-gold/25 rounded-full text-[11.5px] text-dark hover:bg-dark hover:text-cream disabled:opacity-50 transition-all cursor-pointer font-sans"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-cream">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-dark border border-gold/30 shrink-0 overflow-hidden self-end mb-1">
                      <img 
                        src={IMAGES.logo.src} 
                        alt="AI" 
                        onError={(e) => handleImageError(e, IMAGES.logo.fallback)}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}

                  <div className={`max-w-[86%] flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm group relative ${
                      m.role === 'user' 
                        ? 'bg-dark text-cream rounded-2xl rounded-br-xs' 
                        : 'bg-white text-dark rounded-2xl rounded-bl-xs border border-gold/20'
                    }`}>
                      {m.content}

                      {/* Interactive Navigation Action Buttons */}
                      {m.role === 'assistant' && m.actions && m.actions.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gold/15 flex flex-wrap gap-2">
                          {m.actions.map((act, ai) => (
                            <button
                              key={ai}
                              onClick={() => handleActionClick(act)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gold/15 hover:bg-gold text-dark text-xs font-medium rounded-lg border border-gold/30 transition-all cursor-pointer"
                            >
                              <span>{act.label}</span>
                              <ArrowRight size={12} />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Copy button */}
                      {m.role === 'assistant' && m.content && (
                        <button
                          onClick={() => handleCopy(m.content, i)}
                          className="mt-2 text-[10px] text-dark/50 hover:text-gold-mid flex items-center gap-1 opacity-80 transition-opacity"
                        >
                          {copiedIndex === i ? <Check size={11} className="text-green-600" /> : <Copy size={11} />}
                          <span>{copiedIndex === i ? 'Copied' : 'Copy Text'}</span>
                        </button>
                      )}
                    </div>
                    <span className="text-[10px] opacity-40 mt-1 px-1 font-mono">{m.time}</span>
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex gap-2 items-center">
                  <div className="w-7 h-7 rounded-full bg-dark shrink-0 overflow-hidden self-end mb-1">
                    <img 
                      src={IMAGES.logo.src} 
                      alt="AI" 
                      onError={(e) => handleImageError(e, IMAGES.logo.fallback)}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="px-4 py-3 bg-white rounded-2xl rounded-bl-xs border border-gold/20 shadow-sm flex gap-1.5 items-center h-[38px]">
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce" />
                    <span className="text-xs text-dark/60 font-mono ml-2">Thinking…</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <div className="p-3 bg-white border-t border-gold/15 shrink-0">
              <div className="flex items-center gap-2 bg-light/50 rounded-xl p-1.5 px-3 border border-gold/25 focus-within:border-gold-mid focus-within:bg-white transition-all">
                <textarea 
                  rows={1}
                  value={input}
                  disabled={isThinking}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                  placeholder={isThinking ? "Searching website knowledge…" : "Ask about practice areas, advocates, booking..."}
                  className="flex-grow bg-transparent border-none text-sm py-1.5 resize-none max-h-28 outline-none text-dark disabled:opacity-50"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isThinking}
                  className="w-9 h-9 bg-dark text-cream rounded-lg flex items-center justify-center transition-all disabled:opacity-30 hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                >
                  <Send size={15} />
                </button>
              </div>
              <div className="text-[10px] text-center text-dark/50 mt-2 font-mono">
                Confidential website assistance · R. Kasaija &amp; Partners
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
