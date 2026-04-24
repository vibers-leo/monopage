'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, Users, BarChart3, Loader2, Shield, MessageCircle,
  Eye, ArrowRight, ExternalLink, Mail,
} from 'lucide-react';
import Link from 'next/link';
import { getToken, getMyProfile, adminGetAllProfiles, adminGetAllInquiries, updateInquiry } from '@/lib/api';

const SUPER_ADMINS = [
  'juuuno@naver.com',
  'juuuno1116@gmail.com',
  'designd@designd.co.kr',
  'designdlab@designdlab.co.kr',
  'vibers.leo@gmail.com',
];

type Tab = 'overview' | 'pages' | 'inquiries';

export default function AdminConsolePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('overview');
  const [profiles, setProfiles] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [selectedInq, setSelectedInq] = useState<any | null>(null);

  useEffect(() => {
    if (!getToken()) { router.push('/login'); return; }
    getMyProfile().then(p => {
      if (!SUPER_ADMINS.includes(p.email || '')) { router.push('/admin'); return; }
      return Promise.all([adminGetAllProfiles(), adminGetAllInquiries()]);
    }).then(data => {
      if (!data) return;
      setProfiles(data[0]);
      setInquiries(data[1]);
    }).catch(() => router.push('/admin')).finally(() => setLoading(false));
  }, [router]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="w-7 h-7 animate-spin text-gray-300" />
    </div>
  );

  const totalViews = profiles.reduce((s, p) => s + (p.views_count || 0), 0);
  const totalLinks = profiles.reduce((s, p) => s + (p.links_count || 0), 0);
  const totalInquiries = inquiries.length;
  const receivedInquiries = inquiries.filter(i => i.status === 'received').length;
  const activeProfiles = profiles.filter(p => p.links_count > 0).length;

  const tabs = [
    { key: 'overview' as Tab, label: '대시보드', icon: <BarChart3 size={14} /> },
    { key: 'pages' as Tab, label: `페이지 (${profiles.length})`, icon: <Users size={14} /> },
    { key: 'inquiries' as Tab, label: `문의 (${receivedInquiries})`, icon: <MessageCircle size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-gray-300 hover:text-black transition-colors">
              <ChevronLeft size={20} />
            </Link>
            <Shield size={16} className="text-purple-500" />
            <h1 className="text-[16px] font-bold">관리자 대시보드</h1>
          </div>
          <Link href="/admin" className="text-[14px] text-gray-400 hover:text-black transition-colors">
            내 어드민
          </Link>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-5 sm:px-8 flex gap-1">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-[14px] font-semibold border-b-2 transition-colors ${
                tab === t.key ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-400 hover:text-black'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8">
        {/* ===== OVERVIEW ===== */}
        {tab === 'overview' && (
          <div className="flex flex-col gap-8">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: '전체 페이지', value: profiles.length, color: '' },
                { label: '활성 페이지', value: activeProfiles, color: 'text-green-600' },
                { label: '전체 조회', value: totalViews, color: '' },
                { label: '전체 링크', value: totalLinks, color: '' },
                { label: '미확인 문의', value: receivedInquiries, color: receivedInquiries > 0 ? 'text-orange-500' : '' },
              ].map(s => (
                <div key={s.label} className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-[13px] text-gray-400 font-semibold mb-1">{s.label}</p>
                  <p className={`text-[24px] font-black ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* 미확인 문의 미리보기 */}
            {receivedInquiries > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[15px] font-bold flex items-center gap-2">
                    <MessageCircle size={15} className="text-orange-500" /> 새 문의 {receivedInquiries}건
                  </h2>
                  <button onClick={() => setTab('inquiries')} className="text-[14px] text-purple-500 font-semibold hover:underline">
                    전체 보기
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {inquiries.filter(i => i.status === 'received').slice(0, 3).map(inq => (
                    <div key={inq.id} className="flex items-center gap-3 p-4 border border-orange-100 rounded-xl bg-orange-50/30">
                      <div className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold truncate">{inq.name} → <span className="text-gray-400">@{inq.profile_username}</span></p>
                        <p className="text-[14px] text-gray-500 truncate">{inq.message}</p>
                      </div>
                      <span className="text-[13px] text-gray-300 shrink-0">{new Date(inq.created_at).toLocaleDateString('ko', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 최근 개설 페이지 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[15px] font-bold">최근 개설 페이지</h2>
                <button onClick={() => setTab('pages')} className="text-[14px] text-purple-500 font-semibold hover:underline">
                  전체 보기
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {profiles.slice(0, 6).map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl hover:border-gray-300 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center text-[14px] font-bold text-gray-300">
                      {p.avatar_url ? <img src={p.avatar_url} className="w-full h-full object-cover" alt="" /> : p.username?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold truncate">@{p.username}</p>
                      <p className="text-[13px] text-gray-400 truncate">{p.email}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <a href={`/${p.username}`} target="_blank" className="text-gray-300 hover:text-black transition-colors"><Eye size={14} /></a>
                      <a href={`/admin?user=${p.username}`} className="text-purple-400 hover:text-purple-600 transition-colors"><ArrowRight size={14} /></a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== PAGES ===== */}
        {tab === 'pages' && (
          <div className="flex flex-col gap-2">
            {profiles.map(p => (
              <div key={p.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-gray-300 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center text-[14px] font-bold text-gray-300">
                  {p.avatar_url ? <img src={p.avatar_url} className="w-full h-full object-cover" alt="" /> : p.username?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold">@{p.username}</p>
                  <p className="text-[13px] text-gray-400 truncate">{p.email} · {p.provider || 'email'}</p>
                </div>
                <div className="flex items-center gap-4 text-[13px] text-gray-400 shrink-0">
                  <span>{p.links_count} 링크</span>
                  <span>{p.inquiries_count} 문의</span>
                  <span>{p.views_count} 조회</span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a href={`/${p.username}`} target="_blank" className="p-2 rounded-lg text-gray-300 hover:text-black hover:bg-gray-50 transition-colors">
                    <Eye size={14} />
                  </a>
                  <a href={`/admin?user=${p.username}`} className="p-2 rounded-lg text-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-colors">
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== INQUIRIES ===== */}
        {tab === 'inquiries' && (
          <div className="flex flex-col gap-2">
            {inquiries.length === 0 ? (
              <div className="text-center py-16">
                <MessageCircle size={24} className="mx-auto text-gray-200 mb-3" />
                <p className="text-[15px] text-gray-400 font-semibold">아직 문의가 없어요</p>
              </div>
            ) : inquiries.map(inq => (
              <div
                key={inq.id}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedInq?.id === inq.id ? 'border-purple-300 bg-purple-50/30' : 'border-gray-100 hover:border-gray-300'
                }`}
                onClick={() => setSelectedInq(selectedInq?.id === inq.id ? null : inq)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                    inq.status === 'received' ? 'bg-orange-400' :
                    inq.status === 'checked' ? 'bg-blue-400' : 'bg-green-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[14px] font-bold">{inq.name}</span>
                      <span className="text-[13px] text-gray-300">→ @{inq.profile_username}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[12px] font-semibold ${
                        inq.status === 'received' ? 'bg-orange-50 text-orange-500' :
                        inq.status === 'checked' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-600'
                      }`}>
                        {inq.status === 'received' ? '접수' : inq.status === 'checked' ? '확인' : '완료'}
                      </span>
                    </div>
                    <p className="text-[14px] text-gray-500 truncate">{inq.message}</p>
                  </div>
                  <span className="text-[13px] text-gray-300 shrink-0">
                    {new Date(inq.created_at).toLocaleDateString('ko', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {selectedInq?.id === inq.id && (
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

                    <div className="flex gap-2">
                      {inq.status === 'received' && (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            await updateInquiry(inq.id, { status: 'checked' });
                            setInquiries(prev => prev.map(i => i.id === inq.id ? { ...i, status: 'checked' } : i));
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-[14px] font-semibold hover:bg-blue-600 transition-colors"
                        >
                          확인 처리
                        </button>
                      )}
                      {inq.status === 'checked' && (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            await updateInquiry(inq.id, { status: 'completed' });
                            setInquiries(prev => prev.map(i => i.id === inq.id ? { ...i, status: 'completed' } : i));
                          }}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg text-[14px] font-semibold hover:bg-green-600 transition-colors"
                        >
                          완료 처리
                        </button>
                      )}
                      <a
                        href={`/admin?user=${inq.profile_username}`}
                        className="px-4 py-2 border border-purple-200 text-purple-500 rounded-lg text-[14px] font-semibold hover:bg-purple-50 transition-colors"
                        onClick={e => e.stopPropagation()}
                      >
                        @{inq.profile_username} 관리
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
