// src/app/(platform)/work/[slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const clientData: Record<string, {
  image: string;
  href: string;
  features: string[];
}> = {
  arthyun: {
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2971&auto=format&fit=crop",
    href: "/arthyun",
    features: ["Exhibition Archive", "Artist Portfolio", "Media Gallery", "Online Shop", "Contact Management", "Visitor Tracking"],
  },
  artway: {
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=3000&auto=format&fit=crop",
    href: "/art-way",
    features: ["Program Catalog", "Community Hub", "Media Center", "Event Calendar", "Contact Form", "Newsletter"],
  },
};

export default function CaseStudyPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t } = useLanguage();
  const a = t.platform.agency;

  const data = clientData[slug];
  const detail = slug === "arthyun" ? a.clients_detail.arthyun : a.clients_detail.artway;
  const clientInfo = slug === "arthyun" ? a.clients.arthyun : a.clients.artway;

  if (!data || !detail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Project not found.</p>
      </div>
    );
  }

  const techStack = detail.tech.split(", ");

  return (
    <div className="bg-background text-foreground animate-fade-in">
      {/* Hero */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <Image
          src={data.image}
          alt={clientInfo.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-screen-xl mx-auto">
          <span className="text-sm font-mono text-white/60 mb-4">{a.case_study}</span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium text-white mb-4">
            {clientInfo.name}
          </h1>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-mono rounded-full">
              {clientInfo.category}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-screen-xl mx-auto px-6 md:px-12 py-20">
        {/* Back link */}
        <Link
          href="/#our-work"
          className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors mb-16"
        >
          <ArrowLeft size={16} />
          {a.back_to_work}
        </Link>

        {/* Overview */}
        <div className="grid md:grid-cols-3 gap-16 mb-24">
          <div className="md:col-span-2">
            <span className="text-sm font-mono text-muted-foreground block mb-4">{a.overview}</span>
            <p className="text-2xl md:text-3xl font-serif font-light leading-relaxed">
              {clientInfo.desc}
            </p>
          </div>
          <div className="space-y-6">
            <div>
              <span className="text-sm font-mono text-muted-foreground block mb-2">{a.tech_stack}</span>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-muted text-sm rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <Link
                href={data.href}
                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-sm hover:opacity-80 transition-opacity"
              >
                {a.visit_live}
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Challenge / Solution / Results */}
        <div className="space-y-20">
          {/* Challenge */}
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-sm font-mono text-muted-foreground block mb-4">01</span>
              <h2 className="text-3xl font-serif mb-6">{a.challenge}</h2>
            </div>
            <p className="text-lg font-light leading-relaxed text-foreground/80">
              {detail.challenge}
            </p>
          </div>

          <div className="h-px bg-border" />

          {/* Solution */}
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-sm font-mono text-muted-foreground block mb-4">02</span>
              <h2 className="text-3xl font-serif mb-6">{a.solution}</h2>
            </div>
            <p className="text-lg font-light leading-relaxed text-foreground/80">
              {detail.solution}
            </p>
          </div>

          <div className="h-px bg-border" />

          {/* Results */}
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-sm font-mono text-muted-foreground block mb-4">03</span>
              <h2 className="text-3xl font-serif mb-6">{a.results}</h2>
            </div>
            <div>
              <p className="text-lg font-light leading-relaxed text-foreground/80 mb-8">
                {detail.results}
              </p>
              {/* Feature tags */}
              <div className="flex flex-wrap gap-2">
                {data.features.map((feature, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 border border-border rounded-full text-sm font-light hover:bg-foreground hover:text-background transition-colors duration-300"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 md:px-12 border-t border-border bg-muted/30">
        <div className="max-w-screen-xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-8">{a.inquiry_title}</h2>
          <Link
            href="/inquiry"
            className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background text-lg font-medium rounded-sm hover:opacity-80 transition-opacity"
          >
            {a.inquiry_submit}
            <ArrowUpRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
