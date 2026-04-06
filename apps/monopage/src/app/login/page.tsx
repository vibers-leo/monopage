'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowRight } from 'lucide-react';
import { login, setToken } from '@/lib/api';

const KAKAO_REST_KEY = '3a4930ab39652ad5f387496697bf66ba';
const KAKAO_REDIRECT = 'https://monopage.kr/auth/kakao/callback';
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_KEY}&redirect_uri=${KAKAO_REDIRECT}&response_type=code`;

function KakaoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#3C1E1E]">
      <path d="M12 3C6.477 3 2 6.477 2 10.938c0 2.813 1.61 5.283 4.047 6.76-.178.663-.647 2.4-.741 2.773-.117.463.17.457.357.333.147-.098 2.335-1.577 3.28-2.217.342.048.692.073 1.057.073 5.523 0 10-3.477 10-7.722C22 6.477 17.523 3 12 3z"/>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(() => {
    const e = searchParams.get('error');
    if (e === 'kakao_cancelled') return '카카오 로그인이 취소되었습니다.';
    if (e === 'kakao_failed') return '카카오 로그인에 실패했습니다. 다시 시도해주세요.';
    return null;
  });

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError('이메일과 비밀번호를 입력해주세요'); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await login(form.email, form.password);
      setToken(res.token);
      router.push('/admin');
    } catch (e: any) {
      setError(e.message || '이메일 또는 비밀번호가 올바르지 않아요');
    } finally {
      setLoading(false);
    }
  };

  const handleKakao = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full flex flex-col gap-8">
        <div>
          <Link href="/" className="font-extrabold text-xl tracking-tighter">
            Monopage<span className="text-gray-300">.</span>
          </Link>
          <h1 className="text-3xl font-black tracking-tightest mt-6">다시 돌아오셨군요.</h1>
          <p className="text-gray-400 text-sm font-medium mt-2">로그인하고 내 페이지를 관리하세요.</p>
        </div>

        {/* 소셜 로그인 */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleKakao}
            className="w-full py-4 bg-[#FEE500] rounded-2xl font-black text-sm text-[#3C1E1E] flex items-center justify-center gap-2.5 hover:brightness-95 active:scale-95 transition-all"
          >
            <KakaoIcon />
            카카오로 시작하기
          </button>
          {/* 네이버·구글은 키 받은 후 추가 */}
        </div>

        {/* 구분선 */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-300 font-bold">또는 이메일로 로그인</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <div className="flex flex-col gap-3 -mt-4">
          <input
            type="email"
            placeholder="이메일"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-4 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-black transition-colors"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full p-4 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-black transition-colors"
          />
        </div>

        {error && <p className="text-red-500 text-xs font-bold text-center -mt-4">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-5 bg-black text-white rounded-full font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <>로그인 <ArrowRight size={18} /></>}
        </button>

        <p className="text-center text-sm text-gray-400">
          계정이 없으신가요?{' '}
          <Link href="/onboard" className="font-black text-black hover:underline">무료로 시작하기</Link>
        </p>
      </div>
    </div>
  );
}
