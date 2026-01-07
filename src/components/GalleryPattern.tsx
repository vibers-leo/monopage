// components/GalleryPattern.tsx
// 한국 전통 문양을 활용한 장식 요소

interface GalleryPatternProps {
  variant?: "dancheong" | "simple";
  className?: string;
}

export default function GalleryPattern({ variant = "simple", className = "" }: GalleryPatternProps) {
  if (variant === "dancheong") {
    // 단청 패턴 (복잡한 버전)
    return (
      <svg 
        className={className}
        viewBox="0 0 200 20" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* 청색 */}
        <rect x="0" y="0" width="200" height="4" fill="hsl(195 85% 35%)" />
        {/* 주홍 */}
        <rect x="0" y="4" width="200" height="4" fill="hsl(8 85% 55%)" />
        {/* 황금 */}
        <rect x="0" y="8" width="200" height="4" fill="hsl(45 95% 50%)" />
        {/* 녹청 */}
        <rect x="0" y="12" width="200" height="4" fill="hsl(150 40% 45%)" />
        {/* 자주 */}
        <rect x="0" y="16" width="200" height="4" fill="hsl(280 50% 45%)" />
      </svg>
    );
  }

  // 심플 버전 (그라데이션)
  return (
    <svg 
      className={className}
      viewBox="0 0 200 4" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="galleryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(195 85% 35%)" />
          <stop offset="50%" stopColor="hsl(8 85% 55%)" />
          <stop offset="100%" stopColor="hsl(45 95% 50%)" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="200" height="4" fill="url(#galleryGradient)" />
    </svg>
  );
}
