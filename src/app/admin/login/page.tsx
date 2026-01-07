"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else if (err.code === "auth/too-many-requests") {
        setError("너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.");
      } else {
        setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
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
            다시 만나서 반가워요
          </h1>
          <p className="text-sm text-muted-foreground">
            이메일로 로그인하여 계속하세요.
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={18} />
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 bg-muted/30 border border-border rounded-lg focus:outline-none focus:border-foreground focus:bg-background transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="비밀번호"
                className="w-full pl-10 pr-12 py-3 bg-muted/30 border border-border rounded-lg focus:outline-none focus:border-foreground focus:bg-background transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                <span>로그인</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* 푸터 */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          계정이 없으신가요?{" "}
          <Link href="/auth/signup" className="text-foreground font-medium hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
