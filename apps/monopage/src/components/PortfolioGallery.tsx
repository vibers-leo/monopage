'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import type { Theme } from '@/lib/themes';

interface PortfolioItem {
  id: number;
  image_url: string;
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
}

export function PortfolioGallery({ items, className, theme }: PortfolioGalleryProps) {
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const t = theme?.vars;

  if (!items || items.length === 0) return null;

  // 핀 고정 아이템 먼저, 나머지는 기존 순서
  const sorted = [...items].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  return (
    <>
      <div className={cn('w-full mt-8', className)}>
        <p className="text-[14px] font-semibold mb-4" style={{ color: t?.textMuted || '#a3a3a3' }}>Portfolio</p>
        <div className="grid grid-cols-3 gap-2">
          {sorted.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelected(item)}
              className={cn(
                'relative aspect-square rounded-xl overflow-hidden cursor-pointer group',
                index === 0 && sorted.length > 3 && 'col-span-2 row-span-2'
              )}
              style={{ backgroundColor: t?.cardBg || '#f5f5f5' }}
            >
              <img
                src={item.image_url}
                alt={item.title || 'Portfolio'}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {item.pinned && (
                <div className="absolute top-2 left-2 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center text-[10px]">📌</div>
              )}
              {item.title && (
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-[14px] font-semibold truncate">{item.title}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-lg w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selected.image_url}
                alt={selected.title || 'Portfolio'}
                className="w-full max-h-[60vh] object-contain bg-gray-50"
              />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            {(selected.title || selected.description) && (
              <div className="p-5">
                {selected.title && <h3 className="text-[16px] font-bold mb-1">{selected.title}</h3>}
                {selected.description && <p className="text-[14px] text-gray-500 leading-relaxed">{selected.description}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
