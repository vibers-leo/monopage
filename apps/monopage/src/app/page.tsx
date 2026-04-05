import Link from "next/link";
import { ArrowRight, Camera, Video, Share2, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-extrabold text-xl tracking-tighter">
          Monopage<span className="text-gray-300">.</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-black transition-colors">Login</Link>
          <Link href="/onboard" className="px-5 py-2 bg-black text-white rounded-full text-sm font-bold hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-black/10">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center container mx-auto max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">
          <Sparkles size={12} /> 
          <span>No Followers. No Noise. Just You.</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tightest leading-[0.9] mb-6 text-gradient">
          나를 표현하는<br />
          단 하나의 공간
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-xl mb-10 font-medium leading-relaxed">
          여러 SNS의 흩어진 게시물들을 한데 모아 나만의 포트폴리오를 만드세요. 
          따로 관리할 필요 없이, 연결만 하면 완성됩니다.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/onboard" className="group px-8 py-4 bg-black text-white rounded-full text-lg font-bold flex items-center gap-2 hover:scale-105 transition-transform">
            무료로 시작하기 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/alex_kim" className="px-8 py-4 bg-white text-black border border-gray-200 rounded-full text-lg font-bold hover:bg-gray-50 transition-colors">
            샘플 보기
          </Link>
        </div>

        {/* Mockup Preview */}
        <div className="mt-24 w-full max-w-4xl border border-gray-100 rounded-3xl p-8 md:p-12 bg-gray-50/50 relative overflow-hidden">
          <div className="flex flex-col gap-8 text-left">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-gray-200 border border-gray-300"></div>
              <div className="flex flex-col gap-2">
                <div className="h-5 w-32 bg-gray-200 rounded"></div>
                <div className="h-3 w-48 bg-gray-100 rounded"></div>
              </div>
            </div>

            <div className="flex gap-3">
              {['Portfolio', 'Instagram', 'YouTube'].map(tag => (
                <div key={tag} className="px-4 py-2 border border-gray-200 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white">
                  {tag}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-white border border-gray-100 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="py-10 border-t border-gray-50 text-center">
        <p className="text-gray-300 text-[10px] font-bold uppercase tracking-widest leading-loose">
          © 2026 Monopage. Created for personal branding.
        </p>
      </footer>
    </div>
  );
}
