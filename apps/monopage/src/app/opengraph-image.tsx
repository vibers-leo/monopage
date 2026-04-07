import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '모노페이지 — 1페이지 웹사이트 빌더';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* 배경 그라디언트 오브 */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244,114,182,0.2) 0%, transparent 70%)',
          }}
        />
        {/* 로고 텍스트 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #F472B6, #A78BFA)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 900,
              color: '#fff',
            }}
          >
            M
          </div>
          <span style={{ fontSize: 48, fontWeight: 900, color: '#ffffff', letterSpacing: '-2px' }}>
            모노페이지
          </span>
        </div>
        {/* 태그라인 */}
        <div
          style={{
            fontSize: 24,
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '-0.5px',
            textAlign: 'center',
          }}
        >
          1페이지 웹사이트 빌더
        </div>
        {/* 서브 텍스트 */}
        <div
          style={{
            marginTop: 16,
            fontSize: 18,
            color: 'rgba(255,255,255,0.25)',
            textAlign: 'center',
          }}
        >
          monopage.kr
        </div>
        {/* 하단 배지 */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(244,114,182,0.1)',
            border: '1px solid rgba(244,114,182,0.2)',
            borderRadius: 999,
            padding: '8px 20px',
          }}
        >
          <span style={{ fontSize: 14, color: '#F472B6', fontWeight: 600 }}>
            by 계발자들 (Vibers)
          </span>
        </div>
      </div>
    ),
    size,
  );
}
