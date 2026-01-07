// src/app/page.tsx - ArtPage 메인 랜딩 페이지
"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Palette, Globe, ShoppingBag, BarChart3, Zap, Check } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* 히어로 섹션 */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 배경 그라디언트 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
        
        {/* 콘텐츠 */}
        <div className="relative max-w-screen-xl mx-auto px-6 py-20 text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-primary/10 rounded-full">
            <span className="text-sm font-medium text-primary">
              아티스트를 위한 웹사이트 플랫폼
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-light text-foreground mb-6 leading-tight">
            당신의 예술을<br />
            세상에 선보이세요
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            갤러리, 아티스트, 큐레이터를 위한 전문 웹사이트.<br />
            5분 만에 시작하고, 평생 소유하세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-lg font-medium flex items-center justify-center gap-2"
            >
              <span>무료로 시작하기</span>
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/templates"
              className="px-8 py-4 border-2 border-border rounded-md hover:border-primary hover:text-primary transition-colors text-lg font-medium"
            >
              템플릿 둘러보기
            </Link>
          </div>

          {/* 데모 사이트 링크 */}
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span>데모 사이트:</span>
            <a 
              href="https://bukchon.artpage.kr" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              bukchon.artpage.kr
            </a>
          </div>
        </div>

        {/* 스크롤 인디케이터 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-muted-foreground rounded-full" />
          </div>
        </div>
      </section>

      {/* 템플릿 프리뷰 섹션 */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-light text-foreground mb-4">
              전문가가 디자인한 템플릿
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              갤러리, 아티스트, 스튜디오 등 다양한 용도에 맞는 템플릿을 제공합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 템플릿 1: Gallery Modern */}
            <div className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-all duration-300 hover:shadow-xl">
              <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Palette size={64} className="text-primary opacity-20" />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-serif text-foreground">Gallery Modern</h3>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    인기
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  갤러리와 미술관을 위한 모던한 디자인. 전시 관리, 상품 판매, Instagram 연동 포함.
                </p>
                <Link
                  href="/templates/gallery-modern"
                  className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all"
                >
                  <span className="text-sm font-medium">자세히 보기</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* 템플릿 2: Gallery Minimal */}
            <div className="group bg-card border border-border rounded-lg overflow-hidden hover:border-secondary transition-all duration-300 hover:shadow-xl">
              <div className="relative aspect-[4/3] bg-gradient-to-br from-secondary/20 to-accent/20 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Globe size={64} className="text-secondary opacity-20" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-serif text-foreground">Gallery Minimal</h3>
                  <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                    출시 예정
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  미니멀한 디자인으로 작품에 집중. 화이트 스페이스와 타이포그래피 중심.
                </p>
                <div className="inline-flex items-center gap-2 text-muted-foreground">
                  <span className="text-sm">곧 만나요</span>
                </div>
              </div>
            </div>

            {/* 템플릿 3: Artist Portfolio */}
            <div className="group bg-card border border-border rounded-lg overflow-hidden hover:border-accent transition-all duration-300 hover:shadow-xl">
              <div className="relative aspect-[4/3] bg-gradient-to-br from-accent/20 to-primary/20 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Palette size={64} className="text-accent opacity-20" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-serif text-foreground">Artist Portfolio</h3>
                  <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                    출시 예정
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  개인 아티스트를 위한 포트폴리오. 작품 갤러리, 이력서, 연락처 포함.
                </p>
                <div className="inline-flex items-center gap-2 text-muted-foreground">
                  <span className="text-sm">곧 만나요</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="py-20">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-light text-foreground mb-4">
              왜 ArtPage인가요?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              복잡한 설정 없이, 전문적인 웹사이트를 5분 만에 시작하세요.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-card border border-border rounded-lg">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Globe className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-serif text-foreground mb-3">
                나만의 도메인
              </h3>
              <p className="text-muted-foreground">
                yourname.artpage.kr 서브도메인 무료 제공. 커스텀 도메인도 연결 가능.
              </p>
            </div>

            <div className="p-6 bg-card border border-border rounded-lg">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <ShoppingBag className="text-secondary" size={24} />
              </div>
              <h3 className="text-xl font-serif text-foreground mb-3">
                온라인 스토어
              </h3>
              <p className="text-muted-foreground">
                작품과 굿즈를 판매하세요. 결제, 배송, 정산까지 모두 자동화.
              </p>
            </div>

            <div className="p-6 bg-card border border-border rounded-lg">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <BarChart3 className="text-accent" size={24} />
              </div>
              <h3 className="text-xl font-serif text-foreground mb-3">
                통계 대시보드
              </h3>
              <p className="text-muted-foreground">
                방문자, 매출, 인기 작품 등 실시간 통계를 한눈에 확인.
              </p>
            </div>

            <div className="p-6 bg-card border border-border rounded-lg">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Palette className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-serif text-foreground mb-3">
                쉬운 커스터마이징
              </h3>
              <p className="text-muted-foreground">
                코드 없이 색상, 폰트, 레이아웃을 자유롭게 변경.
              </p>
            </div>

            <div className="p-6 bg-card border border-border rounded-lg">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Globe className="text-secondary" size={24} />
              </div>
              <h3 className="text-xl font-serif text-foreground mb-3">
                다국어 지원
              </h3>
              <p className="text-muted-foreground">
                한국어, 영어, 일본어, 중국어 자동 번역 제공.
              </p>
            </div>

            <div className="p-6 bg-card border border-border rounded-lg">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Zap className="text-accent" size={24} />
              </div>
              <h3 className="text-xl font-serif text-foreground mb-3">
                빠른 속도
              </h3>
              <p className="text-muted-foreground">
                최신 기술로 구축된 초고속 웹사이트. SEO 최적화 기본 제공.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 가격 정책 섹션 */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-light text-foreground mb-4">
              합리적인 가격
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              필요한 기능만 선택하고, 성장에 따라 업그레이드하세요.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter 플랜 */}
            <div className="p-8 bg-card border border-border rounded-lg">
              <h3 className="text-2xl font-serif text-foreground mb-2">Starter</h3>
              <p className="text-muted-foreground mb-6">시작하는 아티스트</p>
              <div className="mb-6">
                <span className="text-4xl font-serif text-foreground">₩49,000</span>
                <span className="text-muted-foreground">/월</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check size={20} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">기본 템플릿 1개</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">서브도메인 제공</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">상품 10개까지</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">거래 수수료 10%</span>
                </li>
              </ul>
              <Link
                href="/auth/signup?plan=starter"
                className="block w-full py-3 border border-border text-center rounded-md hover:bg-muted/30 transition-colors"
              >
                시작하기
              </Link>
            </div>

            {/* Pro 플랜 */}
            <div className="p-8 bg-primary text-white rounded-lg relative overflow-hidden">
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                인기
              </div>
              <h3 className="text-2xl font-serif mb-2">Pro</h3>
              <p className="text-white/80 mb-6">전문 갤러리</p>
              <div className="mb-6">
                <span className="text-4xl font-serif">₩99,000</span>
                <span className="text-white/80">/월</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check size={20} className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm">모든 템플릿 사용</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm">커스텀 도메인</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm">상품 100개까지</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm">거래 수수료 7%</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm">우선 지원</span>
                </li>
              </ul>
              <Link
                href="/auth/signup?plan=pro"
                className="block w-full py-3 bg-white text-primary text-center rounded-md hover:bg-white/90 transition-colors font-medium"
              >
                시작하기
              </Link>
            </div>

            {/* Enterprise 플랜 */}
            <div className="p-8 bg-card border border-border rounded-lg">
              <h3 className="text-2xl font-serif text-foreground mb-2">Enterprise</h3>
              <p className="text-muted-foreground mb-6">대형 기관</p>
              <div className="mb-6">
                <span className="text-4xl font-serif text-foreground">₩199,000</span>
                <span className="text-muted-foreground">/월</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check size={20} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">무제한 상품</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">거래 수수료 5%</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">전담 매니저</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">커스텀 개발</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">API 접근</span>
                </li>
              </ul>
              <Link
                href="/contact"
                className="block w-full py-3 border border-border text-center rounded-md hover:bg-muted/30 transition-colors"
              >
                문의하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="p-12 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl text-center">
            <h2 className="text-4xl font-serif font-light text-foreground mb-4">
              지금 시작하세요
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              5분이면 충분합니다. 신용카드 필요 없이 무료로 체험하세요.
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-lg font-medium"
            >
              <span>무료로 시작하기</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
