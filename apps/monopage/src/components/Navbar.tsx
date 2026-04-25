'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Settings, LogOut, Shield, ChevronDown, ExternalLink } from 'lucide-react';
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

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#e5e5e5] px-5 sm:px-8 py-4 flex justify-between items-center">
      <Link href="/" className="font-paperlogy font-extrabold text-[18px] tracking-tight text-[#0a0a0a]">
        Monopage
      </Link>
      <div className="flex items-center gap-3 sm:gap-5">
        <Link href="/about" className="text-[15px] font-medium text-[#a3a3a3] hover:text-[#0a0a0a] transition-colors hidden sm:inline">
          소개
        </Link>

        {isLoggedIn && profile ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(v => !v)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-[14px] font-bold text-gray-400 shrink-0">
                {profile.avatar_url
                  ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" />
                  : (profile.username?.[0] || '?').toUpperCase()
                }
              </div>
              <ChevronDown size={14} className="text-gray-400" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
                {/* 유저 정보 */}
                <div className="px-4 py-2.5 border-b border-gray-100 mb-1">
                  <p className="text-[15px] font-bold truncate">@{profile.username}</p>
                  <p className="text-[13px] text-gray-400 truncate">{profile.email}</p>
                </div>

                {/* 내 프로필 */}
                <Link
                  href="/profile"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] font-medium hover:bg-gray-50 transition-colors"
                >
                  <User size={15} className="text-gray-400" /> 내 프로필
                </Link>

                {/* 내 페이지 관리 */}
                <Link
                  href="/admin"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] font-medium hover:bg-gray-50 transition-colors"
                >
                  <Settings size={15} className="text-gray-400" /> 내 페이지
                </Link>

                {/* 공개 페이지 보기 */}
                <a
                  href={`/${profile.username}`}
                  target="_blank"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] font-medium hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink size={15} className="text-gray-400" /> 페이지 보기
                </a>

                {/* 슈퍼어드민 */}
                {isSuperAdmin && (
                  <>
                    <div className="h-px bg-gray-100 my-1" />
                    <Link
                      href="/admin-console"
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] font-medium hover:bg-gray-50 transition-colors text-purple-600"
                    >
                      <Shield size={15} /> 관리자 대시보드
                    </Link>
                  </>
                )}

                <div className="h-px bg-gray-100 my-1" />
                <button
                  onClick={() => { setShowMenu(false); logout(); }}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[14px] font-medium hover:bg-gray-50 transition-colors text-gray-400"
                >
                  <LogOut size={15} /> 로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/login" className="text-[15px] font-medium text-[#a3a3a3] hover:text-[#0a0a0a] transition-colors">
              로그인
            </Link>
            <Link href="/onboard" className="px-5 py-2.5 bg-[#0a0a0a] text-white rounded-full text-[15px] font-semibold hover:bg-[#262626] transition-colors">
              시작하기
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
