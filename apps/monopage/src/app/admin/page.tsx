'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

import { ProfileHeader } from '@/components/ProfileHeader';
import { LinkCard } from '@/components/LinkCard';
import { PortfolioGallery } from '@/components/PortfolioGallery';
import { SectionRenderer, DEFAULT_SECTIONS, type Section } from '@/components/SectionRenderer';
import { ToastContainer, useToast } from '@/components/Toast';
import {
  Plus, Save, Link as LinkIcon, ArrowRight,
  ChevronLeft, Trash2, GripVertical, Check, X, Loader2, LogOut, Camera,
  Shield, AlertTriangle, Unlink, Image, User, Settings, Eye, EyeOff, BarChart3, MousePointerClick,
  Layout, Type, ChevronUp, ChevronDown, Palette,
} from 'lucide-react';
import { THEMES, type ThemeKey } from '@/lib/themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  getMyProfile, updateProfile,
  getLinks, createLink, updateLink, deleteLink, reorderLinks,
  getPortfolioItems, createPortfolioItem, updatePortfolioItem, deletePortfolioItem, reorderPortfolioItems,
  changePassword, deleteAccount, getSocialConnections, disconnectSocial,
  getSocialAccounts, deleteSocialAccount,
  getAnalytics,
  clearToken, getToken,
} from '@/lib/api';

interface LinkItem { id: number; title: string; url: string; }
interface ProfileData { username: string; bio: string; avatar_url: string; email?: string; }
interface PortfolioItemData { id: number; image_url: string; title: string; description: string; category: string; }

const SUPER_ADMINS = [
  'juuuno@naver.com',
  'juuuno1116@gmail.com',
  'designd@designd.co.kr',
  'designdlab@designdlab.co.kr',
  'vibers.leo@gmail.com',
];

type Tab = 'profile' | 'links' | 'portfolio' | 'layout' | 'analytics' | 'settings';

