"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import BlockViewer from '@/components/editor/BlockViewer';
import { Loader2 } from 'lucide-react';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function DynamicPage({ params }: PageProps) {
  const [pageData, setPageData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchPage() {
      try {
        // slug 필드가 params.slug와 일치하는 문서 찾기
        const q = query(
          collection(db, 'pages'), 
          where('slug', '==', params.slug)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // 첫 번째 일치하는 문서 사용
          setPageData(querySnapshot.docs[0].data());
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error loading page:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPage();
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-serif mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          찾으시는 페이지가 존재하지 않거나 준비 중입니다.
        </p>
        <a href="/demo" className="px-6 py-3 bg-foreground text-background rounded-full hover:opacity-90 transition-opacity">
          홈으로 돌아가기
        </a>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-20">
      {/* Optional: Header Image from pageData if available */}
      <div className="max-w-screen-lg mx-auto px-6 py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-serif font-medium mb-12 text-center">
          {pageData.title}
        </h1>
        
        <div className="bg-background">
          <BlockViewer content={pageData.content} />
        </div>
      </div>
    </div>
  );
}
