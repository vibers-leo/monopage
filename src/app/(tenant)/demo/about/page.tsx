// src/app/about/page.tsx
"use client";

import Image from "next/image";
import GalleryPattern from "@/components/GalleryPattern";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      {/* 히어로 섹션 */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/view.jpg"
            alt="북촌 아트 스페이스"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        </div>

        {/* 타이틀 */}
        <div className="relative z-10 text-center space-y-6 px-6 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-serif font-light text-foreground leading-relaxed">
            북촌 아트 스페이스
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light tracking-wider">
            Bukchon Art Space
          </p>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            한옥의 전통미와 현대 미술이 만나는 곳
          </p>
          {/* 단청 패턴 장식 */}
          <div className="flex items-center justify-center pt-4">
            <GalleryPattern className="w-32 h-1" />
          </div>
        </div>
      </section>

      {/* 갤러리 소개 섹션 */}
      <section className="py-20">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* 왼쪽: 텍스트 */}
            <div className="space-y-6 animate-fade-in-up">
              <h2 className="text-4xl font-serif font-light text-foreground mb-6">
                {t.about.ourSpace}
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed break-keep">
                {t.about.intro1}
              </p>
              <p className="text-base text-muted-foreground leading-relaxed break-keep">
                {t.about.intro2}
              </p>
              
              {/* 특징 카드 */}
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="p-4 border border-border rounded-lg bg-card hover:border-primary transition-colors duration-300">
                  <div className="text-2xl font-serif text-primary mb-2">2018</div>
                  <p className="text-sm text-muted-foreground">{t.about.established}</p>
                </div>
                <div className="p-4 border border-border rounded-lg bg-card hover:border-secondary transition-colors duration-300">
                  <div className="text-2xl font-serif text-secondary mb-2">50평</div>
                  <p className="text-sm text-muted-foreground">{t.about.spaceSize}</p>
                </div>
              </div>
            </div>

            {/* 오른쪽: 이미지 */}
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-lg animate-fade-in">
              <Image
                src="/gallery1.png"
                alt="갤러리 내부"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* 장식 테두리 */}
              <div className="absolute inset-0 border-4 border-primary/20 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 전시 철학 섹션 */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 className="text-4xl font-serif font-light text-center text-foreground mb-12">
            {t.about.philosophy}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* 철학 1 */}
            <div className="text-center space-y-4 p-6 bg-card rounded-lg border border-border hover:border-primary transition-all duration-300 hover:shadow-lg">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-serif text-foreground">{t.about.emergingArtists}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t.about.emergingArtistsDesc}
              </p>
            </div>

            {/* 철학 2 */}
            <div className="text-center space-y-4 p-6 bg-card rounded-lg border border-border hover:border-secondary transition-all duration-300 hover:shadow-lg">
              <div className="w-16 h-16 mx-auto rounded-full bg-secondary/10 flex items-center justify-center">
                <span className="text-2xl">🏛️</span>
              </div>
              <h3 className="text-xl font-serif text-foreground">{t.about.traditionModern}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t.about.traditionModernDesc}
              </p>
            </div>

            {/* 철학 3 */}
            <div className="text-center space-y-4 p-6 bg-card rounded-lg border border-border hover:border-accent transition-all duration-300 hover:shadow-lg">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-serif text-foreground">{t.about.communication}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t.about.communicationDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 방문 정보 섹션 */}
      <section className="py-20">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 className="text-4xl font-serif font-light text-center text-foreground mb-12">
            {t.about.visitGuide}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center md:text-left space-y-3 p-6 border-l-2 border-primary">
              <h3 className="font-serif text-lg text-foreground flex items-center gap-2">
                <span className="text-primary">📍</span> {t.home.location}
              </h3>
              <p className="text-sm text-muted-foreground">{t.about.address}</p>
              <p className="text-xs text-muted-foreground/60 mt-2">
                {t.about.subway}
              </p>
            </div>

            <div className="text-center md:text-left space-y-3 p-6 border-l-2 border-secondary">
              <h3 className="font-serif text-lg text-foreground flex items-center gap-2">
                <span className="text-secondary">🕐</span> {t.home.hours}
              </h3>
              <p className="text-sm text-muted-foreground">{t.about.hoursDetail}</p>
              <p className="text-xs text-muted-foreground/60">
                {t.about.closedMonday}<br />
                {t.about.holidayOpen}
              </p>
            </div>

            <div className="text-center md:text-left space-y-3 p-6 border-l-2 border-accent">
              <h3 className="font-serif text-lg text-foreground flex items-center gap-2">
                <span className="text-accent">💰</span> {t.home.admission}
              </h3>
              <p className="text-sm text-muted-foreground">{t.about.freeEntry}</p>
              <p className="text-xs text-muted-foreground/60 mt-2">
                {t.about.groupReservation}
              </p>
            </div>
          </div>

          {/* 연락처 */}
          <div className="mt-12 p-8 bg-muted/30 rounded-lg text-center">
            <h3 className="font-serif text-xl text-foreground mb-4">{t.about.inquiry}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              T. 02-1234-5678
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              E. info@bukchonart.kr
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <a 
                href="#" 
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm"
              >
                Instagram
              </a>
              <a 
                href="#" 
                className="px-6 py-2 border border-border rounded-md hover:border-primary hover:text-primary transition-colors text-sm"
              >
                오시는 길
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
