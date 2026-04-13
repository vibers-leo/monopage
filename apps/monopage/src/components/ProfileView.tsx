'use client';

import React, { useEffect, useState } from 'react';
import { ShareButton } from '@/components/ShareButton';
import { SectionRenderer, DEFAULT_SECTIONS } from '@/components/SectionRenderer';
import { getPublicProfile, trackView } from '@/lib/api';

interface ProfileViewProps {
  username: string;
}

export function ProfileView({ username }: ProfileViewProps) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getPublicProfile(username)
      .then((p) => {
        setProfile(p);
        trackView(p.id).catch(() => {});
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (notFound) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <p className="text-4xl font-black">404</p>
      <p className="text-gray-400 text-sm font-medium">@{username} 페이지를 찾을 수 없어요</p>
    </div>
  );

  const neonColor = profile.theme_config?.neon_color || '#000000';
  const bgTone = profile.theme_config?.bg_tone || '#ffffff';
  const posts = profile.social_accounts?.flatMap((sa: any) => sa.posts || []) || [];
  const portfolioItems = profile.portfolio_items || [];
  const sections = profile.theme_config?.sections || DEFAULT_SECTIONS;

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: bgTone,
        '--accent-neon': neonColor,
      } as React.CSSProperties}
    >
      {/* 배경 그라디언트 */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% -10%, ${neonColor}18 0%, transparent 70%)`,
        }}
      />
      <div className="relative max-w-sm mx-auto px-5 pt-16 pb-20 flex flex-col items-center">
        <SectionRenderer
          sections={sections}
          profile={profile}
          links={profile.links || []}
          portfolioItems={portfolioItems}
          posts={posts}
        />

        <div className="mt-10 w-full">
          <ShareButton username={profile.username} />
        </div>

        <a
          href="https://monopage.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 opacity-30 hover:opacity-60 transition-opacity text-[9px] font-black uppercase tracking-[0.3em]"
        >
          Made with Monopage
        </a>
      </div>
    </div>
  );
}
