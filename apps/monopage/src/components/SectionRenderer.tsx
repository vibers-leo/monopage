'use client';

import React from 'react';
import { ProfileHeader } from './ProfileHeader';
import { LinkCard } from './LinkCard';
import { SnsIconBar } from './SnsIconBar';
import { PortfolioGallery } from './PortfolioGallery';
import { SnsGallery } from './SnsGallery';
import { InquiryForm } from './InquiryForm';
import { trackClick } from '@/lib/api';
import type { Theme } from '@/lib/themes';

export interface Section {
  id: string;
  type: 'header' | 'sns_icons' | 'links' | 'portfolio' | 'text' | 'sns_feed' | 'inquiry';
  order: number;
  content?: any;
}

interface SectionRendererProps {
  sections: Section[];
  profile: any;
  links: any[];
  portfolioItems: any[];
  posts: any[];
  theme?: Theme;
}

export function SectionRenderer({ sections, profile, links, portfolioItems, posts, theme }: SectionRendererProps) {
  const sorted = [...sections].sort((a, b) => a.order - b.order);

  return (
    <>
      {sorted.map(section => {
        switch (section.type) {
          case 'header':
            return (
              <ProfileHeader
                key={section.id}
                username={profile.username}
                bio={profile.bio || ''}
                avatarUrl={profile.avatar_url}
                theme={theme}
              />
            );

          case 'sns_icons':
            return (
              <SnsIconBar
                key={section.id}
                links={links}
                style={section.content?.style || 'circle'}
                theme={theme}
              />
            );

          case 'links':
            return links.length > 0 ? (
              <div key={section.id} className="w-full space-y-3">
                {links.map((link: any) => (
                  <LinkCard
                    key={link.id}
                    title={link.title}
                    url={link.url}
                    favicon={link.favicon}
                    domain={link.domain}
                    theme={theme}
                    onClick={() => trackClick(profile.id, link.id).catch(() => {})}
                  />
                ))}
              </div>
            ) : null;

          case 'portfolio':
            return portfolioItems.length > 0 ? (
              <PortfolioGallery
                key={section.id}
                items={portfolioItems}
                theme={theme}
                ratio={section.content?.ratio || '1:1'}
                count={section.content?.count || 9}
              />
            ) : null;

          case 'text':
            return section.content?.text ? (
              <div key={section.id} className="w-full my-6 px-2">
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {section.content.text}
                </p>
              </div>
            ) : null;

          case 'sns_feed':
            return posts.length > 0 ? (
              <SnsGallery key={section.id} posts={posts} />
            ) : null;

          case 'inquiry':
            return (
              <div key={section.id} className="w-full mt-6">
                <InquiryForm
                  profileId={profile.id}
                  username={profile.username}
                  theme={theme}
                  ctaText={section.content?.ctaText}
                  title={section.content?.title}
                />
              </div>
            );

          default:
            return null;
        }
      })}
    </>
  );
}

// 기본 섹션 (신규 유저용)
export const DEFAULT_SECTIONS: Section[] = [
  { id: 'header', type: 'header', order: 0 },
  { id: 'sns_icons', type: 'sns_icons', order: 1 },
  { id: 'links', type: 'links', order: 2 },
  { id: 'portfolio', type: 'portfolio', order: 3 },
  { id: 'sns_feed', type: 'sns_feed', order: 4 },
];
