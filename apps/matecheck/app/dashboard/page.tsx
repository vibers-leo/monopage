"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heart, CheckCircle2, Target, Calendar, Wallet,
  RotateCcw, Star, Home, LogOut, Plus, ChevronRight
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://matecheck-api.vibers.co.kr";

interface NestData {
  id: number;
  name: string;
  member_count?: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [nest, setNest] = useState<NestData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("mc_token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Nest 정보 로드 (예시 — 실제로는 API에서 첫 번째 nest를 불러옴)
    fetch(`${API_URL}/nests`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setNest(data[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("mc_token");
    localStorage.removeItem("mc_refresh");
    router.push("/login");
  };

  const menus = [
    { icon: <CheckCircle2 size={20} />, label: "미션", color: "bg-brand-500/20 text-brand-300", badge: "3개 진행 중" },
    { icon: <Target size={20} />, label: "목표", color: "bg-accent/20 text-accent", badge: "2개" },
    { icon: <Calendar size={20} />, label: "캘린더", color: "bg-blue-500/20 text-blue-300", badge: "오늘 일정 1개" },
    { icon: <Wallet size={20} />, label: "가계부", color: "bg-yellow-500/20 text-yellow-300", badge: "이번 달" },
    { icon: <RotateCcw size={20} />, label: "집안일", color: "bg-orange-500/20 text-orange-300", badge: "오늘 담당자 확인해요" },
    { icon: <Star size={20} />, label: "위시리스트", color: "bg-pink-500/20 text-pink-300", badge: "5개" },
  ];

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">불러오는 중...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-8">
      {/* Header */}
      <header className="glass sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl brand-gradient flex items-center justify-center">
              <Heart size={15} className="text-white" />
            </div>
            <span className="font-bold">MateCheck</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
            <LogOut size={15} />
            로그아웃
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 mt-8">
        {/* Nest Card */}
        <div className="glass rounded-3xl p-6 mb-6 brand-gradient relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white to-transparent" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-1">
              <Home size={18} />
              <span className="text-sm opacity-80">우리의 Nest</span>
            </div>
            <h1 className="text-2xl font-bold mb-1">
              {nest ? nest.name : "Nest를 만들어보세요"}
            </h1>
            <p className="text-sm opacity-70">
              {nest ? `파트너와 함께하는 공간` : "파트너를 초대하고 함께 관리를 시작해요"}
            </p>
            {!nest && (
              <button className="mt-4 flex items-center gap-1.5 bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-xl text-sm font-semibold">
                <Plus size={14} /> Nest 만들기
              </button>
            )}
          </div>
        </div>

        {/* Menu Grid */}
        <h2 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide">기능</h2>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {menus.map((m) => (
            <button
              key={m.label}
              className="glass rounded-2xl p-4 text-left card-hover"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${m.color}`}>
                {m.icon}
              </div>
              <p className="font-semibold text-sm mb-0.5">{m.label}</p>
              <p className="text-xs text-slate-400">{m.badge}</p>
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide">빠른 실행</h2>
        <div className="glass rounded-2xl divide-y divide-white/10">
          {[
            { label: "오늘 집안일 확인해요", sub: "로테이션 스케줄" },
            { label: "이번 달 지출 현황", sub: "공동 가계부" },
            { label: "다가오는 기념일", sub: "캘린더" },
          ].map((item) => (
            <button key={item.label} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors">
              <div>
                <p className="text-sm font-medium text-left">{item.label}</p>
                <p className="text-xs text-slate-400">{item.sub}</p>
              </div>
              <ChevronRight size={16} className="ml-auto text-slate-500" />
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
