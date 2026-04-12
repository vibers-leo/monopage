'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Sparkles, ArrowRight, Loader2, X, User, Plus, Trash2, Link as LinkIcon } from 'lucide-react';
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
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [links, setLinks] = useState<DetectedLink[]>([]);
  const [linkInput, setLinkInput] = useState('');

  // 랜딩에서 입력한 draft 링크 불러오기
  useEffect(() => {
    try {
      const draft = sessionStorage.getItem('monopage_draft_links');
      if (draft) {
        setLinks(JSON.parse(draft));
        sessionStorage.removeItem('monopage_draft_links');
      }
    } catch { /* ignore */ }
  }, []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhoto(URL.createObjectURL(file));
  };

  const handleNext = () => {
    if (!form.username.trim()) { setError('사용자명을 입력해주세요'); return; }
    if (!form.email.trim()) { setError('이메일을 입력해주세요'); return; }
    if (form.password.length < 6) { setError('비밀번호는 6자 이상이어야 해요'); return; }
    setError(null);
    setStep(2);
  };

  const addSingleLink = (raw: string) => {
    if (!raw.trim()) return false;
    const detected = detectLink(raw.trim());
    if (links.some(l => l.url === detected.url)) return false;
    return detected;
  };

  const handleAddLink = () => {
    if (!linkInput.trim()) return;
    const detected = addSingleLink(linkInput);
    if (!detected) {
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
    if (lines.length <= 1) return; // 한 줄이면 기본 동작
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

  const startMagic = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      // 1. 회원가입
      const res = await signup(form.email, form.password, form.username);
      setToken(res.token);

      // 2. 사진 업로드 (실패해도 계속 진행)
      if (photoFile) {
        try {
          const avatarUrl = await uploadPhoto(photoFile);
          await updateProfile({ avatar_url: avatarUrl });
        } catch { /* 사진 업로드 실패 시 스킵 */ }
      }

      // 3. 링크 저장
      for (const link of links) {
        const title = link.handle ? `${link.label} @${link.handle}` : link.label;
        await createLink(title, link.url);
      }

      router.push('/admin');
    } catch (e: any) {
      setIsGenerating(false);
      setError(e.message || '가입 중 오류가 발생했어요');
    }
  };

  const snsLinks = links.filter(l => isSnsLink(l.type));
  const otherLinks = links.filter(l => !isSnsLink(l.type));
  const hasNaverPlace = links.some(l => l.type === 'naver_place');

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full">
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6 text-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-black/5 animate-ping rounded-full"></div>
                <Loader2 className="w-12 h-12 animate-spin text-black" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-widest mb-2">Magic in progress</h2>
                <p className="text-gray-400 text-sm font-medium">
                  {links.length > 0
                    ? `${links.length}개 링크로 페이지를 만들고 있어요...`
                    : '계정을 만들고 있어요...'}
                </p>
              </div>
            </motion.div>

          ) : step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2">
                <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Step 01</div>
                <h1 className="text-4xl font-black tracking-tightest">나만의 페이지를<br />만들어볼게요.</h1>
              </div>

              {/* 프로필 사진 */}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="bw-border h-48 rounded-[32px] flex flex-col items-center justify-center gap-3 bg-gray-50 border-dashed hover:border-black cursor-pointer transition-all overflow-hidden group relative"
              >
                {photo ? (
                  <>
                    <img src={photo} className="w-full h-full object-cover" alt="Preview" />
                    <button
                      onClick={(e) => { e.stopPropagation(); setPhoto(null); setPhotoFile(null); }}
                      className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-gray-200 group-hover:text-black transition-colors" />
                    <span className="text-xs font-bold text-gray-400">프로필 사진 올리기</span>
                    <span className="text-[10px] text-gray-300">선택사항 — 나중에 설정 가능</span>
                  </>
                )}
              </div>

              {/* 계정 정보 */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 p-4 bw-border rounded-2xl bg-gray-50 focus-within:border-black transition-colors">
                  <span className="text-gray-300 font-black text-sm">@</span>
                  <input
                    type="text"
                    placeholder="사용자명 (영문, 숫자, _)"
                    className="bg-transparent outline-none font-bold text-sm flex-1"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                  />
                </div>
                <div className="flex items-center gap-3 p-4 bw-border rounded-2xl bg-gray-50 focus-within:border-black transition-colors">
                  <User size={16} className="text-gray-300 shrink-0" />
                  <input
                    type="email"
                    placeholder="이메일"
                    className="bg-transparent outline-none font-bold text-sm flex-1"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-3 p-4 bw-border rounded-2xl bg-gray-50 focus-within:border-black transition-colors">
                  <span className="text-gray-300 text-xs font-black">PW</span>
                  <input
                    type="password"
                    placeholder="비밀번호 (6자 이상)"
                    className="bg-transparent outline-none font-bold text-sm flex-1"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

              <button
                onClick={handleNext}
                className="w-full py-5 bg-black text-white rounded-full font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                Next Step <ArrowRight size={18} />
              </button>
            </motion.div>

          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2">
                <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Step 02</div>
                <h1 className="text-4xl font-black tracking-tightest">링크를<br />붙여넣으세요.</h1>
                <p className="text-sm text-gray-400 font-medium">SNS, 홈페이지, 네이버 플레이스 — 무엇이든 OK</p>
              </div>

              {/* 링크 입력 */}
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-3 p-4 bw-border rounded-2xl bg-gray-50 focus-within:border-black transition-colors">
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

              {/* 추가된 링크 목록 */}
              {links.length > 0 && (
                <div className="flex flex-col gap-2">
                  {links.map((link, index) => (
                    <motion.div
                      key={`${link.url}-${index}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl group"
                    >
                      <span className="text-lg shrink-0">{getLinkIcon(link.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black truncate">{link.handle ? `@${link.handle}` : link.label}</p>
                        <p className="text-[10px] text-gray-400 truncate">{link.url}</p>
                      </div>
                      {isSnsLink(link.type) && (
                        <span className="text-[9px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-full shrink-0">SNS</span>
                      )}
                      {link.type === 'naver_place' && (
                        <span className="text-[9px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-full shrink-0">플레이스</span>
                      )}
                      {link.type === 'website' && (
                        <span className="text-[9px] font-black text-gray-500 bg-gray-100 px-2 py-1 rounded-full shrink-0">웹사이트</span>
                      )}
                      <button
                        onClick={() => handleRemoveLink(index)}
                        className="text-gray-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* SNS 감지 안내 */}
              {snsLinks.length > 0 && (
                <div className="p-3 bg-blue-50 rounded-2xl">
                  <p className="text-[10px] font-bold text-blue-600">
                    SNS {snsLinks.length}개 감지됨 — 가입 후 어드민에서 피드를 자동 연동할 수 있어요
                  </p>
                </div>
              )}

              {/* 네이버 플레이스 감지 안내 */}
              {hasNaverPlace && (
                <div className="p-3 bg-green-50 rounded-2xl">
                  <p className="text-[10px] font-bold text-green-600">
                    네이버 플레이스 감지됨 — 업체 정보가 페이지에 자동으로 표시돼요
                  </p>
                </div>
              )}

              {/* 링크 없이도 진행 가능 안내 */}
              {links.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-4">
                  <p className="text-[10px] text-gray-300 font-medium">링크는 나중에 추가할 수도 있어요</p>
                </div>
              )}

              {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="py-5 px-6 border border-gray-200 rounded-full font-black text-sm hover:border-black transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={startMagic}
                  className="flex-1 py-5 bg-black text-white rounded-full font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <Sparkles size={18} />
                  {links.length > 0 ? `${links.length}개 링크로 페이지 만들기` : 'Generate My Page'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
