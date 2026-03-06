// src/app/(platform)/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { ArrowRight, ArrowUpRight, Database, Layout, Palette, CheckCircle2, Coffee, Globe, Archive, Brush, Monitor, Send } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getActiveClients, type Client } from "@/actions/clientActions";

export default function PlatformHomePage() {
  const { t, locale } = useLanguage();
  const p = t.platform; // 단축 변수
  const a = p.agency; // 에이전시 섹션 단축 변수

  // DB에서 클라이언트 목록 로드 (없으면 정적 데이터 사용)
  const [dbClients, setDbClients] = useState<Client[]>([]);
  useEffect(() => {
    getActiveClients().then((data) => {
      if (data.length > 0) setDbClients(data);
    }).catch(() => {/* DB 미설정 시 정적 데이터 사용 */});
  }, []);

  const products = [
    { title: "ArtHyun — Gallery", link: "/arthyun", thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2971&auto=format&fit=crop" },
    { title: "ArtHyun — Archive", link: "/arthyun/archive", thumbnail: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=2574&auto=format&fit=crop" },
    { title: "ArtWay — Home", link: "/art-way", thumbnail: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=3000&auto=format&fit=crop" },
    { title: "ArtWay — Archive", link: "/art-way/archive", thumbnail: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop" },
    { title: "ArtHyun — Portfolio", link: "/arthyun/portfolio", thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" },
    { title: "ArtHyun — Media", link: "/arthyun/media", thumbnail: "https://images.unsplash.com/photo-1482160549825-59d1b23cb208?q=80&w=3000&auto=format&fit=crop" },
    { title: "ArtWay — Portfolio", link: "/art-way", thumbnail: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=2787&auto=format&fit=crop" },
    { title: "ArtHyun — Contact", link: "/arthyun/contact", thumbnail: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=3000&auto=format&fit=crop" },
    { title: "ArtPage — Templates", link: "/templates", thumbnail: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=3000&auto=format&fit=crop" },
    { title: "ArtWay — Media", link: "/art-way/media", thumbnail: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=3000&auto=format&fit=crop" },
    { title: "ArtHyun — Mall", link: "/arthyun/mall", thumbnail: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=3000&auto=format&fit=crop" },
    { title: "ArtWay — Contact", link: "/art-way/contact", thumbnail: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?q=80&w=3000&auto=format&fit=crop" },
    { title: "ArtPage — Features", link: "/features", thumbnail: "https://images.unsplash.com/photo-1520423465871-0866049020b7?q=80&w=2800&auto=format&fit=crop" },
    { title: "ArtHyun — About", link: "/arthyun/about", thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=3000&auto=format&fit=crop" },
    { title: "ArtWay — About", link: "/art-way/about", thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2968&auto=format&fit=crop" },
  ];

  const services = [
    { icon: Globe, title: a.service1_title, desc: a.service1_desc },
    { icon: Archive, title: a.service2_title, desc: a.service2_desc },
    { icon: Brush, title: a.service3_title, desc: a.service3_desc },
    { icon: Monitor, title: a.service4_title, desc: a.service4_desc },
  ];

  const clientProjects = [
    {
      name: a.clients.arthyun.name,
      desc: a.clients.arthyun.desc,
      category: a.clients.arthyun.category,
      href: "/arthyun",
      slug: "arthyun",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2971&auto=format&fit=crop",
    },
    {
      name: a.clients.artway.name,
      desc: a.clients.artway.desc,
      category: a.clients.artway.category,
      href: "/art-way",
      slug: "artway",
      image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=3000&auto=format&fit=crop",
    },
  ];

  return (
    <div className="bg-background text-foreground animate-fade-in relative">
      
      {/* 1. Hero Section */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 pt-20 relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=2574&auto=format&fit=crop" // Art Gallery Interior
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        {/* ARTPAGE Watermark (Optional: Reduced Opacity) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.1] select-none pointer-events-none z-0 mix-blend-overlay">
          <span className="text-[20vw] font-serif font-bold leading-none whitespace-nowrap text-white">ARTPAGE</span>
        </div>

        <div className="max-w-screen-xl mx-auto w-full z-10 relative">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-medium leading-tight tracking-tight mb-8 drop-shadow-lg text-white">
              {p.hero.title1}<br />
              {locale === 'ko' ? <span className="italic">{p.hero.title2}</span> : p.hero.title2}<br />
              {locale === 'ko' ? p.hero.title3 : <span className="italic">{p.hero.title3}</span>}
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-xl mb-12 font-light leading-relaxed drop-shadow-md">
              {p.hero.desc}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <Link
                href="/auth/signup"
                className="group relative px-8 py-4 bg-white text-black text-lg font-medium overflow-hidden transition-all hover:bg-white/90 shadow-lg hover:shadow-xl rounded-sm"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {p.hero.cta_start}
                  <ArrowRight size={20} />
                </span>
              </Link>
              
              <Link
                href="/demo"
                className="group px-8 py-4 text-lg font-medium border border-white/30 hover:border-white hover:bg-white/10 text-white transition-all flex items-center gap-2 backdrop-blur-sm rounded-sm"
              >
                <span>{p.hero.cta_demo}</span>
                <ArrowUpRight size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-32 left-6 md:left-12 flex items-center gap-4 text-xs font-mono text-white/60 transform -rotate-90 origin-left z-10">
          <span>SCROLL TO EXPLORE</span>
          <div className="w-12 h-px bg-white/60" />
        </div>
      </section>

      {/* 2. Why ArtPage Section (Updated with Images) */}
      <section className="py-32 px-6 md:px-12 border-t border-border bg-background relative">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start mb-24">
            <span className="text-sm font-mono text-muted-foreground block mb-4 md:mb-0">01 — WHY ARTPAGE</span>
            <h2 className="text-3xl md:text-5xl font-serif font-medium leading-tight max-w-2xl text-right whitespace-pre-line">
              {p.why.title}
            </h2>
          </div>
          
          <div className="space-y-32">
            {/* Reason 1: Archiving */}
            <div className="grid md:grid-cols-2 gap-16 items-center group">
              <div className="order-2 md:order-1 relative aspect-[4/3] overflow-hidden rounded-sm bg-muted">
                 <Image
                  src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2971&auto=format&fit=crop" // Gallery Space
                  alt="Curated Gallery Space"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="order-1 md:order-2 space-y-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-border group-hover:bg-foreground group-hover:text-background transition-colors duration-500">
                  <Layout size={24} />
                </div>
                <div>
                  <h3 className="text-4xl font-serif mb-4">
                    {p.why.reason1_title.split('\n').map((line: string, i: number) => (
                      <span key={i} className={`block ${i === 0 ? 'font-light' : 'font-bold'}`}>
                        {line}
                      </span>
                    ))}
                  </h3>
                  <p className="text-sm font-mono text-muted-foreground mb-6">#CuratedControl #DigitalArchive</p>
                  <p className="text-lg font-light leading-relaxed text-foreground/80">
                    {p.why.reason1_desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Reason 2: Membership */}
            <div className="grid md:grid-cols-2 gap-16 items-center group">
              <div className="space-y-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-border group-hover:bg-foreground group-hover:text-background transition-colors duration-500">
                  <Database size={24} />
                </div>
                <div>
                  <h3 className="text-4xl font-serif mb-4">
                    {p.why.reason2_title.split('\n').map((line: string, i: number) => (
                      <span key={i} className={`block ${i === 0 ? 'font-light' : 'font-bold'}`}>
                        {line}
                      </span>
                    ))}
                  </h3>
                  <p className="text-sm font-mono text-muted-foreground mb-6">#DataOwnership #DirectConnection</p>
                  <p className="text-lg font-light leading-relaxed text-foreground/80">
                    {p.why.reason2_desc}
                  </p>
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-muted">
                <Image
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2968&auto=format&fit=crop" // People Connecting / Meeting
                  alt="Artist and Fans"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>

            {/* Reason 3: Studio */}
            <div className="grid md:grid-cols-2 gap-16 items-center group">
              <div className="order-2 md:order-1 relative aspect-[4/3] overflow-hidden rounded-sm bg-muted">
                <Image
                  src="https://images.unsplash.com/photo-1520423465871-0866049020b7?q=80&w=2800&auto=format&fit=crop" // Professional Artist Studio
                  alt="Artist Studio"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="order-1 md:order-2 space-y-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-border group-hover:bg-foreground group-hover:text-background transition-colors duration-500">
                  <Palette size={24} />
                </div>
                <div>
                  <h3 className="text-4xl font-serif mb-4">
                    {p.why.reason3_title.split('\n').map((line: string, i: number) => (
                      <span key={i} className={`block ${i === 0 ? 'font-light' : 'font-bold'}`}>
                        {line}
                      </span>
                    ))}
                  </h3>
                  <p className="text-sm font-mono text-muted-foreground mb-6">#BrandIncubating #CreatorEconomy</p>
                  <p className="text-lg font-light leading-relaxed text-foreground/80">
                    {p.why.reason3_desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 Hero Parallax Section (Gallery Showcase) */}
      <section className="bg-background">
        <HeroParallax products={products} />
      </section>

      {/* 3. Pricing Philosophy Section */}
      <section className="py-32 px-6 md:px-12 border-t border-border bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
             <Image
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=3111&auto=format&fit=crop" // Handshake or Abstract Money
                alt="Trust Background"
                fill
                className="object-cover grayscale"
              />
        </div>
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-sm font-mono text-white/60 block mb-6">02 — PRICING PHILOSOPHY</span>
              <h2 className="text-3xl md:text-5xl font-serif font-medium leading-tight mb-8 whitespace-pre-line">
                {p.pricing.title}
              </h2>
              <p className="text-xl font-light leading-relaxed text-white/80 mb-8">
                {p.pricing.desc}
              </p>
              <p className="text-lg font-light leading-relaxed text-white/60">
                 {p.pricing.policy}
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-10 md:p-14 backdrop-blur-md">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-white text-black rounded-full">
                  <Coffee size={32} />
                </div>
                <h3 className="text-3xl font-serif">{p.pricing.plan_name}</h3>
              </div>
              
              <ul className="space-y-6">
                {[
                  p.pricing.feature1,
                  p.pricing.feature2,
                  p.pricing.feature3,
                  p.pricing.feature4
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <CheckCircle2 className="mt-1 flex-shrink-0 text-white/60" size={20} />
                    <span className="text-lg font-light text-white/90">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-sm font-mono text-white/50 mb-2">{p.pricing.no_fees}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-serif font-medium">{p.pricing.free_per_month}</span>
                </div>
                <p className="text-sm text-white/60 mt-2">{p.pricing.free_desc}</p>
                
                <a 
                  href="https://www.buymeacoffee.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-8 w-full py-4 border border-white/20 rounded-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-all group"
                >
                  <Coffee size={20} className="text-white/80 group-hover:text-white group-hover:rotate-12 transition-all" />
                  <span className="text-white/80 group-hover:text-white font-medium">Buy us a Coffee</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3.5 Agency Portfolio — Client Showcase */}
      <section className="py-32 px-6 md:px-12 border-t border-border bg-background">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start mb-24">
            <span className="text-sm font-mono text-muted-foreground block mb-4 md:mb-0">{a.section_label}</span>
            <h2 className="text-3xl md:text-5xl font-serif font-medium leading-tight max-w-2xl text-right whitespace-pre-line">
              {a.title}
            </h2>
          </div>
          <p className="text-xl font-light text-foreground/70 max-w-2xl mb-16">
            {a.desc}
          </p>

          {/* Client Cards — DB 데이터 우선, 없으면 정적 fallback */}
          <div className="grid md:grid-cols-2 gap-8" id="our-work">
            {(dbClients.length > 0
              ? dbClients.map((c) => ({
                  key: c.id,
                  name: c.name,
                  desc: c.description || "",
                  category: c.category || "",
                  href: c.website_url || `/${c.slug}`,
                  slug: c.slug,
                  image: c.thumbnail_url,
                }))
              : clientProjects.map((c, i) => ({ ...c, key: String(i) }))
            ).map((client) => (
              <div
                key={client.key}
                className="group border border-border rounded-lg overflow-hidden hover:border-foreground/30 transition-all duration-500"
              >
                <Link href={`/work/${client.slug}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    {client.image ? (
                      <Image
                        src={client.image}
                        alt={client.name}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground font-serif text-2xl">
                        {client.name}
                      </div>
                    )}
                    {client.category && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-mono rounded-full">
                          {client.category}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-serif">{client.name}</h3>
                    <ArrowUpRight size={20} className="text-muted-foreground group-hover:text-foreground transition-all" />
                  </div>
                  <p className="text-foreground/60 font-light leading-relaxed">
                    {client.desc}
                  </p>
                  <div className="mt-4 pt-4 border-t border-border flex items-center gap-6">
                    <Link href={`/work/${client.slug}`} className="text-sm font-mono text-primary hover:underline">
                      {a.case_study} →
                    </Link>
                    <Link href={client.href} className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">
                      {a.view_site} ↗
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.6 Agency Services */}
      <section className="py-32 px-6 md:px-12 border-t border-border bg-muted/30">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start mb-24">
            <span className="text-sm font-mono text-muted-foreground block mb-4 md:mb-0">{a.services_label}</span>
            <h2 className="text-3xl md:text-5xl font-serif font-medium leading-tight max-w-2xl text-right whitespace-pre-line">
              {a.services_title}
            </h2>
          </div>
          <p className="text-xl font-light text-foreground/70 max-w-2xl mb-16">
            {a.services_desc}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="group p-8 border border-border rounded-lg bg-background hover:border-foreground/30 transition-all duration-500"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-border mb-6 group-hover:bg-foreground group-hover:text-background transition-colors duration-500">
                  <service.icon size={24} />
                </div>
                <h3 className="text-xl font-serif mb-3">{service.title}</h3>
                <p className="text-sm font-light text-foreground/60 leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Agency Inquiry CTA */}
      <section className="py-32 px-6 md:px-12 border-t border-border bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=3000&auto=format&fit=crop"
            alt="Contact Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-mono text-white/60 block mb-6">{a.inquiry_label}</span>
              <h2 className="text-3xl md:text-5xl font-serif font-medium leading-tight whitespace-pre-line mb-8">
                {a.inquiry_title}
              </h2>
              <p className="text-xl font-light leading-relaxed text-white/80">
                {a.inquiry_desc}
              </p>
            </div>
            <div className="flex flex-col items-start gap-6">
              <Link
                href="/inquiry"
                className="group px-8 py-5 bg-white text-black text-lg font-medium rounded-sm hover:bg-white/90 transition-all flex items-center gap-3 shadow-lg"
              >
                {a.inquiry_submit}
                <Send size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-sm text-white/50 font-light">
                * 24시간 이내 회신드립니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="py-40 px-6 md:px-12 border-t border-border text-center bg-background text-foreground">
        <h2 className="text-4xl md:text-6xl font-serif font-medium mb-12 tracking-tighter whitespace-pre-line">
          {p.cta.title}
        </h2>
        <Link
          href="/auth/signup"
          className="inline-flex items-center gap-4 text-xl md:text-2xl border-b-2 border-foreground pb-2 hover:opacity-50 transition-opacity"
        >
          <span>{p.cta.button}</span>
          <ArrowRight size={32} />
        </Link>
      </section>
    </div>
  );
}
