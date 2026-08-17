import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { streamFetch } from '../utils/api';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-chat', handleOpenChat);
    return () => window.removeEventListener('open-chat', handleOpenChat);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const welcome = "Good day! I am Kasaija AI, your legal intake assistant for R. Kasaija & Partners Advocates.\n\nHow may I assist you today?\n• General legal questions about Ugandan law\n• Information about our services and team\n• Book a consultation\n• Find our office & contact details";
        setMessages([{ role: 'assistant', content: welcome, time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }]);
      }, 500);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsgText = input;
    const userMsg = { role: 'user', content: userMsgText, time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) };
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    let assistantReply = "";
    const assistantMsgIndex = messages.length + 1;

    // Add empty assistant message that will be filled
    setMessages(prev => [...prev, { role: 'assistant', content: "", time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }]);

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    history.push({ role: 'user', content: userMsgText });

    await streamFetch('/chat/stream', { messages: history }, 
      (chunk) => {
        setIsTyping(false);
        assistantReply += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = assistantReply;
          return newMessages;
        });
      },
      () => {
        setIsTyping(false);
      },
      (error) => {
        setIsTyping(false);
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = error;
          return newMessages;
        });
      }
    );
  };

  const quickAsks = [
    "What services do you offer?",
    "How do I book a consultation?",
    "I have a land dispute",
    "Where are you located?"
  ];

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-7 right-7 z-[500] w-[62px] h-[62px] rounded-full bg-gradient-to-br from-[#4a2010] to-dark text-cream shadow-[0_8px_32px_-6px_rgba(42,29,16,0.6)] flex items-center justify-center group hover:scale-110 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="absolute inset-0 rounded-full bg-gold animate-[ringPulse_2.4s_ease-out_infinite]" />
          <MessageCircle className="relative z-10 group-hover:rotate-12 transition-transform" size={24} />
          <span className="absolute bottom-[calc(100%+10px)] right-0 bg-dark text-cream text-[12px] px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
            Ask Kasaija AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-7 right-7 z-[501] w-[min(420px,calc(100vw-40px))] h-[min(640px,calc(100vh-80px))] flex flex-col rounded-[20px] overflow-hidden bg-[#F8F4EE] shadow-[0_24px_80px_-16px_rgba(42,29,16,0.4)] border border-gold/10"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-[#3D2010] via-dark to-[#1e140a] p-4 relative overflow-hidden shrink-0">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 0%, #B8956A 0%, transparent 50%)" }} />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#c8a06a] to-[#a07040] shadow-lg relative overflow-hidden">
                    <img src="/assets/img/firm_logo.jpeg" loading="lazy" width="44" height="44" className="w-full h-full object-cover" alt="Kasaija AI" onError={(e)=>{e.target.onerror=null; e.target.src='/assets/img/remove.png';}} />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#22C55E] border-2 border-dark rounded-full shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
                  </div>
                  <div>
                    <div className="font-serif text-cream text-[16px]">Kasaija AI</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse" />
                      <span className="text-[10px] text-cream/60 uppercase tracking-widest">Online</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-white/10 text-cream/60 hover:text-cream hover:bg-white/20 transition-all flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Quick Chips */}
            <div className="flex gap-2 p-3 bg-gold/5 border-b border-gold/10 overflow-x-auto no-scrollbar shrink-0">
              {quickAsks.map((q, i) => (
                <button 
                  key={i} 
                  onClick={() => { setInput(q); }}
                  className="whitespace-nowrap px-4 py-1.5 bg-white border border-gold/20 rounded-full text-[12px] text-dark hover:bg-dark hover:text-cream hover:border-dark transition-all"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#F2EDE4] to-[#F8F4EE]">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#c8a06a] to-[#a07040] shrink-0 overflow-hidden self-end mb-4">
                      <img src="/assets/img/firm_logo.jpeg" loading="lazy" width="28" height="28" className="w-full h-full object-cover" alt="AI" onError={(e)=>{e.target.onerror=null; e.target.src='/assets/img/remove.png';}} />
                    </div>
                  )}
                  <div className={`max-w-[83%] flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                      m.role === 'user' 
                        ? 'bg-gradient-to-br from-[#3D2010] to-dark text-cream rounded-[16px_16px_4px_16px]' 
                        : 'bg-white text-dark rounded-[16px_16px_16px_4px] border border-gold/10'
                    }`}>
                      {m.content}
                    </div>
                    <span className="text-[10px] opacity-40 mt-1 px-1">{m.time}</span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#c8a06a] to-[#a07040] shrink-0 overflow-hidden self-end mb-4">
                    <img src="/assets/img/firm_logo.jpeg" loading="lazy" width="28" height="28" className="w-full h-full object-cover" alt="AI" onError={(e)=>{e.target.onerror=null; e.target.src='/assets/img/remove.png';}} />
                  </div>
                  <div className="px-4 py-3 bg-white rounded-[16px_16px_16px_4px] border border-gold/10 shadow-sm flex gap-1 items-center h-[38px]">
                    <span className="w-1.5 h-1.5 bg-gold-mid rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-gold-mid rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-gold-mid rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-gold/10 shrink-0">
              <div className="flex items-end gap-2 bg-[#F2EDE4] rounded-xl p-1.5 px-3 focus-within:ring-1 focus-within:ring-gold/50 transition-all">
                <textarea 
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                  placeholder="Type your question..."
                  className="flex-grow bg-transparent border-none focus:ring-0 text-sm py-2 resize-none max-h-32 outline-none"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-9 h-9 bg-gradient-to-br from-[#4a2010] to-dark text-cream rounded-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:hover:scale-100 hover:scale-105 active:scale-95"
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="text-[10px] text-center text-dark/35 mt-2">Confidential intake only · Not a substitute for legal advice</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
