// src/app/admin/pages/page.tsx
"use client";

import Link from "next/link";
import { FileText, Plus, Edit, Eye, Trash2, Globe } from "lucide-react";

export default function AdminPagesPage() {
  // 임시 페이지 데이터
  const pages = [
    { id: "home", title: "Home", slug: "/", status: "published", updated: "2시간 전" },
    { id: "about", title: "About", slug: "/about", status: "published", updated: "1일 전" },
    { id: "archive", title: "Archive", slug: "/archive", status: "published", updated: "2일 전" },
    { id: "media", title: "Media", slug: "/media", status: "published", updated: "3일 전" },
    { id: "shop", title: "Shop", slug: "/mall", status: "published", updated: "4일 전" },
    { id: "contact", title: "Contact", slug: "/contact", status: "published", updated: "5일 전" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="border-b border-border bg-card">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/admin/dashboard"
                className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block"
              >
                ← 대시보드
              </Link>
              <h1 className="text-2xl font-serif font-light text-foreground">
                페이지 관리
              </h1>
            </div>
            <Link
              href="/admin/pages/new"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              <span>새 페이지</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 페이지 목록 */}
      <main className="max-w-screen-2xl mx-auto px-6 py-8">
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-foreground">페이지</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">경로</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">상태</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">최종 수정</th>
                <th className="text-right p-4 text-sm font-medium text-foreground">작업</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-muted-foreground" />
                      <span className="font-medium text-foreground">{page.title}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <code className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      {page.slug}
                    </code>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-green-50 text-green-600 rounded">
                      <Globe size={12} />
                      {page.status === "published" ? "게시됨" : "초안"}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {page.updated}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={page.slug}
                        target="_blank"
                        className="p-2 hover:bg-muted rounded transition-colors"
                        title="미리보기"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        href={`/admin/pages/${page.id}/edit`}
                        className="p-2 hover:bg-muted rounded transition-colors"
                        title="편집"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        className="p-2 hover:bg-destructive/10 text-destructive rounded transition-colors"
                        title="삭제"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
