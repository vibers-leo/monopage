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
      <div className="w-5 h-5 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (notFound) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-3 bg-white px-5">
      <p className="font-paperlogy text-[28px] font-extrabold tracking-tight">404</p>
      <p className="text-[#a3a3a3] text-[14px] font-medium">@{username} 페이지를 찾을 수 없어요</p>
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
      {/* Background gradient */}
      {t.bgGradient !== 'transparent' && (
        <div className="fixed inset-0 pointer-events-none" style={{ background: t.bgGradient }} />
      )}

      <div className="relative max-w-[480px] sm:max-w-[560px] lg:max-w-[640px] mx-auto px-5 sm:px-8 pt-12 pb-20 flex flex-col items-center">
        <SectionRenderer
          sections={sections}
          profile={profile}
          links={profile.links || []}
          portfolioItems={portfolioItems}
          posts={posts}
          theme={theme}
        />

        <div className="mt-10 w-full">
          <ShareButton username={profile.username} theme={theme} />
        </div>

        <a
          href="https://monopage.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 opacity-20 hover:opacity-40 transition-opacity text-[14px] font-medium uppercase tracking-[0.25em]"
          style={{ color: t.textMuted }}
        >
          Made with Monopage
        </a>
      </div>
    </div>
  );
}
