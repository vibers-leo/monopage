'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Shield, ChevronDown, ExternalLink, Settings, Plus } from 'lucide-react';
import { getToken, clearToken, getMyProfile } from '@/lib/api';

const SUPER_ADMINS = [
  'juuuno@naver.com',
  'juuuno1116@gmail.com',
  'designd@designd.co.kr',
  'designdlab@designdlab.co.kr',
  'vibers.leo@gmail.com',
];

export function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsLoggedIn(true);
      getMyProfile().then(p => setProfile(p)).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const logout = () => { clearToken(); router.push('/'); router.refresh(); };
  const isSuperAdmin = profile?.email && SUPER_ADMINS.includes(profile.email);

  // 소셜 로그인 정보
  const provider = profile?.provider;
  const providerLabel = provider === 'kakao' ? '카카오' : provider === 'google' ? '구글' : provider === 'naver' ? '네이버' : null;
  const providerColor = provider === 'kakao' ? 'bg-[#FEE500] text-[#3C1E1E]' : provider === 'google' ? 'bg-[#4285F4] text-white' : provider === 'naver' ? 'bg-[#03C75A] text-white' : '';

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#e5e5e5]">
      <div className="max-w-[80%] mx-auto px-5 py-4 flex items-center justify-between">
        {/* 좌: 로고 */}
        <Link href="/" className="font-paperlogy font-extrabold text-[18px] tracking-tight text-[#0a0a0a] shrink-0">
          Monopage
        </Link>

        {/* 중: 메뉴 */}
        <div className="hidden sm:flex items-center gap-6">
          <Link href="/about" className="text-[15px] font-medium text-[#a3a3a3] hover:text-[#0a0a0a] transition-colors">
            소개
          </Link>
          {isLoggedIn && (
            <Link href="/admin" className="text-[15px] font-medium text-[#a3a3a3] hover:text-[#0a0a0a] transition-colors">
              내 페이지
            </Link>
          )}
        </div>

        {/* 우: 프로필 or 로그인 */}
        {isLoggedIn && profile ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(v => !v)}
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              {/* 아바타 */}
              <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-[13px] font-bold text-gray-400 shrink-0">
                {profile.avatar_url
                  ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" />
                  : (profile.username?.[0] || '?').toUpperCase()
                }
              </div>
              {/* 이름 + 소셜 배지 */}
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-[14px] font-semibold text-[#0a0a0a]">@{profile.username}</span>
                {providerLabel && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${providerColor}`}>
                    {providerLabel[0]}
                  </span>
                )}
              </div>
              <ChevronDown size={14} className="text-gray-400" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
                {/* 프로필 헤더 */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-[14px] font-bold text-gray-400 shrink-0">
                      {profile.avatar_url
                        ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" />
                        : (profile.username?.[0] || '?').toUpperCase()
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-bold truncate">@{profile.username}</p>
                      <p className="text-[13px] text-gray-400 truncate">{profile.email}</p>
                    </div>
                  </div>
                  {providerLabel && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-full ${providerColor}`}>
                        {providerLabel} 연동
                      </span>
                    </div>
                  )}
                </div>

                {/* 내 페이지 목록 */}
                <div className="py-1 border-b border-gray-100">
                  <p className="px-4 py-1.5 text-[12px] font-semibold text-gray-300 uppercase tracking-wider">내 페이지</p>
                  <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-[11px] font-bold text-gray-400 shrink-0">
                      {profile.avatar_url
                        ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" />
                        : (profile.username?.[0] || '?').toUpperCase()
                      }
                    </div>
                    <span className="text-[14px] font-medium flex-1 truncate">@{profile.username}</span>
                    <div className="flex items-center gap-1">
                      <a href={`/${profile.username}`} target="_blank" className="p-1 text-gray-300 hover:text-black transition-colors" title="보기">
                        <ExternalLink size={13} />
                      </a>
                      <Link href="/admin" onClick={() => setShowMenu(false)} className="p-1 text-gray-300 hover:text-black transition-colors" title="관리">
                        <Settings size={13} />
                      </Link>
                    </div>
                  </div>

                  {/* 추가 페이지 만들기 */}
                  <Link
                    href="/onboard"
                    onClick={() => setShowMenu(false)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-400"
                  >
                    <div className="w-7 h-7 rounded-full border border-dashed border-gray-300 flex items-center justify-center shrink-0">
                      <Plus size={12} className="text-gray-300" />
                    </div>
                    <span className="text-[14px] font-medium">새 페이지 만들기</span>
                  </Link>
                </div>

                {/* 메뉴 */}
                <div className="py-1">
                  <Link
                    href="/profile"
                    onClick={() => setShowMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] font-medium hover:bg-gray-50 transition-colors"
                  >
                    <i className="fa-solid fa-user text-[13px] text-gray-400 w-4 text-center" /> 내 프로필
                  </Link>

                  {/* 슈퍼어드민 */}
                  {isSuperAdmin && (
                    <Link
                      href="/admin-console"
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] font-medium hover:bg-gray-50 transition-colors text-purple-600"
                    >
                      <Shield size={14} className="w-4 text-center" /> 관리자 대시보드
                    </Link>
                  )}
                </div>

                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={() => { setShowMenu(false); logout(); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[14px] font-medium hover:bg-gray-50 transition-colors text-gray-400"
                  >
                    <LogOut size={14} className="w-4 text-center" /> 로그아웃
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-[15px] font-medium text-[#a3a3a3] hover:text-[#0a0a0a] transition-colors">
              로그인
            </Link>
            <Link href="/onboard" className="px-5 py-2.5 bg-[#0a0a0a] text-white rounded-full text-[15px] font-semibold hover:bg-[#262626] transition-colors">
              시작하기
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
