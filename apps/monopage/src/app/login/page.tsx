'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowRight } from 'lucide-react';
import { login, setToken } from '@/lib/api';

const KAKAO_REST_KEY = '3a4930ab39652ad5f387496697bf66ba';
const KAKAO_REDIRECT = 'https://monopage.kr/auth/kakao/callback';
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_KEY}&redirect_uri=${KAKAO_REDIRECT}&response_type=code`;

const NAVER_CLIENT_ID = 'Dfa1NH9TT4BY22rcjdv1';
const NAVER_REDIRECT = 'https://monopage.kr/auth/naver/callback';
const NAVER_STATE = 'monopage_login';
const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_REDIRECT}&state=${NAVER_STATE}`;

const GOOGLE_CLIENT_ID = '534035148832-6b2lf74coj33s9m9cmdh509tktcaa7fn.apps.googleusercontent.com';
const GOOGLE_REDIRECT = 'https://monopage.kr/auth/google/callback';
const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT}&response_type=code&scope=openid%20email%20profile`;

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function NaverIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
      <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/>
    </svg>
  );
}

function KakaoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#3C1E1E]">
      <path d="M12 3C6.477 3 2 6.477 2 10.938c0 2.813 1.61 5.283 4.047 6.76-.178.663-.647 2.4-.741 2.773-.117.463.17.457.357.333.147-.098 2.335-1.577 3.28-2.217.342.048.692.073 1.057.073 5.523 0 10-3.477 10-7.722C22 6.477 17.523 3 12 3z"/>
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(() => {
    const e = searchParams.get('error');
    if (e === 'kakao_cancelled') return '카카오 로그인이 취소되었습니다.';
    if (e === 'kakao_failed') return '카카오 로그인에 실패했습니다. 다시 시도해주세요.';
    if (e === 'naver_cancelled') return '네이버 로그인이 취소되었습니다.';
    if (e === 'naver_failed') return '네이버 로그인에 실패했습니다. 다시 시도해주세요.';
    if (e === 'google_cancelled') return '구글 로그인이 취소되었습니다.';
    if (e === 'google_failed') return '구글 로그인에 실패했습니다. 다시 시도해주세요.';
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

  const handleKakao = () => { window.location.href = KAKAO_AUTH_URL; };
  const handleNaver  = () => { window.location.href = NAVER_AUTH_URL; };
  const handleGoogle = () => { window.location.href = GOOGLE_AUTH_URL; };

  return (
    <div className="max-w-md w-full flex flex-col gap-8">
      <div>
        <Link href="/" className="font-extrabold text-xl tracking-tighter">
          Monopage<span className="text-gray-300">.</span>
        </Link>
        <h1 className="text-3xl font-black tracking-tightest mt-6">다시 돌아오셨군요.</h1>
        <p className="text-gray-400 text-sm font-medium mt-2">로그인하고 내 페이지를 관리하세요.</p>
      </div>

      <div className="flex flex-col gap-3">
        <button onClick={handleKakao} className="w-full py-4 bg-[#FEE500] rounded-2xl font-black text-sm text-[#3C1E1E] flex items-center justify-center gap-2.5 hover:brightness-95 active:scale-95 transition-all">
          <KakaoIcon />카카오로 시작하기
        </button>
        <button onClick={handleGoogle} className="w-full py-4 bg-white border border-gray-200 rounded-2xl font-black text-sm text-gray-700 flex items-center justify-center gap-2.5 hover:bg-gray-50 active:scale-95 transition-all">
          <GoogleIcon />구글로 시작하기
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-300 font-bold">또는 이메일로 로그인</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <div className="flex flex-col gap-3 -mt-4">
        <input type="email" placeholder="이메일" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full p-4 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-black transition-colors" />
        <input type="password" placeholder="비밀번호" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} className="w-full p-4 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-black transition-colors" />
      </div>

      {error && <p className="text-red-500 text-xs font-bold text-center -mt-4">{error}</p>}

      <button onClick={handleLogin} disabled={loading} className="w-full py-5 bg-black text-white rounded-full font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
        {loading ? <Loader2 size={18} className="animate-spin" /> : <>로그인 <ArrowRight size={18} /></>}
      </button>

      <div className="flex items-center justify-between text-sm">
        <Link href="/forgot-password" className="text-gray-400 font-bold hover:text-black transition-colors">
          비밀번호를 잊으셨나요?
        </Link>
        <Link href="/onboard" className="font-black text-black hover:underline">무료로 시작하기</Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans">
      <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-gray-300" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
