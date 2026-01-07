// lib/i18n/locales.ts
export const locales = ['ko', 'en'] as const; // ja, zh 제거
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'ko'; // 기본 언어를 한국어로 설정

export const localeNames: Record<Locale, string> = {
  ko: 'KR',
  en: 'EN',
};
