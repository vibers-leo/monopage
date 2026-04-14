import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "에이전시 랜딩 | 1인 마케팅 대행사",
  description: "작지만 강한 1인 마케팅 대행사. 브랜딩, 콘텐츠, 광고 운영까지 전략부터 실행까지 함께합니다.",
  metadataBase: new URL("https://agency.vibers.co.kr"),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://agency.vibers.co.kr",
    siteName: "에이전시 랜딩",
    title: "에이전시 랜딩 | 1인 마케팅 대행사",
    description: "작지만 강한 1인 마케팅 대행사. 브랜딩, 콘텐츠, 광고 운영까지 전략부터 실행까지 함께합니다.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "에이전시 랜딩" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "에이전시 랜딩 | 1인 마케팅 대행사",
    description: "작지만 강한 1인 마케팅 대행사. 브랜딩, 콘텐츠, 광고 운영까지 전략부터 실행까지 함께합니다.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "에이전시 랜딩",
              description: "작지만 강한 1인 마케팅 대행사. 브랜딩, 콘텐츠, 광고 운영까지 전략부터 실행까지 함께합니다.",
              url: "https://agency.vibers.co.kr",
              inLanguage: "ko",
              author: {
                "@type": "Organization",
                name: "계발자들",
                url: "https://vibers.co.kr",
              },
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
