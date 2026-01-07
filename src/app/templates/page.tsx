"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Layout, Sparkles, Home } from "lucide-react";
import PlatformHeader from "../(platform)/components/PlatformHeader";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const TEMPLATES = [
  {
    id: "theme1",
    title: "THE MUSE",
    description: "K-POP 아티스트와 인플루언서를 위한 세련되고 몰입감 있는 팬덤 플랫폼 템플릿.",
    descriptionEn: "A stylish and immersive fandom platform template for K-POP artists and influencers.",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1200",
    link: "/templates/theme1",
    tags: ["Artist", "Dark Mode", "Video"],
  },
  {
    id: "theme2",
    title: "BUKCHON (북촌)",
    description: "한국의 전통미(美)와 여백을 살린 정갈하고 미니멀한 갤러리 템플릿.",
    descriptionEn: "A minimal gallery template emphasizing Korean traditional beauty and emptiness.",
    icon: Home,
    image: "https://images.unsplash.com/photo-1610495392873-1386266209bb?q=80&w=1200",
    link: "/templates/theme2",
    tags: ["Traditional", "Minimal", "Serif"],
  },
  {
    id: "theme3",
    title: "ART WAY (아트웨이)",
    description: "3D 패럴럭스 효과로 작품을 입체적이고 다이내믹하게 보여주는 전시형 템플릿.",
    descriptionEn: "An exhibition template showcasing artworks dynamically with 3D parallax effects.",
    icon: Layout,
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1200",
    link: "/templates/theme3",
    tags: ["3D Effect", "Modern", "Gallery"],
  },
];

export default function TemplatesPage() {
  const { locale } = useLanguage();

  return (
    <div className="min-h-screen bg-neutral-50 selection:bg-black selection:text-white">
      <PlatformHeader />
      
      <main className="pb-24">
        {/* Header Section (Hero) */}
        <section className="relative py-24 flex flex-col items-center justify-center px-6 text-center mb-10 overflow-hidden">
             <div className="absolute inset-0 z-0">
                <Image
                  src="https://images.unsplash.com/photo-1544207240-8b1025eb7aeb?q=80&w=2800&auto=format&fit=crop"
                  alt="Template Background"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/60" />
             </div>

             <div className="relative z-10 max-w-2xl mx-auto animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-serif font-medium mb-6 text-white">
                    Choose Your <span className="italic">Canvas</span>
                </h1>
                <p className="text-lg text-gray-200 leading-relaxed">
                    {locale === 'ko' 
                    ? "당신의 예술 세계를 가장 잘 표현할 수 있는 공간을 선택하세요.\n코딩 없이 클릭만으로 시작할 수 있습니다."
                    : "Select the space that best represents your art world.\nStart with just a click, no coding required."}
                </p>
             </div>
        </section>

        {/* Templates Grid Container */}
        <div className="px-6 md:px-12 max-w-[1440px] mx-auto">

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {TEMPLATES.map((template, index) => (
            <Link 
              key={template.id} 
              href={template.link}
              className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <Image
                  src={template.image}
                  alt={template.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                
                {/* Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 text-xs font-bold tracking-wider shadow-sm">
                  <template.icon size={14} />
                  <span>{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex gap-2 mb-4">
                  {template.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase font-bold tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl font-serif font-medium mb-3 group-hover:text-blue-600 transition-colors">
                  {template.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-8 h-12 line-clamp-2">
                  {locale === 'ko' ? template.description : template.descriptionEn}
                </p>
                <div className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-black group-hover:gap-4 transition-all">
                  Preview Template <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
        </div>
      </main>
      
      {/* Footer Call to Action */}
      <section className="py-24 border-t border-gray-200 bg-white text-center">
        <h2 className="text-2xl md:text-3xl font-serif mb-6">
          {locale === 'ko' ? "마음에 드는 템플릿을 찾으셨나요?" : "Found your favorite template?"}
        </h2>
        <Link 
            href="/auth/signup"
            className="inline-flex h-14 items-center justify-center rounded-full bg-black px-10 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
            {locale === 'ko' ? "무료로 시작하기" : "Start Building for Free"}
        </Link>
      </section>
    </div>
  );
}
