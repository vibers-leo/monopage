"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Instagram, Youtube } from "lucide-react";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      {/* 햄버거 버튼 */}
      <button
        onClick={toggleMenu}
        className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="메뉴 열기"
      >
        <Menu size={24} />
      </button>

      {/* 오버레이 메뉴 - z-index 최대값으로 설정 */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-background animate-fade-in flex flex-col">
          {/* 상단 닫기 버튼 */}
          <div className="h-16 px-6 flex items-center justify-end border-b border-border">
            <button
              onClick={closeMenu}
              className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="메뉴 닫기"
            >
              <X size={28} />
            </button>
          </div>

          {/* 메뉴 링크들 */}
          <nav className="flex-1 flex flex-col justify-center items-center gap-8 text-xl font-light text-foreground lowercase">
            <Link 
              href="/demo/about" 
              onClick={closeMenu} 
              className="hover:text-primary transition-colors"
            >
              about
            </Link>
            <Link 
              href="/demo/archive" 
              onClick={closeMenu} 
              className="hover:text-primary transition-colors"
            >
              archive
            </Link>
            <Link 
              href="/portfolio" 
              onClick={closeMenu} 
              className="hover:text-primary transition-colors"
            >
              portfolio
            </Link>
            <Link 
              href="/demo/media" 
              onClick={closeMenu} 
              className="hover:text-primary transition-colors"
            >
              media
            </Link>
            <Link 
              href="/demo/mall" 
              onClick={closeMenu} 
              className="hover:text-primary transition-colors"
            >
              shop
            </Link>
            <Link 
              href="/demo/contact" 
              onClick={closeMenu} 
              className="hover:text-primary transition-colors"
            >
              contact
            </Link>
          </nav>

          {/* 하단 소셜 링크 */}
          <div className="pb-12 flex gap-8 justify-center text-muted-foreground">
            <a
              href="https://www.instagram.com/bukchonart/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              <Instagram size={28} />
            </a>
            <a
              href="https://www.youtube.com/@bukchonart"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              <Youtube size={28} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
