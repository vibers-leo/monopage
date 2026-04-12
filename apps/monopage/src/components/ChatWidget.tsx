'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

type Message = {
  role: 'user' | 'ai';
  text: string;
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'ai', text: data.response || '응답을 받지 못했어요.' }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', text: '네트워크 오류가 발생했어요. 다시 시도해주세요.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[calc(100vw-48px)] sm:w-[380px] max-h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <p className="text-sm font-black tracking-tight">모노페이지 AI 도우미</p>
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-0.5">Powered by ZeroClaw</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[200px]">
              {messages.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-lg mb-3">
                    💬
                  </div>
                  <p className="text-xs font-bold text-gray-300">궁금한 점을 물어보세요!</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm font-medium leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-black text-white rounded-br-md'
                        : 'bg-gray-100 text-black rounded-bl-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="px-4 py-2.5 bg-gray-100 rounded-2xl rounded-bl-md">
                    <Loader2 size={16} className="animate-spin text-gray-400" />
                  </div>
                </div>
              )}
            </div>

            {/* Contact link */}
            <div className="px-4 pb-2">
              <a
                href="mailto:help@monopage.kr"
                className="block text-center text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-black transition-colors py-1"
              >
                관리자에게 직접 문의 &rarr;
              </a>
            </div>

            {/* Input */}
            <div className="px-4 pb-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 px-4 py-3 bg-gray-50 rounded-full text-sm font-medium outline-none focus:bg-gray-100 transition-colors"
                />
                <button
                  onClick={send}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shrink-0 disabled:opacity-20 hover:scale-105 active:scale-95 transition-all"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-black text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
