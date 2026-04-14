export type LinkType =
  | 'instagram'
  | 'youtube'
  | 'tiktok'
  | 'twitter'
  | 'facebook'
  | 'threads'
  | 'naver_blog'
  | 'naver_place'
  | 'github'
  | 'linkedin'
  | 'website';

export interface DetectedLink {
  type: LinkType;
  label: string;
  url: string;
  handle?: string; // SNS handle if applicable
  favicon?: string; // favicon URL (from OG fetch)
  domain?: string;  // hostname (e.g. "myratingis.kr")
}

const patterns: { type: LinkType; regex: RegExp; label: string; extractHandle?: (url: string) => string }[] = [
  {
    type: 'instagram',
    regex: /instagram\.com\/([^/?#]+)/i,
    label: 'Instagram',
    extractHandle: (url) => url.match(/instagram\.com\/([^/?#]+)/i)?.[1] || '',
  },
  {
    type: 'youtube',
    regex: /(?:youtube\.com|youtu\.be)\//i,
    label: 'YouTube',
    extractHandle: (url) => {
      const match = url.match(/youtube\.com\/(?:@|channel\/|c\/)([^/?#]+)/i);
      return match?.[1] || '';
    },
  },
  {
    type: 'tiktok',
    regex: /tiktok\.com\/@?([^/?#]+)/i,
    label: 'TikTok',
    extractHandle: (url) => url.match(/tiktok\.com\/@?([^/?#]+)/i)?.[1] || '',
  },
  {
    type: 'twitter',
    regex: /(?:twitter\.com|x\.com)\/([^/?#]+)/i,
    label: 'X (Twitter)',
    extractHandle: (url) => url.match(/(?:twitter\.com|x\.com)\/([^/?#]+)/i)?.[1] || '',
  },
  {
    type: 'threads',
    regex: /threads\.net\/@?([^/?#]+)/i,
    label: 'Threads',
    extractHandle: (url) => url.match(/threads\.net\/@?([^/?#]+)/i)?.[1] || '',
  },
  {
    type: 'facebook',
    regex: /facebook\.com\/([^/?#]+)/i,
    label: 'Facebook',
  },
  {
    type: 'naver_place',
    regex: /(?:place\.naver\.com|naver\.me|map\.naver\.com\/local)/i,
    label: '네이버 플레이스',
  },
  {
    type: 'naver_blog',
    regex: /blog\.naver\.com\/([^/?#]+)/i,
    label: '네이버 블로그',
  },
  {
    type: 'github',
    regex: /github\.com\/([^/?#]+)/i,
    label: 'GitHub',
    extractHandle: (url) => url.match(/github\.com\/([^/?#]+)/i)?.[1] || '',
  },
  {
    type: 'linkedin',
    regex: /linkedin\.com\/in\/([^/?#]+)/i,
    label: 'LinkedIn',
  },
];

export function detectLink(input: string): DetectedLink {
  // Normalize: add https if missing
  let url = input.trim();
  if (url && !url.match(/^https?:\/\//i)) {
    // Handle @username for SNS
    if (url.startsWith('@')) {
      // Could be Instagram, TikTok, etc — default to Instagram
      return {
        type: 'instagram',
        label: 'Instagram',
        url: `https://instagram.com/${url.slice(1)}`,
        handle: url.slice(1),
      };
    }
    url = `https://${url}`;
  }

  for (const pattern of patterns) {
    if (pattern.regex.test(url)) {
      return {
        type: pattern.type,
        label: pattern.label,
        url,
        handle: pattern.extractHandle?.(url),
      };
    }
  }

  // 호스트명을 label로 사용 (https://myratingis.kr → myratingis.kr)
  let hostname = url;
  try {
    hostname = new URL(url).hostname.replace(/^www\./, '');
  } catch { /* keep original */ }
  return { type: 'website', label: hostname, url };
}

export function getLinkIcon(type: LinkType): string {
  const icons: Record<LinkType, string> = {
    instagram: '📸',
    youtube: '▶️',
    tiktok: '🎵',
    twitter: '𝕏',
    facebook: '👤',
    threads: '🧵',
    naver_blog: '📝',
    naver_place: '📍',
    github: '💻',
    linkedin: '💼',
    website: '🌐',
  };
  return icons[type];
}

export function isSnsLink(type: LinkType): boolean {
  return ['instagram', 'youtube', 'tiktok', 'twitter', 'threads'].includes(type);
}
