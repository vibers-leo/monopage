// src/app/admin/pages/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye, Loader2, Share } from 'lucide-react';
import Link from 'next/link';
import BlockEditor from '@/components/editor/BlockEditor';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface PageEditProps {
  params: {
    id: string;
  };
}

export default function PageEdit({ params }: PageEditProps) {
  const router = useRouter();
  const pageId = params.id;
  const isNew = pageId === 'new';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    async function fetchPage() {
      if (isNew) {
        setIsLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'pages', pageId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || '');
          setContent(data.content || '');
          setSlug(data.slug || '');
        } else {
          alert('페이지를 찾을 수 없습니다.');
          router.push('/admin/pages');
        }
      } catch (error) {
        console.error("Error fetching page:", error);
        // alert('페이지 로드 중 오류가 발생했습니다.'); // 개발 중에는 주석 처리 (Config 없을 때 에러 방지)
      } finally {
        setIsLoading(false);
      }
    }

    fetchPage();
  }, [pageId, isNew, router]);

  const handleSave = async () => {
    if (!title) {
      alert('페이지 제목을 입력해주세요.');
      return;
    }

    setIsSaving(true);
    try {
      // 문서 ID는 slug를 기반으로 하거나, 자동 생성된 ID 사용 가능.
      // 여기서는 pageId가 있으면 업데이트, 'new'이면 slug를 ID로 사용하거나 자동 생성.
      // 간편함을 위해 'new'일 경우 자동 생성 ID를 쓰지 않고 slug가 있다면 slug를 ID로 쓸 수도 있음.
      // 하지만 slug 변경 가능성을 고려해 ID는 고정하는 것이 좋으나, 지금은 간단히 구현.
      
      const targetId = isNew ? (slug || Date.now().toString()) : pageId;
      const docRef = doc(db, 'pages', targetId);

      const pageData = {
        title,
        content,
        slug,
        updatedAt: serverTimestamp(),
        isPublished: true, // 기본 공개
      };

      if (isNew) {
        // 새 페이지 생성 시 createdAt 추가
        await setDoc(docRef, { ...pageData, createdAt: serverTimestamp() });
      } else {
        await updateDoc(docRef, pageData);
      }

      alert('저장되었습니다.');
      if (isNew) {
        router.push(`/admin/pages/${targetId}/edit`);
      }
    } catch (error) {
      console.error("Error saving page:", error);
      alert('저장에 실패했습니다. Firebase 설정을 확인해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Top Bar */}
      <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/pages" 
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="h-6 w-px bg-border mx-2" />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="페이지 제목 없음"
            className="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground min-w-[300px]"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded text-sm text-muted-foreground mr-2">
            <span className="opacity-50">/demo/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="url-slug"
              className="bg-transparent border-none focus:outline-none w-24 p-0 text-foreground"
            />
          </div>

          <button 
            className="p-2 text-muted-foreground hover:text-foreground rounded transition-colors"
            title="미리보기"
          >
            <Eye size={20} />
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            <span>{isNew ? '발행하기' : '저장하기'}</span>
          </button>
        </div>
      </div>

      {/* Main Content - Editor */}
      <div className="flex-1 overflow-auto bg-muted/10">
        <div className="max-w-4xl mx-auto py-12 px-6">
          <BlockEditor 
            content={content} 
            onChange={setContent} 
            editable={true}
          />
        </div>
      </div>
    </div>
  );
}
