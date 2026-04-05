import React from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LinkCardProps {
  title: string;
  url: string;
  iconType?: string;
  className?: string;
}

export const LinkCard: React.FC<LinkCardProps> = ({ title, url, className }) => {
  const isCoffee = url.includes('buymeacoffee.com');

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={cn(
        "flex items-center justify-between p-5 bw-border rounded-3xl bg-white hover:scale-[1.02] active:scale-[0.98] transition-all group relative overflow-hidden",
        isCoffee && "border-[var(--accent-neon)] shadow-[0_0_20px_rgba(0,0,0,0.05)]",
        className
      )}
    >
      {isCoffee && (
        <div className="absolute inset-0 bg-[var(--accent-neon)] opacity-[0.03] pointer-events-none"></div>
      )}
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-10 h-10 rounded-2xl flex items-center justify-center bg-gray-50 group-hover:bg-black group-hover:text-white transition-colors",
          isCoffee && "bg-black text-white"
        )}>
          {isCoffee ? <span className="text-xl">☕</span> : <ExternalLink size={18} />}
        </div>
        <span className="font-bold text-sm tracking-tight">{title}</span>
      </div>
      <ArrowRight size={16} className="text-gray-300 group-hover:text-black transition-colors" />
    </a>
  );
};
