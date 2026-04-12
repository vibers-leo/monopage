'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, ArrowLeft } from 'lucide-react';

type Message = {
  role: 'user' | 'ai';
  text: string;
};

const QUICK_TOPICS = [
  { label: '🔗 만드는 방법', message: '모노페이지로 홈페이지 만드는 방법을 알려줘' },
  { label: '⚠️ 오류 문의', message: '오류가 발생했어요. 어떻게 해결할 수 있나요?' },
  { label: '💝 후원 안내', message: '모노페이지 후원은 어떻게 하나요?' },
  { label: '✨ 기능 소개', message: '모노페이지의 주요 기능을 알려줘' },
];

type Mode = 'chat' | 'contact';
type ContactStep = 'content' | 'email' | 'done';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>('chat');
  const [contactStep, setContactStep] = useState<ContactStep>('content');
  const [contactContent, setContactContent] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    if (!text) setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: msg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'ai', text: data.response || '응답을 받지 못했어요.' }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', text: '네트워크 오류가 발생했어요. 다시 시도해주세요.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async () => {
    if (contactStep === 'content') {
      if (!contactContent.trim()) return;
      setContactStep('email');
      return;
    }
    if (contactStep === 'email') {
      if (!contactEmail.trim() || !contactEmail.includes('@')) return;
      setContactSubmitting(true);
      try {
        await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `[관리자 문의 접수] 이메일: ${contactEmail} / 내용: ${contactContent}`,
          }),
        });
      } catch { /* ignore */ }
      setContactSubmitting(false);
      setContactStep('done');
    }
  };

  const resetContact = () => {
    setMode('chat');
    setContactStep('content');
    setContactContent('');
    setContactEmail('');
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
              <div className="flex items-center gap-2">
                {mode === 'contact' && (
                  <button onClick={resetContact} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors">
                    <ArrowLeft size={14} />
                  </button>
                )}
                <div>
                  <p className="text-sm font-black tracking-tight">
                    {mode === 'chat' ? '모노페이지 AI 도우미' : '관리자 문의'}
                  </p>
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-0.5">
                    {mode === 'chat' ? 'Powered by ZeroClaw' : '확인 후 연락드릴게요'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {mode === 'chat' ? (
              <>
                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[200px]">
                  {messages.length === 0 && !loading && (
                    <div className="flex flex-col items-center text-center py-6">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-lg mb-3">💬</div>
                      <p className="text-xs font-bold text-gray-400 mb-4">궁금한 점을 물어보세요!</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {QUICK_TOPICS.map((t) => (
                          <button
                            key={t.label}
                            onClick={() => send(t.message)}
                            className="px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-full text-[11px] font-bold text-gray-600 transition-colors"
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
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
                  <button
                    onClick={() => setMode('contact')}
                    className="w-full text-center text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-black transition-colors py-1"
                  >
                    관리자에게 직접 문의 &rarr;
                  </button>
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
                      onClick={() => send()}
                      disabled={!input.trim() || loading}
                      className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shrink-0 disabled:opacity-20 hover:scale-105 active:scale-95 transition-all"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Contact Form */
              <div className="flex-1 px-5 py-6 flex flex-col gap-4">
                {contactStep === 'content' && (
                  <>
                    <p className="text-sm font-bold text-gray-600">어떤 내용으로 문의하시나요?</p>
                    <textarea
                      value={contactContent}
                      onChange={(e) => setContactContent(e.target.value)}
                      placeholder="문의 내용을 자유롭게 적어주세요..."
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-medium outline-none focus:bg-gray-100 transition-colors resize-none"
                    />
                    <button
                      onClick={handleContactSubmit}
                      disabled={!contactContent.trim()}
                      className="w-full py-3 bg-black text-white rounded-full text-sm font-black disabled:opacity-20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      다음
                    </button>
                  </>
                )}
                {contactStep === 'email' && (
                  <>
                    <p className="text-sm font-bold text-gray-600">연락받으실 이메일을 알려주세요</p>
                    <div className="p-3 bg-gray-50 rounded-2xl text-xs text-gray-400 font-medium">
                      "{contactContent.length > 50 ? contactContent.slice(0, 50) + '...' : contactContent}"
                    </div>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleContactSubmit()}
                      placeholder="email@example.com"
                      className="w-full px-4 py-3 bg-gray-50 rounded-full text-sm font-medium outline-none focus:bg-gray-100 transition-colors"
                    />
                    <button
                      onClick={handleContactSubmit}
                      disabled={!contactEmail.includes('@') || contactSubmitting}
                      className="w-full py-3 bg-black text-white rounded-full text-sm font-black disabled:opacity-20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      {contactSubmitting ? <Loader2 size={16} className="animate-spin" /> : '문의 접수하기'}
                    </button>
                  </>
                )}
                {contactStep === 'done' && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-8 gap-3">
                    <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-2xl">✅</div>
                    <p className="text-sm font-black">문의가 접수되었어요</p>
                    <p className="text-xs text-gray-400 font-medium">빠른 시일 내 입력하신 이메일로<br />연락드리겠습니다.</p>
                    <button
                      onClick={resetContact}
                      className="mt-2 px-5 py-2.5 bg-gray-100 rounded-full text-xs font-black hover:bg-gray-200 transition-colors"
                    >
                      채팅으로 돌아가기
                    </button>
                  </div>
                )}
              </div>
            )}
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
