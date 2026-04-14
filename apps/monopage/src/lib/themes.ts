export type ThemeKey = 'minimal' | 'dark' | 'warm' | 'forest' | 'sky';

export interface Theme {
  key: ThemeKey;
  label: string;
  preview: string; // gradient for preview swatch
  vars: {
    bg: string;
    bgGradient: string; // top radial glow
    text: string;
    textSub: string;
    textMuted: string;
    cardBg: string;
    cardBorder: string;
    cardHover: string;
    avatarRing: string;
  };
}

export const THEMES: Record<ThemeKey, Theme> = {
  minimal: {
    key: 'minimal',
    label: 'Minimal',
    preview: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)',
    vars: {
      bg: '#ffffff',
      bgGradient: 'transparent',
      text: '#0a0a0a',
      textSub: '#374151',
      textMuted: '#9ca3af',
      cardBg: '#ffffff',
      cardBorder: '#f3f4f6',
      cardHover: '#f9fafb',
      avatarRing: '#ffffff',
    },
  },
  dark: {
    key: 'dark',
    label: 'Dark',
    preview: 'linear-gradient(135deg, #0a0a0a 0%, #1f1f1f 100%)',
    vars: {
      bg: '#0a0a0a',
      bgGradient: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 70%)',
      text: '#f9fafb',
      textSub: '#d1d5db',
      textMuted: '#6b7280',
      cardBg: '#171717',
      cardBorder: '#2a2a2a',
      cardHover: '#1f1f1f',
      avatarRing: '#2a2a2a',
    },
  },
  warm: {
    key: 'warm',
    label: 'Warm',
    preview: 'linear-gradient(135deg, #fdf8f0 0%, #f5ede0 100%)',
    vars: {
      bg: '#fdf8f0',
      bgGradient: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(210,160,90,0.12) 0%, transparent 70%)',
      text: '#1c1109',
      textSub: '#5c3d1e',
      textMuted: '#a07850',
      cardBg: '#fffdf8',
      cardBorder: '#ecdcc8',
      cardHover: '#f8f0e3',
      avatarRing: '#ecdcc8',
    },
  },
  forest: {
    key: 'forest',
    label: 'Forest',
    preview: 'linear-gradient(135deg, #0d1a0f 0%, #1a2e1c 100%)',
    vars: {
      bg: '#0d1a0f',
      bgGradient: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(74,222,128,0.08) 0%, transparent 70%)',
      text: '#f0fdf4',
      textSub: '#bbf7d0',
      textMuted: '#4ade80',
      cardBg: '#132016',
      cardBorder: '#1e3622',
      cardHover: '#1a2e1c',
      avatarRing: '#1e3622',
    },
  },
  sky: {
    key: 'sky',
    label: 'Sky',
    preview: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    vars: {
      bg: '#eff6ff',
      bgGradient: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%)',
      text: '#0c1a2e',
      textSub: '#1e40af',
      textMuted: '#60a5fa',
      cardBg: '#ffffff',
      cardBorder: '#bfdbfe',
      cardHover: '#eff6ff',
      avatarRing: '#bfdbfe',
    },
  },
};

export function getTheme(key?: string | null): Theme {
  return THEMES[(key as ThemeKey) || 'minimal'] || THEMES.minimal;
}
