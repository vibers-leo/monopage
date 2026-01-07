"use client";

import { HeroParallax } from "@/components/ui/hero-parallax";

// HeroParallax에 사용할 15개의 검증된 고화질 이미지 데이터
const PRODUCTS = [
    { title: "Moonbeam", link: "#", thumbnail: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=3000&auto=format&fit=crop" },
    { title: "Cursor", link: "#", thumbnail: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=3000&auto=format&fit=crop" },
    { title: "Rogue", link: "#", thumbnail: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop" },
    { title: "Editorally", link: "#", thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" },
    { title: "Editrix AI", link: "#", thumbnail: "https://images.unsplash.com/photo-1482160549825-59d1b23cb208?q=80&w=3000&auto=format&fit=crop" },
    { title: "Pixel Perfect", link: "#", thumbnail: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=2787&auto=format&fit=crop" },
    { title: "Algochurn", link: "#", thumbnail: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=3000&auto=format&fit=crop" },
    { title: "Aceternity UI", link: "#", thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=3000&auto=format&fit=crop" },
    { title: "Tailwind Master Kit", link: "#", thumbnail: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=3000&auto=format&fit=crop" },
    { title: "SmartBridge", link: "#", thumbnail: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=3000&auto=format&fit=crop" },
    { title: "Renderwork", link: "#", thumbnail: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=3000&auto=format&fit=crop" },
    { title: "Creme Digital", link: "#", thumbnail: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?q=80&w=3000&auto=format&fit=crop" },
    { title: "Golden Bells Academy", link: "#", thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=3000&auto=format&fit=crop" },
    { title: "Invoker Labs", link: "#", thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=3000&auto=format&fit=crop" },
    { title: "E Free Invoice", link: "#", thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=3000&auto=format&fit=crop" },
];

export default function TemplateTheme3() {
  return (
    <div className="bg-black min-h-screen">
       {/* 
         HeroParallax 컴포넌트는 내부적으로 Header와 Products Grid를 모두 포함함.
         Parallax Scroll 효과가 들어간 모던한 갤러리 템플릿.
       */}
      <HeroParallax products={PRODUCTS} />
    </div>
  );
}
