'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';

function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-red-500 font-bold">유효하지 않은 링크예요.</p>
        <Link href="/forgot-password" className="text-sm font-bold underline">다시 시도하기</Link>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (password.length < 6) { setError('비밀번호는 6자 이상이어야 해요'); return; }
    if (password !== confirm) { setError('비밀번호가 일치하지 않아요'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/proxy/api/v1/password_resets/${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || '실패했어요'); return; }
      setDone(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch {
      setError('요청에 실패했어요. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col gap-4">
        <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-2xl">✅</div>
        <h1 className="text-3xl font-black">비밀번호를 변경했어요</h1>
        <p className="text-gray-400 font-medium">로그인 페이지로 이동할게요...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2">새 비밀번호 설정</h1>
        <p className="text-gray-400 text-sm font-medium">6자 이상으로 입력해주세요</p>
      </div>

      <div className="flex flex-col gap-3">
        <input
          type="password"
          placeholder="새 비밀번호 (6자 이상)"
          className="w-full p-4 border border-gray-200 rounded-2xl bg-gray-50 outline-none font-bold text-sm focus:border-black transition-colors"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoFocus
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          className="w-full p-4 border border-gray-200 rounded-2xl bg-gray-50 outline-none font-bold text-sm focus:border-black transition-colors"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
        {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-4 bg-black text-white rounded-full font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-all"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : '비밀번호 변경하기'}
      </button>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-400 font-bold hover:text-black transition-colors mb-10">
          <ArrowLeft size={16} /> 로그인으로
        </Link>
        <Suspense fallback={<Loader2 className="animate-spin text-gray-300" />}>
          <ResetPasswordInner />
        </Suspense>
      </div>
    </div>
  );
}
