"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import { ArrowRight, Check, Sparkles, Layout, Monitor } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");

  // Step 1: 닉네임 저장
  const handleNicknameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    
    setLoading(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: nickname
        });
        setUserName(nickname);
        setStep(2); // 다음 단계로
      }
    } catch (error) {
      console.error("Profile update error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Step 2 완료 후 대시보드로 이동
  const handleComplete = () => {
    router.push("/admin/dashboard");
  };

  // 로그인 안 된 상태면 로그인으로 튕겨냄 (보안)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/auth/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 animate-fade-in text-foreground">
      
      {/* 진행 상태 바 (Step Indicator) */}
      <div className="w-full max-w-md mb-12 flex gap-2">
        <div className={`h-1 flex-1 rounded-full transition-colors duration-500 ${step >= 1 ? "bg-foreground" : "bg-muted"}`} />
        <div className={`h-1 flex-1 rounded-full transition-colors duration-500 ${step >= 2 ? "bg-foreground" : "bg-muted"}`} />
      </div>

      <div className="w-full max-w-md">
        {step === 1 && (
          <div className="animate-slide-up">
            <h1 className="text-3xl font-serif font-medium mb-4">
              어떻게 불러드릴까요?
            </h1>
            <p className="text-muted-foreground mb-8">
              작가명이나 활동명을 입력해주세요. 나중에 언제든 변경할 수 있습니다.
            </p>
            
            <form onSubmit={handleNicknameSubmit}>
              <div className="relative mb-6">
                 <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="예: Vincent, 또는 스튜디오 홍길동"
                  className="w-full text-2xl font-serif border-b-2 border-muted focus:border-foreground bg-transparent py-2 outline-none transition-colors placeholder:text-muted/50"
                  autoFocus
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || !nickname.trim()}
                className="w-full py-4 bg-foreground text-background rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? "저장 중..." : "다음으로"}
                <ArrowRight size={20} />
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="animate-slide-up text-center">
            <div className="w-16 h-16 bg-foreground text-background rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles size={32} />
            </div>
            <h1 className="text-3xl font-serif font-medium mb-4">
              환영합니다, {userName}님!
            </h1>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              ArtPage는 작가님을 위해 준비된 공간입니다.<br />
              이제 당신만의 갤러리를 만들어보세요.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-10 text-left">
              <div className="p-4 border border-border rounded-xl bg-muted/20">
                <Layout className="mb-3 text-foreground" size={24} />
                <h3 className="font-medium mb-1">쉬운 편집</h3>
                <p className="text-xs text-muted-foreground">블록을 쌓듯이 쉽고 자유롭게 페이지를 구성하세요.</p>
              </div>
              <div className="p-4 border border-border rounded-xl bg-muted/20">
                <Monitor className="mb-3 text-foreground" size={24} />
                <h3 className="font-medium mb-1">자동 디자인</h3>
                <p className="text-xs text-muted-foreground">어떤 기기에서도 완벽하게 보이는 반응형 갤러리.</p>
              </div>
            </div>

            <button
              onClick={handleComplete}
              className="w-full py-4 bg-foreground text-background rounded-xl font-medium hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              내 갤러리 만들기
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
