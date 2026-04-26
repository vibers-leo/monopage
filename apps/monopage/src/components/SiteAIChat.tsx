'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MessageCircle, X, Send, Loader2, Maximize2, Minimize2, FileText } from 'lucide-react';
import type { Theme } from '@/lib/themes';

type Message = { role: 'user' | 'ai'; text: string };

interface SiteAIChatProps {
  username: string;
  theme?: Theme;
}

type ChatSize = 'small' | 'medium' | 'large';

const SIZES: Record<ChatSize, { w: string; h: string }> = {
  small: { w: 'w-[320px] sm:w-[360px]', h: 'max-h-[420px]' },
  medium: { w: 'w-[360px] sm:w-[400px]', h: 'max-h-[520px]' },
  large: { w: 'w-[400px] sm:w-[460px]', h: 'max-h-[640px]' },
};

export function SiteAIChat({ username, theme }: SiteAIChatProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [size, setSize] = useState<ChatSize>('medium');
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = theme?.vars;

  useEffect(() => { setMounted(true); }, []);
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

  const cycleSize = () => {
    setSize(s => s === 'small' ? 'medium' : s === 'medium' ? 'large' : 'small');
  };

  const scrollToInquiry = () => {
    setOpen(false);
    setTimeout(() => {
      const el = document.querySelector('[data-section="inquiry"]') || document.querySelector('button[class*="문의"]');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (el as HTMLElement).click?.();
      } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    }, 100);
  };

  if (!mounted) return null;

  const s = SIZES[size];

  const widget = (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[99999] w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{ backgroundColor: t?.text || '#0a0a0a', color: t?.bg || '#ffffff' }}
        >
          <MessageCircle size={22} />
        </button>
      )}

      {open && (
        <div
          className={`fixed bottom-6 right-6 z-[99999] ${s.w} flex flex-col rounded-2xl shadow-2xl overflow-hidden transition-all`}
          style={{ ...({ maxHeight: s.h.replace('max-h-[','').replace(']','') } as any), backgroundColor: t?.bg || '#ffffff', border: `1px solid ${t?.cardBorder || '#e5e5e5'}` }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 shrink-0"
            style={{ backgroundColor: t?.text || '#0a0a0a', color: t?.bg || '#ffffff' }}
          >
            <div>
              <p className="text-[15px] font-bold">AI 도우미</p>
              <p className="text-[11px] opacity-50">자동 응답 · 실시간 상담이 아니에요</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={cycleSize} className="opacity-50 hover:opacity-100 transition-opacity p-1" title="크기 조절">
                {size === 'large' ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
              <button onClick={() => setOpen(false)} className="opacity-50 hover:opacity-100 transition-opacity p-1">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3" style={{ minHeight: '160px' }}>
            {messages.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <p className="text-[14px] font-medium" style={{ color: t?.text || '#0a0a0a' }}>궁금한 점을 물어보세요</p>
                <p className="text-[13px] leading-relaxed" style={{ color: t?.textMuted || '#a3a3a3' }}>
                  AI가 등록된 정보를 기반으로 답변해드려요.<br />
                  직접 문의가 필요하면 아래 문의하기를 이용해주세요.
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[14px] leading-relaxed ${
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

          {/* 문의하기 안내 */}
          <div className="px-4 py-2 shrink-0" style={{ borderTop: `1px solid ${t?.cardBorder || '#e5e5e5'}` }}>
            <button
              onClick={scrollToInquiry}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[13px] font-medium transition-colors hover:opacity-80"
              style={{ backgroundColor: t?.cardBg || '#f5f5f5', color: t?.textMuted || '#a3a3a3' }}
            >
              <FileText size={13} /> 직접 문의하기 (문의폼으로 이동)
            </button>
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
      )}
    </>
  );

  return createPortal(widget, document.body);
}
