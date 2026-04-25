'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Sparkles, Loader2, X, Plus, Trash2, Link as LinkIcon, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signup, setToken, updateProfile, createLink, getToken } from '@/lib/api';
import { detectLink, getLinkIcon, isSnsLink, type DetectedLink } from '@/lib/link-detector';

async function uploadPhoto(file: File, token?: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('사진을 올리지 못했어요');
  const data = await res.json();
  return data.url;
}

export default function Onboarding() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [links, setLinks] = useState<DetectedLink[]>([]);
  const [linkInput, setLinkInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({ username: '', purpose: '', email: '' });
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestDone, setRequestDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (token) setIsLoggedIn(true);
    try {
      const draft = sessionStorage.getItem('monopage_draft_links');
      if (draft) {
        setLinks(JSON.parse(draft));
        sessionStorage.removeItem('monopage_draft_links');
      }
    } catch { /* ignore */ }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhoto(URL.createObjectURL(file));
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

  const handleAddLink = async () => {
    if (!linkInput.trim()) return;
    const detected = detectLink(linkInput.trim());
    if (links.some(l => l.url === detected.url)) {
      setError('이미 추가된 링크예요');
      return;
    }
    const enriched = await enrichLink(detected);
    setLinks([...links, enriched]);
    setLinkInput('');
    setError(null);
    linkInputRef.current?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    const lines = text.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    if (lines.length <= 1) return;
    e.preventDefault();
    const newLinks: DetectedLink[] = [];
    const existingUrls = new Set(links.map(l => l.url));
    for (const line of lines) {
      const detected = detectLink(line);
      if (!existingUrls.has(detected.url)) {
        newLinks.push(detected);
        existingUrls.add(detected.url);
      }
    }
    if (newLinks.length > 0) {
      setLinks([...links, ...newLinks]);
      setLinkInput('');
      setError(null);
    }
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (isLoggedIn) {
      if (links.length === 0) { router.push('/admin'); return; }
      setIsGenerating(true);
      setProgressStep(3);
      setError(null);
      try {
        for (const link of links) {
          const title = link.handle ? `${link.label} @${link.handle}` : link.label;
          await createLink(title, link.url, link.favicon, link.domain);
        }
        setProgressStep(4);
        await new Promise(r => setTimeout(r, 400));
        router.push('/admin');
      } catch (e: any) {
        setIsGenerating(false);
        setError(e.message || '링크를 추가하지 못했어요');
      }
      return;
    }

    if (!form.username.trim()) { setError('페이지 주소를 정해주세요'); return; }
    if (!form.email.trim()) { setError('이메일을 입력해주세요'); return; }
    if (form.password.length < 6) { setError('비밀번호는 6자 이상이어야 해요'); return; }

    setIsGenerating(true);
    setProgressStep(0);
    setError(null);
    try {
      setProgressStep(1);
      const res = await signup(form.email, form.password, form.username);
      setToken(res.token);
      setProgressStep(2);

      if (photoFile) {
        try {
          const avatarUrl = await uploadPhoto(photoFile, getToken() || undefined);
          await updateProfile({ avatar_url: avatarUrl });
        } catch (e) {
          console.error('Photo upload failed:', e);
        }
      }

      if (links.length > 0) {
        setProgressStep(3);
        for (const link of links) {
          const title = link.handle ? `${link.label} @${link.handle}` : link.label;
          await createLink(title, link.url, link.favicon, link.domain);
        }
      }

      setProgressStep(4);
      await new Promise(r => setTimeout(r, 600));
      router.push('/admin');
    } catch (e: any) {
      setIsGenerating(false);
      const msg = e.message || '';
      if (msg.includes('Email has already been taken')) setError('이미 사용 중인 이메일이에요. 다른 이메일로 시도해보세요.');
      else if (msg.includes('Username has already been taken') || msg.includes('already been taken')) setError('이미 사용 중인 주소예요. 다른 주소로 시도해보세요.');
      else setError(msg || '페이지를 만들지 못했어요. 다시 시도해볼게요.');
    }
  };

  const snsLinks = links.filter(l => isSnsLink(l.type));
  const hasNaverPlace = links.some(l => l.type === 'naver_place');

  // 이미 로그인한 유저 → 추가 페이지 신청 안내
  const handleRequestSubmit = async () => {
    if (!requestForm.username.trim() || !requestForm.email.trim()) return;
    setRequestSubmitting(true);
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'page_request',
          data: { username: requestForm.username, purpose: requestForm.purpose, email: requestForm.email },
        }),
      });
      setRequestDone(true);
    } catch {
      setRequestDone(true);
    } finally {
      setRequestSubmitting(false);
    }
  };

  if (isLoggedIn && !isGenerating) {
    return (
      <div className="min-h-screen bg-white text-[#0a0a0a] flex items-center justify-center p-5 sm:p-8">
        <div className="max-w-[440px] w-full flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 bg-[#f5f5f5] rounded-full flex items-center justify-center text-2xl">📄</div>
          <div>
            <h1 className="font-paperlogy text-[24px] font-extrabold tracking-tight mb-2">이미 페이지가 있어요</h1>
            <p className="text-[16px] text-[#525252] leading-relaxed">
              현재 오픈 베타 기간으로<br />1인 1페이지만 지원하고 있어요.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => router.push('/admin')}
              className="w-full py-4 bg-[#0a0a0a] text-white rounded-full text-[16px] font-semibold hover:bg-[#262626] transition-colors"
            >
              내 페이지 관리하기
            </button>
            <a
              href="https://buymeacoffee.com/vibers"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-[#FFDD00] text-[#0a0a0a] rounded-full text-[16px] font-semibold hover:brightness-95 transition-all text-center"
            >
              ☕ 후원하기
            </a>
            <button
              onClick={() => setShowRequestModal(true)}
              className="w-full py-4 border border-[#e5e5e5] text-[#525252] rounded-full text-[16px] font-semibold hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-colors"
            >
              추가 페이지 개설 신청하기
            </button>
          </div>

          <p className="text-[14px] text-[#a3a3a3]">
            후원해주신 분께 추가 페이지 개설 권한을 드려요
          </p>
        </div>

        {/* 추가 페이지 신청 모달 */}
        {showRequestModal && (
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => !requestSubmitting && setShowRequestModal(false)}
          >
            <div
              className="bg-white rounded-2xl w-full max-w-[420px] p-6 sm:p-8"
              onClick={e => e.stopPropagation()}
            >
              {requestDone ? (
                <div className="flex flex-col items-center gap-4 text-center py-4">
                  <div className="w-14 h-14 bg-[#f5f5f5] rounded-full flex items-center justify-center text-2xl">✅</div>
                  <h3 className="font-paperlogy text-[20px] font-bold">신청을 접수했어요</h3>
                  <p className="text-[15px] text-[#525252] leading-relaxed">
                    확인 후 입력하신 이메일로 연락드릴게요.
                  </p>
                  <button
                    onClick={() => { setShowRequestModal(false); setRequestDone(false); }}
                    className="w-full py-3.5 bg-[#0a0a0a] text-white rounded-full text-[15px] font-semibold hover:bg-[#262626] transition-colors mt-2"
                  >
                    확인
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <div>
                    <h3 className="font-paperlogy text-[20px] font-bold mb-1">추가 페이지 개설 신청</h3>
                    <p className="text-[15px] text-[#a3a3a3]">후원 확인 후 개설해드려요</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block text-[14px] font-semibold text-[#525252] mb-1.5">희망 페이지 주소</label>
                      <div className="flex items-center border border-[#e5e5e5] rounded-xl overflow-hidden focus-within:border-[#0a0a0a] transition-colors">
                        <span className="text-[14px] text-[#a3a3a3] pl-4 shrink-0">monopage.kr/</span>
                        <input
                          type="text"
                          placeholder="my_brand"
                          className="flex-1 py-3.5 pr-4 text-[15px] font-medium outline-none bg-transparent"
                          value={requestForm.username}
                          onChange={e => setRequestForm({ ...requestForm, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[14px] font-semibold text-[#525252] mb-1.5">용도 (선택)</label>
                      <input
                        type="text"
                        placeholder="브랜드 페이지, 팀 소개 등"
                        className="w-full py-3.5 px-4 border border-[#e5e5e5] rounded-xl text-[15px] font-medium outline-none focus:border-[#0a0a0a] transition-colors"
                        value={requestForm.purpose}
                        onChange={e => setRequestForm({ ...requestForm, purpose: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-[14px] font-semibold text-[#525252] mb-1.5">연락받을 이메일</label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        className="w-full py-3.5 px-4 border border-[#e5e5e5] rounded-xl text-[15px] font-medium outline-none focus:border-[#0a0a0a] transition-colors"
                        value={requestForm.email}
                        onChange={e => setRequestForm({ ...requestForm, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowRequestModal(false)}
                      className="flex-1 py-3.5 border border-[#e5e5e5] rounded-full text-[15px] font-semibold text-[#525252] hover:border-[#0a0a0a] transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleRequestSubmit}
                      disabled={requestSubmitting || !requestForm.username.trim() || !requestForm.email.trim()}
                      className="flex-1 py-3.5 bg-[#0a0a0a] text-white rounded-full text-[15px] font-semibold hover:bg-[#262626] transition-colors disabled:opacity-30 flex items-center justify-center gap-2"
                    >
                      {requestSubmitting ? <Loader2 size={16} className="animate-spin" /> : '신청하기'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#0a0a0a] flex items-center justify-center p-5 sm:p-8">
      <div className="max-w-[440px] w-full">
          {isGenerating ? (
            <div className="flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-300">
              <div>
                <h2 className="font-paperlogy text-[26px] font-extrabold tracking-tight leading-tight mb-1">페이지 만드는 중<span className="animate-pulse">...</span></h2>
                <p className="text-[#a3a3a3] text-[16px] font-medium">잠깐만요, 금방 돼요</p>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { step: 1, label: '계정 만들기', sub: '이메일 · 비밀번호 등록 중' },
                  { step: 2, label: '프로필 설정', sub: '기본 정보 저장 중' },
                  ...(links.length > 0 ? [{ step: 3, label: `링크 ${links.length}개 추가`, sub: '링크 카드 생성 중' }] : []),
                  { step: links.length > 0 ? 4 : 3, label: '페이지 완성!', sub: '어드민으로 이동 중' },
                ].map(({ step, label, sub }) => {
                  const done = progressStep > step;
                  const active = progressStep === step;
                  return (
                    <div key={step} className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${active ? 'bg-[#0a0a0a] text-white' : done ? 'bg-[#f5f5f5]' : 'opacity-30'}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${active ? 'bg-white text-[#0a0a0a]' : done ? 'bg-[#0a0a0a] text-white' : 'bg-[#e5e5e5] text-[#a3a3a3]'}`}>
                        {done ? <Check size={13} /> : active ? <Loader2 size={13} className="animate-spin" /> : step}
                      </div>
                      <div className="flex-1">
                        <p className={`text-[14px] font-semibold ${active ? 'text-white' : done ? 'text-[#0a0a0a]' : 'text-[#a3a3a3]'}`}>{label}</p>
                        {active && <p className="text-[14px] text-[#525252] font-medium mt-0.5">{sub}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Header */}
              <div className="flex flex-col gap-2">
                <h1 className="font-paperlogy text-[28px] sm:text-[32px] font-extrabold tracking-tight leading-snug">
                  내 페이지 만들기
                </h1>
                <p className="text-[16px] text-[#a3a3a3]">링크 추가하고, 주소만 정하면 바로 완성돼요.</p>
              </div>

              {/* Link input */}
              <div>
                <p className="text-[14px] font-semibold text-[#a3a3a3] uppercase tracking-[0.15em] mb-2">링크 추가</p>
                <div className="flex gap-2.5">
                  <div className="flex-1 flex items-center gap-3 p-4 border border-[#e5e5e5] rounded-xl bg-[#f5f5f5] focus-within:border-[#0a0a0a] focus-within:bg-white transition-all">
                    <LinkIcon size={16} className="text-[#a3a3a3] shrink-0" />
                    <input
                      ref={linkInputRef}
                      type="text"
                      placeholder="링크 붙여넣기 (여러 개도 OK)"
                      className="bg-transparent outline-none font-medium text-[14px] flex-1 placeholder:text-[#a3a3a3]"
                      value={linkInput}
                      onChange={(e) => setLinkInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                      onPaste={handlePaste}
                    />
                  </div>
                  <button
                    onClick={handleAddLink}
                    disabled={!linkInput.trim()}
                    className="w-12 h-12 bg-[#0a0a0a] text-white rounded-xl flex items-center justify-center shrink-0 disabled:opacity-20 hover:bg-[#262626] active:scale-95 transition-all"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Added links */}
              {links.length > 0 && (
                <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto">
                  {links.map((link, index) => (
                    <div
                      key={`${link.url}-${index}`}
                      className="flex items-center gap-3 px-4 py-3 bg-[#f5f5f5] rounded-xl group animate-in fade-in slide-in-from-left-2 duration-200"
                    >
                      <span className="text-sm shrink-0">{getLinkIcon(link.type)}</span>
                      <p className="text-[15px] font-medium truncate flex-1">{link.handle ? `@${link.handle}` : link.label}</p>
                      {isSnsLink(link.type) && (
                        <span className="text-[14px] font-semibold text-[#0a0a0a] bg-[#e5e5e5] px-2 py-0.5 rounded-full shrink-0">SNS</span>
                      )}
                      {link.type === 'naver_place' && (
                        <span className="text-[14px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full shrink-0">플레이스</span>
                      )}
                      <button
                        onClick={() => handleRemoveLink(index)}
                        className="text-[#a3a3a3] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {snsLinks.length > 0 && (
                <p className="text-[14px] font-medium text-[#525252]">SNS {snsLinks.length}개를 감지했어요 — 어드민에서 피드 연동할 수 있어요</p>
              )}
              {hasNaverPlace && (
                <p className="text-[14px] font-medium text-green-700">네이버 플레이스를 감지했어요 — 업체 정보가 자동으로 표시돼요</p>
              )}

              <div className="border-t border-[#e5e5e5]" />

              {/* Profile photo */}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="h-24 rounded-xl flex items-center gap-4 px-5 bg-[#f5f5f5] border border-dashed border-[#e5e5e5] hover:border-[#0a0a0a] cursor-pointer transition-all overflow-hidden group"
              >
                {photo ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
                    <img src={photo} className="w-full h-full object-cover" alt="Preview" />
                    <button
                      onClick={(e) => { e.stopPropagation(); setPhoto(null); setPhotoFile(null); }}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <X size={14} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#e5e5e5] flex items-center justify-center shrink-0 group-hover:bg-[#d4d4d4] transition-colors">
                    <Camera size={20} className="text-[#a3a3a3]" />
                  </div>
                )}
                <div>
                  <p className="text-[15px] font-semibold">{photo ? '사진 변경하기' : '프로필 사진 추가'}</p>
                  <p className="text-[14px] text-[#a3a3a3]">선택사항이에요</p>
                </div>
              </div>

              {/* Account info (not logged in) */}
              {!isLoggedIn && (
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[14px] font-semibold text-[#a3a3a3] uppercase tracking-[0.15em]">페이지 주소</p>
                      <p className="text-[14px] font-medium text-[#a3a3a3]">영문·숫자·_ 만 가능</p>
                    </div>
                    <div className="flex items-center gap-0 border border-[#e5e5e5] rounded-xl bg-[#f5f5f5] focus-within:border-[#0a0a0a] focus-within:bg-white transition-all overflow-hidden">
                      <span className="text-[14px] font-medium text-[#a3a3a3] pl-4 shrink-0">monopage.kr/</span>
                      <input
                        type="text"
                        placeholder="my_page"
                        className="bg-transparent outline-none font-semibold text-[14px] flex-1 py-4 pr-4"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                      />
                    </div>
                    <p className="text-[14px] text-[#a3a3a3] font-medium mt-2">
                      나중에 내 도메인으로 연결할 수도 있어요 (예: mybrand.com)
                    </p>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#a3a3a3] uppercase tracking-[0.15em] mb-2">이메일</p>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      className="w-full p-4 border border-[#e5e5e5] rounded-xl bg-[#f5f5f5] outline-none font-medium text-[14px] focus:border-[#0a0a0a] focus:bg-white transition-all placeholder:text-[#a3a3a3]"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#a3a3a3] uppercase tracking-[0.15em] mb-2">비밀번호</p>
                    <input
                      type="password"
                      placeholder="6자 이상"
                      className="w-full p-4 border border-[#e5e5e5] rounded-xl bg-[#f5f5f5] outline-none font-medium text-[14px] focus:border-[#0a0a0a] focus:bg-white transition-all placeholder:text-[#a3a3a3]"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                    />
                  </div>
                </div>
              )}

              {/* 이용약관 동의 */}
              {!isLoggedIn && (
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={e => setAgreeTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-[#e5e5e5] accent-[#0a0a0a]"
                  />
                  <span className="text-[14px] text-[#525252] leading-relaxed">
                    <a href="/terms" target="_blank" className="underline hover:text-[#0a0a0a]">이용약관</a> 및{' '}
                    <a href="/privacy" target="_blank" className="underline hover:text-[#0a0a0a]">개인정보처리방침</a>에 동의해요
                  </span>
                </label>
              )}

              {error && <p className="text-red-500 text-[14px] font-medium text-center">{error}</p>}

              {/* CTA */}
              <button
                onClick={handleCreate}
                disabled={!isLoggedIn && !agreeTerms}
                className="w-full py-4 bg-[#0a0a0a] text-white rounded-full font-semibold text-[16px] flex items-center justify-center gap-2 hover:bg-[#262626] active:scale-[0.98] transition-all disabled:opacity-30"
              >
                <Sparkles size={16} />
                {links.length > 0 ? '페이지 만들기' : '내 페이지 만들기'}
              </button>

              <p className="text-[14px] text-[#a3a3a3] text-center font-medium">
                링크는 나중에 어드민에서 자유롭게 수정할 수 있어요
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
