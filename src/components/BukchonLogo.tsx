// components/BukchonLogo.tsx
"use client";

interface BukchonLogoProps {
  className?: string;
  variant?: "light" | "dark";
}

export default function BukchonLogo({ className = "", variant = "dark" }: BukchonLogoProps) {
  const textColor = variant === "light" ? "#FFFFFF" : "#1A1A1A";
  const accentColor = variant === "light" ? "#FFFFFF" : "hsl(195 85% 35%)"; // primary color
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* 한옥 지붕 아이콘 */}
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* 한옥 지붕 실루엣 */}
        <path
          d="M20 8L4 18L6 19L20 11L34 19L36 18L20 8Z"
          fill={accentColor}
        />
        <path
          d="M8 20V30H16V24H24V30H32V20L20 13L8 20Z"
          fill={textColor}
          fillOpacity="0.8"
        />
        {/* 장식 라인 */}
        <rect x="6" y="17" width="28" height="1" fill={accentColor} opacity="0.6" />
      </svg>
      
      {/* 텍스트 로고 */}
      <div className="flex flex-col leading-none">
        <span 
          className="font-serif text-lg tracking-tight"
          style={{ color: textColor }}
        >
          북촌
        </span>
        <span 
          className="text-[10px] tracking-widest uppercase opacity-60"
          style={{ color: textColor }}
        >
          Art Space
        </span>
      </div>
    </div>
  );
}
