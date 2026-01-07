"use client";

import Image from "next/image";
import Link from "next/link";

interface ContentItem {
  id: string;
  type: string;
  title: string;
  date: string;
  imageUrl: string;
  link: string;
}

const dummyContents: ContentItem[] = [
  {
    id: "1",
    type: "EXHIBITION",
    title: "현대와 전통의 조화: 서울 아티잔",
    date: "2024.03.15",
    imageUrl: "/gallery1.png",
    link: "/archive",
  },
  {
    id: "2",
    type: "EVENT",
    title: "봄맞이 특별 도예전: 흙의 기억",
    date: "2024.04.01",
    imageUrl: "/gallery2.png",
    link: "/mall",
  },
  {
    id: "3",
    type: "NEWS",
    title: "새로운 공간, 새로운 시작",
    date: "2024.02.28",
    imageUrl: "/hero.png", // Hero 이미지를 재사용하거나 view.jpg 사용
    link: "/about",
  },
  {
    id: "4",
    type: "NOTICE",
    title: "갤러리 리뉴얼 오픈 안내",
    date: "2024.02.20",
    imageUrl: "/view.jpg",
    link: "/contact",
  },
];

export default function MasonryGrid() {
  return (
    <section className="bg-white py-20 px-4 md:px-8">
      <div className="max-w-screen-2xl mx-auto">
        {/* 섹션 헤더 */}
        <div className="flex justify-between items-end mb-12 border-b border-gray-900 pb-4">
          <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tighter">
            LATEST CONTENTS
          </h2>
          <Link 
            href="/archive" 
            className="hidden md:block text-sm font-medium hover:opacity-50 transition-opacity"
          >
            VIEW ALL &rarr;
          </Link>
        </div>

        {/* 그리드 레이아웃 (대성 홈페이지 스타일 참고: 불규칙한 그리드 느낌) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[400px]">
          
          {/* 첫 번째 아이템 (크게 강조) */}
          <Link 
            href={dummyContents[0].link}
            className="group relative col-span-1 md:col-span-2 lg:col-span-2 row-span-1 md:row-span-1 overflow-hidden bg-gray-100"
          >
            <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            <Image
              src={dummyContents[0].imageUrl}
              alt={dummyContents[0].title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 z-20 p-8 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <span className="inline-block px-3 py-1 mb-3 text-xs font-bold border border-white/30 backdrop-blur-sm">
                {dummyContents[0].type}
              </span>
              <h3 className="text-2xl md:text-3xl font-serif font-medium mb-2">
                {dummyContents[0].title}
              </h3>
              <p className="opacity-0 group-hover:opacity-80 transition-opacity duration-300 text-sm">
                {dummyContents[0].date}
              </p>
            </div>
          </Link>

          {/* 나머지 아이템들 */}
          {dummyContents.slice(1).map((content) => (
            <Link 
              key={content.id}
              href={content.link}
              className="group relative col-span-1 row-span-1 overflow-hidden bg-gray-100"
            >
              <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              <Image
                src={content.imageUrl}
                alt={content.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 z-20 p-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block px-2 py-0.5 mb-2 text-[10px] font-bold border border-white/30 backdrop-blur-sm">
                  {content.type}
                </span>
                <h3 className="text-xl font-serif font-medium mb-1 line-clamp-2">
                  {content.title}
                </h3>
                <p className="opacity-0 group-hover:opacity-80 transition-opacity duration-300 text-xs">
                  {content.date}
                </p>
              </div>
            </Link>
          ))}
          
        </div>

        <div className="mt-8 text-center md:hidden">
           <Link 
            href="/archive" 
            className="text-sm font-medium border-b border-black pb-1"
          >
            VIEW ALL CONTENTS
          </Link>
        </div>
      </div>
    </section>
  );
}
