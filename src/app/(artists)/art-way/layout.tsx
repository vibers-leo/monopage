import type { Metadata } from "next";
import { Noto_Serif_KR, Inter } from "next/font/google";

// 👇 헤더 컴포넌트 경로 확인 (components/Header 인지 components/ui/Header 인지)
import Header from "@/components/templates/art-way/Header"; 
import VisitorTracker from "@/components/templates/art-way/VisitorTracker"; 

import { getSiteSettings } from "@/actions/settingsActions";

const serif = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-serif",
});
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  const title = "Artway Gallery";
  const description = settings?.og_description || "부산 동구 문화 예술 공간";
  const ogImage = settings?.og_image_url ? [settings.og_image_url] : [];

  return {
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
  return (
    <html lang="ko" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans text-gray-900 bg-white selection:bg-black selection:text-white">
        
        {/* 방문자 추적기 (관리자 통계용) */}
        <VisitorTracker />
        
        {/* 헤더 */}
        <Header />

        {/* 메인 컨텐츠 */}
        <main className="min-h-screen">
            {children}
        </main>

        {/* 푸터 */}
        {/* py-24: 위아래 여백을 넉넉하게 줌 */}
        {/* mt-20 삭제: 위쪽 불필요한 공백 제거 */}
        <footer className="py-24 border-t border-gray-100 bg-white">
          <div className="max-w-screen-2xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-gray-400 text-xs font-light">
            
            {/* 왼쪽: 주소 및 연락처 */}
            <div>
              <p className="mb-2 font-serif text-black text-sm">
                아트웨이 갤러리 ARTWAY GALLERY
              </p>
              <p>부산광역시 동구 정공단로 9</p>
              <p>T. 0507-1369-8386 | E. artway_gallery@naver.com</p>
            </div>

            {/* 👇 오른쪽: 사라졌던 SNS 링크들 복구 완료! */}
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/artwaygallery_story/"
                target="_blank"
                className="hover:text-black transition"
              >
                INSTAGRAM
              </a>
              <a
                href="https://blog.naver.com/art_way_"
                target="_blank"
                className="hover:text-black transition"
              >
                BLOG
              </a>
              <a
                href="https://www.youtube.com/@artwaygallerybusan"
                target="_blank"
                className="hover:text-black transition"
              >
                YOUTUBE
              </a>
            </div>

          </div>
        </footer>
      </body>
    </html>
  );
}