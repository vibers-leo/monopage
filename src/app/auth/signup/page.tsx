"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Firebase 회원가입
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      // 성공 시 온보딩 페이지로 이동
      router.push("/onboarding");
    } catch (err: any) {
      console.error("Signup error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError("이미 사용 중인 이메일입니다.");
      } else if (err.code === 'auth/weak-password') {
        setError("비밀번호는 6자 이상이어야 합니다.");
      } else {
        setError("가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6 animate-fade-in">
      <div className="w-full max-w-sm">
        {/* 헤더 */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block group">
            <div className="w-12 h-12 mx-auto bg-foreground text-background rounded-xl flex items-center justify-center font-serif text-2xl mb-4 group-hover:rotate-6 transition-transform">
              A
            </div>
          </Link>
          <h1 className="text-2xl font-serif font-medium mb-2">
            3초 만에 시작하기
          </h1>
          <p className="text-sm text-muted-foreground">
            복잡한 절차 없이 이메일로 바로 시작하세요.
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={18} />
              <input
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 bg-muted/30 border border-border rounded-lg focus:outline-none focus:border-foreground focus:bg-background transition-all"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="비밀번호 (6자 이상)"
                className="w-full pl-10 pr-12 py-3 bg-muted/30 border border-border rounded-lg focus:outline-none focus:border-foreground focus:bg-background transition-all"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-destructive text-sm text-center font-medium bg-destructive/10 py-2 rounded">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span>계속하기</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* 푸터 */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link href="/auth/login" className="text-foreground font-medium hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
