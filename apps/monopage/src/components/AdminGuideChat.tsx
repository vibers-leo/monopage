'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, Minimize2, Maximize2 } from 'lucide-react';

type Message = { role: 'user' | 'ai'; text: string };

interface AdminGuideChatProps {
  profile: { username: string; bio: string; avatar_url: string };
  linksCount: number;
  portfolioCount: number;
}

export function AdminGuideChat({ profile, linksCount, portfolioCount }: AdminGuideChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  // 첫 진입 시 자동 안내
  useEffect(() => {
    if (initialized) return;
    setInitialized(true);

    const tips: string[] = [];
    if (!profile.avatar_url && !profile.bio && linksCount === 0 && portfolioCount === 0) {
      tips.push('안녕하세요! 모노페이지 AI 비서예요. 🙌\n\n페이지가 아직 비어있네요. 제가 단계별로 도와드릴게요!\n\n먼저 **프로필 탭**에서 사진과 소개글을 설정해보세요.');
    } else {
      const missing: string[] = [];
      if (!profile.avatar_url) missing.push('프로필 사진');
      if (!profile.bio) missing.push('소개글');
      if (linksCount === 0) missing.push('링크');
      if (portfolioCount === 0) missing.push('포트폴리오');

      if (missing.length > 0) {
        tips.push(`안녕하세요! 모노페이지 AI 비서예요. 🙌\n\n페이지가 거의 완성됐어요! ${missing.join(', ')}만 추가하면 더 멋진 페이지가 될 거예요.\n\n궁금한 점이 있으면 언제든 물어보세요.`);
      } else {
        tips.push('안녕하세요! 모노페이지 AI 비서예요. 🙌\n\n페이지가 잘 만들어졌어요! 수정하고 싶은 부분이나 궁금한 점이 있으면 물어보세요.');
      }
    }

    setMessages([{ role: 'ai', text: tips[0] }]);
  }, [profile, linksCount, portfolioCount]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.response || '답변을 가져오지 못했어요.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: '네트워크가 불안정해요.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-full text-[13px] font-semibold hover:bg-gray-800 transition-colors shadow-lg"
      >
        <Sparkles size={14} /> AI 비서
      </button>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col shadow-xl" style={{ maxHeight: '380px' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black text-white shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles size={14} />
          <span className="text-[14px] font-bold">AI 비서</span>
          <span className="text-[11px] opacity-50">모노페이지 도우미</span>
        </div>
        <button onClick={() => setMinimized(true)} className="opacity-50 hover:opacity-100">
          <Minimize2 size={14} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2.5" style={{ minHeight: '140px' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[90%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user' ? 'bg-black text-white rounded-br-sm' : 'bg-gray-50 text-gray-700 rounded-bl-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-sm bg-gray-50">
              <Loader2 size={14} className="animate-spin text-gray-400" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-t border-gray-100 shrink-0">
        <input
          type="text"
          placeholder="무엇이든 물어보세요"
          className="flex-1 py-2 px-3 rounded-xl text-[13px] outline-none bg-gray-50"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shrink-0 disabled:opacity-20"
        >
          <Send size={13} />
        </button>
      </div>
    </div>
  );
}
