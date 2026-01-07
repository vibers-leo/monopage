// src/app/admin/dashboard/page.tsx
"use client";

import Link from "next/link";
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  ShoppingBag, 
  Palette,
  Users,
  Settings,
  BarChart3,
  TrendingUp,
  Eye,
  Edit,
  Folder
} from "lucide-react";

export default function AdminDashboardPage() {
  // 임시 통계 데이터
  const stats = [
    { label: "총 방문자", value: "1,234", change: "+12%", icon: Eye, color: "text-primary" },
    { label: "페이지 뷰", value: "5,678", change: "+8%", icon: BarChart3, color: "text-secondary" },
    { label: "상품 판매", value: "₩890K", change: "+23%", icon: ShoppingBag, color: "text-accent" },
    { label: "전시 수", value: "12", change: "+2", icon: Palette, color: "text-primary" },
  ];

  const quickActions = [
    { label: "페이지 편집", href: "/admin/pages", icon: Edit, color: "bg-primary" },
    { label: "미디어 관리", href: "/admin/media", icon: ImageIcon, color: "bg-secondary" },
    { label: "상품 관리", href: "/admin/products", icon: ShoppingBag, color: "bg-accent" },
    { label: "전시 관리", href: "/admin/exhibition", icon: Palette, color: "bg-primary" },
    { label: "포트폴리오", href: "/admin/portfolio", icon: Folder, color: "bg-black" },
  ];

  const recentPages = [
    { title: "About", updated: "2시간 전", status: "게시됨" },
    { title: "Archive", updated: "1일 전", status: "게시됨" },
    { title: "Contact", updated: "3일 전", status: "게시됨" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="border-b border-border bg-card">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="text-primary" size={24} />
              <h1 className="text-2xl font-serif font-light text-foreground">
                관리자 대시보드
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                target="_blank"
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                <Eye size={16} />
                <span>사이트 보기</span>
              </Link>
              <Link
                href="/admin/settings"
                className="p-2 rounded-md hover:bg-muted transition-colors"
              >
                <Settings size={20} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-screen-2xl mx-auto px-6 py-8">
        {/* 통계 카드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-6 bg-card border border-border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={stat.color} size={24} />
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-serif text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 빠른 작업 */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-serif text-foreground mb-6">빠른 작업</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {quickActions.map((action, idx) => (
                  <Link
                    key={idx}
                    href={action.href}
                    className="p-4 border border-border rounded-lg hover:border-primary transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white`}>
                        <action.icon size={20} />
                      </div>
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {action.label}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 최근 수정된 페이지 */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif text-foreground">최근 수정된 페이지</h2>
                <Link
                  href="/admin/pages"
                  className="text-sm text-primary hover:underline"
                >
                  전체 보기
                </Link>
              </div>
              <div className="space-y-3">
                {recentPages.map((page, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">{page.title}</p>
                        <p className="text-xs text-muted-foreground">{page.updated}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded">
                        {page.status}
                      </span>
                      <Link
                        href={`/admin/pages/${page.title.toLowerCase()}/edit`}
                        className="p-2 hover:bg-muted rounded transition-colors"
                      >
                        <Edit size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 사이트 정보 */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-serif text-foreground mb-4">사이트 정보</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">도메인</span>
                  <span className="text-foreground font-medium">bukchon.artpage.kr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">템플릿</span>
                  <span className="text-foreground font-medium">Gallery Modern</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">플랜</span>
                  <span className="text-primary font-medium">Pro</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">상태</span>
                  <span className="text-green-600 font-medium">활성</span>
                </div>
              </div>
            </div>

            {/* 최근 활동 */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-serif text-foreground mb-4">최근 활동</h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="text-foreground">About 페이지 수정</p>
                  <p className="text-xs text-muted-foreground">2시간 전</p>
                </div>
                <div className="text-sm">
                  <p className="text-foreground">새 상품 추가</p>
                  <p className="text-xs text-muted-foreground">1일 전</p>
                </div>
                <div className="text-sm">
                  <p className="text-foreground">전시 게시</p>
                  <p className="text-xs text-muted-foreground">3일 전</p>
                </div>
              </div>
            </div>

            {/* 도움말 */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-6">
              <h3 className="font-serif text-foreground mb-2">도움이 필요하신가요?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                가이드를 확인하거나 지원팀에 문의하세요.
              </p>
              <div className="flex gap-2">
                <Link
                  href="/admin/help"
                  className="flex-1 py-2 text-center text-sm border border-border rounded-md hover:bg-muted transition-colors"
                >
                  가이드
                </Link>
                <Link
                  href="/admin/support"
                  className="flex-1 py-2 text-center text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  문의
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
