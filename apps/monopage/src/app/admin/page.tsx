'use client';

import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';

import { ProfileHeader } from '@/components/ProfileHeader';
import { AdminGuideChat } from '@/components/AdminGuideChat';
import { LinkCard } from '@/components/LinkCard';
import { PortfolioGallery } from '@/components/PortfolioGallery';
import { SectionRenderer, DEFAULT_SECTIONS, type Section } from '@/components/SectionRenderer';
import { ToastContainer, useToast } from '@/components/Toast';
import {
  Plus, Save, Link as LinkIcon, ArrowRight,
  ChevronLeft, Trash2, GripVertical, Check, X, Loader2, LogOut, Camera,
  Shield, AlertTriangle, Unlink, Image, User, Settings, Eye, EyeOff, BarChart3, MousePointerClick,
  Layout, Type, ChevronUp, ChevronDown, Palette, RefreshCw, Clock, ExternalLink, MessageCircle, Mail, Bell,
} from 'lucide-react';
import { THEMES, type ThemeKey } from '@/lib/themes';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  getMyProfile, updateProfile,
  getLinks, createLink, updateLink, deleteLink, reorderLinks,
  getPortfolioItems, createPortfolioItem, updatePortfolioItem, deletePortfolioItem, reorderPortfolioItems,
  changePassword, deleteAccount, getSocialConnections, disconnectSocial,
  getSocialAccounts, deleteSocialAccount,
  getAnalytics,
  getInquiries, getInquiryStats, updateInquiry, deleteInquiry,
  adminGetProfile, adminGetLinks, adminGetPortfolioItems, adminGetInquiries,
  getNotifications, markNotificationRead, markAllNotificationsRead,
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

type Tab = 'profile' | 'links' | 'portfolio' | 'sns' | 'layout' | 'inquiries' | 'analytics' | 'settings';

interface AnalyticsData {
  total_views: number;
  today_views: number;
  total_clicks: number;
  daily: Record<string, number>;
  link_clicks: { link_id: number; clicks: number; title: string }[];
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" /></div>}>
      <AdminDashboard />
    </Suspense>
  );
}

function AdminDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const managingUser = searchParams.get('user'); // 슈퍼어드민이 다른 유저 관리 시
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
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [inquiryStats, setInquiryStats] = useState<{ total: number; received: number; today: number } | null>(null);
  const [inquiryFilter, setInquiryFilter] = useState<string>('all');
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPageMenu, setShowPageMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  const loadData = useCallback(async () => {
    if (!getToken()) { router.push('/login'); return; }
    try {
      if (managingUser) {
        // 슈퍼어드민 모드: 다른 유저의 데이터 로드
        const [p, l, pi] = await Promise.all([
          adminGetProfile(managingUser),
          adminGetLinks(managingUser),
          adminGetPortfolioItems(managingUser),
        ]);
        setProfile({ username: p.username || '', bio: p.bio || '', avatar_url: p.avatar_url || '', email: p.user?.email || '', knowledge_md: p.knowledge_md || '' } as any);
        setSections(p.theme_config?.sections || DEFAULT_SECTIONS);
        setSelectedTheme((p.theme_config?.theme as ThemeKey) || 'minimal');
        setLinks(l);
        setPortfolioItems(pi);
        setConnections(null);
        setSocialAccounts([]);
      } else {
        const [p, l, pi, c, sa] = await Promise.all([getMyProfile(), getLinks(), getPortfolioItems(), getSocialConnections(), getSocialAccounts().catch(() => [])]);
        setSocialAccounts(sa as any);
        setProfile({ username: p.username || '', bio: p.bio || '', avatar_url: p.avatar_url || '', email: p.email || '', knowledge_md: p.knowledge_md || '' } as any);
        setSections(p.theme_config?.sections || DEFAULT_SECTIONS);
        setSelectedTheme((p.theme_config?.theme as ThemeKey) || 'minimal');
        setLinks(l);
        setPortfolioItems(pi);
        setConnections(c);
      }
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router, managingUser]);

  useEffect(() => { loadData(); }, [loadData]);

  // 알림 로드 + 30초마다 폴링
  useEffect(() => {
    if (!getToken() || managingUser) return;
    const load = () => getNotifications().then(d => { setNotifications(d.notifications); setUnreadCount(d.unread_count); }).catch(() => {});
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [managingUser]);

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

  useEffect(() => {
    if (activeTab === 'inquiries' && inquiries.length === 0) {
      setInquiriesLoading(true);
      Promise.all([getInquiries(), getInquiryStats()])
        .then(([inqs, stats]) => { setInquiries(inqs); setInquiryStats(stats); })
        .catch(() => {})
        .finally(() => setInquiriesLoading(false));
    }
  }, [activeTab]);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateProfile({ bio: profile.bio, username: profile.username, avatar_url: profile.avatar_url, knowledge_md: (profile as any).knowledge_md || '', theme_config: { sections, theme: selectedTheme } });
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

  const tabGroups: { group: string; tabs: { key: Tab; label: string; icon: React.ReactNode }[] }[] = [
    {
      group: '콘텐츠',
      tabs: [
        { key: 'profile', label: '프로필', icon: <User size={14} /> },
        { key: 'links', label: '링크', icon: <LinkIcon size={14} /> },
        { key: 'portfolio', label: '갤러리', icon: <Image size={14} /> },
        { key: 'sns', label: 'SNS', icon: <Camera size={14} /> },
      ],
    },
    {
      group: '설정',
      tabs: [
        { key: 'layout', label: '레이아웃', icon: <Layout size={14} /> },
        { key: 'settings', label: '설정', icon: <Settings size={14} /> },
      ],
    },
    {
      group: '관리',
      tabs: [
        { key: 'inquiries', label: '문의함', icon: <MessageCircle size={14} /> },
        { key: 'analytics', label: '통계', icon: <BarChart3 size={14} /> },
      ],
    },
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
    <div className="flex flex-col h-screen bg-white text-[#0a0a0a] overflow-hidden">
      {/* 슈퍼어드민 배너 */}
      {managingUser && (
        <div className="bg-purple-600 text-white px-4 py-2 flex items-center justify-between text-[14px] font-semibold shrink-0">
          <div className="flex items-center gap-2">
            <Shield size={14} />
            <span>슈퍼어드민 모드 — @{managingUser} 관리 중</span>
          </div>
          <div className="flex items-center gap-3">
            <a href={`/${managingUser}`} target="_blank" className="underline text-white/80 hover:text-white">페이지 보기</a>
            <button onClick={() => router.push('/admin')} className="underline text-white/80 hover:text-white">내 어드민으로</button>
          </div>
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
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
              <div className="flex items-center gap-3">
                {/* 알림 벨 */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(v => !v)}
                    className="relative p-2 text-gray-300 hover:text-black transition-colors"
                  >
                    <Bell size={16} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 max-h-80 overflow-y-auto" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <p className="text-[14px] font-bold">알림</p>
                        {unreadCount > 0 && (
                          <button
                            onClick={async () => { await markAllNotificationsRead(); setUnreadCount(0); setNotifications(n => n.map(x => ({ ...x, read: true }))); }}
                            className="text-[13px] text-purple-500 font-semibold hover:underline"
                          >모두 읽음</button>
                        )}
                      </div>
                      {notifications.length === 0 ? (
                        <p className="text-[14px] text-gray-300 text-center py-8">알림이 없어요</p>
                      ) : notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={async () => {
                            if (!n.read) { await markNotificationRead(n.id); setUnreadCount(c => Math.max(0, c - 1)); setNotifications(ns => ns.map(x => x.id === n.id ? { ...x, read: true } : x)); }
                            if (n.type_key === 'new_inquiry') setActiveTab('inquiries');
                            setShowNotifications(false);
                            if (view === 'list') setView('editor');
                          }}
                          className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 ${!n.read ? 'bg-blue-50/30' : ''}`}
                        >
                          <p className={`text-[14px] ${!n.read ? 'font-bold' : 'font-medium text-gray-500'}`}>{n.title}</p>
                          {n.body && <p className="text-[13px] text-gray-400 mt-0.5 truncate">{n.body}</p>}
                          <p className="text-[12px] text-gray-300 mt-1">{new Date(n.created_at).toLocaleDateString('ko', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(v => !v)}
                  className="flex items-center gap-2 text-[14px] font-bold text-gray-300 hover:text-black transition-colors"
                >
                  <span>monopage.kr/{profile.username}</span>
                  <ChevronDown size={12} />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-lg py-2 z-50" onClick={() => setShowUserMenu(false)}>
                    <a href={`/${profile.username}`} target="_blank" className="flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold hover:bg-gray-50 transition-colors text-gray-500">
                      <Eye size={13} /> 내 페이지 보기
                    </a>
                    {SUPER_ADMINS.includes(profile.email || '') && (
                      <>
                        <div className="h-px bg-gray-100 my-1" />
                        <Link href="/admin-console" className="flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold hover:bg-gray-50 transition-colors text-purple-600">
                          <Shield size={13} /> 관리자 대시보드
                        </Link>
                      </>
                    )}
                    <div className="h-px bg-gray-100 my-1" />
                    <button onClick={logout} className="flex items-center gap-2 w-full px-4 py-2.5 text-[14px] font-semibold hover:bg-gray-50 transition-colors text-gray-500">
                      <LogOut size={13} /> 로그아웃
                    </button>
                  </div>
                )}
              </div>
              </div>
            </div>

            <p className="text-[14px] font-black text-gray-300 uppercase tracking-[0.3em] mb-2">내 모노페이지</p>
            <h1 className="text-2xl font-black mb-6">페이지 목록</h1>

            <div className="flex flex-col gap-4 flex-1">
              {/* 내 페이지 카드 — 콘텐츠가 있을 때만 */}
              {(links.length > 0 || portfolioItems.length > 0 || profile.bio || profile.avatar_url) ? (
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
                        <Trash2 size={13} /> 페이지 삭제
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
              ) : (
              /* 빈 상태 — 페이지 삭제 후 */
              <div className="border border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-[#f5f5f5] rounded-full flex items-center justify-center text-2xl">✨</div>
                <div>
                  <p className="text-[16px] font-bold mb-1">페이지가 비어있어요</p>
                  <p className="text-[14px] text-gray-400">새로운 페이지를 만들어보세요</p>
                </div>
                <button
                  onClick={() => setView('editor')}
                  className="px-6 py-3 bg-[#0a0a0a] text-white rounded-full text-[15px] font-semibold hover:bg-[#262626] transition-colors"
                >
                  새로 시작하기
                </button>
              </div>
              )}

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

            {/* 페이지 삭제 확인 모달 */}
            {showResetConfirm && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => !resetting && setShowResetConfirm(false)}>
                <div className="bg-white rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
                  <div className="flex flex-col items-center text-center gap-4 mb-5">
                    <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
                      <Trash2 size={22} className="text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-[18px] font-bold mb-1">페이지를 삭제할까요?</h3>
                      <p className="text-[15px] text-gray-400 leading-relaxed">
                        모든 링크, 포트폴리오, 소개글이 삭제돼요.<br />
                        삭제 후 새로운 페이지를 다시 만들 수 있어요.
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl mb-5">
                    <p className="text-[14px] text-gray-500 text-center">
                      계정(@{profile.username})은 유지돼요
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 py-3.5 border border-gray-200 rounded-xl text-[15px] font-semibold hover:border-black transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={async () => {
                        setResetting(true);
                        setError(null);
                        try {
                          for (const link of links) {
                            try { await deleteLink(link.id); } catch { /* skip already deleted */ }
                          }
                          for (const item of portfolioItems) {
                            try { await deletePortfolioItem(item.id); } catch { /* skip */ }
                          }
                          await updateProfile({ bio: '', avatar_url: '', knowledge_md: '' } as any);
                          setLinks([]);
                          setPortfolioItems([]);
                          setProfile(p => ({ ...p, bio: '', avatar_url: '', knowledge_md: '' } as any));
                          setShowResetConfirm(false);
                          addToast('success', '페이지를 삭제했어요. 새로 시작해보세요!');
                        } catch (e: any) {
                          addToast('error', e.message || '삭제 중 문제가 생겼어요');
                        } finally {
                          setResetting(false);
                        }
                      }}
                      disabled={resetting}
                      className="flex-1 py-3.5 bg-red-500 text-white rounded-xl text-[15px] font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-1.5"
                    >
                      {resetting ? <Loader2 size={14} className="animate-spin" /> : '삭제하기'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        ) : (
          /* ===== 에디터 뷰 ===== */
          <div className="flex flex-col h-full p-6 lg:p-8 animate-in fade-in duration-200">
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setView('list')} className="flex items-center gap-1.5 text-gray-400 hover:text-black transition-colors text-[14px] font-medium">
            <ChevronLeft size={16} /> 목록
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowPreview(true)} className="text-gray-300 hover:text-black transition-colors lg:hidden">
              <Eye size={16} />
            </button>
          </div>
        </div>

        {/* 페이지 이름 + 3버튼 */}
        <div className="mb-5">
          <p className="text-[18px] font-bold mb-3">@{profile.username}</p>
          <div className="grid grid-cols-3 gap-2">
            <a
              href={`/${profile.username}`}
              target="_blank"
              className="flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 rounded-xl text-[14px] font-semibold hover:border-black transition-colors"
            >
              <ExternalLink size={14} /> 보기
            </a>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[14px] font-semibold transition-colors ${
                activeTab === 'analytics' ? 'bg-black text-white' : 'border border-gray-200 hover:border-black'
              }`}
            >
              <BarChart3 size={14} /> 통계
            </button>
            <button
              onClick={() => { if (activeTab === 'analytics') setActiveTab('profile'); }}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[14px] font-semibold transition-colors ${
                activeTab !== 'analytics' ? 'bg-black text-white' : 'border border-gray-200 hover:border-black'
              }`}
            >
              <Settings size={14} /> 관리
            </button>
          </div>
        </div>

        {/* 관리 모드일 때 탭 그룹 */}
        {activeTab !== 'analytics' && (
        <div className="flex flex-col gap-2 mb-5">
          {tabGroups.filter(g => g.group !== '관리').map(group => (
            <div key={group.group}>
              <p className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5 px-1">{group.group}</p>
              <div className="flex gap-1 p-0.5 bg-gray-50 rounded-xl">
                {group.tabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                      activeTab === tab.key
                        ? 'bg-black text-white shadow-sm'
                        : 'text-gray-400 hover:text-black'
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
          {/* 관리 그룹의 문의함 바로가기 */}
          <div className="flex gap-1 p-0.5 bg-gray-50 rounded-xl">
            <button onClick={() => setActiveTab('inquiries')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${activeTab === 'inquiries' ? 'bg-black text-white shadow-sm' : 'text-gray-400 hover:text-black'}`}>
              <MessageCircle size={14} /> <span className="hidden sm:inline">문의함</span>
            </button>
            <button onClick={() => setActiveTab('settings')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${activeTab === 'settings' ? 'bg-black text-white shadow-sm' : 'text-gray-400 hover:text-black'}`}>
              <Settings size={14} /> <span className="hidden sm:inline">설정</span>
            </button>
          </div>
        </div>
        )}

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
                <button
                  onClick={() => setActiveTab('sns')}
                  className="w-full flex items-center gap-3 p-4 border border-gray-100 rounded-2xl hover:border-gray-300 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shrink-0">
                    <Camera size={18} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[14px] font-bold">
                      {socialAccounts.find(a => a.provider === 'instagram')
                        ? `Instagram @${socialAccounts.find(a => a.provider === 'instagram')?.metadata?.username || '연결됨'}`
                        : 'SNS 연결 관리하기'}
                    </p>
                    <p className="text-[14px] text-gray-400 mt-0.5">SNS 탭에서 연동·피드·토큰을 관리할 수 있어요</p>
                  </div>
                  <ArrowRight size={14} className="text-gray-300 group-hover:text-black transition-colors" />
                </button>
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
                <div className="flex gap-2">
                  {/* Instagram에서 가져오기 */}
                  {socialAccounts.find(a => a.provider === 'instagram')?.metadata?.posts?.length > 0 && (
                    <button
                      onClick={async () => {
                        const igPosts = socialAccounts.find(a => a.provider === 'instagram')?.metadata?.posts || [];
                        const existingUrls = new Set(portfolioItems.map(i => i.image_url));
                        let added = 0;
                        for (const post of igPosts.slice(0, 9)) {
                          const url = post.media_url || post.image_url;
                          if (url && !existingUrls.has(url)) {
                            try {
                              const item = await createPortfolioItem({ image_url: url, title: post.caption?.slice(0, 50) || '', source: 'instagram' });
                              setPortfolioItems(prev => [...prev, item]);
                              added++;
                            } catch { /* skip */ }
                          }
                        }
                        if (added > 0) addToast('success', `Instagram에서 ${added}개 가져왔어요`);
                        else addToast('error', '새로 가져올 게시물이 없어요');
                      }}
                      className="flex items-center gap-1 text-[14px] font-bold text-pink-500 hover:text-pink-600 transition-colors"
                    >
                      <Camera size={12} /> IG 가져오기
                    </button>
                  )}
                  <button
                    onClick={() => portfolioInputRef.current?.click()}
                    disabled={uploadingPortfolio}
                    className="flex items-center gap-1 text-[14px] font-black text-black hover:opacity-50 transition-opacity uppercase tracking-widest disabled:opacity-30"
                  >
                    {uploadingPortfolio ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} Add
                  </button>
                </div>
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

              {/* 그리드 뷰 — 드래그 정렬 + 핀 고정 */}
              <div className="grid grid-cols-3 gap-2">
                {portfolioItems.map((item, index) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={handlePortfolioDrop}
                    className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group cursor-grab active:cursor-grabbing"
                  >
                    <img src={item.image_url} alt="" className="w-full h-full object-cover" />

                    {/* 핀 배지 */}
                    {(item as any).pinned && (
                      <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[10px]">📌</div>
                    )}

                    {/* 소스 배지 */}
                    {(item as any).source === 'instagram' && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-pink-500 text-white rounded-full flex items-center justify-center text-[10px]">📸</div>
                    )}

                    {/* 호버 오버레이 */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingPortfolio(item.id); }}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform"
                      >
                        <Settings size={12} />
                      </button>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          const newPinned = !(item as any).pinned;
                          await updatePortfolioItem(item.id, { pinned: newPinned });
                          setPortfolioItems(prev => prev.map(i => i.id === item.id ? { ...i, pinned: newPinned } : i));
                        }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform ${(item as any).pinned ? 'bg-yellow-400 text-black' : 'bg-white text-black'}`}
                      >
                        <span className="text-[10px]">📌</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeletePortfolio(item.id); }}
                        className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 편집 모달 */}
              {editingPortfolio && (() => {
                const item = portfolioItems.find(i => i.id === editingPortfolio);
                if (!item) return null;
                return (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditingPortfolio(null)}>
                    <div className="bg-white rounded-2xl max-w-sm w-full p-5 flex flex-col gap-3" onClick={e => e.stopPropagation()}>
                      <div className="w-full h-40 rounded-xl overflow-hidden bg-gray-100">
                        <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <input
                        value={item.title || ''}
                        onChange={(e) => patchPortfolio(item.id, 'title', e.target.value)}
                        placeholder="제목 (선택)"
                        className="text-[14px] font-semibold bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-black transition-colors"
                      />
                      <textarea
                        value={item.description || ''}
                        onChange={(e) => patchPortfolio(item.id, 'description', e.target.value)}
                        placeholder="설명 (선택)"
                        rows={2}
                        className="text-[14px] font-medium bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-black transition-colors resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeletePortfolio(item.id)}
                          className="flex-1 py-3 border border-red-200 text-red-500 rounded-xl text-[14px] font-semibold hover:bg-red-50 transition-colors"
                        >
                          삭제
                        </button>
                        <button
                          onClick={() => handleUpdatePortfolio(item.id)}
                          className="flex-1 py-3 bg-black text-white rounded-xl text-[14px] font-semibold hover:bg-gray-800 transition-colors"
                        >
                          저장
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <p className="text-[13px] text-gray-300 mt-3 text-center">드래그해서 순서를 바꿀 수 있어요. 📌 핀으로 위치를 고정할 수 있어요.</p>
            </section>
          )}

          {/* ===== SNS TAB ===== */}
          {activeTab === 'sns' && (
            <section className="flex flex-col gap-6">
              {/* Instagram 연동 상태 */}
              {(() => {
                const igAccount = socialAccounts.find(a => a.provider === 'instagram');
                const tokenExpiry = igAccount?.metadata?.token_expires_at;
                const expiresAt = tokenExpiry ? new Date(tokenExpiry) : null;
                const now = new Date();
                const daysLeft = expiresAt ? Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;
                const isExpiringSoon = daysLeft !== null && daysLeft <= 7;
                const isExpired = daysLeft !== null && daysLeft <= 0;

                return (
                  <div className="flex flex-col gap-4">
                    <label className="text-[14px] font-black text-gray-300 uppercase tracking-widest">Instagram</label>

                    {igAccount ? (
                      <>
                        {/* 연동 상태 카드 */}
                        <div className="p-5 border border-pink-200 rounded-2xl bg-pink-50/30">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shrink-0">
                              <Camera size={20} />
                            </div>
                            <div className="flex-1">
                              <p className="text-[15px] font-bold">@{igAccount.metadata?.username || igAccount.uid}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${isExpired ? 'bg-red-400' : isExpiringSoon ? 'bg-yellow-400' : 'bg-green-400'}`} />
                                <span className={`text-[14px] font-medium ${isExpired ? 'text-red-500' : isExpiringSoon ? 'text-yellow-600' : 'text-green-600'}`}>
                                  {isExpired ? '토큰 만료됨' : isExpiringSoon ? `${daysLeft}일 후 만료` : daysLeft ? `${daysLeft}일 남음` : '연결됨'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* 토큰 정보 */}
                          {expiresAt && (
                            <div className="flex items-center gap-2 p-3 bg-white rounded-xl mb-3">
                              <Clock size={14} className="text-gray-400 shrink-0" />
                              <div className="flex-1">
                                <p className="text-[14px] text-gray-500">토큰 만료일</p>
                                <p className="text-[14px] font-semibold">{expiresAt.toLocaleDateString('ko', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                              </div>
                              {(isExpiringSoon || isExpired) && (
                                <a
                                  href={`/api/instagram/login?token=${getToken() || ''}`}
                                  className="flex items-center gap-1.5 px-3 py-2 bg-pink-500 text-white rounded-lg text-[14px] font-semibold hover:bg-pink-600 transition-colors"
                                >
                                  <RefreshCw size={13} /> 갱신하기
                                </a>
                              )}
                            </div>
                          )}

                          {/* 액션 버튼 */}
                          <div className="flex gap-2">
                            <a
                              href={`/api/instagram/login?token=${getToken() || ''}`}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-pink-200 rounded-xl text-[14px] font-semibold text-pink-600 hover:bg-pink-50 transition-colors"
                            >
                              <RefreshCw size={13} /> 재연동하기
                            </a>
                            <button
                              onClick={async () => {
                                if (!confirm('Instagram 연결을 해제할까요?')) return;
                                await deleteSocialAccount(igAccount.id);
                                setSocialAccounts(sa => sa.filter(a => a.id !== igAccount.id));
                                addToast('success', 'Instagram 연결을 해제했어요');
                              }}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 rounded-xl text-[14px] font-semibold text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors"
                            >
                              <Unlink size={13} /> 연결 해제
                            </button>
                          </div>
                        </div>

                        {/* Instagram 피드 미리보기 */}
                        {igAccount.metadata?.posts && igAccount.metadata.posts.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <label className="text-[14px] font-black text-gray-300 uppercase tracking-widest">최근 게시물</label>
                              <span className="text-[14px] text-gray-400">{igAccount.metadata.posts.length}개</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                              {igAccount.metadata.posts.slice(0, 9).map((post: any, i: number) => (
                                <a
                                  key={i}
                                  href={post.permalink || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="aspect-square rounded-lg overflow-hidden bg-gray-100 hover:opacity-80 transition-opacity"
                                >
                                  {post.media_url || post.image_url ? (
                                    <img src={post.media_url || post.image_url} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                      <Camera size={16} />
                                    </div>
                                  )}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      /* 미연동 상태 — 간편 가져오기 + OAuth */
                      <div className="flex flex-col gap-4">
                        {/* 간편 가져오기 (SocialCrawl) */}
                        <div className="p-5 border border-gray-200 rounded-2xl">
                          <p className="text-[15px] font-bold mb-1">Instagram 게시물 가져오기</p>
                          <p className="text-[14px] text-gray-400 mb-4">username만 입력하면 공개 게시물을 바로 가져와요</p>
                          <div className="flex gap-2">
                            <div className="flex-1 flex items-center gap-2 px-4 py-3 border border-gray-100 rounded-xl focus-within:border-black transition-colors">
                              <span className="text-[14px] text-gray-300">@</span>
                              <input
                                type="text"
                                placeholder="instagram_username"
                                id="ig-handle-input"
                                className="flex-1 text-[14px] font-medium outline-none bg-transparent"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const btn = document.getElementById('ig-fetch-btn');
                                    btn?.click();
                                  }
                                }}
                              />
                            </div>
                            <button
                              id="ig-fetch-btn"
                              onClick={async () => {
                                const input = document.getElementById('ig-handle-input') as HTMLInputElement;
                                const handle = input?.value?.trim().replace('@', '');
                                if (!handle) return;
                                const btn = document.getElementById('ig-fetch-btn') as HTMLButtonElement;
                                btn.disabled = true;
                                btn.textContent = '...';
                                try {
                                  const res = await fetch('/api/social-fetch', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ platform: 'instagram', handle }),
                                  });
                                  const data = await res.json();
                                  if (data.error) { addToast('error', data.error); return; }
                                  // 포트폴리오에 추가
                                  let added = 0;
                                  const existingUrls = new Set(portfolioItems.map((i: any) => i.image_url));
                                  for (const post of data.posts.slice(0, 12)) {
                                    if (post.image_url && !existingUrls.has(post.image_url)) {
                                      try {
                                        const item = await createPortfolioItem({
                                          image_url: post.image_url,
                                          video_url: post.video_url || '',
                                          media_type: post.media_type || 'image',
                                          permalink: post.permalink || '',
                                          title: (post.caption || '').slice(0, 50),
                                          source: 'instagram',
                                        });
                                        setPortfolioItems(prev => [...prev, item]);
                                        added++;
                                      } catch { /* skip */ }
                                    }
                                  }
                                  addToast('success', `Instagram에서 ${added}개 게시물을 가져왔어요`);
                                } catch { addToast('error', '가져오기에 실패했어요'); }
                                finally { btn.disabled = false; btn.textContent = '가져오기'; }
                              }}
                              className="px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-[14px] font-semibold hover:opacity-90 transition-opacity"
                            >
                              가져오기
                            </button>
                          </div>
                        </div>

                        {/* OAuth 연동 (고급) */}
                        <details className="group">
                          <summary className="flex items-center gap-2 text-[14px] text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
                            <Camera size={14} /> Instagram 계정 연동 (고급)
                            <span className="text-[12px] text-gray-300 ml-auto">비공개 게시물, 자동 동기화</span>
                          </summary>
                          <div className="mt-3 p-4 bg-gray-50 rounded-xl">
                            <a
                              href={`/api/instagram/login?token=${getToken() || ''}`}
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-[14px] font-semibold hover:bg-gray-800 transition-colors"
                            >
                              <Camera size={14} /> OAuth로 연결하기
                            </a>
                            <p className="text-[13px] text-gray-400 mt-2">Instagram 앱에서 "허용"을 누르면 동기화돼요</p>
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Threads 가져오기 */}
              <div>
                <label className="text-[14px] font-black text-gray-300 uppercase tracking-widest mb-3 block">Threads</label>
                <div className="p-5 border border-gray-200 rounded-2xl">
                  <p className="text-[14px] text-gray-400 mb-3">username을 입력하면 Threads 게시물을 타임라인으로 표시해요</p>
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center gap-2 px-4 py-3 border border-gray-100 rounded-xl focus-within:border-black transition-colors">
                      <span className="text-[14px] text-gray-300">@</span>
                      <input
                        type="text"
                        placeholder="threads_username"
                        id="threads-handle-input"
                        className="flex-1 text-[14px] font-medium outline-none bg-transparent"
                        onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('threads-fetch-btn')?.click(); }}
                      />
                    </div>
                    <button
                      id="threads-fetch-btn"
                      onClick={async () => {
                        const input = document.getElementById('threads-handle-input') as HTMLInputElement;
                        const handle = input?.value?.trim().replace('@', '');
                        if (!handle) return;
                        const btn = document.getElementById('threads-fetch-btn') as HTMLButtonElement;
                        btn.disabled = true; btn.textContent = '...';
                        try {
                          const res = await fetch('/api/social-fetch', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ platform: 'threads', handle }),
                          });
                          const data = await res.json();
                          if (data.error) { addToast('error', data.error); return; }
                          // sns_timeline 섹션에 posts 저장
                          const existing = sections.find(s => s.type === 'sns_timeline');
                          if (existing) {
                            setSections(sections.map(s => s.id === existing.id ? { ...s, content: { ...s.content, posts: data.posts } } : s));
                          } else {
                            setSections([...sections, { id: 'sns_timeline_' + Date.now(), type: 'sns_timeline' as any, order: sections.length, content: { posts: data.posts, count: 5 } }]);
                          }
                          addToast('success', `Threads에서 ${data.total}개 게시물을 가져왔어요`);
                        } catch { addToast('error', '가져오기에 실패했어요'); }
                        finally { btn.disabled = false; btn.textContent = '가져오기'; }
                      }}
                      className="px-5 py-3 bg-black text-white rounded-xl text-[14px] font-semibold hover:bg-gray-800 transition-colors"
                    >
                      가져오기
                    </button>
                  </div>
                </div>
              </div>

              {/* 다른 SNS 가져오기 */}
              {[
                { platform: 'youtube', label: 'YouTube', fa: 'fa-brands fa-youtube', color: '#FF0000', placeholder: 'youtube_channel', target: 'portfolio' },
                { platform: 'tiktok', label: 'TikTok', fa: 'fa-brands fa-tiktok', color: '#010101', placeholder: 'tiktok_username', target: 'portfolio' },
                { platform: 'twitter', label: 'X (Twitter)', fa: 'fa-brands fa-x-twitter', color: '#000000', placeholder: 'twitter_handle', target: 'timeline' },
              ].map(sns => (
                <div key={sns.platform}>
                  <label className="text-[14px] font-black text-gray-300 uppercase tracking-widest mb-3 block">{sns.label}</label>
                  <div className="p-5 border border-gray-200 rounded-2xl">
                    <div className="flex gap-2">
                      <div className="flex-1 flex items-center gap-2 px-4 py-3 border border-gray-100 rounded-xl focus-within:border-black transition-colors">
                        <i className={`${sns.fa} text-[16px]`} style={{ color: sns.color }} />
                        <input
                          type="text"
                          placeholder={sns.placeholder}
                          id={`${sns.platform}-handle-input`}
                          className="flex-1 text-[14px] font-medium outline-none bg-transparent"
                          onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById(`${sns.platform}-fetch-btn`)?.click(); }}
                        />
                      </div>
                      <button
                        id={`${sns.platform}-fetch-btn`}
                        onClick={async () => {
                          const input = document.getElementById(`${sns.platform}-handle-input`) as HTMLInputElement;
                          const handle = input?.value?.trim().replace('@', '');
                          if (!handle) return;
                          const btn = document.getElementById(`${sns.platform}-fetch-btn`) as HTMLButtonElement;
                          btn.disabled = true; btn.textContent = '...';
                          try {
                            const res = await fetch('/api/social-fetch', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ platform: sns.platform, handle }),
                            });
                            const data = await res.json();
                            if (data.error) { addToast('error', data.error); return; }

                            if (sns.target === 'portfolio') {
                              // 포트폴리오에 추가 (YouTube/TikTok)
                              let added = 0;
                              const existingUrls = new Set(portfolioItems.map((i: any) => i.image_url));
                              for (const post of data.posts.slice(0, 9)) {
                                if (post.image_url && !existingUrls.has(post.image_url)) {
                                  try {
                                    const item = await createPortfolioItem({
                                      image_url: post.image_url,
                                      video_url: post.video_url || '',
                                      media_type: post.media_type || 'image',
                                      permalink: post.permalink || '',
                                      title: post.caption || '',
                                      source: sns.platform,
                                    });
                                    setPortfolioItems(prev => [...prev, item]);
                                    added++;
                                  } catch { /* skip */ }
                                }
                              }
                              addToast('success', `${sns.label}에서 ${added}개 가져왔어요`);
                            } else {
                              // 타임라인에 추가 (X/Twitter)
                              const existing = sections.find(s => s.type === 'sns_timeline');
                              if (existing) {
                                setSections(sections.map(s => s.id === existing.id ? { ...s, content: { ...s.content, posts: data.posts } } : s));
                              } else {
                                setSections([...sections, { id: 'sns_timeline_' + Date.now(), type: 'sns_timeline' as any, order: sections.length, content: { posts: data.posts, count: 5 } }]);
                              }
                              addToast('success', `${sns.label}에서 ${data.total}개 가져왔어요`);
                            }
                          } catch { addToast('error', '가져오기에 실패했어요'); }
                          finally { btn.disabled = false; btn.textContent = '가져오기'; }
                        }}
                        className="px-5 py-3 bg-[#0a0a0a] text-white rounded-xl text-[14px] font-semibold hover:bg-[#262626] transition-colors"
                      >
                        가져오기
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
                    { type: 'inquiry' as const, label: '문의폼', icon: <Plus size={10} /> },
                  ].filter(b => !sections.some(s => s.type === b.type && (b.type === 'sns_icons' || b.type === 'inquiry'))).map(block => (
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
                  <div
                    key={section.id}
                    draggable
                    onDragStart={(e) => { e.dataTransfer.setData('section-index', String(index)); (e.currentTarget as HTMLElement).style.opacity = '0.5'; }}
                    onDragEnd={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                    onDragOver={(e) => { e.preventDefault(); (e.currentTarget as HTMLElement).style.borderColor = '#0a0a0a'; }}
                    onDragLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}
                    onDrop={(e) => {
                      e.preventDefault();
                      (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                      const fromIndex = Number(e.dataTransfer.getData('section-index'));
                      if (fromIndex === index) return;
                      const sorted = [...sections].sort((a, b) => a.order - b.order);
                      const [moved] = sorted.splice(fromIndex, 1);
                      sorted.splice(index, 0, moved);
                      setSections(sorted.map((s, i) => ({ ...s, order: i })));
                    }}
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl group cursor-grab active:cursor-grabbing border-2 border-transparent transition-colors"
                  >
                    <GripVertical size={14} className="text-gray-300 shrink-0" />
                    <span className="text-xs font-black flex-1 capitalize">
                      {section.type === 'header' ? '프로필 헤더' :
                       section.type === 'links' ? '링크' :
                       section.type === 'portfolio' ? '포트폴리오' :
                       section.type === 'sns_icons' ? 'SNS 아이콘' :
                       section.type === 'sns_feed' ? 'SNS 피드' :
                       section.type === 'text' ? '텍스트' :
                       section.type === 'sns_timeline' ? 'Threads' :
                       section.type === 'inquiry' ? '문의폼' : section.type}
                    </span>
                    {section.type === 'portfolio' && (
                      <div className="flex gap-1 items-center">
                        <select
                          value={section.content?.ratio || '1:1'}
                          onChange={(e) => setSections(sections.map(s => s.id === section.id ? { ...s, content: { ...s.content, ratio: e.target.value } } : s))}
                          className="text-[13px] bg-white border border-gray-100 rounded-lg px-1.5 py-1 outline-none focus:border-black transition-colors"
                        >
                          <option value="1:1">1:1</option>
                          <option value="4:5">4:5</option>
                        </select>
                        <select
                          value={section.content?.count || 9}
                          onChange={(e) => setSections(sections.map(s => s.id === section.id ? { ...s, content: { ...s.content, count: Number(e.target.value) } } : s))}
                          className="text-[13px] bg-white border border-gray-100 rounded-lg px-1.5 py-1 outline-none focus:border-black transition-colors"
                        >
                          <option value={9}>9개</option>
                          <option value={12}>12개</option>
                        </select>
                        <button
                          onClick={() => setSections(sections.map(s => s.id === section.id ? { ...s, content: { ...s.content, showPermalink: !(s.content?.showPermalink !== false) } } : s))}
                          className={`text-[12px] font-semibold px-2 py-1 rounded-lg transition-colors ${
                            section.content?.showPermalink !== false ? 'bg-blue-50 text-blue-500' : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {section.content?.showPermalink !== false ? '원본↗' : '원본✕'}
                        </button>
                      </div>
                    )}
                    {section.type === 'text' && (
                      <input
                        value={section.content?.text || ''}
                        onChange={(e) => setSections(sections.map(s => s.id === section.id ? { ...s, content: { ...s.content, text: e.target.value } } : s))}
                        placeholder="텍스트 입력..."
                        className="text-[14px] bg-white border border-gray-100 rounded-lg px-2 py-1 w-32 outline-none focus:border-black transition-colors"
                      />
                    )}
                    {section.type === 'inquiry' && (
                      <div className="flex gap-1 items-center">
                        <input
                          value={section.content?.title || ''}
                          onChange={(e) => setSections(sections.map(s => s.id === section.id ? { ...s, content: { ...s.content, title: e.target.value } } : s))}
                          placeholder="제목"
                          className="text-[13px] bg-white border border-gray-100 rounded-lg px-2 py-1 w-14 outline-none focus:border-black transition-colors"
                        />
                        <input
                          value={section.content?.ctaText || ''}
                          onChange={(e) => setSections(sections.map(s => s.id === section.id ? { ...s, content: { ...s.content, ctaText: e.target.value } } : s))}
                          placeholder="버튼"
                          className="text-[13px] bg-white border border-gray-100 rounded-lg px-2 py-1 w-14 outline-none focus:border-black transition-colors"
                        />
                        <button
                          onClick={() => setSections(sections.map(s => s.id === section.id ? { ...s, content: { ...s.content, collapsed: !(s.content?.collapsed !== false) } } : s))}
                          className={`text-[12px] font-semibold px-2 py-1 rounded-lg transition-colors ${
                            section.content?.collapsed !== false ? 'bg-gray-100 text-gray-400' : 'bg-black text-white'
                          }`}
                        >
                          {section.content?.collapsed !== false ? '접힘' : '펼침'}
                        </button>
                      </div>
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

          {/* ===== INQUIRIES TAB ===== */}
          {activeTab === 'inquiries' && (
            <section className="flex flex-col gap-5">
              {inquiriesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
                </div>
              ) : (
                <>
                  {/* 문의 통계 */}
                  {inquiryStats && (
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-4 bg-gray-50 rounded-2xl text-center">
                        <p className="text-[22px] font-black">{inquiryStats.total}</p>
                        <p className="text-[14px] text-gray-400 font-semibold mt-0.5">전체</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl text-center">
                        <p className="text-[22px] font-black text-orange-500">{inquiryStats.received}</p>
                        <p className="text-[14px] text-gray-400 font-semibold mt-0.5">미확인</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl text-center">
                        <p className="text-[22px] font-black">{inquiryStats.today}</p>
                        <p className="text-[14px] text-gray-400 font-semibold mt-0.5">오늘</p>
                      </div>
                    </div>
                  )}

                  {/* 필터 */}
                  <div className="flex gap-1.5 p-1 bg-gray-50 rounded-xl">
                    {[
                      { key: 'all', label: '전체' },
                      { key: 'received', label: '접수' },
                      { key: 'checked', label: '확인' },
                      { key: 'completed', label: '완료' },
                    ].map(f => (
                      <button
                        key={f.key}
                        onClick={() => setInquiryFilter(f.key)}
                        className={`flex-1 py-2 rounded-lg text-[14px] font-semibold transition-colors ${
                          inquiryFilter === f.key ? 'bg-black text-white' : 'text-gray-400 hover:text-black'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* 문의 목록 */}
                  <div className="flex flex-col gap-2">
                    {inquiries
                      .filter(inq => inquiryFilter === 'all' || inq.status === inquiryFilter)
                      .map(inq => (
                        <div
                          key={inq.id}
                          onClick={() => setSelectedInquiry(selectedInquiry?.id === inq.id ? null : inq)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            selectedInquiry?.id === inq.id ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                              inq.status === 'received' ? 'bg-orange-400' :
                              inq.status === 'checked' ? 'bg-blue-400' : 'bg-green-400'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-[15px] font-bold truncate">{inq.name}</p>
                                <span className={`px-2 py-0.5 rounded-full text-[12px] font-semibold shrink-0 ${
                                  inq.status === 'received' ? 'bg-orange-50 text-orange-500' :
                                  inq.status === 'checked' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'
                                }`}>
                                  {inq.status === 'received' ? '접수' : inq.status === 'checked' ? '확인' : '완료'}
                                </span>
                              </div>
                              <p className="text-[14px] text-gray-500 line-clamp-2">{inq.message}</p>
                              <p className="text-[13px] text-gray-300 mt-1">{new Date(inq.created_at).toLocaleDateString('ko', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </div>

                          {/* 상세 펼침 */}
                          {selectedInquiry?.id === inq.id && (
                            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-3">
                              {inq.email && (
                                <div className="flex items-center gap-2 text-[14px]">
                                  <Mail size={14} className="text-gray-400" />
                                  <a href={`mailto:${inq.email}`} className="text-blue-500 hover:underline">{inq.email}</a>
                                </div>
                              )}
                              {inq.phone && (
                                <div className="flex items-center gap-2 text-[14px]">
                                  <ExternalLink size={14} className="text-gray-400" />
                                  <a href={`tel:${inq.phone}`} className="text-blue-500 hover:underline">{inq.phone}</a>
                                </div>
                              )}
                              <p className="text-[14px] text-gray-600 leading-relaxed whitespace-pre-wrap">{inq.message}</p>

                              {/* 메모 */}
                              {inq.admin_note && (
                                <div className="p-3 bg-yellow-50 rounded-xl">
                                  <p className="text-[13px] font-semibold text-yellow-700 mb-1">메모</p>
                                  <p className="text-[14px] text-yellow-800">{inq.admin_note}</p>
                                </div>
                              )}

                              {/* 상태 변경 + 삭제 */}
                              <div className="flex gap-2 mt-1">
                                {inq.status === 'received' && (
                                  <button
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      const updated = await updateInquiry(inq.id, { status: 'checked' });
                                      setInquiries(prev => prev.map(i => i.id === inq.id ? updated : i));
                                      if (inquiryStats) setInquiryStats({ ...inquiryStats, received: inquiryStats.received - 1 });
                                    }}
                                    className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl text-[14px] font-semibold hover:bg-blue-600 transition-colors"
                                  >
                                    확인 처리
                                  </button>
                                )}
                                {inq.status === 'checked' && (
                                  <button
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      const updated = await updateInquiry(inq.id, { status: 'completed' });
                                      setInquiries(prev => prev.map(i => i.id === inq.id ? updated : i));
                                    }}
                                    className="flex-1 py-2.5 bg-green-500 text-white rounded-xl text-[14px] font-semibold hover:bg-green-600 transition-colors"
                                  >
                                    완료 처리
                                  </button>
                                )}
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    if (!confirm('이 문의를 삭제할까요?')) return;
                                    await deleteInquiry(inq.id);
                                    setInquiries(prev => prev.filter(i => i.id !== inq.id));
                                    setSelectedInquiry(null);
                                    if (inquiryStats) setInquiryStats({ ...inquiryStats, total: inquiryStats.total - 1 });
                                  }}
                                  className="py-2.5 px-4 border border-gray-200 rounded-xl text-[14px] font-semibold text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    }

                    {inquiries.filter(inq => inquiryFilter === 'all' || inq.status === inquiryFilter).length === 0 && (
                      <div className="text-center py-12">
                        <MessageCircle size={24} className="mx-auto text-gray-200 mb-3" />
                        <p className="text-[16px] text-gray-400 font-semibold">
                          {inquiryFilter === 'all' ? '아직 문의가 없어요' : `${inquiryFilter === 'received' ? '미확인' : inquiryFilter === 'checked' ? '확인 중' : '완료된'} 문의가 없어요`}
                        </p>
                        <p className="text-[14px] text-gray-300 mt-1">
                          Layout 탭에서 문의폼을 추가하면 방문자가 문의를 보낼 수 있어요
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
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
                  {/* Stats Cards — 4칸 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-[14px] text-gray-400 font-semibold mb-1">전체 방문</p>
                      <p className="text-[24px] font-black">{analytics.total_views.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-[14px] text-gray-400 font-semibold mb-1">오늘 방문</p>
                      <p className="text-[24px] font-black">{analytics.today_views.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-[14px] text-gray-400 font-semibold mb-1">전체 클릭</p>
                      <p className="text-[24px] font-black">{analytics.total_clicks.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-[14px] text-gray-400 font-semibold mb-1">클릭 전환율</p>
                      <p className="text-[24px] font-black">
                        {analytics.total_views > 0
                          ? `${((analytics.total_clicks / analytics.total_views) * 100).toFixed(1)}%`
                          : '—'}
                      </p>
                    </div>
                  </div>

                  {/* Daily Chart (14 days) */}
                  <div>
                    <p className="text-[14px] font-black text-gray-300 uppercase tracking-widest mb-3">최근 14일</p>
                    <div className="flex items-end gap-0.5 h-28">
                      {(() => {
                        const days = [];
                        for (let i = 13; i >= 0; i--) {
                          const d = new Date();
                          d.setDate(d.getDate() - i);
                          const key = d.toISOString().split('T')[0];
                          days.push({ date: key, count: analytics.daily[key] || 0, day: d.getDate() });
                        }
                        const max = Math.max(...days.map(d => d.count), 1);
                        return days.map((day, idx) => (
                          <div key={day.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-black text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                              {day.count}
                            </div>
                            <div
                              className="w-full bg-black rounded-t transition-all hover:bg-gray-700"
                              style={{ height: `${(day.count / max) * 96}px`, minHeight: day.count > 0 ? '4px' : '1px' }}
                            />
                            {idx % 2 === 0 && (
                              <span className="text-[10px] text-gray-400 font-semibold">{day.day}</span>
                            )}
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* Link Clicks Ranking with bars */}
                  {analytics.link_clicks.length > 0 && (
                    <div>
                      <p className="text-[14px] font-black text-gray-300 uppercase tracking-widest mb-3">
                        <MousePointerClick size={12} className="inline mr-1" />
                        링크별 클릭
                      </p>
                      <div className="flex flex-col gap-2">
                        {(() => {
                          const maxClicks = Math.max(...analytics.link_clicks.map(lc => lc.clicks), 1);
                          return analytics.link_clicks.map((lc, i) => (
                            <div key={lc.link_id} className="relative p-3 bg-gray-50 rounded-xl overflow-hidden">
                              <div
                                className="absolute inset-y-0 left-0 bg-black/[0.04] rounded-xl"
                                style={{ width: `${(lc.clicks / maxClicks) * 100}%` }}
                              />
                              <div className="relative flex items-center gap-3">
                                <span className="text-[14px] font-black text-gray-300 w-5">{i + 1}</span>
                                <span className="text-[14px] font-semibold flex-1 truncate">{lc.title || '(제목 없음)'}</span>
                                <span className="text-[14px] font-black">{lc.clicks}</span>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  )}

                  {analytics.total_views === 0 && analytics.total_clicks === 0 && (
                    <div className="text-center py-8">
                      <p className="text-[16px] text-gray-400 font-bold">아직 방문자가 없어요</p>
                      <p className="text-[14px] text-gray-300 mt-1">페이지를 공유하면 여기에 통계가 나타나요</p>
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
              {/* AI 도우미 설정 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[14px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-1.5">
                    <MessageCircle size={10} /> AI 도우미
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-[13px] font-semibold text-gray-400">
                      {sections.some(s => (s as any).ai_chat_enabled !== false) && (profile as any).knowledge_md?.trim() ? 'ON' : 'OFF'}
                    </span>
                    <div
                      className={`w-10 h-6 rounded-full transition-colors relative ${(profile as any).knowledge_md?.trim() ? 'bg-green-500' : 'bg-gray-200'}`}
                      onClick={() => {
                        if ((profile as any).knowledge_md?.trim()) {
                          setProfile({ ...profile, knowledge_md: '' } as any);
                        }
                      }}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${(profile as any).knowledge_md?.trim() ? 'left-[18px]' : 'left-0.5'}`} />
                    </div>
                  </label>
                </div>
                <p className="text-[14px] text-gray-400 mb-3">
                  아래 내용을 입력하면 내 페이지에 AI 챗봇이 활성화돼요. 방문자가 질문하면 이 내용만으로 답변해요.
                </p>
                <textarea
                  value={(profile as any).knowledge_md || ''}
                  onChange={(e) => setProfile({ ...profile, knowledge_md: e.target.value } as any)}
                  className="w-full min-h-[180px] p-4 text-[14px] font-medium border border-gray-100 rounded-2xl focus:border-black outline-none transition-colors resize-none leading-relaxed font-mono"
                  placeholder={"# 우리 가게 정보\n\n- 위치: 수원시 인계동\n- 영업시간: 18:00 ~ 02:00\n- 예약: 0507-1322-4606\n- 메뉴: 시그니처 칵테일, 하이볼, 와인\n\n# 자주 묻는 질문\n\nQ: 주차 가능한가요?\nA: 건물 지하주차장 이용 가능해요."}
                />
                <p className="text-[13px] text-gray-300 mt-2">
                  {(profile as any).knowledge_md?.length || 0}자 · 놀리지를 비우면 챗봇이 비활성화돼요
                </p>
              </div>

              <div className="h-px bg-gray-100 mb-6" />

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

        {/* AI 비서 — createPortal로 자체 렌더링 */}
        {view === 'editor' && (
          <AdminGuideChat
            profile={profile}
            linksCount={links.length}
            portfolioCount={portfolioItems.length}
          />
        )}
      </main>
      </div>
    </div>
  );
}
