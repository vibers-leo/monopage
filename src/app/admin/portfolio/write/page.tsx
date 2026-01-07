"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Upload, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Firebase
import { db, storage } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  serverTimestamp,
  deleteDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export default function PortfolioWritePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [internalPath, setInternalPath] = useState("");
  const [category, setCategory] = useState("Web");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (id) {
      setDataLoading(true);
      const fetchPortfolio = async () => {
        try {
          const docRef = doc(db, "portfolios", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setTitle(data.title);
            setDescription(data.description || "");
            setExternalUrl(data.external_url || "");
            setInternalPath(data.internal_path || "");
            setCategory(data.category || "Web");
            setPreviewUrl(data.thumbnail_url);
          }
        } catch (error) {
          console.error("Error loading portfolio:", error);
          alert("데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
          setDataLoading(false);
        }
      };
      
      fetchPortfolio();
    }
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleUploadImage = async () => {
    if (!file) return previewUrl; // 기존 이미지 URL 반환

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const storageRef = ref(storage, `portfolios/${fileName}`);
    
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const thumbnailUrl = await handleUploadImage();

      const portfolioData = {
        title,
        description,
        category,
        external_url: externalUrl || null,
        internal_path: internalPath || null,
        thumbnail_url: thumbnailUrl || null,
        updated_at: serverTimestamp(),
      };

      if (id) {
        // Update
        const docRef = doc(db, "portfolios", id);
        await updateDoc(docRef, portfolioData);
        alert("수정되었습니다.");
      } else {
        // Create
        await addDoc(collection(db, "portfolios"), {
          ...portfolioData,
          is_active: true,
          created_at: serverTimestamp(),
        });
        alert("등록되었습니다.");
      }
      
      router.push("/admin/portfolio");
      router.refresh(); // 리스트 갱신을 위해

    } catch (error) {
      console.error("Error saving portfolio:", error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm("정말 삭제하시겠습니까? 복구할 수 없습니다.")) return;
    
    setLoading(true);
    try {
      await deleteDoc(doc(db, "portfolios", id));
      
      // 이미지 삭제 로직도 추가하면 좋음 (선택사항)
      if (previewUrl && previewUrl.includes("firebasestorage")) {
         try {
             // URL에서 ref 추출이 복잡하므로 여기서는 생략하거나 추후 구현
         } catch (e) { console.error("Image delete fail", e); }
      }

      alert("삭제되었습니다.");
      router.push("/admin/portfolio");
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert("삭제 실패");
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-6">
        <Link href="/admin/portfolio" className="inline-flex items-center text-gray-500 hover:text-black">
          <ArrowLeft size={16} className="mr-1" /> 돌아가기
        </Link>
        {id && (
          <button 
            type="button"
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
          >
            <Trash2 size={16} /> 프로젝트 삭제
          </button>
        )}
      </div>

      <h1 className="text-2xl font-serif font-bold mb-8">
        {id ? "프로젝트 수정" : "새 프로젝트 등록"} (Firebase)
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">프로젝트명 *</label>
          <input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required 
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
            placeholder="예: Art Way"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">카테고리</label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
          >
            <option value="Web">Web Platform</option>
            <option value="Gallery">Gallery</option>
            <option value="Archive">Archive</option>
            <option value="Commerce">Commerce</option>
            <option value="Template">Template</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">썸네일 이미지</label>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {previewUrl ? (
              <div className="relative h-48 w-full">
                <Image src={previewUrl} alt="Preview" fill className="object-contain" />
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <Upload size={32} className="mb-2" />
                <span className="text-sm">클릭하여 이미지 업로드</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">간단 설명</label>
          <textarea 
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
            placeholder="프로젝트에 대한 간단한 설명을 입력하세요."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">외부 링크 (운영중인 사이트)</label>
            <input 
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">내부 템플릿 경로 (미리보기)</label>
             <input 
              value={internalPath}
              onChange={(e) => setInternalPath(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
              placeholder="/art-way"
            />
          </div>
        </div>

        <div className="pt-6 border-t">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "저장 중..." : (id ? "수정하기" : "등록하기")}
          </button>
        </div>
      </form>
    </div>
  );
}
