'use client';

import { useEffect } from 'react';
import { DARK_ORANGE } from '@/lib/themes';
import { Hero, Problem } from '@/components/landing/HeroProblem';
import { Solution, Services } from '@/components/landing/SolutionServices';
import { Pricing, FAQ, Footer } from '@/components/landing/PricingFooter';

export default function Page() {
  const theme = DARK_ORANGE;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      {/* 상단 네비 */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(9,9,11,0.8)',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <span style={{ fontFamily: 'Paperlogy, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--foreground)' }}>
            MZ MKT<span style={{ color: 'var(--primary)' }}>.</span>
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <a href="#services" style={{ fontSize: 14, color: 'var(--muted-foreground)', textDecoration: 'none' }}>서비스</a>
            <a href="#pricing" style={{ fontSize: 14, color: 'var(--muted-foreground)', textDecoration: 'none' }}>요금제</a>
            <a href="#faq" style={{ fontSize: 14, color: 'var(--muted-foreground)', textDecoration: 'none' }}>FAQ</a>
            <button className="btn-orange" style={{ padding: '8px 20px', fontSize: 13 }}>
              무료 상담
            </button>
          </div>
        </div>
      </nav>

      <div className="reveal"><Hero theme={theme} /></div>
      <div className="reveal"><Problem theme={theme} /></div>
      <div className="reveal" id="services"><Solution theme={theme} /></div>
      <div className="reveal"><Services theme={theme} /></div>
      <div className="reveal" id="pricing"><Pricing theme={theme} /></div>
      <div className="reveal" id="faq"><FAQ theme={theme} /></div>
      <Footer theme={theme} />
    </main>
  );
}
