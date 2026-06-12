import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Send, X, Bot, Sparkles, User, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIAdvisor = () => {
  const { token, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello ${user ? user.name : 'Learner'} 👋! I am your AI Learning Assistant. I track your curriculum progress and can guide your path.\n\nHere are some things you can ask me:`,
      isWelcome: true
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!user || user.role !== 'student') return null; // Only show to student role

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    // Add user message
    const userMsgId = Math.random().toString();
    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { 
          id: Math.random().toString(), 
          sender: 'assistant', 
          text: data.reply 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          id: Math.random().toString(), 
          sender: 'assistant', 
          text: 'Sorry, I hit an error while processing that. Please try again.' 
        }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { 
        id: Math.random().toString(), 
        sender: 'assistant', 
        text: 'Network error. Make sure the API server is running.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (actionText) => {
    handleSend(actionText);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-brand-primary to-purple-600 text-white shadow-xl shadow-purple-900/40 hover:brightness-110 transition-all border border-brand-primary/30"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative flex items-center justify-center"
            >
              <Bot className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand-secondary text-[8px] font-bold text-[#030014] animate-ping" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand-secondary text-[8px] font-bold text-[#030014]">
                !
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 50 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute bottom-18 right-0 w-[360px] sm:w-[400px] h-[500px] rounded-2xl glass-panel shadow-2xl flex flex-col overflow-hidden border border-brand-cardBorder"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-primary/25 to-brand-secondary/15 px-4 py-3 border-b border-brand-cardBorder flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30">
                  <Brain className="h-4.5 w-4.5 text-brand-secondary animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-1">
                    Aether AI Advisor
                    <Sparkles className="h-3 w-3 text-brand-secondary fill-brand-secondary/20" />
                  </h4>
                  <p className="text-[10px] text-brand-secondary">Core engine mapping online...</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="rounded-lg p-1 text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Message Pane */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'assistant' && (
                    <div className="h-7 w-7 rounded-lg bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 flex-shrink-0 mt-0.5">
                      <Bot className="h-4 w-4 text-purple-400" />
                    </div>
                  )}
                  <div className="max-w-[80%] flex flex-col gap-1.5">
                    <div className={`rounded-xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line shadow ${msg.sender === 'user' ? 'bg-brand-primary text-white' : 'bg-brand-cardBorder/45 border border-brand-cardBorder/70 text-gray-200'}`}>
                      {msg.text}
                    </div>

                    {msg.isWelcome && (
                      <div className="flex flex-col gap-2 mt-1">
                        <button onClick={() => handleQuickAction("What should I learn next?")} className="w-full text-left rounded-lg border border-brand-cardBorder bg-brand-cardBorder/35 px-3 py-2 text-[11px] text-purple-300 hover:bg-brand-primary/15 hover:border-brand-primary/40 transition-colors">
                          🎯 What should I learn next?
                        </button>
                        <button onClick={() => handleQuickAction("Explain React")} className="w-full text-left rounded-lg border border-brand-cardBorder bg-brand-cardBorder/35 px-3 py-2 text-[11px] text-cyan-300 hover:bg-brand-secondary/15 hover:border-brand-secondary/40 transition-colors">
                          📘 Explain React
                        </button>
                        <button onClick={() => handleQuickAction("Give study advice")} className="w-full text-left rounded-lg border border-brand-cardBorder bg-brand-cardBorder/35 px-3 py-2 text-[11px] text-amber-300 hover:bg-amber-400/10 hover:border-amber-400/35 transition-colors">
                          💡 Give me study advice
                        </button>
                      </div>
                    )}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="h-7 w-7 rounded-lg bg-brand-secondary/10 flex items-center justify-center border border-brand-secondary/20 flex-shrink-0 mt-0.5">
                      <User className="h-4 w-4 text-cyan-400" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="h-7 w-7 rounded-lg bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 flex-shrink-0 mt-0.5">
                    <Bot className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="rounded-xl px-3.5 py-2.5 text-xs text-brand-textMuted bg-brand-cardBorder/45 border border-brand-cardBorder/70 flex items-center gap-1.5">
                    <span>AI is formulating guidance</span>
                    <span className="flex gap-0.5">
                      <span className="h-1 w-1 bg-brand-secondary rounded-full animate-bounce" />
                      <span className="h-1 w-1 bg-brand-secondary rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="h-1 w-1 bg-brand-secondary rounded-full animate-bounce [animation-delay:0.4s]" />
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="p-3 border-t border-brand-cardBorder bg-black/40 flex gap-2 items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your learning path..."
                disabled={isLoading}
                className="flex-1 rounded-xl bg-brand-cardBorder/50 px-3.5 py-2 text-xs border border-brand-cardBorder/60 text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-gradient-to-r from-brand-primary to-purple-600 p-2.5 text-white hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAdvisor;
