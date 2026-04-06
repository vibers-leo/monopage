'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setToken } from '@/lib/api';
import { Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://49.50.138.93:4110';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const code  = searchParams.get('code');
    const error = searchParams.get('error');

    if (error || !code) {
      router.replace('/login?error=google_cancelled');
      return;
    }

    fetch(`${API_URL}/api/v1/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        redirect_uri: `${window.location.origin}/auth/google/callback`,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          setToken(data.token);
          router.replace('/admin');
        } else {
          router.replace('/login?error=google_failed');
        }
      })
      .catch(() => router.replace('/login?error=google_failed'));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3 text-gray-400">
        <Loader2 className="w-7 h-7 animate-spin" />
        <p className="text-sm font-medium">구글 로그인 처리 중...</p>
      </div>
    </div>
  );
}
