'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email.trim()) { setError('이메일을 입력해주세요'); return; }
    setLoading(true);
    setError('');
    try {
      await fetch('/api/proxy/api/v1/password_resets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch {
      setError('요청을 처리하지 못했어요. 다시 시도해볼게요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-400 font-bold hover:text-black transition-colors mb-10">
          <ArrowLeft size={16} /> 로그인으로
        </Link>

        {sent ? (
          <div className="flex flex-col gap-4">
            <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-2xl">📬</div>
            <h1 className="text-3xl font-black tracking-tight">이메일을 확인해보세요</h1>
            <p className="text-gray-400 font-medium leading-relaxed">
              <span className="text-black font-black">{email}</span>로<br />
              비밀번호 재설정 링크를 보냈어요.<br />
              스팸함도 확인해보세요.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-black tracking-tight mb-2">비밀번호 찾기</h1>
              <p className="text-gray-400 text-sm font-medium">가입한 이메일 주소를 입력하면 재설정 링크를 보내드려요.</p>
            </div>

            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full p-4 border border-gray-200 rounded-2xl bg-gray-50 outline-none font-bold text-sm focus:border-black transition-colors"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                autoFocus
              />
              {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 bg-black text-white rounded-full font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-all"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : '재설정 링크 보내기'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
