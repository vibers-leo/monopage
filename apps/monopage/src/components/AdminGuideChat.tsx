'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';

type Message = { role: 'user' | 'ai'; text: string };

interface AdminGuideChatProps {
  profile: { username: string; bio: string; avatar_url: string };
  linksCount: number;
  portfolioCount: number;
}

const GUIDE_KNOWLEDGE = `# 모노페이지 어드민 가이드

## 페이지 만들기 순서
1. 프로필 사진과 소개글을 먼저 설정해요
2. 링크를 추가해요 (홈페이지, SNS, 네이버 지도 등)
3. SNS 탭에서 Instagram username을 입력하면 게시물을 자동으로 가져올 수 있어요
4. 포트폴리오 탭에서 사진/영상을 추가하거나 Instagram에서 가져온 게시물을 관리해요
5. Layout 탭에서 섹션 순서를 드래그로 변경하고, 테마를 선택해요
6. 문의폼을 추가하면 방문자가 문의를 남길 수 있어요
7. Settings에서 AI 도우미 놀리지를 입력하면 챗봇이 활성화돼요
8. 저장 버튼을 누르면 바로 반영돼요

## 팁
- Instagram, YouTube, TikTok, Threads, X 게시물을 username만 입력하면 바로 가져올 수 있어요
- 포트폴리오 비율은 1:1 또는 4:5로 선택 가능해요
- 문의폼은 접힌 상태가 기본이고, 펼침으로 바꿀 수도 있어요
- AI 도우미는 놀리지(지식)를 입력해야 활성화돼요
- 테마는 5가지: Minimal, Dark, Warm, Forest, Sky
- 페이지 주소는 monopage.kr/username 또는 username.monopage.kr 로 접속 가능해요
- QR 코드는 공유 버튼에서 다운로드할 수 있어요`;

export function AdminGuideChat({ profile, linksCount, portfolioCount }: AdminGuideChatProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  // 첫 진입 시 자동 안내 메시지
  useEffect(() => {
    if (!open || messages.length > 0) return;
    const tips: string[] = [];
    if (!profile.avatar_url) tips.push('프로필 사진을 먼저 설정해보세요!');
    if (!profile.bio) tips.push('소개글을 작성하면 페이지가 더 풍성해져요.');
    if (linksCount === 0) tips.push('링크를 추가해보세요. 홈페이지, SNS, 네이버 지도 등 어떤 링크든 가능해요.');
    if (portfolioCount === 0) tips.push('SNS 탭에서 Instagram username을 입력하면 게시물을 자동으로 가져올 수 있어요!');
    if (tips.length === 0) tips.push('페이지가 잘 만들어졌어요! 궁금한 점이 있으면 물어보세요.');

    setMessages([{ role: 'ai', text: tips.join('\n\n') }]);
  }, [open]);

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

  if (!mounted) return null;

  return (
    <>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-full text-[13px] font-semibold hover:bg-gray-800 transition-colors"
        >
          <Sparkles size={14} /> 도움이 필요하면 물어보세요
        </button>
      ) : (
        <div className="w-full bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col" style={{ maxHeight: '320px' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-black text-white shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles size={14} />
              <span className="text-[14px] font-bold">페이지 만들기 가이드</span>
            </div>
            <button onClick={() => setOpen(false)} className="opacity-60 hover:opacity-100">
              <X size={14} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2.5" style={{ minHeight: '120px' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-[13px] leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user' ? 'bg-black text-white rounded-br-sm' : 'bg-gray-100 text-gray-700 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-xl rounded-bl-sm bg-gray-100">
                  <Loader2 size={14} className="animate-spin text-gray-400" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-t border-gray-100 shrink-0">
            <input
              type="text"
              placeholder="궁금한 점을 물어보세요"
              className="flex-1 py-2 px-3 rounded-lg text-[13px] outline-none bg-gray-50"
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
      )}
    </>
  );
}
