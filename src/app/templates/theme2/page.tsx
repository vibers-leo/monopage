"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";

const GALLERY_ITEMS = [
  { id: 1, title: '달항아리', artist: '김영희', year: '2024', src: 'https://images.unsplash.com/photo-1610495392873-1386266209bb?q=80&w=2800&auto=format&fit=crop' },
  { id: 2, title: '소나무', artist: '이철수', year: '2023', src: 'https://images.unsplash.com/photo-1518972458649-b0f242a64cc8?q=80&w=2800&auto=format&fit=crop' },
  { id: 3, title: '기와', artist: '박지성', year: '2024', src: 'https://images.unsplash.com/photo-1617267448897-488663806a4b?q=80&w=2800&auto=format&fit=crop' },
  { id: 4, title: '한복의 선', artist: '최미나', year: '2024', src: 'https://images.unsplash.com/photo-1582236894376-7bc618e00138?q=80&w=2800&auto=format&fit=crop' },
  { id: 5, title: '고요', artist: '정우성', year: '2023', src: 'https://images.unsplash.com/photo-1544084666-4f7943063f2d?q=80&w=2800&auto=format&fit=crop' },
  { id: 6, title: '차 한잔', artist: '강다니엘', year: '2024', src: 'https://images.unsplash.com/photo-1579017308347-e53e0d2fc5e9?q=80&w=2800&auto=format&fit=crop' },
];

export default function TemplateTheme2() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2C2C] font-serif selection:bg-[#D4A373] selection:text-white">
      {/* 1. Sidebar Navigation (Left, Fixed for Desktop) */}
      <nav className="fixed left-0 top-0 bottom-0 w-24 border-r border-[#E5E0D8] hidden md:flex flex-col items-center justify-between py-12 z-50 bg-[#FDFBF7]">
        <div className="writing-vertical text-lg font-bold tracking-[0.3em] opacity-80 cursor-pointer hover:opacity-100 transition-opacity">
          북촌예술공간
        </div>
        <div className="flex flex-col gap-8 text-xs font-light tracking-widest text-center">
          <Link href="#" className="hover:text-[#D4A373] transition-colors writing-vertical py-2">전시</Link>
          <Link href="#" className="hover:text-[#D4A373] transition-colors writing-vertical py-2">작가</Link>
          <Link href="#" className="hover:text-[#D4A373] transition-colors writing-vertical py-2">공간</Link>
          <Link href="#" className="hover:text-[#D4A373] transition-colors writing-vertical py-2">문의</Link>
        </div>
        <div className="opacity-50 hover:opacity-100 cursor-pointer">
          <Search size={20} strokeWidth={1} />
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="md:hidden flex justify-between items-center p-6 border-b border-[#E5E0D8] sticky top-0 bg-[#FDFBF7]/90 z-50 backdrop-blur-sm">
        <span className="text-xl font-bold">북촌예술공간</span>
        <button onClick={() => setMenuOpen(true)}>
          <Menu size={24} strokeWidth={1} />
        </button>
      </header>
      
      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#FDFBF7] flex flex-col items-center justify-center gap-8 text-xl font-serif">
          <button onClick={() => setMenuOpen(false)} className="absolute top-6 right-6">
            <X size={32} strokeWidth={1} />
          </button>
          <Link href="#" onClick={() => setMenuOpen(false)}>전시</Link>
          <Link href="#" onClick={() => setMenuOpen(false)}>작가</Link>
          <Link href="#" onClick={() => setMenuOpen(false)}>공간</Link>
          <Link href="#" onClick={() => setMenuOpen(false)}>문의</Link>
        </div>
      )}

      {/* Main Content Area */}
      <main className="md:pl-24 w-full">
        {/* 2. Hero Section (Typographic) */}
        <section className="h-[80vh] flex flex-col items-center justify-center px-6 text-center border-b border-[#E5E0D8]">
          <div className="mb-8">
            <span className="inline-block px-3 py-1 border border-[#2C2C2C] text-[10px] tracking-widest mb-4">
              CURRENT EXHIBITION
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-snug mb-10 text-gray-800">
            선의 미학,<br />
            한국의 멋을 담다
          </h1>
          <p className="text-sm md:text-base text-gray-500 font-light leading-relaxed max-w-lg mx-auto">
            전통과 현대가 만나는 지점에서<br />
            새로운 예술적 영감을 발견하세요.
          </p>
          <div className="mt-16 w-px h-24 bg-gray-300" />
        </section>

        {/* 3. Gallery Grid (Minimal Masonry Vibe) */}
        <section className="py-24 px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {GALLERY_ITEMS.map((item, idx) => (
              <div key={item.id} className={`group cursor-pointer ${idx % 2 === 1 ? 'md:translate-y-16' : ''}`}> {/* Staggered Effect */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-6 shadow-sm hover:shadow-md transition-shadow duration-500">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105 group-hover:grayscale-[20%]"
                  />
                  <div className="absolute inset-0 bg-[#2C2C2C]/0 group-hover:bg-[#2C2C2C]/10 transition-colors duration-500" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-500 tracking-widest">{item.artist}, {item.year}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Contact / Info */}
        <section className="py-24 border-t border-[#E5E0D8] bg-[#F7F4EF]">
          <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-lg font-bold mb-6">방문 안내</h3>
              <p className="text-sm leading-loose text-gray-600">
                서울특별시 종로구 북촌로 12길<br />
                화 - 일 11:00 - 18:00<br />
                매주 월요일 휴관
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6">문의</h3>
              <p className="text-sm leading-loose text-gray-600">
                T. 02-123-4567<br />
                E. art@bukchon.kr<br />
                Instagram @bukchon_art
              </p>
            </div>
          </div>
        </section>
        
        <footer className="py-8 text-center text-[10px] text-gray-400 border-t border-[#E5E0D8]">
          &copy; 2025 BUKCHON ART SPACE.
        </footer>
      </main>
      
      <style jsx global>{`
        .writing-vertical {
          writing-mode: vertical-rl;
          text-orientation: upright;
        }
      `}</style>
    </div>
  );
}
