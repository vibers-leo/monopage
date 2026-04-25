'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Shield, Unlink, ChevronLeft, Check, Camera } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { getToken, getMyProfile, changePassword, getSocialConnections, disconnectSocial, deleteAccount, clearToken } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [connections, setConnections] = useState<any>(null);

  // 비밀번호 변경
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<string | null>(null);

  // 계정 삭제
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    if (!getToken()) { router.push('/login'); return; }
    Promise.all([getMyProfile(), getSocialConnections()])
      .then(([p, c]) => { setProfile(p); setConnections(c); })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-[520px] mx-auto px-5 sm:px-8 py-10">
        <Link href="/admin" className="flex items-center gap-1.5 text-[14px] text-gray-400 hover:text-black transition-colors mb-8">
          <ChevronLeft size={16} /> 내 페이지로
        </Link>

        <h1 className="text-[24px] font-bold mb-8">내 프로필</h1>

        {/* 프로필 카드 */}
        <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl mb-8">
          <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shrink-0">
            {profile?.avatar_url
              ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" />
              : <span className="text-lg font-bold text-gray-400">{(profile?.username?.[0] || '?').toUpperCase()}</span>
            }
          </div>
          <div>
            <p className="text-[16px] font-bold">@{profile?.username}</p>
            <p className="text-[14px] text-gray-400">{profile?.email || connections?.email}</p>
          </div>
        </div>

        {/* 소셜 로그인 연동 */}
        <section className="mb-8">
          <h2 className="text-[16px] font-bold mb-4">소셜 로그인 연동</h2>
          {connections && (
            <div className="flex flex-col gap-2">
              {connections.provider ? (
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-[14px] font-bold ${
                      connections.provider === 'kakao' ? 'bg-yellow-400 text-black' :
                      connections.provider === 'google' ? 'bg-blue-500' : 'bg-green-500'
                    }`}>
                      {connections.provider === 'kakao' ? 'K' : connections.provider === 'google' ? 'G' : 'N'}
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold capitalize">{connections.provider === 'kakao' ? '카카오' : connections.provider === 'google' ? '구글' : '네이버'} 연동됨</p>
                      <p className="text-[14px] text-gray-400">{connections.uid}</p>
                    </div>
                  </div>
                  {connections.has_password && (
                    <button
                      onClick={async () => {
                        if (!confirm('소셜 연동을 해제할까요?')) return;
                        setDisconnecting(true);
                        try {
                          await disconnectSocial();
                          setConnections({ ...connections, provider: null, uid: null });
                        } catch { }
                        finally { setDisconnecting(false); }
                      }}
                      disabled={disconnecting}
                      className="flex items-center gap-1 text-[14px] font-semibold text-red-400 hover:text-red-500 transition-colors"
                    >
                      {disconnecting ? <Loader2 size={12} className="animate-spin" /> : <Unlink size={12} />} 해제
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-[14px] text-gray-400 mb-2">소셜 계정을 연동하면 더 간편하게 로그인할 수 있어요</p>
                  {[
                    { provider: 'kakao', label: '카카오', color: 'bg-yellow-400 text-black', url: `https://kauth.kakao.com/oauth/authorize?client_id=3a4930ab39652ad5f387496697bf66ba&redirect_uri=${encodeURIComponent('https://monopage.kr/auth/kakao/callback')}&response_type=code` },
                    { provider: 'google', label: '구글', color: 'bg-blue-500 text-white', url: `https://accounts.google.com/o/oauth2/v2/auth?client_id=534035148832-6b2lf74coj33s9m9cmdh509tktcaa7fn.apps.googleusercontent.com&redirect_uri=${encodeURIComponent('https://monopage.kr/auth/google/callback')}&response_type=code&scope=openid%20email%20profile` },
                  ].map(s => (
                    <a key={s.provider} href={s.url} className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl hover:border-gray-300 transition-colors">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-bold ${s.color}`}>
                        {s.label[0]}
                      </div>
                      <span className="text-[15px] font-semibold">{s.label}로 연동하기</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* 비밀번호 변경 */}
        {connections && (connections.has_password || !connections.provider) && (
          <section className="mb-8">
            <h2 className="text-[16px] font-bold mb-4">비밀번호 변경</h2>
            <div className="flex flex-col gap-3">
              <input
                type="password"
                placeholder="현재 비밀번호"
                value={pwForm.current}
                onChange={e => setPwForm({ ...pwForm, current: e.target.value })}
                className="w-full py-3.5 px-4 text-[15px] border border-gray-100 rounded-xl outline-none focus:border-black transition-colors"
              />
              <input
                type="password"
                placeholder="새 비밀번호 (6자 이상)"
                value={pwForm.next}
                onChange={e => setPwForm({ ...pwForm, next: e.target.value })}
                className="w-full py-3.5 px-4 text-[15px] border border-gray-100 rounded-xl outline-none focus:border-black transition-colors"
              />
              <input
                type="password"
                placeholder="새 비밀번호 확인"
                value={pwForm.confirm}
                onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })}
                className="w-full py-3.5 px-4 text-[15px] border border-gray-100 rounded-xl outline-none focus:border-black transition-colors"
              />
              {pwMsg && <p className={`text-[14px] font-medium ${pwMsg.includes('변경') ? 'text-green-500' : 'text-red-500'}`}>{pwMsg}</p>}
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
                className="w-full py-3.5 bg-[#0a0a0a] text-white text-[15px] font-semibold rounded-xl disabled:opacity-30 flex items-center justify-center gap-1.5"
              >
                {pwSaving ? <Loader2 size={14} className="animate-spin" /> : '변경하기'}
              </button>
            </div>
          </section>
        )}

        {/* 계정 삭제 */}
        <section>
          <h2 className="text-[16px] font-bold mb-4 text-red-500">위험 구역</h2>
          {!deleteConfirm ? (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="w-full py-3.5 border border-red-200 text-red-400 text-[15px] font-semibold rounded-xl hover:border-red-400 hover:text-red-500 transition-colors"
            >
              회원 탈퇴
            </button>
          ) : (
            <div className="p-5 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-[15px] font-medium text-red-600 mb-4">정말 탈퇴하시겠어요? 페이지·링크·모든 데이터가 삭제되고 복구할 수 없어요.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(false)} className="flex-1 py-3 border border-gray-200 bg-white text-[15px] font-semibold rounded-xl hover:border-black transition-colors">
                  취소
                </button>
                <button
                  onClick={async () => {
                    setDeleting(true);
                    try { await deleteAccount(); clearToken(); router.push('/'); }
                    catch { setDeleting(false); }
                  }}
                  disabled={deleting}
                  className="flex-1 py-3 bg-red-500 text-white text-[15px] font-semibold rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-1.5"
                >
                  {deleting ? <Loader2 size={14} className="animate-spin" /> : '탈퇴 확인'}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
