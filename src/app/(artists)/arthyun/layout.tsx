import type { Metadata } from "next";
import Image from "next/image";
import { Montserrat, Crimson_Text, Open_Sans } from "next/font/google";

// 👇 헤더 컴포넌트 경로 확인 (components/Header 인지 components/ui/Header 인지)
import Header from "@/components/templates/arthyun/Header"; 
import VisitorTracker from "@/components/templates/arthyun/VisitorTracker"; 
import ScrollToTop from "@/components/ui/ScrollToTop";
import { Toaster } from 'sonner';

import { getSiteSettings } from "@/actions/settingsActions";

const serif = Crimson_Text({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
});
const sans = Open_Sans({ subsets: ["latin"], variable: "--font-sans" });
const heading = Montserrat({ subsets: ["latin"], variable: "--font-heading" });

export async function generateMetadata(): Promise<Metadata> {
  // const settings = await getSiteSettings();
const settings: any = null;
  
  const title = "Art Hyun | 예술로 여는 도시재생";
  const description = settings?.og_description || "공공미술, 공공디자인, 벽화 전문 청년 사회적기업입니다.";
  const ogImage = settings?.og_image_url ? [settings.og_image_url] : [];

  return {
    metadataBase: new URL("https://arthyun.co.kr"),
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage,
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarLogoUrl = "https://firebasestorage.googleapis.com/v0/b/arthyun-5b255.firebasestorage.app/o/migration_uploads%2F2019%2F02%2F0dd60f7fc0a29d1943f7bfae58f46435.png?alt=media"; // Hardcoded migrated logo
  const footerLogoUrl = "/images/logo-light.png";

  // JSON-LD Structure
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Art Hyun",
    "url": "https://arthyun.co.kr",
    "logo": "https://arthyun.co.kr/logo.png",
    "sameAs": [
        "https://www.instagram.com/art_hyun/",
        "https://www.youtube.com/channel/UC3WCKuxcrEp6LoG-5Rlbt4A"
    ],
    "description": "공공미술, 공공디자인, 벽화 전문 청년 사회적기업입니다."
  };

  return (
    <html lang="ko" className={`${serif.variable} ${sans.variable} ${heading.variable}`}>
      <body className="font-sans text-gray-800 bg-white selection:bg-gray-900 selection:text-white">
        
        {/* Toast Notifications */}
        <Toaster position="top-center" richColors />

        {/* JSON-LD for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* 방문자 추적기 (관리자 통계용) */}
        <VisitorTracker />
        
        {/* Scroll To Top Button */}
        <ScrollToTop />

        {/* 헤더 */}
        <Header />

        {/* 메인 컨텐츠 */}
        <main className="min-h-screen">
            {children}
        </main>

        {/* 푸터 - 2019년 백업 디자인 및 데이터 복원 */}
        <footer className="py-24 bg-[#222222] text-gray-400 cursor-auto">
          <div className="max-w-screen-2xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-10 text-xs font-light">
            
            {/* 왼쪽: 로고 및 주소 */}
            <div className="space-y-4">
              {/* 복원된 푸터 로고 */}
              <div className="mb-6 opacity-80 hover:opacity-100 transition-opacity relative h-8 w-40">
                 <Image 
                   src={footerLogoUrl} 
                   alt="Art Hyun Logo" 
                   fill
                   className="object-contain object-left"
                   sizes="(max-width: 768px) 100px, 150px"
                 />
              </div>

              <div>
                <p className="mb-1 font-heading font-bold text-white text-sm tracking-widest">
                  ART HYUN
                </p>
                <p>부산광역시 금정구 금사로 130, 캠퍼스디 2관 camp2</p>
                <p>T. 010-7713-4750 | E. k-drawingboard@naver.com</p>
              </div>
            </div>

            {/* 오른쪽: SNS 링크 */}
            <div className="flex gap-6 font-heading tracking-widest">
              <a
                href="https://www.instagram.com/art_hyun/"
                target="_blank"
                className="text-white hover:text-gray-300 transition"
              >
                INSTAGRAM
              </a>
              <a
                href="https://blog.naver.com/arthyunn"
                target="_blank"
                className="text-white hover:text-gray-300 transition"
              >
                BLOG
              </a>
            </div>

          </div>
          
          <div className="max-w-screen-2xl mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-center md:text-left text-[10px] text-gray-600 font-heading">
            COPYRIGHT 2019 ART HYUN. ALL RIGHTS RESERVED.
          </div>
        </footer>
      </body>
    </html>
  );
}