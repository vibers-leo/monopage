"use client";

import { Check, ArrowRight, Coffee, Sparkles, Gem, ArrowUpRight } from "lucide-react";
import PlatformHeader from "../(platform)/components/PlatformHeader";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function PricingPage() {
  const { locale } = useLanguage();

  return (
    <div className="min-h-screen bg-neutral-50 selection:bg-black selection:text-white">
      <PlatformHeader />
      
      <main className="pb-24">
        {/* Hero Section with Image (Compact) */}
        <section className="relative py-32 flex flex-col items-center justify-center px-6 text-center mb-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
             <Image
                src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2800&auto=format&fit=crop"
                alt="Pricing Background"
                fill
                className="object-cover"
                priority
             />
             <div className="absolute inset-0 bg-black/60" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto animate-fade-in-up">
            <span className="text-xs font-bold tracking-widest text-blue-300 uppercase mb-4 block">Pricing Plans</span>
            <h1 className="text-3xl md:text-4xl font-serif font-medium mb-4 text-white leading-tight">
              {locale === 'ko' ? "활동 규모와 목적에 맞춘\n유연한 플랜" : "Flexible plans tailored to your needs."}
            </h1>
            <p className="text-base text-gray-200 leading-relaxed font-light">
              {locale === 'ko' 
                ? "처음은 가볍게 시작하고, 필요할 때 확장하세요. ArtPage는 당신의 모든 여정을 함께합니다."
                : "Start light, expand when you need to. ArtPage is with you on every step of your journey."}
            </p>
          </div>
        </section>

        {/* Pricing Cards Container */}
        <div className="px-6 md:px-12 max-w-[1440px] mx-auto">
          
          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* 1. FREE PLAN */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Coffee size={120} />
             </div>
             
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold tracking-widest uppercase rounded-full">개인 아티스트</span>
                </div>
                <h3 className="text-3xl font-serif font-medium mb-2">Free</h3>
                <p className="text-gray-500 text-sm mb-8">가볍게 시작하고, 수익이 생기면 후원하세요.</p>
                
                <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold font-sans">₩0</span>
                        <span className="text-gray-400 font-medium">/ 월</span>
                    </div>
                     <p className="text-xs text-gray-400 mt-2 ml-1">초기 세팅비 무료</p>
                </div>

                <div className="space-y-4 mb-10">
                    <li className="flex gap-3 text-sm text-gray-700">
                        <Check size={18} className="text-green-600 shrink-0" />
                        <span>기본 템플릿 제공</span>
                    </li>
                    <li className="flex gap-3 text-sm text-gray-700">
                        <Check size={18} className="text-green-600 shrink-0" />
                        <span>갤러리 호스팅 무료</span>
                    </li>
                     <li className="flex gap-3 text-sm text-gray-700">
                        <Check size={18} className="text-green-600 shrink-0" />
                        <span>자발적 후원 (Buy me a coffee)</span>
                    </li>
                </div>

                <Link href="/auth/signup" className="block w-full py-4 text-center rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition-colors">
                    무료로 시작하기
                </Link>
             </div>
          </div>

          {/* 2. PRO PLAN (Highlighted) */}
          <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 shadow-2xl relative overflow-hidden text-white lg:-mt-8 lg:mb-8 group hover:scale-[1.02] transition-transform duration-300">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-blue-400">
                <Sparkles size={140} />
             </div>
             
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-[10px] font-bold tracking-widest uppercase rounded-full border border-blue-500/30">갤러리 / 단체</span>
                </div>
                <h3 className="text-3xl font-serif font-medium mb-2">Pro</h3>
                <p className="text-gray-400 text-sm mb-8">전문적인 판매와 브랜딩을 위한 기능.</p>
                
                <div className="mb-8">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold font-sans">₩20,000</span>
                            <span className="text-gray-400 font-medium">/ 월</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-blue-200/90">
                            <span>또는 연 200,000원</span>
                            <span className="bg-blue-500/30 text-blue-200 text-[10px] px-2 py-0.5 rounded-full">2개월 SAVE</span>
                        </div>
                    </div>
                     <p className="text-xs text-gray-400 mt-4 ml-1">초기 세팅비 100만원부터 ~</p>
                </div>

                <div className="space-y-4 mb-10">
                    <li className="flex gap-3 text-sm text-gray-300">
                        <Check size={18} className="text-blue-400 shrink-0" />
                        <span>모든 Free 기능 포함</span>
                    </li>
                    <li className="flex gap-3 text-sm text-gray-300">
                        <Check size={18} className="text-blue-400 shrink-0" />
                        <span>작품 / 티켓 / 굿즈 판매 관리 기능</span>
                    </li>
                     <li className="flex gap-3 text-sm text-gray-300">
                        <Check size={18} className="text-blue-400 shrink-0" />
                        <span>정기 결제 (멤버십) 시스템</span>
                    </li>
                    <li className="flex gap-3 text-sm text-gray-300">
                        <Check size={18} className="text-blue-400 shrink-0" />
                        <span>커스텀 도메인 연결</span>
                    </li>
                </div>

                <Link href="/contact" className="block w-full py-4 text-center rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors">
                    도입 문의하기
                </Link>
             </div>
          </div>

          {/* 3. MASTER PLAN */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Gem size={120} />
             </div>
             
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold tracking-widest uppercase rounded-full">전문 예술가 / 기업</span>
                </div>
                <h3 className="text-3xl font-serif font-medium mb-2">Master</h3>
                <p className="text-gray-500 text-sm mb-8">확장을 위한 협업 프로젝트</p>
                
                <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold font-sans">Custom</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 ml-1">초기 비용 및 관리비 별도 문의</p>
                </div>

                <div className="space-y-4 mb-10">
                    <li className="flex gap-3 text-sm text-gray-700">
                        <Check size={18} className="text-purple-600 shrink-0" />
                        <span>작업 구현을 위한 자문</span>
                    </li>
                    <li className="flex gap-3 text-sm text-gray-700">
                        <Check size={18} className="text-purple-600 shrink-0" />
                        <span>글로벌 확장을 위한 퍼블리싱</span>
                    </li>
                    <li className="flex gap-3 text-sm text-gray-700">
                        <Check size={18} className="text-purple-600 shrink-0" />
                        <span>인터렉티브 웹 / 앱</span>
                    </li>
                     <li className="flex gap-3 text-sm text-gray-700">
                        <Check size={18} className="text-purple-600 shrink-0" />
                        <span>아트 콜라보레이션</span>
                    </li>
                </div>

                <Link href="/contact" className="block w-full py-4 text-center rounded-xl border border-gray-200 text-gray-900 font-medium hover:bg-gray-50 transition-colors">
                    상담 신청하기
                </Link>
             </div>
          </div>

        </div>
        </div>

        {/* FAQ Section Lite */}
        <div className="mt-32 max-w-4xl mx-auto">
            <h2 className="text-2xl font-serif font-medium mb-12 text-center">자주 묻는 질문</h2>
            <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-xl font-bold mb-3">초기비용이 무료인가요?</h3>
                    <p className="text-gray-600 text-base leading-relaxed">네, Free 플랜은 초기 세팅비와 월 관리비가 발생하지 않습니다. Artpage를 통해서 작품이 판매되시면 커피나 한잔 사주세요^^</p>
                </div>
                <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-xl font-bold mb-3">나중에 플랜을 변경할 수 있나요?</h3>
                    <p className="text-gray-600 text-base leading-relaxed">물론입니다. 무료로 운영하시다가 별도의 기능이 필요할 때 언제든지 Pro ~ Master 플랜으로 업그레이드하실 수 있습니다. 혹은 반대의 경우도 가능합니다.</p>
                </div>
                 <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-xl font-bold mb-3">커스텀 디자인 의뢰나 별도의 기능개발도 가능한가요?</h3>
                    <p className="text-gray-600 text-base leading-relaxed">네, 별도의 디자인 의뢰나 기능개발도 가능하며, 별도로 문의주시면 답변드리겠습니다. 다양한 협업 문의를 환영합니다.</p>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}
