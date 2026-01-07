"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Header from "@/components/Header";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import type { PortfolioItem } from "@/actions/portfolioActions";

// Fallback data (DB 연결 전 데모용)
const fallbackPortfolios: PortfolioItem[] = [
  {
    id: "fallback-1",
    title: "Bukchon Art Gallery",
    description: "갤러리 및 전시 공간을 위한 모던하고 미니멀한 웹 템플릿입니다.",
    thumbnail_url: "/images/view.jpg",
    external_url: null,
    internal_path: "/demo",
    category: "Template",
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: "fallback-2",
    title: "Art Way",
    description: "아티스트를 위한 감각적인 포트폴리오 및 전시 아카이빙 템플릿입니다.",
    thumbnail_url: "/images/gallery1.png",
    external_url: null,
    internal_path: "/art-way",
    category: "Template",
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: "fallback-3",
    title: "Art Hyun",
    description: "공공미술 및 사회적 기업을 위한 신뢰감 있는 비즈니스 템플릿입니다.",
    thumbnail_url: "/images/gallery2.png",
    external_url: null,
    internal_path: "/arthyun",
    category: "Template",
    is_active: true,
    created_at: new Date().toISOString()
  }
];

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(db, "portfolios"), 
          where("is_active", "==", true),
          orderBy("created_at", "desc")
        );
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            // DB 비어있으면 Fallback 사용
            setPortfolios(fallbackPortfolios);
        } else {
            const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            })) as PortfolioItem[];
            setPortfolios(data);
        }
      } catch (error) {
        console.warn("Firebase fetch error, using fallback:", error);
        setPortfolios(fallbackPortfolios);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-32 pb-24 px-6 max-w-screen-2xl mx-auto">
        <div className="mb-20">
          <h1 className="text-5xl md:text-7xl font-serif font-light mb-8">
            Our Works
          </h1>
          <p className="text-xl text-gray-400 font-light max-w-2xl">
            우리가 만들어온 다양한 예술과 기술의 융합 프로젝트들을 소개합니다.
            각 프로젝트는 고유한 아이덴티티와 목적을 가지고 있습니다.
          </p>
        </div>

        {loading ? (
             <div className="py-20 text-center text-gray-300">Loading projects...</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
            {portfolios.map((item, index) => (
                <div key={item.id} className={`group ${index % 2 === 1 ? 'md:mt-24' : ''}`}>
                <a 
                    href={item.external_url || item.internal_path || "#"} 
                    target={item.external_url ? "_blank" : "_self"}
                    className="block mb-6 overflow-hidden rounded-lg bg-gray-100 relative aspect-[4/3]"
                >
                    {item.thumbnail_url ? (
                    <img 
                        src={item.thumbnail_url} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out grayscale group-hover:grayscale-0"
                    />
                    ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        No Image
                    </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <ArrowUpRight size={20} />
                    </div>
                </a>

                <div className="flex justify-between items-start border-t border-gray-200 pt-6">
                    <div>
                    <span className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-2 block">
                        {item.category}
                    </span>
                    <h3 className="text-2xl font-serif font-medium mb-2 group-hover:underline decoration-1 underline-offset-4">
                        {item.title}
                    </h3>
                    <p className="text-gray-500 font-light text-sm line-clamp-2 max-w-md">
                        {item.description}
                    </p>
                    </div>
                </div>
                </div>
            ))}

            {portfolios.length === 0 && (
                <div className="col-span-full text-center py-24 text-gray-300 font-light">
                준비된 포트폴리오가 없습니다.
                </div>
            )}
            </div>
        )}
      </main>
    </div>
  );
}
