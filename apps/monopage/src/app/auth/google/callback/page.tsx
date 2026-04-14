'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setToken } from '@/lib/api';
import { Loader2 } from 'lucide-react';

function GoogleCallbackInner() {
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

    fetch('/api/proxy/api/v1/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        redirect_uri: `${window.location.origin}/auth/google/callback`,
      }),
    })
      .then(res => res.json())
      .then(async data => {
        if (data.token) {
          setToken(data.token);
          // 링크가 없으면 onboard로 (페이지 아직 안 만든 신규 유저)
          const profile = await fetch('/api/proxy/api/v1/profile', {
            headers: { Authorization: `Bearer ${data.token}` },
          }).then(r => r.json()).catch(() => null);
          const hasLinks = profile?.links?.length > 0;
          router.replace(hasLinks ? '/admin' : '/onboard');
        } else {
          router.replace('/login?error=google_failed');
        }
      })
      .catch(() => router.replace('/login?error=google_failed'));
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 text-gray-400">
      <Loader2 className="w-7 h-7 animate-spin" />
      <p className="text-sm font-medium">구글 로그인 처리 중...</p>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Suspense fallback={<Loader2 className="w-7 h-7 animate-spin text-gray-300" />}>
        <GoogleCallbackInner />
      </Suspense>
    </div>
  );
}
