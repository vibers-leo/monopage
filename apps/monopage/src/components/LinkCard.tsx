import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// 링크 타입별 아이콘/색상
function getLinkMeta(url: string) {
  if (url.includes('instagram.com')) return { icon: '📸', label: 'Instagram', color: 'from-purple-500 to-pink-500' };
  if (url.includes('youtube.com') || url.includes('youtu.be')) return { icon: '▶️', label: 'YouTube', color: 'from-red-500 to-red-600' };
  if (url.includes('tiktok.com')) return { icon: '🎵', label: 'TikTok', color: 'from-gray-800 to-gray-900' };
  if (url.includes('twitter.com') || url.includes('x.com')) return { icon: '𝕏', label: 'X', color: 'from-gray-800 to-black' };
  if (url.includes('github.com')) return { icon: '⌨️', label: 'GitHub', color: 'from-gray-700 to-gray-900' };
  if (url.includes('linkedin.com')) return { icon: '💼', label: 'LinkedIn', color: 'from-blue-600 to-blue-700' };
  if (url.includes('naver.com')) return { icon: '🟢', label: 'Naver', color: 'from-green-500 to-green-600' };
  if (url.includes('kakao')) return { icon: '💬', label: 'KakaoTalk', color: 'from-yellow-400 to-yellow-500' };
  if (url.includes('buymeacoffee.com')) return { icon: '☕', label: 'Buy Me a Coffee', color: 'from-yellow-400 to-orange-400' };
  if (url.includes('threads.net')) return { icon: '🧵', label: 'Threads', color: 'from-gray-700 to-black' };
  return { icon: '🔗', label: '', color: 'from-gray-600 to-gray-800' };
}

interface LinkCardProps {
  title: string;
  url: string;
  iconType?: string;
  className?: string;
  onClick?: () => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({ title, url, className, onClick }) => {
  const meta = getLinkMeta(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl hover:border-gray-300 hover:shadow-sm active:scale-[0.98] transition-all group",
        className
      )}
    >
      <div className={cn(
        "w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 bg-gradient-to-br text-white",
        meta.color
      )}>
        {meta.icon}
      </div>
      <span className="flex-1 font-bold text-sm tracking-tight truncate">{title}</span>
      <ArrowUpRight size={15} className="text-gray-300 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
    </a>
  );
};
