'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Sparkles, Loader2, X, Plus, Trash2, Link as LinkIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signup, setToken, updateProfile, createLink } from '@/lib/api';
import { detectLink, getLinkIcon, isSnsLink, type DetectedLink } from '@/lib/link-detector';

async function uploadPhoto(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  if (!res.ok) throw new Error('사진 올리기 실패');
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
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
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

  const handleAddLink = () => {
    if (!linkInput.trim()) return;
    const detected = detectLink(linkInput.trim());
    if (links.some(l => l.url === detected.url)) {
      setError('이미 추가된 링크예요');
      return;
    }
    setLinks([...links, detected]);
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
    if (!form.username.trim()) { setError('페이지 주소를 정해주세요'); return; }
    if (!form.email.trim()) { setError('이메일을 입력해주세요'); return; }
    if (form.password.length < 6) { setError('비밀번호는 6자 이상이어야 해요'); return; }

    setIsGenerating(true);
    setError(null);
    try {
      const res = await signup(form.email, form.password, form.username);
      setToken(res.token);

      if (photoFile) {
        try {
          const avatarUrl = await uploadPhoto(photoFile);
          await updateProfile({ avatar_url: avatarUrl });
        } catch { /* 스킵 */ }
      }

      for (const link of links) {
        const title = link.handle ? `${link.label} @${link.handle}` : link.label;
        await createLink(title, link.url);
      }

      router.push('/admin');
    } catch (e: any) {
      setIsGenerating(false);
      const msg = e.message || '';
      if (msg.includes('Email has already been taken')) setError('이미 사용 중인 이메일이에요. 다른 이메일을 사용해주세요.');
      else if (msg.includes('Username has already been taken') || msg.includes('already been taken')) setError('이미 사용 중인 사용자명이에요. 다른 주소를 선택해주세요.');
      else setError(msg || '페이지 만들기에 실패했어요. 다시 시도해주세요.');
    }
  };

  const snsLinks = links.filter(l => isSnsLink(l.type));
  const hasNaverPlace = links.some(l => l.type === 'naver_place');

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-6 text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-black/5 animate-ping rounded-full"></div>
                <Loader2 className="w-12 h-12 animate-spin text-black" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-widest mb-2">페이지 만드는 중...</h2>
                <p className="text-gray-400 text-sm font-medium">
                  {links.length > 0
                    ? `${links.length}개 링크로 페이지를 만들고 있어요`
                    : '페이지를 준비하고 있어요'}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* 헤더 */}
              <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tightest leading-[1.1]">
                  내 페이지<br />만들기.
                </h1>
                <p className="text-sm text-gray-400 font-medium">링크 추가하고, 주소만 정하면 바로 완성돼요.</p>
              </div>

              {/* 링크 입력 */}
              <div>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-2">링크 추가</p>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-3 p-4 border border-gray-200 rounded-2xl bg-gray-50 focus-within:border-black transition-colors">
                    <LinkIcon size={16} className="text-gray-300 shrink-0" />
                    <input
                      ref={linkInputRef}
                      type="text"
                      placeholder="링크 붙여넣기 (여러 개도 OK)"
                      className="bg-transparent outline-none font-bold text-sm flex-1"
                      value={linkInput}
                      onChange={(e) => setLinkInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                      onPaste={handlePaste}
                    />
                  </div>
                  <button
                    onClick={handleAddLink}
                    disabled={!linkInput.trim()}
                    className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shrink-0 disabled:opacity-20 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* 추가된 링크 */}
              {links.length > 0 && (
                <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto">
                  {links.map((link, index) => (
                    <div
                      key={`${link.url}-${index}`}
                      className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl group animate-in fade-in slide-in-from-left-2 duration-200"
                    >
                      <span className="text-base shrink-0">{getLinkIcon(link.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black truncate">{link.handle ? `@${link.handle}` : link.label}</p>
                      </div>
                      {isSnsLink(link.type) && (
                        <span className="text-[9px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full shrink-0">SNS</span>
                      )}
                      {link.type === 'naver_place' && (
                        <span className="text-[9px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full shrink-0">플레이스</span>
                      )}
                      <button
                        onClick={() => handleRemoveLink(index)}
                        className="text-gray-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {snsLinks.length > 0 && (
                <p className="text-[10px] font-bold text-blue-500">SNS {snsLinks.length}개 감지 — 어드민에서 피드 연동 가능</p>
              )}
              {hasNaverPlace && (
                <p className="text-[10px] font-bold text-green-600">네이버 플레이스 감지 — 업체 정보 자동 표시</p>
              )}

              {/* 구분선 */}
              <div className="border-t border-gray-100" />

              {/* 프로필 사진 (선택) */}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="h-24 rounded-2xl flex items-center gap-4 px-5 bg-gray-50 border border-dashed border-gray-200 hover:border-black cursor-pointer transition-all overflow-hidden group"
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
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center shrink-0 group-hover:bg-gray-300 transition-colors">
                    <Camera size={20} className="text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="text-xs font-black">{photo ? '사진 변경하기' : '프로필 사진 추가'}</p>
                  <p className="text-[10px] text-gray-400">선택사항</p>
                </div>
              </div>

              {/* 페이지 주소 + 계정 정보 */}
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-2">페이지 주소</p>
                  <div className="flex items-center gap-0 border border-gray-200 rounded-2xl bg-gray-50 focus-within:border-black transition-colors overflow-hidden">
                    <span className="text-[11px] font-bold text-gray-300 pl-4 shrink-0">monopage.kr/</span>
                    <input
                      type="text"
                      placeholder="내사용자명"
                      className="bg-transparent outline-none font-black text-sm flex-1 py-4 pr-4"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-2">저장할 이메일</p>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full p-4 border border-gray-200 rounded-2xl bg-gray-50 outline-none font-bold text-sm focus:border-black transition-colors"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-2">비밀번호</p>
                  <input
                    type="password"
                    placeholder="6자 이상"
                    className="w-full p-4 border border-gray-200 rounded-2xl bg-gray-50 outline-none font-bold text-sm focus:border-black transition-colors"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

              {/* CTA */}
              <button
                onClick={handleCreate}
                className="w-full py-5 bg-black text-white rounded-full font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <Sparkles size={18} />
                {links.length > 0 ? `페이지 만들기` : '내 페이지 만들기'}
              </button>

              <p className="text-[10px] text-gray-300 text-center font-medium">
                링크는 나중에 어드민에서 추가/수정할 수 있어요
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
