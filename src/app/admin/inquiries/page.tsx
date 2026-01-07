"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, Trash2, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  status: 'pending' | 'processing' | 'done';
  createdAt: any;
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Firestore 실시간 구독
  useEffect(() => {
    const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Inquiry[];
      setInquiries(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (id: string, newStatus: Inquiry['status']) => {
    try {
        await updateDoc(doc(db, "inquiries", id), { status: newStatus });
    } catch (error) {
        console.error("Update failed", error);
        alert("상태 변경 실패");
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("정말 삭제하시겠습니까?")) return;
    try {
        await deleteDoc(doc(db, "inquiries", id));
    } catch (error) {
        console.error("Delete failed", error);
        alert("삭제 실패");
    }
  };

  const statusBadge = (status: string) => {
      switch(status) {
          case 'pending': return <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-bold">대기중</span>;
          case 'processing': return <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-bold">처리중</span>;
          case 'done': return <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-bold">완료</span>;
          default: return null;
      }
  };

  const categoryBadge = (cat: string) => {
      const map: Record<string, string> = {
          'general': '일반',
          'design': '디자인',
          'dev': '개발',
          'partnership': '제휴'
      };
      return <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">[{map[cat] || cat}]</span>;
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 text-black p-8">
        <div className="max-w-6xl mx-auto">
            
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Inquiries Dashboard</h1>
                    <p className="text-gray-500">문의 접수 현황 관리 ({inquiries.length}건)</p>
                </div>
                <Link href="/" className="text-sm underline">홈으로 돌아가기</Link>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-medium text-gray-500">Status</th>
                            <th className="p-4 font-medium text-gray-500">Date</th>
                            <th className="p-4 font-medium text-gray-500">Category / Name</th>
                            <th className="p-4 font-medium text-gray-500 w-1/3">Message</th>
                            <th className="p-4 font-medium text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {inquiries.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 whitespace-nowrap">
                                    {statusBadge(item.status)}
                                </td>
                                <td className="p-4 text-gray-400 whitespace-nowrap text-xs">
                                    {item.createdAt?.seconds 
                                        ? format(new Date(item.createdAt.seconds * 1000), 'yyyy-MM-dd HH:mm') 
                                        : '-'}
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col gap-1">
                                        {categoryBadge(item.category)}
                                        <span className="font-bold">{item.name}</span>
                                        <span className="text-gray-400 text-xs">{item.email}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <p className="line-clamp-3 text-gray-600 leading-relaxed max-w-md">{item.message}</p>
                                </td>
                                <td className="p-4 text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-2">
                                        <select 
                                            value={item.status}
                                            onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
                                            className="text-xs border rounded p-1 bg-white outline-none focus:border-black"
                                        >
                                            <option value="pending">대기중</option>
                                            <option value="processing">처리중</option>
                                            <option value="done">완료</option>
                                        </select>
                                        <button 
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            title="삭제"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {inquiries.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-gray-400">
                                    아직 접수된 문의가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    </div>
  );
}
