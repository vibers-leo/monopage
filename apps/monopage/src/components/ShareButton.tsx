'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, QrCode, X } from 'lucide-react';
import type { Theme } from '@/lib/themes';

interface ShareButtonProps {
  username: string;
  theme?: Theme;
}

export function ShareButton({ username, theme }: ShareButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = theme?.vars;

  const url = `https://monopage.kr/${username}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: `@${username} — Monopage`, url }); }
      catch { /* cancelled */ }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center gap-2.5 sm:gap-3">
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all hover:opacity-70"
          style={{
            backgroundColor: t?.cardBg || '#f5f5f5',
            color: t?.textMuted || '#a3a3a3',
            border: `1px solid ${t?.cardBorder || '#e5e5e5'}`,
          }}
        >
          <Share2 size={14} /> 공유하기
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all hover:opacity-70"
          style={{
            backgroundColor: t?.cardBg || '#f5f5f5',
            color: t?.textMuted || '#a3a3a3',
            border: `1px solid ${t?.cardBorder || '#e5e5e5'}`,
          }}
        >
          <QrCode size={14} /> QR
        </button>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative bg-white rounded-2xl w-full max-w-sm p-8 flex flex-col items-center gap-5"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-[#a3a3a3] hover:text-[#0a0a0a] transition-colors"
            >
              <X size={16} />
            </button>

            <div className="text-center">
              <h3 className="text-[16px] font-bold mb-0.5">@{username}</h3>
              <p className="text-[14px] text-[#a3a3a3]">이 페이지를 공유해보세요</p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#e5e5e5]">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}&margin=8`}
                alt="QR Code"
                className="w-44 h-44"
                width={176}
                height={176}
              />
            </div>

            <div className="flex gap-2 w-full">
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#0a0a0a] text-white rounded-full text-[14px] font-semibold hover:bg-[#262626] transition-colors"
              >
                {copied ? <><Check size={14} /> 복사됐어요!</> : <><Copy size={14} /> 링크 복사</>}
              </button>
              <a
                href={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}&margin=16&format=png`}
                download={`monopage-${username}-qr.png`}
                className="py-3.5 px-5 border border-[#e5e5e5] rounded-full text-[14px] font-semibold hover:border-[#0a0a0a] transition-colors"
              >
                저장
              </a>
            </div>

            <p className="text-[14px] text-[#a3a3a3]">{url}</p>
          </div>
        </div>
      )}
    </>
  );
}
