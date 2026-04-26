'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { X, Play, ExternalLink } from 'lucide-react';
import type { Theme } from '@/lib/themes';

interface PortfolioItem {
  id: number;
  image_url: string;
  video_url?: string;
  media_type?: string;
  permalink?: string;
  title?: string;
  description?: string;
  category?: string;
  pinned?: boolean;
  source?: string;
}

interface PortfolioGalleryProps {
  items: PortfolioItem[];
  className?: string;
  theme?: Theme;
  ratio?: '1:1' | '4:5';
  count?: number;
  showPermalink?: boolean;
}

export function PortfolioGallery({ items, className, theme, ratio = '1:1', count = 9, showPermalink = true }: PortfolioGalleryProps) {
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const t = theme?.vars;

  if (!items || items.length === 0) return null;

  const sorted = [...items].sort((a, b) => {
    if (a.source === 'instagram' && b.source !== 'instagram') return -1;
    if (a.source !== 'instagram' && b.source === 'instagram') return 1;
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const visible = sorted.slice(0, count);
  const aspectClass = ratio === '4:5' ? 'aspect-[4/5]' : 'aspect-square';

  return (
    <>
      <div className={cn('w-full mt-6', className)}>
        <div className="grid grid-cols-3 gap-[1px] overflow-hidden">
          {visible.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelected(item)}
              className={cn('relative overflow-hidden cursor-pointer group', aspectClass)}
              style={{ backgroundColor: t?.cardBg || '#f5f5f5' }}
            >
              <img
                src={item.image_url}
                alt={item.title || ''}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              {/* 영상 표시 */}
              {item.media_type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Play size={18} className="text-white ml-0.5" fill="white" />
                  </div>
                </div>
              )}
              {item.pinned && (
                <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center text-[9px]">📌</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white overflow-hidden max-w-lg w-full max-h-[90vh] flex flex-col rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {/* 영상이면 video, 아니면 img */}
              {selected.media_type === 'video' && selected.video_url ? (
                <video
                  src={selected.video_url}
                  controls
                  autoPlay
                  playsInline
                  className="w-full max-h-[70vh] bg-black"
                />
              ) : (
                <img
                  src={selected.image_url}
                  alt={selected.title || ''}
                  className="w-full max-h-[70vh] object-contain bg-black"
                />
              )}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            {(selected.title || selected.description || (showPermalink && selected.permalink)) && (
              <div className="p-4">
                {selected.title && <p className="text-[15px] font-semibold mb-1">{selected.title}</p>}
                {selected.description && <p className="text-[14px] text-gray-500 leading-relaxed">{selected.description}</p>}
                {showPermalink && selected.permalink && (
                  <a
                    href={selected.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-[14px] text-blue-500 font-medium hover:underline"
                  >
                    <ExternalLink size={14} /> 원본 보기
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
