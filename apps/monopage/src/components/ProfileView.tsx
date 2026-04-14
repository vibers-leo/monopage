'use client';

import React, { useEffect, useState } from 'react';
import { ShareButton } from '@/components/ShareButton';
import { SectionRenderer, DEFAULT_SECTIONS } from '@/components/SectionRenderer';
import { getPublicProfile, trackView } from '@/lib/api';
import { getTheme } from '@/lib/themes';

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
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (notFound) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-3 bg-white">
      <p className="text-3xl font-black tracking-tight">404</p>
      <p className="text-gray-400 text-[13px] font-medium">@{username} 페이지를 찾을 수 없어요</p>
    </div>
  );

  const themeKey = profile.theme_config?.theme;
  const theme = getTheme(themeKey);
  const t = theme.vars;

  const posts = profile.social_accounts?.flatMap((sa: any) => sa.posts || []) || [];
  const portfolioItems = profile.portfolio_items || [];
  const sections = profile.theme_config?.sections || DEFAULT_SECTIONS;

  const cssVars = {
    '--t-bg': t.bg,
    '--t-text': t.text,
    '--t-text-sub': t.textSub,
    '--t-text-muted': t.textMuted,
    '--t-card-bg': t.cardBg,
    '--t-card-border': t.cardBorder,
    '--t-card-hover': t.cardHover,
    '--t-avatar-ring': t.avatarRing,
  } as React.CSSProperties;

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: t.bg, ...cssVars }}
    >
      {/* 배경 그라디언트 */}
      {t.bgGradient !== 'transparent' && (
        <div className="fixed inset-0 pointer-events-none" style={{ background: t.bgGradient }} />
      )}

      <div className="relative max-w-[390px] mx-auto px-5 pt-14 pb-20 flex flex-col items-center">
        <SectionRenderer
          sections={sections}
          profile={profile}
          links={profile.links || []}
          portfolioItems={portfolioItems}
          posts={posts}
          theme={theme}
        />

        <div className="mt-8 w-full">
          <ShareButton username={profile.username} />
        </div>

        <a
          href="https://monopage.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 opacity-25 hover:opacity-50 transition-opacity text-[9px] font-black uppercase tracking-[0.3em]"
          style={{ color: t.textMuted }}
        >
          Made with Monopage
        </a>
      </div>
    </div>
  );
}
