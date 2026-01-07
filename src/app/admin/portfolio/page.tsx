"use client";

import Link from "next/link";
import { Plus, Globe, Folder } from "lucide-react";
import { useEffect, useState } from "react";
// Firebase
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { PortfolioItem } from "@/actions/portfolioActions";

export default function AdminPortfolioPage() {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "portfolios"), orderBy("created_at", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as PortfolioItem[];
        setPortfolios(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Portfolio Management (Firebase)</h1>
          <p className="text-gray-500">포트폴리오 프로젝트를 관리합니다.</p>
        </div>
        <Link 
          href="/admin/portfolio/write" 
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
        >
          <Plus size={18} /> 새 프로젝트 등록
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden group hover:shadow-lg transition">
            {/* Thumbnail */}
            <div className="h-48 bg-gray-100 relative overflow-hidden">
              {item.thumbnail_url ? (
                <img 
                  src={item.thumbnail_url} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Folder size={48} />
                </div>
              )}
              {item.category && (
                <span className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                  {item.category}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px]">
                {item.description || "설명이 없습니다."}
              </p>

              <div className="flex flex-col gap-2 text-sm text-gray-600">
                {item.external_url && (
                   <div className="flex items-center gap-2 truncate">
                      <Globe size={14} className="text-blue-500" />
                      <a href={item.external_url} target="_blank" className="hover:underline truncate">
                        {item.external_url}
                      </a>
                   </div>
                )}
                {item.internal_path && (
                   <div className="flex items-center gap-2 truncate">
                      <Folder size={14} className="text-green-500" />
                      <Link href={item.internal_path} className="hover:underline truncate">
                        {item.internal_path} (Template)
                      </Link>
                   </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
                 <Link 
                   href={`/admin/portfolio/write?id=${item.id}`}
                   className="text-sm px-3 py-1.5 border border-gray-200 rounded hover:bg-gray-50"
                 >
                   수정 (View)
                 </Link>
                 {/* 삭제는 수정 페이지 안에서 처리 */}
              </div>
            </div>
          </div>
        ))}

        {portfolios.length === 0 && (
          <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-400 mb-4">등록된 포트폴리오가 없습니다.</p>
            <Link 
              href="/admin/portfolio/write" 
              className="text-blue-600 hover:underline"
            >
              첫 프로젝트를 등록해보세요
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
