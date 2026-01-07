"use client";

import Image from "next/image";
import PlatformHeader from "../(platform)/components/PlatformHeader";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ArrowDown } from "lucide-react";

export default function FeaturesPage() {
  const { locale } = useLanguage();

  const features = [
    {
      subtitle: "IMMERSIVE EXPERIENCE",
      title: locale === 'ko' ? "작품, 그 이상의 감동을\n전달하는 갤러리" : "Gallery beyond Artworks",
      desc: locale === 'ko' 
        ? "멈춰있는 그림이 아닌, 살아 숨 쉬는 이야기를 전하세요. 관람객의 손끝에서 깊어지는 공간감과 여운은, 당신의 예술을 단순한 감상을 넘어 하나의 완벽한 경험으로 완성합니다."
        : "Don't just show static images; tell a living story. The depth and immersion felt at the viewer's fingertips turn your art into a perfect journey beyond simple appreciation.",
      image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2800&auto=format&fit=crop", // Immersive Gallery
      align: "right"
    },
    {
      subtitle: "YOUR OWN ARCHIVE",
      title: locale === 'ko' ? "흘려보내지 마세요.\n차곡차곡 쌓아올린 역사" : "Your History, Archived",
      desc: locale === 'ko'
        ? "SNS의 피드는 시간과 함께 흘러가 버립니다. ArtPage에서는 당신의 초기작부터 현재의 걸작까지, 당신이 원하는 맥락과 순서대로 작품을 영구히 보존할 수 있습니다. 당신만의 예술 세계를 견고하게 구축하세요."
        : "Social feed fades away with time. On ArtPage, preserve everything from your early sketches to your masterpieces forever. Build your art world solidly in your own context.",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2800&auto=format&fit=crop", // Library/Archive
      align: "left"
    },
    {
      subtitle: "BORDERLESS CONNECTION",
      title: locale === 'ko' ? "국경 없는 연결,\n세상과 만나는 가장 쉬운 길" : "Borderless Connection",
      desc: locale === 'ko'
        ? "언어와 화폐의 장벽을 넘으세요. 자동 번역되는 페이지와 전 세계 결제 시스템은 당신의 예술을 지구 반대편의 컬렉터와 연결합니다. 당신은 창작에만 집중하세요."
        : "Cross the barriers of language and currency. With auto-translation and global payments, connect your art with collectors on the other side of the world. Just focus on creating.",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2800&auto=format&fit=crop", // People/Connection
      align: "right"
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      <PlatformHeader />
      
      <main>
        {/* 1. Hero Section (Emotional & Cinematic) */}
        <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden text-white">
             <div className="absolute inset-0 z-0">
                <Image
                  src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2800&auto=format&fit=crop" // Dynamic Event/Space
                  alt="Artistic Space"
                  fill
                  className="object-cover opacity-70"
                  priority
                />
                <div className="absolute inset-0 bg-black/75" />
             </div>

             <div className="relative z-10 max-w-4xl animate-fade-in-up">
                <h1 className="text-3xl md:text-5xl font-serif font-light mb-8 leading-tight tracking-tight text-white">
                    {locale === 'ko' ? "기술이 아닌,\n예술을 담았습니다." : "Not Features,\nBut Essence."}
                </h1>
                <p className="text-lg md:text-xl text-white/80 font-light max-w-2xl mx-auto leading-relaxed">
                    {locale === 'ko' 
                        ? "ArtPage는 복잡한 기능을 자랑하지 않습니다.\n오직 당신의 작품이 가장 빛나는 방법에 대해서만 고민했습니다."
                        : "ArtPage doesn't boast complex features.\nWe only obsess over how your work shines the brightest."}
                </p>
             </div>

             <div className="absolute bottom-12 animate-bounce opacity-50">
                <ArrowDown size={32} />
             </div>
        </section>

        {/* 2. Features Storytelling (Magazine Layout) */}
        <section className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto space-y-32">
            {features.map((feature, idx) => (
                <div key={idx} className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 ${feature.align === 'left' ? 'md:flex-row-reverse' : ''}`}>
                    {/* Text Area */}
                    <div className="flex-1 space-y-8">
                        <span className="text-xs font-bold tracking-[0.3em] text-gray-500">{feature.subtitle}</span>
                        <h2 className="text-3xl md:text-5xl font-serif leading-tight whitespace-pre-line text-black">
                            {feature.title}
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed font-light">
                            {feature.desc}
                        </p>
                    </div>

                    {/* Image Area */}
                    <div className="flex-1 relative aspect-[4/5] w-full bg-gray-100 overflow-hidden group">
                        <Image
                            src={feature.image}
                            alt={feature.title}
                            fill
                            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                    </div>
                </div>
            ))}
        </section>

        {/* 3. Closing Statement */}
        <section className="py-40 text-center px-6 border-t border-gray-100">
            <h2 className="text-4xl md:text-6xl font-serif mb-12 text-black">
                {locale === 'ko' ? "당신의 이야기는\n이제 시작입니다." : "Your story begins here."}
            </h2>
             <p className="text-gray-600 mb-12 max-w-xl mx-auto leading-relaxed">
                {locale === 'ko' ? "ArtPage라는 캔버스 위에 마음껏 그려나가세요." : "Paint freely on the canvas called ArtPage."}
             </p>
        </section>

      </main>
    </div>
  );
}
