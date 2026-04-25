'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import type { Theme } from '@/lib/themes';

type Message = { role: 'user' | 'ai'; text: string };

interface SiteAIChatProps {
  username: string;
  theme?: Theme;
}

export function SiteAIChat({ username, theme }: SiteAIChatProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = theme?.vars;

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/site-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, username }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.response || '응답을 받지 못했어요.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: '네트워크가 불안정해요. 잠시 후 다시 시도해볼게요.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{ backgroundColor: t?.text || '#0a0a0a', color: t?.bg || '#ffffff' }}
      >
        <MessageCircle size={22} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] w-[340px] sm:w-[380px] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
      style={{ maxHeight: '500px', backgroundColor: t?.bg || '#ffffff', border: `1px solid ${t?.cardBorder || '#e5e5e5'}` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ backgroundColor: t?.text || '#0a0a0a', color: t?.bg || '#ffffff' }}
      >
        <div>
          <p className="text-[15px] font-bold">AI 도우미</p>
          <p className="text-[12px] opacity-60">@{username}</p>
        </div>
        <button onClick={() => setOpen(false)} className="opacity-60 hover:opacity-100 transition-opacity">
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3" style={{ minHeight: '200px', maxHeight: '340px' }}>
        {messages.length === 0 && (
          <p className="text-[14px] text-center py-8" style={{ color: t?.textMuted || '#a3a3a3' }}>
            궁금한 점을 물어보세요
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-[14px] leading-relaxed ${
                msg.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'
              }`}
              style={msg.role === 'user'
                ? { backgroundColor: t?.text || '#0a0a0a', color: t?.bg || '#ffffff' }
                : { backgroundColor: t?.cardBg || '#f5f5f5', color: t?.text || '#0a0a0a' }
              }
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-md" style={{ backgroundColor: t?.cardBg || '#f5f5f5' }}>
              <Loader2 size={16} className="animate-spin" style={{ color: t?.textMuted || '#a3a3a3' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-3 py-3 shrink-0" style={{ borderTop: `1px solid ${t?.cardBorder || '#e5e5e5'}` }}>
        <input
          type="text"
          placeholder="메시지를 입력해보세요"
          className="flex-1 py-2.5 px-3 rounded-xl text-[14px] outline-none"
          style={{ backgroundColor: t?.cardBg || '#f5f5f5', color: t?.text || '#0a0a0a' }}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 disabled:opacity-20 transition-all"
          style={{ backgroundColor: t?.text || '#0a0a0a', color: t?.bg || '#ffffff' }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
