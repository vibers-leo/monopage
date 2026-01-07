"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { localeNames, locales, Locale } from "@/lib/i18n/locales";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  // 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors text-sm font-medium"
        aria-label="Change Language"
      >
        <Globe size={16} />
        <span>{localeNames[locale]}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-background border border-border rounded-lg shadow-lg py-1 z-50 animate-fade-in">
          {locales.map((cur) => (
            <button
              key={cur}
              onClick={() => handleLocaleChange(cur)}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors flex items-center justify-between ${
                locale === cur ? "font-bold text-primary" : "text-muted-foreground"
              }`}
            >
              <span>{localeNames[cur]}</span>
              {locale === cur && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
