// src/components/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileMenu from "@/components/MobileMenu";
import BukchonLogo from "@/components/BukchonLogo";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header() {
  const pathname = usePathname();
  // 데모 홈이거나 루트일 때 (혹시 모를 리다이렉트 대비)
  const isHome = pathname === "/demo" || pathname === "/";
  
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClass = isHome && !isScrolled
    ? "bg-transparent border-transparent text-white"
    : "bg-background/95 backdrop-blur-md border-border/50 text-foreground";

  const logoVariant = isHome && !isScrolled ? "light" : "dark";

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${headerClass}`}>
      <div className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/demo" className="hover:opacity-70 transition-opacity duration-300">
          <BukchonLogo variant={logoVariant} />
        </Link>

        <div className="flex items-center gap-8">
          {/* 네비게이션 - 영문 소문자 */}
          <nav className={`hidden md:flex gap-8 text-sm tracking-wide transition-colors duration-300`}>
            <Link 
              href="/demo/about" 
              className={`relative py-1 transition-all duration-300 lowercase ${
                isHome && !isScrolled 
                  ? "text-white/90 hover:text-white" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              about
              <span className={`absolute bottom-0 left-0 w-0 h-px bg-current transition-all duration-300 ${
                pathname === "/demo/about" ? "w-full" : ""
              }`} />
            </Link>
            
            <Link 
              href="/demo/archive" 
              className={`relative py-1 transition-all duration-300 lowercase ${
                isHome && !isScrolled 
                  ? "text-white/90 hover:text-white" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              archive
              <span className={`absolute bottom-0 left-0 w-0 h-px bg-current transition-all duration-300 ${
                pathname === "/demo/archive" ? "w-full" : ""
              }`} />
            </Link>

            {/* Portfolio 메뉴 */}
             <Link 
              href="/portfolio" 
              className={`relative py-1 transition-all duration-300 lowercase ${
                isHome && !isScrolled 
                  ? "text-white/90 hover:text-white" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              portfolio
              <span className={`absolute bottom-0 left-0 w-0 h-px bg-current transition-all duration-300 ${
                pathname === "/portfolio" ? "w-full" : ""
              }`} />
            </Link>
            
            <Link 
              href="/demo/media" 
              className={`relative py-1 transition-all duration-300 lowercase ${
                isHome && !isScrolled 
                  ? "text-white/90 hover:text-white" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              media
              <span className={`absolute bottom-0 left-0 w-0 h-px bg-current transition-all duration-300 ${
                pathname === "/demo/media" ? "w-full" : ""
              }`} />
            </Link>
            
            <Link 
              href="/demo/mall" 
              className={`relative py-1 transition-all duration-300 lowercase ${
                isHome && !isScrolled 
                  ? "text-white/90 hover:text-white" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              shop
              <span className={`absolute bottom-0 left-0 w-0 h-px bg-current transition-all duration-300 ${
                pathname === "/demo/mall" ? "w-full" : ""
              }`} />
            </Link>
            
            <Link 
              href="/demo/contact" 
              className={`relative py-1 transition-all duration-300 lowercase ${
                isHome && !isScrolled 
                  ? "text-white/90 hover:text-white" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              contact
              <span className={`absolute bottom-0 left-0 w-0 h-px bg-current transition-all duration-300 ${
                pathname === "/demo/contact" ? "w-full" : ""
              }`} />
            </Link>
          </nav>

          {/* 언어 전환 버튼 - 왼쪽 여백 추가 */}
          <div className="hidden md:block ml-4 pl-4 border-l border-border/30">
            <LanguageSwitcher />
          </div>

          {/* 모바일 메뉴 - 색상 통일 */}
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
