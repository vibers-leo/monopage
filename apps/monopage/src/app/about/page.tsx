import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight, ArrowUpRight,
  Globe, Palette, Share2, BarChart3,
} from 'lucide-react';

export default function AboutPage() {

  return (
    <div className="bg-white text-gray-900 relative overflow-hidden" style={{ fontFamily: "'Pretendard', system-ui, sans-serif" }}>

      {/* ── Nav ───────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <Link href="/" className="font-black text-base tracking-tight">
          Monopage<span className="text-gray-300">.</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-xs font-bold text-gray-400 hover:text-black transition-colors">로그인</Link>
          <Link href="/onboard" className="px-4 py-2 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800 transition-colors">
            시작하기
          </Link>
        </div>
      </nav>

      {/* ── 1. Hero ────────────────────────────────────────── */}
      <section className="min-h-[100dvh] relative flex items-center pt-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-emerald-50/60 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-gray-50/60 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* 왼쪽 — 텍스트 */}
            <div className="pt-8 lg:pt-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs text-emerald-700 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                A Social Art Experiment
              </div>

              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6 text-gray-900"
                style={{ wordBreak: 'keep-all' }}
              >
                누구에게나
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-500">
                  단 하나의 페이지가
                </span>
                <br />
                필요하다면? 모노페이지!
              </h1>

              <p
                className="text-lg md:text-xl text-gray-500 max-w-lg mb-10 leading-relaxed font-light"
                style={{ wordBreak: 'keep-all' }}
              >
                SNS 링크, 작품, 유튜브, 쇼핑까지 — 한 페이지에.
                <br />
                모노페이지는 누구나 쉽게 만들 수 있는
                나만의 공간이에요.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/onboard"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-black text-white text-sm font-bold rounded-full hover:bg-emerald-600 transition-all"
                >
                  무료로 시작하기 <ArrowRight size={16} />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 border border-gray-200 text-sm font-bold rounded-full hover:border-black transition-colors"
                >
                  내 페이지 관리
                </Link>
              </div>

              <p className="mt-5 text-xs text-gray-300 pl-1">
                1분만에 완성 · 무료 · 카드 등록 불필요
              </p>
            </div>

            {/* 오른쪽 — 비주얼 */}
            <div className="relative hidden lg:block">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-gray-100 bg-white ring-1 ring-black/5 shadow-2xl shadow-black/10">
                <Image
                  src="https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?q=80&w=800&auto=format&fit=crop"
                  alt="monopage 미리보기"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-white/20" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-4 shadow-lg">
                    <p className="text-xs text-gray-400 mb-1 font-mono">monopage.kr/@나의페이지</p>
                    <p className="text-sm font-medium text-gray-900">나만의 단 하나의 페이지</p>
                    <div className="flex gap-2 mt-3">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[14px] rounded-full font-medium">링크 연결</span>
                      <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[14px] rounded-full">5가지 테마</span>
                      <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[14px] rounded-full">무료</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl bg-emerald-50 border border-emerald-100 animate-bounce" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-gray-50 border border-gray-100 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. 실험 소개 ──────────────────────────────────── */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-mono tracking-widest text-emerald-600 mb-6 uppercase">The Story</p>
          <blockquote className="mb-8">
            <p
              className="text-2xl md:text-3xl font-light text-gray-700 leading-relaxed"
              style={{ wordBreak: 'keep-all', fontFamily: "'Noto Serif KR', Georgia, serif" }}
            >
              &ldquo;단 하나의 링크로, 나를 표현할 수 있는 공간이 필요했다.
              <br />
              복잡하지 않고, 예쁘고, 빠르게.
              <br />
              그래서 모노페이지가 시작됐다.&rdquo;
            </p>
          </blockquote>
          <p className="text-sm text-gray-400 leading-relaxed" style={{ wordBreak: 'keep-all' }}>
            모노페이지는 2024년 아트페이지(ArtPage)라는 이름으로 아티스트를 위해 시작됐어요.
            <br />
            지금은 아티스트뿐만 아니라 누구나 자신만의 페이지를 가질 수 있도록 확장됐어요.
          </p>
        </div>
      </section>

      {/* ── 3. 핵심 기능 ──────────────────────────────────── */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <p className="text-xs font-mono tracking-widest text-emerald-600 mb-4 uppercase">Core features</p>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-gray-900"
                style={{ wordBreak: 'keep-all' }}
              >
                관리는 쉽게,
                <br />
                연결은 자유롭게
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Globe, title: '링크 모음', desc: 'SNS, 유튜브, 블로그, 쇼핑몰 — 모든 링크를 한 곳에. 파비콘과 함께 앱 아이콘처럼 깔끔하게.' },
              { icon: Palette, title: '5가지 테마', desc: 'Minimal, Dark, Warm, Forest, Sky — 내 분위기에 맞는 테마를 골라 나만의 공간으로 꾸밀 수 있어요.' },
              { icon: Share2, title: 'SNS 연동', desc: '인스타그램 계정을 연결하면 최신 피드가 페이지에 자동으로 반영돼요.' },
              { icon: BarChart3, title: '방문 통계', desc: '내 페이지를 누가 얼마나 봤는지, 어떤 링크를 클릭했는지 한눈에 확인할 수 있어요.' },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl border border-gray-100 bg-white ring-1 ring-black/5 hover:shadow-lg hover:shadow-black/5 hover:border-gray-200 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-5 group-hover:bg-emerald-100 transition-colors">
                  <feature.icon size={22} className="text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ wordBreak: 'keep-all' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. 왜 모노페이지인가 ─────────────────────────── */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs font-mono tracking-widest text-emerald-600 mb-4 uppercase">Why Monopage</p>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-gray-900"
              style={{ wordBreak: 'keep-all' }}
            >
              왜 모노페이지인가요?
            </h2>
          </div>

          <div className="space-y-24">
            {[
              {
                subtitle: 'SIMPLE',
                title: '알고리즘이 아닌,\n나의 큐레이션',
                desc: 'SNS의 피드는 알고리즘이 정해요. 모노페이지는 내가 원하는 순서와 맥락으로 링크를 배치할 수 있어요. 나를 표현하는 방식을 직접 결정할 수 있어요.',
                image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2971&auto=format&fit=crop',
                align: 'right' as const,
              },
              {
                subtitle: 'BEAUTIFUL',
                title: '하나의 링크로\n모든 것을 연결',
                desc: '인스타 바이오에 링크 하나만 넣어보세요. 방문자는 유튜브, 블로그, 쇼핑몰, SNS를 한 곳에서 모두 만날 수 있어요.',
                image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2968&auto=format&fit=crop',
                align: 'left' as const,
              },
              {
                subtitle: 'FREE',
                title: '무료, 지금 바로\n1분 만에',
                desc: '카드 등록도, 복잡한 설정도 필요 없어요. 계정 만들고 링크 추가하면 끝이에요. 지금 바로 나만의 모노페이지를 시작해보세요.',
                image: 'https://images.unsplash.com/photo-1520423465871-0866049020b7?q=80&w=2800&auto=format&fit=crop',
                align: 'right' as const,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`flex flex-col md:flex-row items-center gap-12 md:gap-20 ${item.align === 'left' ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="flex-1 space-y-6">
                  <span className="text-xs font-bold tracking-[0.3em] text-gray-400">{item.subtitle}</span>
                  <h3
                    className="text-3xl md:text-4xl font-bold leading-snug whitespace-pre-line text-gray-900"
                    style={{ wordBreak: 'keep-all' }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-lg text-gray-500 leading-relaxed font-light" style={{ wordBreak: 'keep-all' }}>
                    {item.desc}
                  </p>
                </div>
                <div className="flex-1 relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-xl shadow-black/5 group">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. 시작하기 CTA ──────────────────────────────── */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6" style={{ wordBreak: 'keep-all' }}>
            지금 시작해보세요
          </h2>
          <p className="text-gray-400 text-lg mb-10 font-light">무료 · 카드 등록 불필요 · 1분 완성</p>
          <Link
            href="/onboard"
            className="inline-flex items-center gap-2 px-10 py-5 bg-black text-white text-sm font-bold rounded-full hover:bg-emerald-600 transition-all shadow-xl shadow-black/10"
          >
            무료로 시작하기 <ArrowRight size={16} />
          </Link>
          <p className="mt-6 text-xs text-gray-300">이미 계정이 있나요? <Link href="/login" className="underline hover:text-black transition-colors">로그인</Link></p>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-10 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <Link href="/" className="font-black text-sm tracking-tight mb-4 inline-block">
            Monopage<span className="text-gray-300">.</span>
          </Link>
          <div className="flex justify-center gap-4 mb-3">
            <Link href="/privacy" className="text-xs text-gray-300 hover:text-black transition-colors">개인정보처리방침</Link>
            <span className="text-gray-200">|</span>
            <Link href="/terms" className="text-xs text-gray-300 hover:text-black transition-colors">이용약관</Link>
          </div>
          <p className="text-xs text-gray-200">© 2026 Monopage by Vibers (D.Lab Corp.)</p>
        </div>
      </footer>

    </div>
  );
}
