'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Users, BarChart3, Loader2, Shield } from 'lucide-react';
import Link from 'next/link';
import { getToken, request } from '@/lib/api';

const SUPER_ADMINS = [
  'juuuno@naver.com',
  'juuuno1116@gmail.com',
  'designd@designd.co.kr',
  'designdlab@designdlab.co.kr',
  'vibers.leo@gmail.com',
];

interface UserRow {
  id: number;
  email: string;
  name: string;
  provider: string | null;
  created_at: string;
  profile?: { username: string; bio: string };
}

export default function AdminConsolePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [email, setEmail] = useState('');
  const [stats, setStats] = useState<{ total: number; today: number; social: number } | null>(null);

  useEffect(() => {
    if (!getToken()) { router.push('/login'); return; }
    // 내 프로필에서 이메일 확인
    request<any>('/api/v1/profiles/me').then(p => {
      const myEmail = p?.email || '';
      setEmail(myEmail);
      if (!SUPER_ADMINS.includes(myEmail)) {
        router.push('/admin');
        return;
      }
      // 유저 목록 로드
      return request<UserRow[]>('/api/v1/admin/users');
    }).then(data => {
      if (!data) return;
      setUsers(data);
      const today = new Date().toISOString().slice(0, 10);
      setStats({
        total: data.length,
        today: data.filter(u => u.created_at?.startsWith(today)).length,
        social: data.filter(u => u.provider).length,
      });
    }).catch(() => router.push('/admin')).finally(() => setLoading(false));
  }, [router]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="w-7 h-7 animate-spin text-gray-300" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <Link href="/admin" className="text-gray-300 hover:text-black transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-purple-500" />
            <h1 className="text-xl font-black">관리자 콘솔</h1>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="border border-gray-100 rounded-2xl p-5">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">전체 유저</p>
              <p className="text-3xl font-black">{stats.total}</p>
            </div>
            <div className="border border-gray-100 rounded-2xl p-5">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">오늘 가입</p>
              <p className="text-3xl font-black">{stats.today}</p>
            </div>
            <div className="border border-gray-100 rounded-2xl p-5">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">소셜 로그인</p>
              <p className="text-3xl font-black">{stats.social}</p>
            </div>
          </div>
        )}

        {/* Users */}
        <div className="flex items-center gap-2 mb-4">
          <Users size={14} className="text-gray-400" />
          <h2 className="text-sm font-black">유저 목록</h2>
        </div>
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-black text-gray-400">@username</th>
                <th className="text-left px-4 py-3 font-black text-gray-400">이메일</th>
                <th className="text-left px-4 py-3 font-black text-gray-400">로그인</th>
                <th className="text-left px-4 py-3 font-black text-gray-400">가입일</th>
                <th className="text-left px-4 py-3 font-black text-gray-400"></th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-300 font-medium">유저가 없어요</td></tr>
              ) : users.map(u => (
                <tr key={u.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-bold">@{u.profile?.username || '-'}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      u.provider === 'google' ? 'bg-blue-50 text-blue-500' :
                      u.provider === 'kakao' ? 'bg-yellow-50 text-yellow-600' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {u.provider || 'email'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{u.created_at?.slice(0, 10) || '-'}</td>
                  <td className="px-4 py-3">
                    {u.profile?.username && (
                      <a
                        href={`/admin?user=${u.profile.username}`}
                        className="text-[13px] font-semibold text-purple-500 hover:text-purple-700 transition-colors"
                      >
                        관리
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
