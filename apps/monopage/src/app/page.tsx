'use client';

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ArrowRight, Sparkles, Plus, Trash2, Link as LinkIcon, Loader2 } from "lucide-react";
import { detectLink, getLinkIcon, type DetectedLink } from "@/lib/link-detector";
import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  const [links, setLinks] = useState<DetectedLink[]>([]);
  const [input, setInput] = useState('');
  const [aiComment, setAiComment] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/proxy/api/v1/stats').then(r => r.json()).then(d => setPageCount(d.pages)).catch(() => {});
  }, []);

  const analyzeLinks = async (allLinks: DetectedLink[]) => {
    if (allLinks.length === 0) { setAiComment(''); return; }
    setAiLoading(true);
    try {
      const summary = allLinks.map(l => l.handle ? `${l.label} @${l.handle}` : `${l.label}: ${l.url}`).join(', ');
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `사용자가 이런 링크들을 입력했어: ${summary}

이 링크들을 보고 이 사람이 어떤 사람인지 구체적으로 분석해줘. 예를 들어 "인스타 팔로워가 많은 뷰티 크리에이터네요", "GitHub에 프로젝트가 많은 개발자시군요", "유튜브와 인스타 둘 다 운영하는 콘텐츠 크리에이터네요" 처럼 링크에서 유추한 직업/활동을 구체적으로 언급해.

두 문장으로 답변해:
1번 문장: 링크 분석 (구체적인 직업/활동 언급, "관련 웹사이트네요" 같은 뻔한 표현 절대 금지)
2번 문장: 이 분야에 맞는 개인화된 회원가입 유도 (예: "크리에이터들이 많이 쓰는 바로 지금 페이지 만들어봐요!", "개발자라면 포트폴리오 페이지 하나쯤은 필수죠!")

반드시 한국어로. 이모지 1-2개 포함. 반드시 두 문장만.` }),
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
    <div className="flex flex-col min-h-screen bg-white text-black font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-black text-xl tracking-tight">
          Monopage<span className="text-gray-300">.</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-black transition-colors">
            로그인
          </Link>
          <Link href="/onboard" className="px-5 py-2.5 bg-black text-white rounded-full text-sm font-black hover:scale-105 active:scale-95 transition-all">
            시작하기
          </Link>
        </div>
      </nav>

      {/* Hero + Interactive Demo */}
      <section className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 px-6 py-16 lg:py-24 max-w-6xl mx-auto w-full">
        {/* Left: Copy + Input */}
        <div className="flex-1 max-w-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400">
              <Sparkles size={12} /> 오픈 베타
            </div>
            {pageCount !== null && pageCount > 0 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white rounded-full text-[10px] font-black">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                {pageCount}명이 만들었어요
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] mb-4">
            링크만 붙여넣으면<br />
            <span className="text-gray-300">페이지가 완성돼요.</span>
          </h1>

          <p className="text-base text-gray-400 font-medium mb-8 leading-relaxed">
            SNS, 홈페이지, 네이버 플레이스 — 어떤 링크든 넣어보세요.<br />
            오른쪽에서 내 페이지가 어떻게 보이는지 바로 확인할 수 있어요.
          </p>

          {/* Link Input */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1 flex items-center gap-3 px-4 py-3.5 border border-gray-200 rounded-2xl focus-within:border-black transition-colors bg-white">
              <LinkIcon size={16} className="text-gray-300 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="링크 붙여넣기 (여러 개도 OK)"
                className="flex-1 text-sm font-bold outline-none bg-transparent"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                onPaste={handlePaste}
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={!input.trim()}
              className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shrink-0 disabled:opacity-20 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Added Links */}
          {links.length > 0 && (
            <div className="flex flex-col gap-1.5 mb-6">
              {links.map((link, i) => (
                <div key={`${link.url}-${i}`} className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl group">
                  <span className="text-base shrink-0">{getLinkIcon(link.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black truncate">{link.handle ? `@${link.handle}` : link.label}</p>
                  </div>
                  <button onClick={() => handleRemove(i)} className="text-gray-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* AI Comment */}
          {links.length > 0 && (aiLoading || aiComment) && (
            <div className="mb-6 p-4 bg-black rounded-2xl">
              {aiLoading ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 size={14} className="animate-spin text-white" />
                  <span className="text-xs font-bold text-gray-300">링크 분석 중...</span>
                </div>
              ) : aiComment ? (
                <div className="flex items-start gap-3">
                  <span className="text-base shrink-0 mt-0.5">✨</span>
                  <p className="text-sm font-bold text-white leading-relaxed">{aiComment}</p>
                </div>
              ) : null}
            </div>
          )}

          {/* CTA */}
          <Link
            href="/onboard"
            onClick={handleStartWithLinks}
            className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full text-sm font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
          >
            {links.length > 0 ? `${links.length}개 링크로 시작하기` : '무료로 시작하기'}
            <ArrowRight size={16} />
          </Link>

          {/* Quick hints */}
          {links.length === 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {['instagram.com/username', 'youtube.com/@channel', 'place.naver.com/...'].map(hint => (
                <button
                  key={hint}
                  onClick={() => { setInput(hint); inputRef.current?.focus(); }}
                  className="px-3 py-1.5 border border-gray-100 rounded-full text-[10px] font-bold text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-colors"
                >
                  {hint}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: iPhone Preview */}
        <div className="shrink-0">
          <div className="w-[320px] h-[640px] bg-white border-[8px] border-black rounded-[50px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-b-2xl z-20"></div>
            <div className="h-full overflow-y-auto scrollbar-hide px-6 pt-16 pb-8 flex flex-col items-center">
              {links.length === 0 ? (
                /* Empty state */
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                    👤
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-300">@username</p>
                    <p className="text-[10px] text-gray-200 mt-1">왼쪽에서 링크를 추가해보세요</p>
                  </div>
                  <div className="w-full space-y-2 mt-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-full h-12 bg-gray-50 rounded-xl border border-gray-100"></div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Live preview */
                <>
                  <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-white text-xl font-black mb-3">
                    M
                  </div>
                  <p className="text-sm font-black mb-1">@my_page</p>
                  <p className="text-[10px] text-gray-400 mb-6">나만의 모노페이지</p>
                  <div className="w-full space-y-2">
                    {links.map((link, i) => {
                      const hostname = link.domain || (() => { try { return new URL(link.url).hostname.replace(/^www\./, ''); } catch { return link.url; } })();
                      return (
                        <div
                          key={`preview-${link.url}-${i}`}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-white rounded-xl border border-gray-100"
                        >
                          <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                            {link.favicon ? (
                              <img src={link.favicon} alt="" className="w-4 h-4 object-contain" />
                            ) : (
                              <span className="text-[10px]">{getLinkIcon(link.type)}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold truncate leading-tight">{link.handle ? `@${link.handle}` : link.label}</p>
                            <p className="text-[9px] text-gray-400 truncate">{hostname}</p>
                          </div>
                          <ArrowRight size={10} className="text-gray-300 shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-auto pt-8 opacity-10 text-[8px] font-black uppercase tracking-widest">
                    Monopage
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-black mb-12 text-center">왜 Monopage인가요?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🔗', title: '링크만 넣으면 끝', desc: 'SNS, 블로그, 네이버 플레이스까지 자동 감지' },
              { icon: '📱', title: '모바일에서도 완벽', desc: '어디서든 쉽게 편집하고 공유할 수 있어요' },
              { icon: '📊', title: '방문자 분석', desc: '누가, 언제, 어떤 링크를 클릭했는지 한눈에' },
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-black text-base mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-10 border-t border-gray-100 text-center">
        <p className="text-gray-300 text-[10px] font-black uppercase tracking-widest">
          © 2026 Monopage. All rights reserved.
        </p>
      </footer>

      <ChatWidget />
    </div>
  );
}
