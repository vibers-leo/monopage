"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function PlatformHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 텍스트 색상 동적 결정
  const textColor = isScrolled || mobileMenuOpen ? "text-foreground" : "text-white";
  const mutedTextColor = isScrolled || mobileMenuOpen ? "text-muted-foreground" : "text-white/80";
  const logoBg = isScrolled || mobileMenuOpen ? "bg-foreground text-background" : "bg-white text-black";
  const buttonClass = isScrolled || mobileMenuOpen 
    ? "bg-foreground text-background hover:bg-foreground/90" 
    : "bg-white text-black hover:bg-white/90";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen
          ? "bg-background/95 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-serif text-xl transition-colors ${logoBg}`}>
            A
          </div>
          <span className={`text-xl font-serif font-medium transition-colors ${textColor}`}>
            ArtPage
          </span>
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/features"
            className={`text-sm font-medium transition-colors hover:opacity-100 opacity-80 ${textColor}`}
          >
            {t.platform.nav.features || 'Features'}
          </Link>
          <Link
            href="/pricing"
            className={`text-sm font-medium transition-colors hover:opacity-100 opacity-80 ${textColor}`}
          >
            {t.platform.nav.pricing || 'Pricing'}
          </Link>
          <Link
            href="/templates"
            className={`text-sm font-medium transition-colors hover:opacity-100 opacity-80 ${textColor}`}
          >
            {t.platform.nav.demo || 'Demo'}
          </Link>
        </nav>

        {/* 데스크톱 액션 버튼 */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/admin/login"
            className={`text-sm font-medium transition-colors hover:opacity-100 opacity-80 ${textColor}`}
          >
             {t.platform.nav.login || 'Sign in'}
          </Link>
          <Link
            href="/auth/signup"
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${buttonClass}`}
          >
            <span>{t.platform.nav.start || 'Start Free'}</span>
            <ArrowRight size={16} />
          </Link>

          {/* 언어 전환 버튼 (맨 오른쪽) */}
          <div className={`pl-4 ml-2 border-l ${isScrolled ? "border-border" : "border-white/20"}`}>
            <LanguageSwitcher />
          </div>
        </div>

        {/* 모바일 메뉴 버튼 */}
        <div className="md:hidden flex items-center gap-4">
           {/* 모바일에서도 언어 변경 가능하도록 */}
          <LanguageSwitcher />
          
          <button
            className={`p-2 transition-colors ${textColor}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-background border-b border-border p-6 shadow-xl h-screen">
          <nav className="flex flex-col gap-6">
            <Link
              href="/features"
              className="text-lg font-medium text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.platform.nav.features || 'Features'}
            </Link>
            <Link
              href="/pricing"
              className="text-lg font-medium text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.platform.nav.pricing || 'Pricing'}
            </Link>
            <Link
              href="/templates"
              className="text-lg font-medium text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.platform.nav.demo || 'Demo'}
            </Link>
            <hr className="border-border" />
            <Link
              href="/admin/login"
              className="text-lg font-medium text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.platform.nav.login || 'Sign in'}
            </Link>
            <Link
              href="/auth/signup"
              className="py-3 bg-foreground text-background rounded-lg text-center text-lg font-medium hover:bg-foreground/90 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.platform.nav.start || 'Start Free'}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