interface AnalyticsData {
  total_views: number;
  today_views: number;
  total_clicks: number;
  daily: Record<string, number>;
  link_clicks: { link_id: number; clicks: number; title: string }[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const { toasts, addToast, dismiss } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [profile, setProfile] = useState<ProfileData>({ username: '', bio: '', avatar_url: '' });
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const [editingLink, setEditingLink] = useState<number | null>(null);
  const [newLink, setNewLink] = useState<{ title: string; url: string } | null>(null);
  const [editingPortfolio, setEditingPortfolio] = useState<number | null>(null);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [panelWidth, setPanelWidth] = useState(380);
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startW = useRef(0);
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [socialAccounts, setSocialAccounts] = useState<{ id: number; provider: string; uid: string; metadata: any }[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS);
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>('minimal');

  // account section
  const [connections, setConnections] = useState<{ provider: string | null; uid: string | null; has_password: boolean; email: string | null } | null>(null);
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [showPageMenu, setShowPageMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  const loadData = useCallback(async () => {
    if (!getToken()) { router.push('/login'); return; }
    try {
      const [p, l, pi, c, sa] = await Promise.all([getMyProfile(), getLinks(), getPortfolioItems(), getSocialConnections(), getSocialAccounts().catch(() => [])]);
      setSocialAccounts(sa as any);
      setProfile({ username: p.username || '', bio: p.bio || '', avatar_url: p.avatar_url || '', email: p.email || '' });
      setSections(p.theme_config?.sections || DEFAULT_SECTIONS);
      setSelectedTheme((p.theme_config?.theme as ThemeKey) || 'minimal');
      setLinks(l);
      setPortfolioItems(pi);
      setConnections(c);
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { loadData(); }, [loadData]);

  // Instagram 연결 결과 토스트
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const igResult = params.get('instagram');
    if (igResult === 'success') {
      addToast('instagram', `Instagram @${params.get('username') || ''} 연결 완료!`);
      window.history.replaceState({}, '', '/admin');
    } else if (igResult === 'error') {
      addToast('error', 'Instagram 연결에 실패했어요. 다시 시도해볼게요.');
      window.history.replaceState({}, '', '/admin');
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'analytics' && !analytics) {
      setAnalyticsLoading(true);
      getAnalytics().then(setAnalytics).catch(() => {}).finally(() => setAnalyticsLoading(false));
    }
  }, [activeTab, analytics]);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateProfile({ bio: profile.bio, username: profile.username, avatar_url: profile.avatar_url, theme_config: { sections, theme: selectedTheme } });
      setSaved(true);
      setTimeout(() => { setSaved(false); setView('list'); }, 1500);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  // --- Link handlers ---
  const handleAddLink = async () => {
    if (!newLink?.title || !newLink?.url) return;
    try {
      const url = newLink.url.startsWith('http') ? newLink.url : `https://${newLink.url}`;
      const created = await createLink(newLink.title, url);
      setLinks([...links, created]);
      setNewLink(null);
    } catch (e: any) { setError(e.message); }
  };

  const handleUpdateLink = async (id: number) => {
    const link = links.find(l => l.id === id);
    if (!link) return;
    try {
      await updateLink(id, { title: link.title, url: link.url });
      setEditingLink(null);
    } catch (e: any) { setError(e.message); }
  };

  const handleDeleteLink = async (id: number) => {
    try {
      await deleteLink(id);
      setLinks(links.filter(l => l.id !== id));
      if (editingLink === id) setEditingLink(null);
    } catch (e: any) { setError(e.message); }
  };

  const patchLink = (id: number, field: 'title' | 'url', value: string) => {
    setLinks(links.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  // --- Avatar handler ---
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData, headers: { Authorization: `Bearer ${getToken() || ''}` } });
      if (!res.ok) throw new Error('올리지 못했어요');
      const { url } = await res.json();
      await updateProfile({ avatar_url: url });
      setProfile(p => ({ ...p, avatar_url: url }));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // --- Portfolio handlers ---
  const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPortfolio(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData, headers: { Authorization: `Bearer ${getToken() || ''}` } });
      if (!res.ok) throw new Error('올리지 못했어요');
      const { url } = await res.json();
      const item = await createPortfolioItem({ image_url: url });
      setPortfolioItems([...portfolioItems, item]);
      setEditingPortfolio(item.id);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploadingPortfolio(false);
      if (portfolioInputRef.current) portfolioInputRef.current.value = '';
    }
  };

  const handleUpdatePortfolio = async (id: number) => {
    const item = portfolioItems.find(i => i.id === id);
    if (!item) return;
    try {
      await updatePortfolioItem(id, { title: item.title, description: item.description });
      setEditingPortfolio(null);
    } catch (e: any) { setError(e.message); }
  };

  const handleDeletePortfolio = async (id: number) => {
    try {
      await deletePortfolioItem(id);
      setPortfolioItems(portfolioItems.filter(i => i.id !== id));
      if (editingPortfolio === id) setEditingPortfolio(null);
    } catch (e: any) { setError(e.message); }
  };

  const patchPortfolio = (id: number, field: 'title' | 'description', value: string) => {
    setPortfolioItems(portfolioItems.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  // --- Drag reorder ---
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (index: number) => { dragItem.current = index; };
  const handleDragOver = (e: React.DragEvent, index: number) => { e.preventDefault(); dragOverItem.current = index; };

  const handleLinkDrop = async () => {
    if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) return;
    const reordered = [...links];
    const [moved] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOverItem.current, 0, moved);
    setLinks(reordered);
    dragItem.current = null;
    dragOverItem.current = null;
    try { await reorderLinks(reordered.map(l => l.id)); } catch { /* silent */ }
  };

  const handlePortfolioDrop = async () => {
    if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) return;
    const reordered = [...portfolioItems];
    const [moved] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOverItem.current, 0, moved);
    setPortfolioItems(reordered);
    dragItem.current = null;
    dragOverItem.current = null;
    try { await reorderPortfolioItems(reordered.map(i => i.id)); } catch { /* silent */ }
  };

  const logout = () => { clearToken(); router.push('/'); };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
    </div>
  );

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'profile', label: 'Profile', icon: <User size={14} /> },
    { key: 'links', label: 'Links', icon: <LinkIcon size={14} /> },
    { key: 'portfolio', label: 'Portfolio', icon: <Image size={14} /> },
    { key: 'layout', label: 'Layout', icon: <Layout size={14} /> },
    { key: 'analytics', label: 'Stats', icon: <BarChart3 size={14} /> },
    { key: 'settings', label: 'Settings', icon: <Settings size={14} /> },
  ];

  const onResizeStart = (e: React.MouseEvent) => {
    isResizing.current = true;
    startX.current = e.clientX;
    startW.current = panelWidth;
    const onMove = (ev: MouseEvent) => {
      if (!isResizing.current) return;
      const delta = ev.clientX - startX.current;
      setPanelWidth(Math.max(280, Math.min(600, startW.current + delta)));
    };
    const onUp = () => { isResizing.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div className="flex h-screen bg-white text-[#0a0a0a] overflow-hidden">
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      {/* 후원 모달 */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setShowSupportModal(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center" onClick={e => e.stopPropagation()}>
            <div className="text-4xl mb-4">☕</div>
            <h2 className="text-xl font-black mb-2">추가 페이지 개설</h2>
            <p className="text-sm text-gray-400 font-medium mb-6 leading-relaxed">
              현재 오픈 베타 기간으로 1인 1페이지만 지원돼요.<br />
              후원해주시면 추가 페이지 개설 권한을 드릴게요!
            </p>
            <a
              href="https://buymeacoffee.com/vibers"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 bg-[#FFDD00] rounded-full font-black text-sm mb-3 hover:scale-[1.02] active:scale-95 transition-all"
            >
              ☕ Buy Me a Coffee
            </a>
            <p className="text-[14px] text-gray-300 font-medium">후원 후 vibers@vibers.co.kr 로 문의해주시면 돼요</p>
            <button onClick={() => setShowSupportModal(false)} className="mt-4 text-xs text-gray-300 hover:text-black transition-colors">닫기</button>
          </div>
        </div>
      )}

      {/* Left Panel — 목록 or 에디터 */}
      <aside
        className={`w-full border-r border-gray-100 flex flex-col bg-white z-10 relative ${showPreview ? 'hidden lg:flex' : 'flex'}`}
        style={{ width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? panelWidth : undefined }}
      >
        {/* Resize handle */}
        <div
          onMouseDown={onResizeStart}
          className="hidden lg:flex absolute right-0 top-0 bottom-0 w-1 cursor-col-resize items-center justify-center hover:bg-black/5 transition-colors z-50 group"
        >
          <div className="w-0.5 h-8 bg-gray-200 rounded-full group-hover:bg-gray-400 transition-colors" />
        </div>

        {/* ===== 목록 뷰 ===== */}
        {view === 'list' ? (
          <div className="flex flex-col h-full p-6 lg:p-8 animate-in fade-in duration-200">
            {/* 목록 헤더 */}
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="font-paperlogy font-extrabold text-[16px] tracking-tight text-[#0a0a0a]">Monopage</Link>
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(v => !v)}
                  className="flex items-center gap-2 text-[14px] font-bold text-gray-300 hover:text-black transition-colors"
                >
                  <span>monopage.kr/{profile.username}</span>
                  <ChevronDown size={12} />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-100 rounded-2xl shadow-lg py-2 z-50" onClick={() => setShowUserMenu(false)}>
                    {SUPER_ADMINS.includes(profile.email || '') && (
                      <Link href="/admin-console" className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold hover:bg-gray-50 transition-colors text-purple-600">
                        <Shield size={13} /> 관리자 콘솔
                      </Link>
                    )}
                    <button onClick={logout} className="flex items-center gap-2 w-full px-4 py-2.5 text-xs font-bold hover:bg-gray-50 transition-colors text-gray-500">
                      <LogOut size={13} /> 로그아웃
                    </button>
                  </div>
                )}
              </div>
            </div>

            <p className="text-[14px] font-black text-gray-300 uppercase tracking-[0.3em] mb-2">내 모노페이지</p>
            <h1 className="text-2xl font-black mb-6">페이지 목록</h1>

            <div className="flex flex-col gap-4 flex-1">
              {/* 내 페이지 카드 */}
              <div className="border border-gray-200 rounded-2xl p-5 relative group">
                {/* 우측 상단 메뉴 */}
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={() => setShowPageMenu(v => !v)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-black hover:bg-gray-100 transition-colors"
                  >
                    <Settings size={14} />
                  </button>
                  {showPageMenu && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50" onClick={() => setShowPageMenu(false)}>
                      <button
                        onClick={() => setView('editor')}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-[14px] font-medium hover:bg-gray-50 transition-colors"
                      >
                        <Settings size={13} /> 페이지 편집
                      </button>
                      <a
                        href={`/${profile.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-[14px] font-medium hover:bg-gray-50 transition-colors"
                      >
                        <Eye size={13} /> 페이지 보기
                      </a>
                      <div className="h-px bg-gray-100 my-1" />
                      <button
                        onClick={() => setShowResetConfirm(true)}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-[14px] font-medium text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={13} /> 페이지 초기화
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('editor')}>
                  <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden shrink-0">
                    {profile.avatar_url
                      ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" />
                      : <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-300">{(profile.username?.[0] || '?').toUpperCase()}</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                      <span className="text-[13px] font-semibold text-gray-400">Active</span>
                    </div>
                    <p className="font-bold text-[15px]">@{profile.username}</p>
                    <p className="text-[14px] text-gray-400 font-medium mt-0.5 truncate">{profile.bio || '소개가 없어요'}</p>
                  </div>
                  <ArrowRight size={16} className="text-gray-300 shrink-0" />
                </div>

                {/* 하단 빠른 액션 */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setView('editor')}
                    className="flex-1 py-2.5 bg-[#0a0a0a] text-white rounded-xl text-[14px] font-semibold hover:bg-[#262626] transition-colors"
                  >
                    편집하기
                  </button>
                  <a
                    href={`/${profile.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 border border-gray-200 rounded-xl text-[14px] font-semibold text-center hover:border-black transition-colors"
                  >
                    미리보기
                  </a>
                </div>
              </div>

              {/* + 추가 카드 */}
              <button
                onClick={() => setShowSupportModal(true)}
                className="border border-dashed border-gray-200 rounded-2xl p-5 flex items-center gap-4 hover:border-gray-400 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center group-hover:border-gray-400 transition-colors shrink-0">
                  <Plus size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>
                <div className="text-left">
                  <p className="text-[14px] font-semibold text-gray-400">새 페이지 추가하기</p>
                  <p className="text-[13px] text-gray-300 font-medium mt-0.5">후원 후 신청할 수 있어요</p>
                </div>
              </button>
            </div>

            {/* 페이지 초기화 확인 모달 */}
            {showResetConfirm && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => !resetting && setShowResetConfirm(false)}>
                <div className="bg-white rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center shrink-0">
                      <AlertTriangle size={18} className="text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold">페이지를 초기화할까요?</h3>
                      <p className="text-[14px] text-gray-400 mt-0.5">모든 링크, 프로필 사진, 소개글이 삭제돼요.</p>
                    </div>
                  </div>
                  <p className="text-[14px] text-red-500 font-medium mb-5">계정은 유지되고, 페이지 주소(@{profile.username})도 그대로예요.</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 py-3 border border-gray-200 rounded-xl text-[14px] font-semibold hover:border-black transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={async () => {
                        setResetting(true);
                        try {
                          // 모든 링크 삭제
                          for (const link of links) {
                            await deleteLink(link.id);
                          }
                          // 모든 포트폴리오 삭제
                          for (const item of portfolioItems) {
                            await deletePortfolioItem(item.id);
                          }
                          // 프로필 초기화
                          await updateProfile({ bio: '', avatar_url: '' });
                          // 상태 리셋
                          setLinks([]);
                          setPortfolioItems([]);
                          setProfile(p => ({ ...p, bio: '', avatar_url: '' }));
                          setShowResetConfirm(false);
                          addToast('success', '페이지를 초기화했어요');
                        } catch (e: any) {
                          setError(e.message);
                        } finally {
                          setResetting(false);
                        }
                      }}
                      disabled={resetting}
                      className="flex-1 py-3 bg-red-500 text-white rounded-xl text-[14px] font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-1.5"
                    >
                      {resetting ? <Loader2 size={14} className="animate-spin" /> : '초기화하기'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        ) : (
          /* ===== 에디터 뷰 ===== */
          <div className="flex flex-col h-full p-6 lg:p-8 animate-in fade-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setView('list')} className="flex items-center gap-1.5 text-gray-400 hover:text-black transition-colors text-xs font-bold">
            <ChevronLeft size={16} /> 목록
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowPreview(true)} className="text-gray-300 hover:text-black transition-colors lg:hidden">
              <Eye size={16} />
            </button>
            <button onClick={logout} className="text-gray-300 hover:text-black transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 p-1 bg-gray-50 rounded-2xl">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[14px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.key
                  ? 'bg-black text-white shadow-sm'
                  : 'text-gray-300 hover:text-black'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-8 flex-1 overflow-y-auto pb-4">
          {/* ===== PROFILE TAB ===== */}
          {activeTab === 'profile' && (
            <>
              <section>
                <label className="block text-[14px] font-black text-gray-300 uppercase mb-3 tracking-widest">Profile Photo</label>
                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                <div
                  onClick={() => avatarInputRef.current?.click()}
                  className="relative w-20 h-20 rounded-full border-2 border-dashed border-gray-200 hover:border-black transition-colors cursor-pointer overflow-hidden group"
                >
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center text-2xl font-black text-gray-200">
                      {profile.username?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {uploadingPhoto
                      ? <Loader2 size={18} className="text-white animate-spin" />
                      : <Camera size={18} className="text-white" />}
                  </div>
                </div>
              </section>

              <section>
                <label className="block text-[14px] font-black text-gray-300 uppercase mb-3 tracking-widest">내 페이지 주소</label>
                <div className="flex items-center border border-gray-100 rounded-2xl focus-within:border-black transition-colors overflow-hidden">
                  <span className="px-3 py-4 text-xs text-gray-300 font-bold bg-gray-50 border-r border-gray-100 shrink-0">monopage.kr/</span>
                  <input
                    value={profile.username}
                    onChange={(e) => {
                      const val = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
                      setProfile({ ...profile, username: val });
                    }}
                    className="flex-1 px-3 py-4 text-sm font-bold outline-none"
                    placeholder="your-handle"
                    maxLength={30}
                  />
                </div>
                <p className="text-[14px] text-gray-300 font-medium mt-1.5">영문, 숫자, -, _ 만 사용할 수 있어요</p>
              </section>

              <section>
                <label className="block text-[14px] font-black text-gray-300 uppercase mb-3 tracking-widest">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full min-h-[100px] p-4 text-sm font-medium border border-gray-100 rounded-2xl focus:border-black outline-none transition-colors resize-none leading-relaxed"
                  placeholder="Tell your story..."
                />
              </section>

              <section>
                <label className="block text-[14px] font-black text-gray-300 uppercase mb-3 tracking-widest">SNS 연결</label>
                <div className="flex flex-col gap-2">
                  {(() => {
                    const igAccount = socialAccounts.find(a => a.provider === 'instagram');
                    if (igAccount) {
                      return (
                        <div className="flex items-center gap-3 p-4 border border-pink-200 rounded-2xl bg-pink-50/50">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shrink-0">
                            <Camera size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black">Instagram 연결됨</p>
                            <p className="text-[14px] text-pink-500 font-bold">@{igAccount.metadata?.username || igAccount.uid}</p>
                          </div>
                          <button
                            onClick={async () => {
                              if (!confirm('Instagram 연결을 해제할까요?')) return;
                              await deleteSocialAccount(igAccount.id);
                              setSocialAccounts(sa => sa.filter(a => a.id !== igAccount.id));
                            }}
                            className="text-[14px] font-bold text-gray-300 hover:text-red-500 transition-colors"
                          >
                            해제
                          </button>
                        </div>
                      );
                    }
                    return (
                      <>
                        <a
                          href={`/api/instagram/login?token=${getToken() || ''}`}
                          className="flex items-center gap-3 p-4 border border-gray-100 rounded-2xl hover:border-pink-300 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shrink-0">
                            <Camera size={18} />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-black">Instagram 연결하기</p>
                            <p className="text-[14px] text-gray-400">게시물이 자동으로 페이지에 표시돼요</p>
                          </div>
                          <ArrowRight size={14} className="text-gray-300 group-hover:text-pink-400 transition-colors" />
                        </a>
                        <p className="text-[14px] text-gray-300 px-1">
                          Instagram 앱에서 "허용"을 누르면 최근 게시물 20개가 자동으로 동기화돼요.
                        </p>
                      </>
                    );
                  })()}
                </div>
              </section>
            </>
          )}

          {/* ===== LINKS TAB ===== */}
          {activeTab === 'links' && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <label className="text-[14px] font-black text-gray-300 uppercase tracking-widest">Links</label>
                <button
                  onClick={() => setNewLink({ title: '', url: '' })}
                  className="flex items-center gap-1 text-[14px] font-black text-black hover:opacity-50 transition-opacity uppercase tracking-widest"
                >
                  <Plus size={12} /> Add
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {links.map((link, index) => (
                  <div
                    key={link.id}
                    draggable={editingLink !== link.id}
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={handleLinkDrop}
                    className="transition-opacity"
                  >
                    {editingLink === link.id ? (
                      <div className="flex flex-col gap-2 p-3 border border-black rounded-2xl bg-gray-50">
                        <input
                          value={link.title}
                          onChange={(e) => patchLink(link.id, 'title', e.target.value)}
                          placeholder="링크 제목"
                          className="text-xs font-bold bg-white border border-gray-100 rounded-xl px-3 py-2 outline-none focus:border-black transition-colors"
                        />
                        <input
                          value={link.url}
                          onChange={(e) => patchLink(link.id, 'url', e.target.value)}
                          placeholder="https://..."
                          className="text-xs font-medium bg-white border border-gray-100 rounded-xl px-3 py-2 outline-none focus:border-black transition-colors"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleDeleteLink(link.id)}
                            className="flex items-center gap-1 text-[14px] font-black text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={10} /> 없애기
                          </button>
                          <button
                            onClick={() => handleUpdateLink(link.id)}
                            className="flex items-center gap-1 text-[14px] font-black text-black hover:opacity-50 transition-opacity"
                          >
                            <Check size={10} /> 완료했어요
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-4 border border-gray-50 rounded-xl bg-gray-50/50 group">
                        <div className="flex items-center gap-3 min-w-0">
                          <GripVertical size={14} className="text-gray-200 shrink-0" />
                          <LinkIcon size={14} className="text-gray-300 shrink-0" />
                          <span className="text-xs font-bold truncate">{link.title}</span>
                        </div>
                        <button
                          onClick={() => setEditingLink(link.id)}
                          className="text-gray-200 hover:text-black transition-colors opacity-0 group-hover:opacity-100 shrink-0 ml-2"
                        >
                          <Settings size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {newLink !== null && (
                  <div className="flex flex-col gap-2 p-3 border border-black rounded-2xl bg-gray-50">
                    <input
                      autoFocus
                      value={newLink.title}
                      onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                      placeholder="링크 제목"
                      className="text-xs font-bold bg-white border border-gray-100 rounded-xl px-3 py-2 outline-none focus:border-black transition-colors"
                    />
                    <input
                      value={newLink.url}
                      onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                      placeholder="https://..."
                      onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                      className="text-xs font-medium bg-white border border-gray-100 rounded-xl px-3 py-2 outline-none focus:border-black transition-colors"
                    />
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setNewLink(null)} className="flex items-center gap-1 text-[14px] font-black text-gray-400 hover:text-black transition-colors">
                        <X size={10} /> 취소
                      </button>
                      <button
                        onClick={handleAddLink}
                        disabled={!newLink.title || !newLink.url}
                        className="flex items-center gap-1 text-[14px] font-black text-black disabled:opacity-30 hover:opacity-50 transition-opacity"
                      >
                        <Check size={10} /> 추가
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ===== PORTFOLIO TAB ===== */}
          {activeTab === 'portfolio' && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <label className="text-[14px] font-black text-gray-300 uppercase tracking-widest">Portfolio</label>
                <button
                  onClick={() => portfolioInputRef.current?.click()}
                  disabled={uploadingPortfolio}
                  className="flex items-center gap-1 text-[14px] font-black text-black hover:opacity-50 transition-opacity uppercase tracking-widest disabled:opacity-30"
                >
                  {uploadingPortfolio ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} Add
                </button>
              </div>
              <input ref={portfolioInputRef} type="file" accept="image/*" className="hidden" onChange={handlePortfolioUpload} />

              {portfolioItems.length === 0 && (
                <div
                  onClick={() => portfolioInputRef.current?.click()}
                  className="w-full py-12 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center gap-3 cursor-pointer hover:border-black transition-colors"
                >
                  <Image size={24} className="text-gray-200" />
                  <p className="text-[14px] font-black text-gray-300 uppercase tracking-widest">이미지를 올려보세요</p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {portfolioItems.map((item, index) => (
                  <div
                    key={item.id}
                    draggable={editingPortfolio !== item.id}
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={handlePortfolioDrop}
                    className="transition-opacity"
                  >
                    {editingPortfolio === item.id ? (
                      <div className="flex flex-col gap-2 p-3 border border-black rounded-2xl bg-gray-50">
                        <div className="w-full h-32 rounded-xl overflow-hidden bg-gray-100">
                          <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                        <input
                          value={item.title || ''}
                          onChange={(e) => patchPortfolio(item.id, 'title', e.target.value)}
                          placeholder="제목 (선택)"
                          className="text-xs font-bold bg-white border border-gray-100 rounded-xl px-3 py-2 outline-none focus:border-black transition-colors"
                        />
                        <textarea
                          value={item.description || ''}
                          onChange={(e) => patchPortfolio(item.id, 'description', e.target.value)}
                          placeholder="설명 (선택)"
                          rows={2}
                          className="text-xs font-medium bg-white border border-gray-100 rounded-xl px-3 py-2 outline-none focus:border-black transition-colors resize-none"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleDeletePortfolio(item.id)}
                            className="flex items-center gap-1 text-[14px] font-black text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={10} /> 없애기
                          </button>
                          <button
                            onClick={() => handleUpdatePortfolio(item.id)}
                            className="flex items-center gap-1 text-[14px] font-black text-black hover:opacity-50 transition-opacity"
                          >
                            <Check size={10} /> 완료했어요
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 border border-gray-50 rounded-xl bg-gray-50/50 group">
                        <div className="flex items-center gap-3 min-w-0">
                          <GripVertical size={14} className="text-gray-200 shrink-0" />
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs font-bold truncate">{item.title || '제목 없음'}</span>
                        </div>
                        <button
                          onClick={() => setEditingPortfolio(item.id)}
                          className="text-gray-200 hover:text-black transition-colors opacity-0 group-hover:opacity-100 shrink-0 ml-2"
                        >
                          <Settings size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ===== LAYOUT TAB ===== */}
          {activeTab === 'layout' && (
            <section>
              {/* 테마 선택 */}
              <div className="mb-6">
                <label className="text-[14px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-1 mb-3">
                  <Palette size={10} /> 테마
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {Object.values(THEMES).map((theme) => (
                    <button
                      key={theme.key}
                      onClick={() => setSelectedTheme(theme.key)}
                      className="flex flex-col items-center gap-1.5 group"
                    >
                      <div
                        className="w-full aspect-square rounded-xl border-2 transition-all"
                        style={{
                          background: theme.preview,
                          borderColor: selectedTheme === theme.key ? '#000' : 'transparent',
                          boxShadow: selectedTheme === theme.key ? '0 0 0 1px #000' : 'none',
                        }}
                      >
                        {selectedTheme === theme.key && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                              <Check size={8} className="text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="text-[14px] font-bold text-gray-500 group-hover:text-black transition-colors">
                        {theme.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gray-100 mb-5" />

              <div className="flex justify-between items-center mb-4">
                <label className="text-[14px] font-black text-gray-300 uppercase tracking-widest">페이지 섹션</label>
                <div className="flex gap-1">
                  {[
                    { type: 'text' as const, label: 'Text', icon: <Type size={10} /> },
                    { type: 'sns_icons' as const, label: 'SNS', icon: <Camera size={10} /> },
                  ].filter(b => !sections.some(s => s.type === b.type && b.type === 'sns_icons')).map(block => (
                    <button
                      key={block.type}
                      onClick={() => {
                        const id = `${block.type}_${Date.now()}`;
                        setSections([...sections, { id, type: block.type, order: sections.length, content: block.type === 'text' ? { text: '' } : {} }]);
                      }}
                      className="flex items-center gap-1 px-2 py-1 text-[14px] font-black text-gray-400 border border-gray-100 rounded-lg hover:border-black hover:text-black transition-colors"
                    >
                      {block.icon} {block.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                {[...sections].sort((a, b) => a.order - b.order).map((section, index) => (
                  <div key={section.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl group">
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => {
                          if (index === 0) return;
                          const sorted = [...sections].sort((a, b) => a.order - b.order);
                          const newSections = sorted.map((s, i) => ({ ...s, order: i }));
                          [newSections[index].order, newSections[index - 1].order] = [newSections[index - 1].order, newSections[index].order];
                          setSections(newSections);
                        }}
                        disabled={index === 0}
                        className="text-gray-300 hover:text-black disabled:opacity-20 transition-colors"
                      >
                        <ChevronUp size={10} />
                      </button>
                      <button
                        onClick={() => {
                          const sorted = [...sections].sort((a, b) => a.order - b.order);
                          if (index >= sorted.length - 1) return;
                          const newSections = sorted.map((s, i) => ({ ...s, order: i }));
                          [newSections[index].order, newSections[index + 1].order] = [newSections[index + 1].order, newSections[index].order];
                          setSections(newSections);
                        }}
                        disabled={index >= sections.length - 1}
                        className="text-gray-300 hover:text-black disabled:opacity-20 transition-colors"
                      >
                        <ChevronDown size={10} />
                      </button>
                    </div>
                    <span className="text-xs font-black flex-1 capitalize">
                      {section.type === 'header' ? '프로필 헤더' :
                       section.type === 'links' ? '링크' :
                       section.type === 'portfolio' ? '포트폴리오' :
                       section.type === 'sns_icons' ? 'SNS 아이콘' :
                       section.type === 'sns_feed' ? 'SNS 피드' :
                       section.type === 'text' ? '텍스트' : section.type}
                    </span>
                    {section.type === 'text' && (
                      <input
                        value={section.content?.text || ''}
                        onChange={(e) => setSections(sections.map(s => s.id === section.id ? { ...s, content: { text: e.target.value } } : s))}
                        placeholder="텍스트 입력..."
                        className="text-[14px] bg-white border border-gray-100 rounded-lg px-2 py-1 w-32 outline-none focus:border-black transition-colors"
                      />
                    )}
                    {!['header', 'links', 'portfolio'].includes(section.type) && (
                      <button
                        onClick={() => setSections(sections.filter(s => s.id !== section.id))}
                        className="text-gray-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={10} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-[14px] text-gray-300 mt-3 text-center">섹션 순서를 변경하면 퍼블릭 페이지에 반영돼요. 저장 버튼을 눌러주세요</p>
            </section>
          )}

          {/* ===== ANALYTICS TAB ===== */}
          {activeTab === 'analytics' && (
            <section>
              {analyticsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
                </div>
              ) : analytics ? (
                <div className="flex flex-col gap-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 bg-gray-50 rounded-2xl text-center">
                      <p className="text-2xl font-black">{analytics.total_views}</p>
                      <p className="text-[14px] font-black text-gray-400 uppercase tracking-widest mt-1">총 조회</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl text-center">
                      <p className="text-2xl font-black">{analytics.today_views}</p>
                      <p className="text-[14px] font-black text-gray-400 uppercase tracking-widest mt-1">오늘</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl text-center">
                      <p className="text-2xl font-black">{analytics.total_clicks}</p>
                      <p className="text-[14px] font-black text-gray-400 uppercase tracking-widest mt-1">클릭</p>
                    </div>
                  </div>

                  {/* Daily Chart (7 days) */}
                  <div>
                    <p className="text-[14px] font-black text-gray-300 uppercase tracking-widest mb-3">최근 7일</p>
                    <div className="flex items-end gap-1 h-24">
                      {(() => {
                        const days = [];
                        for (let i = 6; i >= 0; i--) {
                          const d = new Date();
                          d.setDate(d.getDate() - i);
                          const key = d.toISOString().split('T')[0];
                          days.push({ date: key, count: analytics.daily[key] || 0 });
                        }
                        const max = Math.max(...days.map(d => d.count), 1);
                        return days.map(day => (
                          <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                            <div
                              className="w-full bg-black rounded-t-lg transition-all"
                              style={{ height: `${(day.count / max) * 80}px`, minHeight: day.count > 0 ? '4px' : '1px' }}
                            ></div>
                            <span className="text-[8px] text-gray-400 font-bold">
                              {new Date(day.date).toLocaleDateString('ko', { weekday: 'narrow' })}
                            </span>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* Link Clicks Ranking */}
                  {analytics.link_clicks.length > 0 && (
                    <div>
                      <p className="text-[14px] font-black text-gray-300 uppercase tracking-widest mb-3">
                        <MousePointerClick size={10} className="inline mr-1" />
                        링크별 클릭
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {analytics.link_clicks.map((lc, i) => (
                          <div key={lc.link_id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <span className="text-xs font-black text-gray-300 w-5">{i + 1}</span>
                            <span className="text-xs font-bold flex-1 truncate">{lc.title || '(제목 없음)'}</span>
                            <span className="text-xs font-black">{lc.clicks}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analytics.total_views === 0 && analytics.total_clicks === 0 && (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-300 font-bold">아직 방문자가 없어요</p>
                      <p className="text-[14px] text-gray-200 mt-1">페이지를 공유하면 여기에 통계가 나타나요</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-8">통계를 불러오지 못했어요</p>
              )}
            </section>
          )}

          {/* ===== SETTINGS TAB ===== */}
          {activeTab === 'settings' && (
            <section>
              <label className="block text-[14px] font-black text-gray-300 uppercase mb-4 tracking-widest flex items-center gap-1.5">
                <Shield size={10} /> Account
              </label>

              {connections && (
                <div className="mb-4 p-3 bg-gray-50 rounded-2xl">
                  <p className="text-[14px] font-black text-gray-400 uppercase tracking-widest mb-2">소셜 로그인 연동</p>
                  {connections.provider ? (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold capitalize">
                        {connections.provider === 'kakao' ? '카카오' : connections.provider === 'naver' ? '네이버' : '구글'} 연동됨
                      </span>
                      {connections.has_password && (
                        <button
                          onClick={async () => {
                            if (!confirm('소셜 연동을 해제할까요?')) return;
                            setDisconnecting(true);
                            try {
                              await disconnectSocial();
                              setConnections({ ...connections, provider: null, uid: null });
                            } catch (e: any) { setError(e.message); }
                            finally { setDisconnecting(false); }
                          }}
                          disabled={disconnecting}
                          className="flex items-center gap-1 text-[14px] font-black text-red-400 hover:text-red-600 transition-colors"
                        >
                          {disconnecting ? <Loader2 size={10} className="animate-spin" /> : <Unlink size={10} />} 해제
                        </button>
                      )}
                      {!connections.has_password && (
                        <span className="text-[14px] text-gray-400">(비밀번호를 설정하면 해제할 수 있어요)</span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <p className="text-xs text-gray-400">연동된 소셜 계정이 없어요</p>
                      <div className="flex gap-2 flex-wrap">
                        {[
                          { provider: 'kakao', label: '카카오', url: `https://kauth.kakao.com/oauth/authorize?client_id=3a4930ab39652ad5f387496697bf66ba&redirect_uri=${encodeURIComponent('https://monopage.kr/auth/kakao/callback')}&response_type=code` },
                          { provider: 'google', label: '구글', url: `https://accounts.google.com/o/oauth2/v2/auth?client_id=534035148832-6b2lf74coj33s9m9cmdh509tktcaa7fn.apps.googleusercontent.com&redirect_uri=${encodeURIComponent('https://monopage.kr/auth/google/callback')}&response_type=code&scope=openid%20email%20profile` },
                        ].map(s => (
                          <a key={s.provider} href={s.url} className="px-3 py-1.5 border border-gray-200 rounded-xl text-[14px] font-black hover:border-black transition-colors">
                            {s.label}로 연동하기
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {connections && (connections.has_password || !connections.provider) && (
                <div className="mb-4">
                  <p className="text-[14px] font-black text-gray-400 uppercase tracking-widest mb-2">비밀번호 변경</p>
                  <div className="flex flex-col gap-2">
                    <input
                      type="password"
                      placeholder="현재 비밀번호"
                      value={pwForm.current}
                      onChange={e => setPwForm({ ...pwForm, current: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs font-medium border border-gray-100 rounded-xl outline-none focus:border-black transition-colors"
                    />
                    <input
                      type="password"
                      placeholder="새 비밀번호 (6자 이상)"
                      value={pwForm.next}
                      onChange={e => setPwForm({ ...pwForm, next: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs font-medium border border-gray-100 rounded-xl outline-none focus:border-black transition-colors"
                    />
                    <input
                      type="password"
                      placeholder="새 비밀번호 확인해요"
                      value={pwForm.confirm}
                      onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs font-medium border border-gray-100 rounded-xl outline-none focus:border-black transition-colors"
                    />
                    {pwMsg && <p className={`text-[14px] font-bold ${pwMsg.includes('변경') ? 'text-green-500' : 'text-red-500'}`}>{pwMsg}</p>}
                    <button
                      onClick={async () => {
                        if (pwForm.next !== pwForm.confirm) { setPwMsg('새 비밀번호가 일치하지 않아요'); return; }
                        setPwSaving(true); setPwMsg(null);
                        try {
                          await changePassword(pwForm.current, pwForm.next);
                          setPwMsg('비밀번호가 변경됐어요');
                          setPwForm({ current: '', next: '', confirm: '' });
                        } catch (e: any) { setPwMsg(e.message); }
                        finally { setPwSaving(false); }
                      }}
                      disabled={pwSaving || !pwForm.current || !pwForm.next || !pwForm.confirm}
                      className="w-full py-2.5 bg-black text-white text-[14px] font-black uppercase tracking-widest rounded-xl disabled:opacity-30 flex items-center justify-center gap-1"
                    >
                      {pwSaving ? <Loader2 size={10} className="animate-spin" /> : '변경하기'}
                    </button>
                  </div>
                </div>
              )}

              <div>
                <p className="text-[14px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <AlertTriangle size={10} /> 위험 구역
                </p>
                {!deleteConfirm ? (
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="w-full py-2.5 border border-red-200 text-red-400 text-[14px] font-black uppercase tracking-widest rounded-xl hover:border-red-400 hover:text-red-600 transition-colors"
                  >
                    회원 탈퇴
                  </button>
                ) : (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-xs font-bold text-red-600 mb-3">정말 탈퇴하시겠어요? 페이지·링크·모든 데이터가 삭제되고 복구할 수 없어요.</p>
                    <div className="flex gap-2">
                      <button onClick={() => setDeleteConfirm(false)} className="flex-1 py-2 border border-gray-200 text-[14px] font-black rounded-xl hover:border-black transition-colors">취소</button>
                      <button
                        onClick={async () => {
                          setDeleting(true);
                          try {
                            await deleteAccount();
                            clearToken();
                            router.push('/');
                          } catch (e: any) { setError(e.message); setDeleting(false); }
                        }}
                        disabled={deleting}
                        className="flex-1 py-2 bg-red-500 text-white text-[14px] font-black rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
                      >
                        {deleting ? <Loader2 size={10} className="animate-spin" /> : '탈퇴 확인'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {error && <p className="text-red-500 text-xs font-bold text-center mb-3">{error}</p>}

        <div className="pt-4 border-t border-gray-50 flex gap-3">
          <Link
            href={`/${profile.username}`}
            target="_blank"
            className="px-5 py-4 border border-gray-200 rounded-full text-xs font-black uppercase tracking-widest hover:border-black transition-colors"
          >
            미리보기
          </Link>
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 py-4 bg-black text-white rounded-full text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <><Check size={14} /> 저장 완료!</> : <><Save size={14} /> 저장하기</>}
          </button>
        </div>
          </div>
        )}
      </aside>

      {/* Live Preview */}
      <main className={`flex-1 bg-gray-50 flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto ${showPreview ? 'flex' : 'hidden lg:flex'}`}>
        {/* Mobile: back button */}
        {showPreview && (
          <button
            onClick={() => setShowPreview(false)}
            className="lg:hidden self-start mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
          >
            <EyeOff size={14} /> 에디터로 돌아가기
          </button>
        )}

        {/* 목록 뷰일 때 — 페이지 선택 안내 + 바로가기 */}
        {view === 'list' && (
          <div className="text-center mb-8">
            <p className="text-xs font-bold text-gray-300 mb-3">왼쪽에서 페이지를 선택하면 편집할 수 있어요</p>
            <a
              href={`/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-xs font-black hover:border-black transition-colors"
            >
              <Eye size={12} /> monopage.kr/{profile.username}
            </a>
          </div>
        )}
        <div className="w-[320px] max-w-full h-[620px] lg:h-[680px] border-[7px] border-black rounded-[44px] shadow-2xl relative overflow-hidden"
          style={{ backgroundColor: THEMES[selectedTheme].vars.bg }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-b-2xl z-20"></div>
          <div className="h-full overflow-y-auto scrollbar-hide">
          <div className="px-5 py-16 flex flex-col items-center">
            <div className="inline-block px-3 py-1 bg-black text-white rounded-full text-[8px] font-black uppercase tracking-widest mb-10">
              Live Preview
            </div>
            <SectionRenderer
              sections={sections}
              profile={{ ...profile, id: 0 }}
              links={links}
              portfolioItems={portfolioItems}
              posts={[]}
              theme={THEMES[selectedTheme]}
            />
            <div className="mt-10 opacity-20 text-[7px] font-black uppercase tracking-widest text-center"
              style={{ color: THEMES[selectedTheme].vars.textMuted }}>
              Preview Mode
            </div>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
}
