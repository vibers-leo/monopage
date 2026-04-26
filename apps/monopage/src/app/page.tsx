'use client';

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ArrowRight, Sparkles, Plus, Trash2, Link as LinkIcon, Loader2 } from "lucide-react";
import { detectLink, getLinkIcon, type DetectedLink } from "@/lib/link-detector";
import { getToken } from "@/lib/api";
import ChatWidget from "@/components/ChatWidget";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  const [links, setLinks] = useState<DetectedLink[]>([]);
  const [input, setInput] = useState('');
  const [aiComment, setAiComment] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/proxy/api/v1/stats').then(r => r.json()).then(d => setPageCount(d.pages)).catch(() => {});
    setIsLoggedIn(!!getToken());
  }, []);

  const analyzeLinks = async (allLinks: DetectedLink[]) => {
    if (allLinks.length === 0) { setAiComment(''); return; }
    setAiLoading(true);
    try {
      const summary = allLinks.map(l => l.handle ? `${l.label} @${l.handle}` : `${l.label}: ${l.url}`).join(', ');
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `사용자가 이런 링크들을 입력했어: ${summary}\n\n이 링크들을 보고 이 사람이 어떤 사람인지 구체적으로 분석해줘. 예를 들어 "인스타 팔로워가 많은 뷰티 크리에이터네요", "GitHub에 프로젝트가 많은 개발자시군요", "유튜브와 인스타 둘 다 운영하는 콘텐츠 크리에이터네요" 처럼 링크에서 유추한 직업/활동을 구체적으로 언급해.\n\n두 문장으로 답변해:\n1번 문장: 링크 분석 (구체적인 직업/활동 언급, "관련 웹사이트네요" 같은 뻔한 표현 절대 금지)\n2번 문장: 이 분야에 맞는 개인화된 회원가입 유도\n\n반드시 한국어로. 이모지 1-2개 포함. 반드시 두 문장만.` }),
      });
      const data = await res.json();
      setAiComment(data.response || '');
    } catch { setAiComment(''); }
    setAiLoading(false);
  };

  const enrichLink = async (link: DetectedLink): Promise<DetectedLink> => {
    try {
      const res = await fetch(`/api/og?url=${encodeURIComponent(link.url)}`);
      const og = await res.json();
      return {
        ...link,
        ...(og.title && link.type === 'website' ? { label: og.title } : {}),
        favicon: og.favicon || undefined,
        domain: og.hostname || undefined,
      };
    } catch { /* keep original */ }
    return link;
  };

  const handleAdd = async () => {
    if (!input.trim()) return;
    const detected = detectLink(input);
    if (links.some(l => l.url === detected.url)) { setInput(''); return; }
    setInput('');
    inputRef.current?.focus();
    const enriched = await enrichLink(detected);
    const newLinks = [...links, enriched];
    setLinks(newLinks);
    analyzeLinks(newLinks);
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    const lines = text.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    if (lines.length <= 1) return;
    e.preventDefault();
    const existingUrls = new Set(links.map(l => l.url));
    const newLinks: DetectedLink[] = [];
    for (const line of lines) {
      const detected = detectLink(line);
      if (!existingUrls.has(detected.url)) {
        newLinks.push(detected);
        existingUrls.add(detected.url);
      }
    }
    if (newLinks.length > 0) {
      setInput('');
      const enriched = await Promise.all(newLinks.map(enrichLink));
      const all = [...links, ...enriched];
      setLinks(all);
      analyzeLinks(all);
    }
  };

  const handleRemove = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleStartWithLinks = () => {
    if (links.length > 0) {
      sessionStorage.setItem('monopage_draft_links', JSON.stringify(links));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#0a0a0a]">
      <Navbar />

      {/* Hero */}
      <section className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 px-5 sm:px-8 py-14 sm:py-20 lg:py-0 max-w-[1100px] mx-auto w-full lg:min-h-[calc(100vh-65px)]">
        {/* Left: Copy + Input */}
        <div className="flex-1 max-w-lg w-full">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f5f5f5] rounded-full text-[13px] font-medium text-[#a3a3a3]">
              <Sparkles size={13} className="text-[#a3a3a3]" /> Open Beta
            </span>
            {pageCount !== null && pageCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0a0a0a] text-white rounded-full text-[13px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                {pageCount}명 참여 중
              </span>
            )}
          </div>

          <h1 className="font-paperlogy text-[36px] sm:text-[44px] lg:text-[52px] font-extrabold tracking-tight leading-[1.08] mb-5" style={{ wordBreak: 'keep-all' }}>
            링크 하나로,<br />
            <span className="text-[#c4c4c4]">나만의 페이지.</span>
          </h1>

          <p className="text-[16px] sm:text-[17px] text-[#525252] font-normal leading-[1.7] mb-10 max-w-[400px]" style={{ wordBreak: 'keep-all' }}>
            SNS, 포트폴리오, 네이버 플레이스 —<br className="hidden sm:block" />
            어떤 링크든 하나의 페이지로 정리할 수 있어요.
          </p>

          {/* Link Input */}
          <div className="flex gap-2.5 mb-4">
            <div className="flex-1 flex items-center gap-3 px-4 py-4 border border-[#e5e5e5] rounded-2xl focus-within:border-[#0a0a0a] transition-colors bg-white">
              <LinkIcon size={18} className="text-[#a3a3a3] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="링크를 붙여넣어 보세요"
                className="flex-1 text-[15px] font-medium outline-none bg-transparent placeholder:text-[#a3a3a3]"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                onPaste={handlePaste}
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={!input.trim()}
              className="w-[52px] h-[52px] bg-[#0a0a0a] text-white rounded-2xl flex items-center justify-center shrink-0 disabled:opacity-20 hover:bg-[#262626] active:scale-95 transition-all"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Added Links */}
          {links.length > 0 && (
            <div className="flex flex-col gap-1.5 mb-5">
              {links.map((link, i) => (
                <div key={`${link.url}-${i}`} className="flex items-center gap-3 px-4 py-3.5 bg-[#f5f5f5] rounded-xl group">
                  <span className="text-base shrink-0">{getLinkIcon(link.type)}</span>
                  <p className="text-[15px] font-medium truncate flex-1">{link.handle ? `@${link.handle}` : link.label}</p>
                  {link.handle && ['instagram', 'threads'].includes(link.type) && (
                    <span className="text-[12px] font-semibold text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full shrink-0">자동</span>
                  )}
                  <button onClick={() => handleRemove(i)} className="text-[#a3a3a3] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* AI Comment */}
          {links.length > 0 && (aiLoading || aiComment) && (
            <div className="mb-5 p-5 bg-[#0a0a0a] rounded-2xl">
              {aiLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-white" />
                  <span className="text-[15px] font-medium text-[#a3a3a3]">분석하고 있어요...</span>
                </div>
              ) : (
                <p className="text-[15px] font-medium text-white leading-relaxed">{aiComment}</p>
              )}
            </div>
          )}

          {/* CTA */}
          <Link
            href="/onboard"
            onClick={handleStartWithLinks}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0a0a0a] text-white rounded-full text-[16px] font-semibold hover:bg-[#262626] active:scale-[0.98] transition-all"
          >
            {links.length > 0
              ? links.some(l => l.handle && ['instagram', 'threads', 'tiktok'].includes(l.type))
                ? `${links.length}개 링크 + SNS 게시물로 시작`
                : `${links.length}개 링크로 시작`
              : '무료로 시작하기'}
            <ArrowRight size={18} />
          </Link>

          {/* Quick hints */}
          {links.length === 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {['instagram.com/username', 'youtube.com/@channel', 'place.naver.com/...'].map(hint => (
                <button
                  key={hint}
                  onClick={() => { setInput(hint); inputRef.current?.focus(); }}
                  className="px-3 py-1.5 border border-[#e5e5e5] rounded-full text-[13px] font-medium text-[#a3a3a3] hover:border-[#a3a3a3] hover:text-[#525252] transition-colors"
                >
                  {hint}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Phone Preview — mini on mobile, full on desktop */}
        <div className="shrink-0 w-full lg:w-auto flex justify-center">
          {/* Mobile: compact card preview */}
          <div className="lg:hidden w-full max-w-[320px] p-6 bg-[#f5f5f5] rounded-3xl flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#0a0a0a] flex items-center justify-center text-white text-lg font-bold">M</div>
            <p className="text-[15px] font-semibold">@my_page</p>
            <div className="w-full space-y-2">
              {['Instagram', 'YouTube', 'Blog'].map(name => (
                <div key={name} className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-xl">
                  <div className="w-8 h-8 bg-[#f5f5f5] rounded-lg" />
                  <span className="text-[14px] font-medium text-[#525252]">{name}</span>
                  <ArrowRight size={12} className="ml-auto text-[#d4d4d4]" />
                </div>
              ))}
            </div>
            <p className="text-[13px] text-[#a3a3a3] mt-1">이렇게 보여요</p>
          </div>

          {/* Desktop: full iPhone mock */}
          <div className="hidden lg:block">
            <div className="w-[300px] h-[620px] bg-white border-[7px] border-[#0a0a0a] rounded-[48px] shadow-[0_16px_40px_rgba(0,0,0,0.12)] relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#0a0a0a] rounded-b-2xl z-20" />
              <div className="h-full overflow-y-auto scrollbar-hide px-5 pt-14 pb-8 flex flex-col items-center">
                {links.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#f5f5f5] flex items-center justify-center">
                      <span className="text-[#a3a3a3] text-xl font-semibold">M</span>
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#a3a3a3]">@username</p>
                      <p className="text-[11px] text-[#d4d4d4] mt-1">링크를 추가해보세요</p>
                    </div>
                    <div className="w-full space-y-2 mt-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-full h-12 bg-[#f5f5f5] rounded-xl" />
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-[#0a0a0a] flex items-center justify-center text-white text-lg font-bold mb-3">
                      M
                    </div>
                    <p className="text-[13px] font-semibold mb-0.5">@my_page</p>
                    <p className="text-[11px] text-[#a3a3a3] mb-6">나만의 모노페이지</p>
                    <div className="w-full space-y-2">
                      {links.map((link, i) => {
                        const hostname = link.domain || (() => { try { return new URL(link.url).hostname.replace(/^www\./, ''); } catch { return link.url; } })();
                        return (
                          <div key={`preview-${link.url}-${i}`} className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-white rounded-xl border border-[#e5e5e5]">
                            <div className="w-7 h-7 bg-[#f5f5f5] flex items-center justify-center shrink-0 overflow-hidden" style={{ borderRadius: '28%' }}>
                              {link.favicon ? (
                                <img src={link.favicon} alt="" className="w-4 h-4 object-contain" />
                              ) : (
                                <span className="text-[10px] text-[#a3a3a3]">{getLinkIcon(link.type)}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-semibold truncate leading-tight">{link.handle ? `@${link.handle}` : link.label}</p>
                              <p className="text-[9px] text-[#a3a3a3] truncate">{hostname}</p>
                            </div>
                            <ArrowRight size={10} className="text-[#d4d4d4] shrink-0" />
                          </div>
                        );
                      })}
                    </div>
                    <p className="mt-auto pt-8 opacity-15 text-[8px] font-medium uppercase tracking-[0.2em]">Monopage</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features — inverted dark section */}
      <section className="py-20 sm:py-28 bg-[#0a0a0a] text-white">
        <div className="max-w-[960px] mx-auto px-5 sm:px-8">
          <p className="text-[13px] font-semibold text-[#525252] uppercase tracking-[0.3em] text-center mb-3">Why Monopage</p>
          <h2 className="font-paperlogy text-[26px] sm:text-[32px] font-extrabold text-center mb-14 tracking-tight text-white">
            한 페이지로 충분한 이유
          </h2>
          <div className="grid sm:grid-cols-3 gap-5 sm:gap-6">
            {[
              { num: '01', title: '링크만 넣으면 끝이에요', desc: 'SNS, 블로그, 네이버 플레이스까지 자동으로 감지하고 정리해드려요.' },
              { num: '02', title: '어디서든 수정할 수 있어요', desc: '스마트폰에서도 바로 편집하고, 변경 사항이 실시간으로 반영돼요.' },
              { num: '03', title: '방문자 통계를 볼 수 있어요', desc: '누가 언제 어떤 링크를 눌렀는지 한눈에 확인할 수 있어요.' },
            ].map((f) => (
              <div key={f.num} className="p-6 sm:p-7 rounded-2xl border border-white/10 hover:border-white/20 transition-all bg-white/[0.03]">
                <p className="text-[13px] font-semibold text-[#525252] mb-4 tracking-[0.2em]">{f.num}</p>
                <h3 className="font-paperlogy text-[18px] font-bold mb-3 text-white leading-snug">{f.title}</h3>
                <p className="text-[15px] text-[#a3a3a3] leading-[1.7]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24">
        <div className="max-w-[560px] mx-auto px-5 sm:px-8 text-center">
          <h2 className="font-paperlogy text-[26px] sm:text-[32px] font-extrabold tracking-tight mb-5">
            지금 바로 시작해보세요
          </h2>
          <p className="text-[16px] text-[#525252] mb-8 leading-[1.7]">
            무료로 만들고, 원하는 대로 꾸밀 수 있어요.<br />
            나만의 페이지가 1분이면 완성돼요.
          </p>
          <Link
            href="/onboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0a0a0a] text-white rounded-full text-[16px] font-semibold hover:bg-[#262626] transition-colors"
          >
            무료로 시작하기 <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[#e5e5e5]">
        <div className="max-w-[960px] mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[14px] text-[#a3a3a3]">&copy; 2026 Monopage by Vibers</p>
          <div className="flex items-center gap-5">
            <Link href="/about" className="text-[14px] text-[#a3a3a3] hover:text-[#0a0a0a] transition-colors">소개</Link>
            <Link href="/privacy" className="text-[14px] text-[#a3a3a3] hover:text-[#0a0a0a] transition-colors">개인정보처리방침</Link>
            <Link href="/terms" className="text-[14px] text-[#a3a3a3] hover:text-[#0a0a0a] transition-colors">이용약관</Link>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
