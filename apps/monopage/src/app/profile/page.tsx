'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Unlink, Check, ExternalLink } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { getToken, getMyProfile, changePassword, getSocialConnections, disconnectSocial, deleteAccount, clearToken } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [connections, setConnections] = useState<any>(null);
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [deleteStep, setDeleteStep] = useState(0); // 0: 없음, 1: 확인, 2: 진행중
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
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />

      <div className="max-w-[480px] mx-auto px-5 sm:px-8 py-10">
        {/* 프로필 카드 */}
        <div className="bg-white rounded-2xl p-6 mb-4">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-full bg-[#f5f5f5] overflow-hidden flex items-center justify-center shrink-0">
              {profile?.avatar_url
                ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" />
                : <span className="text-xl font-bold text-[#a3a3a3]">{(profile?.username?.[0] || '?').toUpperCase()}</span>
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[18px] font-bold">@{profile?.username}</p>
              <p className="text-[14px] text-[#a3a3a3] truncate">{profile?.email || connections?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <a href={`/${profile?.username}`} target="_blank" className="flex-1 py-2.5 border border-[#e5e5e5] rounded-xl text-[14px] font-semibold text-center hover:border-[#0a0a0a] transition-colors flex items-center justify-center gap-1.5">
              <ExternalLink size={14} /> 내 페이지
            </a>
            <button onClick={() => router.push('/admin')} className="flex-1 py-2.5 bg-[#0a0a0a] text-white rounded-xl text-[14px] font-semibold hover:bg-[#262626] transition-colors">
              페이지 관리
            </button>
          </div>
        </div>

        {/* 소셜 연동 */}
        <div className="bg-white rounded-2xl p-6 mb-4">
          <p className="text-[15px] font-bold mb-4">로그인 연동</p>
          {connections?.provider ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-bold ${
                  connections.provider === 'kakao' ? 'bg-[#FEE500] text-[#3C1E1E]' :
                  connections.provider === 'google' ? 'bg-[#4285F4] text-white' : 'bg-[#03C75A] text-white'
                }`}>
                  {connections.provider === 'kakao' ? 'K' : connections.provider === 'google' ? 'G' : 'N'}
                </div>
                <div>
                  <p className="text-[15px] font-semibold">{connections.provider === 'kakao' ? '카카오' : connections.provider === 'google' ? '구글' : '네이버'}</p>
                  <p className="text-[13px] text-[#a3a3a3]">연동됨</p>
                </div>
              </div>
              {connections.has_password && (
                <button
                  onClick={async () => {
                    if (!confirm('소셜 연동을 해제할까요?')) return;
                    setDisconnecting(true);
                    try { await disconnectSocial(); setConnections({ ...connections, provider: null, uid: null }); }
                    catch { } finally { setDisconnecting(false); }
                  }}
                  className="text-[14px] font-semibold text-[#a3a3a3] hover:text-red-500 transition-colors"
                >
                  {disconnecting ? <Loader2 size={14} className="animate-spin" /> : '해제'}
                </button>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              {[
                { label: '카카오', color: 'bg-[#FEE500] text-[#3C1E1E]', url: `https://kauth.kakao.com/oauth/authorize?client_id=3a4930ab39652ad5f387496697bf66ba&redirect_uri=${encodeURIComponent('https://monopage.kr/auth/kakao/callback')}&response_type=code` },
                { label: '구글', color: 'bg-[#4285F4] text-white', url: `https://accounts.google.com/o/oauth2/v2/auth?client_id=534035148832-6b2lf74coj33s9m9cmdh509tktcaa7fn.apps.googleusercontent.com&redirect_uri=${encodeURIComponent('https://monopage.kr/auth/google/callback')}&response_type=code&scope=openid%20email%20profile` },
              ].map(s => (
                <a key={s.label} href={s.url} className={`flex-1 py-3 rounded-xl text-[14px] font-bold text-center ${s.color} hover:opacity-90 transition-opacity`}>
                  {s.label} 연동
                </a>
              ))}
            </div>
          )}
        </div>

        {/* 비밀번호 */}
        {connections && (connections.has_password || !connections.provider) && (
          <div className="bg-white rounded-2xl p-6 mb-4">
            <p className="text-[15px] font-bold mb-4">비밀번호 변경</p>
            <div className="flex flex-col gap-2.5">
              <input type="password" placeholder="현재 비밀번호" value={pwForm.current} onChange={e => setPwForm({ ...pwForm, current: e.target.value })}
                className="w-full py-3 px-4 text-[15px] bg-[#fafafa] border border-[#e5e5e5] rounded-xl outline-none focus:border-[#0a0a0a] transition-colors" />
              <input type="password" placeholder="새 비밀번호 (6자 이상)" value={pwForm.next} onChange={e => setPwForm({ ...pwForm, next: e.target.value })}
                className="w-full py-3 px-4 text-[15px] bg-[#fafafa] border border-[#e5e5e5] rounded-xl outline-none focus:border-[#0a0a0a] transition-colors" />
              <input type="password" placeholder="새 비밀번호 확인" value={pwForm.confirm} onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })}
                className="w-full py-3 px-4 text-[15px] bg-[#fafafa] border border-[#e5e5e5] rounded-xl outline-none focus:border-[#0a0a0a] transition-colors" />
              {pwMsg && <p className={`text-[14px] font-medium ${pwMsg.includes('변경') ? 'text-green-500' : 'text-red-500'}`}>{pwMsg}</p>}
              <button
                onClick={async () => {
                  if (pwForm.next !== pwForm.confirm) { setPwMsg('새 비밀번호가 일치하지 않아요'); return; }
                  setPwSaving(true); setPwMsg(null);
                  try { await changePassword(pwForm.current, pwForm.next); setPwMsg('비밀번호가 변경됐어요'); setPwForm({ current: '', next: '', confirm: '' }); }
                  catch (e: any) { setPwMsg(e.message); } finally { setPwSaving(false); }
                }}
                disabled={pwSaving || !pwForm.current || !pwForm.next || !pwForm.confirm}
                className="w-full py-3 bg-[#0a0a0a] text-white text-[15px] font-semibold rounded-xl disabled:opacity-30 flex items-center justify-center gap-1.5"
              >
                {pwSaving ? <Loader2 size={14} className="animate-spin" /> : '변경하기'}
              </button>
            </div>
          </div>
        )}

        {/* 회원 탈퇴 */}
        <div className="bg-white rounded-2xl p-6">
          {deleteStep === 0 && (
            <button onClick={() => setDeleteStep(1)} className="w-full text-[14px] text-[#a3a3a3] font-medium hover:text-red-500 transition-colors">
              회원 탈퇴
            </button>
          )}
          {deleteStep === 1 && (
            <div>
              <p className="text-[15px] font-medium text-red-500 mb-4 text-center">모든 데이터가 삭제되고 복구할 수 없어요</p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteStep(0)} className="flex-1 py-3 border border-[#e5e5e5] rounded-xl text-[15px] font-semibold">취소</button>
                <button
                  onClick={async () => { setDeleteStep(2); try { await deleteAccount(); clearToken(); router.push('/'); } catch { setDeleteStep(1); } }}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl text-[15px] font-semibold flex items-center justify-center"
                >
                  {deleteStep === 2 ? <Loader2 size={14} className="animate-spin" /> : '탈퇴 확인'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
