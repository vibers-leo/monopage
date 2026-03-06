"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getClient, updateClient } from "@/actions/clientActions";
import type { Client } from "@/actions/clientActions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EditClientPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [client, setClient] = useState<Client | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        getClient(id).then((data) => {
            setClient(data);
            setLoading(false);
        });
    }, [id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!id) return;
        setIsSubmitting(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const result = await updateClient(id, formData);

        if (result.success) {
            router.push("/admin/clients");
        } else {
            setError(result.message || "수정에 실패했습니다.");
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-screen-md mx-auto py-20 px-6">
                <p className="text-gray-500">로딩 중...</p>
            </div>
        );
    }

    if (!client) {
        return (
            <div className="max-w-screen-md mx-auto py-20 px-6">
                <p className="text-red-500">클라이언트를 찾을 수 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="max-w-screen-md mx-auto py-20 px-6">
            <div className="flex items-center justify-between mb-10">
                <h1 className="text-3xl font-serif font-bold">클라이언트 수정</h1>
                <Link href="/admin/clients">
                    <Button variant="outline">목록으로</Button>
                </Link>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="name"
                        type="text"
                        required
                        defaultValue={client.name}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        슬러그 (URL) <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="slug"
                        type="text"
                        required
                        defaultValue={client.slug}
                        pattern="[a-z0-9-]+"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black font-mono"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                    <textarea
                        name="description"
                        rows={3}
                        defaultValue={client.description || ""}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                        <select
                            name="category"
                            defaultValue={client.category || ""}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                        >
                            <option value="">선택하세요</option>
                            <option value="갤러리">갤러리</option>
                            <option value="작가">작가</option>
                            <option value="문화단체">문화단체</option>
                            <option value="교육기관">교육기관</option>
                            <option value="기타">기타</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">템플릿</label>
                        <select
                            name="template"
                            defaultValue={client.template}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                        >
                            <option value="default">기본</option>
                            <option value="arthyun">아트현 (클래식 갤러리)</option>
                            <option value="art-way">아트웨이 (커뮤니티)</option>
                            <option value="minimal">미니멀 (화이트)</option>
                            <option value="modern-dark">모던 다크</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">웹사이트 URL</label>
                    <input
                        name="website_url"
                        type="text"
                        defaultValue={client.website_url || ""}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                    <select
                        name="status"
                        defaultValue={client.status}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    >
                        <option value="active">활성</option>
                        <option value="development">개발중</option>
                        <option value="inactive">비활성</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        썸네일 이미지 (새로 업로드 시에만 선택)
                    </label>
                    <input
                        name="thumbnail"
                        type="file"
                        accept="image/*"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                    {client.thumbnail_url && (
                        <p className="mt-2 text-sm text-gray-500">
                            현재 이미지가 설정되어 있습니다. 새 파일을 선택하면 교체됩니다.
                        </p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-black text-white hover:bg-gray-800 text-lg"
                >
                    {isSubmitting ? "수정 중..." : "클라이언트 수정"}
                </Button>
            </form>
        </div>
    );
}
