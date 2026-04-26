'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MessageCircle, X, Send, Loader2, Sparkles, Minimize2, FileText } from 'lucide-react';

type Message = { role: 'user' | 'ai'; text: string };
type ChatSize = 'small' | 'medium' | 'large';

const SIZES: Record<ChatSize, { w: string; maxH: string }> = {
  small: { w: 'w-[320px] sm:w-[360px]', maxH: '420px' },
  medium: { w: 'w-[360px] sm:w-[400px]', maxH: '520px' },
  large: { w: 'w-[400px] sm:w-[460px]', maxH: '640px' },
};

interface AdminGuideChatProps {
  profile: { username: string; bio: string; avatar_url: string; display_name?: string };
  linksCount: number;
  portfolioCount: number;
}

export function AdminGuideChat({ profile, linksCount, portfolioCount }: AdminGuideChatProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [size, setSize] = useState<ChatSize>('medium');
  const [mode, setMode] = useState<'chat' | 'contact'>('chat');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSent, setContactSent] = useState(false);
  const [contactSending, setContactSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  // 첫 열림 시 자동 안내
  useEffect(() => {
    if (!open || messages.length > 0) return;
    const missing: string[] = [];
    if (!profile.avatar_url) missing.push('프로필 사진');
    if (!profile.bio) missing.push('소개글');
    if (linksCount === 0) missing.push('링크');
    if (portfolioCount === 0) missing.push('포트폴리오');

    let greeting: string;
    const hi = profile.display_name ? `${profile.display_name}님, 안녕하세요!` : '안녕하세요!';

    if (missing.length === 4) {
      greeting = `${hi} 모노페이지 AI 비서예요 🙌\n\n페이지가 아직 비어있네요. 제가 단계별로 도와드릴게요!\n\n먼저 **프로필** 탭에서 사진과 소개글을 설정해보세요.\n\n그리고 **SNS** 탭에서 Instagram username만 입력하면 게시물을 자동으로 가져올 수 있어요!`;
    } else if (missing.length > 0) {
      greeting = `${hi} 모노페이지 AI 비서예요 🙌\n\n거의 다 됐어요! ${missing.join(', ')}만 추가하면 더 멋진 페이지가 될 거예요.\n\n궁금한 점이 있으면 언제든 물어보세요.`;
    } else {
      greeting = `${hi} 모노페이지 AI 비서예요 🙌\n\n페이지가 잘 만들어졌어요! 수정하거나 궁금한 점이 있으면 물어보세요.`;
    }
    setMessages([{ role: 'ai', text: greeting }]);
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

  const sendContact = async () => {
    if (!contactMsg.trim()) return;
    setContactSending(true);
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'page_request',
          data: { username: profile.username, purpose: '어드민 문의/건의', email: contactMsg },
        }),
      });
      setContactSent(true);
    } catch { setContactSent(true); }
    finally { setContactSending(false); }
  };

  const cycleSize = () => setSize(s => s === 'small' ? 'medium' : s === 'medium' ? 'large' : 'small');

  if (!mounted) return null;

  const s = SIZES[size];

  const widget = (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[99999] flex items-center gap-2 px-5 py-3 bg-black text-white rounded-full text-[14px] font-semibold shadow-lg hover:bg-gray-800 transition-colors"
        >
          <Sparkles size={16} /> AI 비서
        </button>
      )}

      {open && (
        <div
          className={`fixed bottom-6 right-6 z-[99999] ${s.w} flex flex-col rounded-2xl shadow-2xl overflow-hidden bg-white border border-gray-200 transition-all`}
          style={{ maxHeight: s.maxH }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-black text-white shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles size={14} />
              <span className="text-[15px] font-bold">AI 비서</span>
              <span className="text-[11px] opacity-50">모노페이지 도우미</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={cycleSize} className="opacity-50 hover:opacity-100 transition-opacity p-1" title="크기 조절">
                <Minimize2 size={14} />
              </button>
              <button onClick={() => setOpen(false)} className="opacity-50 hover:opacity-100 transition-opacity p-1">
                <X size={16} />
              </button>
            </div>
          </div>

          {mode === 'chat' ? (
            <>
              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2.5" style={{ minHeight: '160px' }}>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[14px] leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user' ? 'bg-black text-white rounded-br-md' : 'bg-gray-50 text-gray-700 rounded-bl-md'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-md bg-gray-50">
                      <Loader2 size={16} className="animate-spin text-gray-400" />
                    </div>
                  </div>
                )}
              </div>

              {/* 문의/건의 버튼 */}
              <div className="px-4 py-2 shrink-0 border-t border-gray-100">
                <button
                  onClick={() => setMode('contact')}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[13px] font-medium bg-gray-50 text-gray-400 hover:text-black transition-colors"
                >
                  <FileText size={13} /> 관리자에게 문의/건의하기
                </button>
              </div>

              {/* Input */}
              <div className="flex items-center gap-2 px-3 py-3 shrink-0 border-t border-gray-100">
                <input
                  type="text"
                  placeholder="무엇이든 물어보세요"
                  className="flex-1 py-2.5 px-3 rounded-xl text-[14px] outline-none bg-gray-50"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                />
                <button
                  onClick={send}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shrink-0 disabled:opacity-20"
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          ) : (
            /* 문의/건의 모드 */
            <div className="flex-1 flex flex-col p-5 gap-4">
              {contactSent ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-xl">✅</div>
                  <p className="text-[16px] font-bold">문의를 접수했어요</p>
                  <p className="text-[14px] text-gray-400">확인 후 연락드릴게요</p>
                  <button onClick={() => { setMode('chat'); setContactSent(false); setContactMsg(''); }} className="text-[14px] text-black font-semibold mt-2 hover:underline">
                    채팅으로 돌아가기
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-[16px] font-bold mb-1">관리자에게 문의/건의</p>
                    <p className="text-[14px] text-gray-400">서비스 개선이나 문의사항을 남겨주세요</p>
                  </div>
                  <textarea
                    placeholder="문의 또는 건의 내용을 자유롭게 적어주세요"
                    rows={5}
                    className="w-full p-4 text-[14px] border border-gray-200 rounded-xl outline-none focus:border-black resize-none leading-relaxed"
                    value={contactMsg}
                    onChange={e => setContactMsg(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setMode('chat')} className="flex-1 py-3 border border-gray-200 rounded-xl text-[14px] font-semibold hover:border-black transition-colors">
                      취소
                    </button>
                    <button
                      onClick={sendContact}
                      disabled={!contactMsg.trim() || contactSending}
                      className="flex-1 py-3 bg-black text-white rounded-xl text-[14px] font-semibold disabled:opacity-30 flex items-center justify-center gap-1.5"
                    >
                      {contactSending ? <Loader2 size={14} className="animate-spin" /> : '보내기'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );

  return createPortal(widget, document.body);
}
