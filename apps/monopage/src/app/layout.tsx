import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "모노페이지 — 나를 위한 단 하나의 페이지",
  description: "나를 위한 단 하나의 페이지. 링크, 프로필, 소개까지 하나의 URL로 완성하는 가장 심플한 웹 페이지 빌더.",
  metadataBase: new URL("https://monopage.kr"),
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "모노페이지 — 나를 위한 단 하나의 페이지",
    description: "나를 위한 단 하나의 페이지. 링크, 프로필, 소개까지 하나의 URL로 완성하는 가장 심플한 웹 페이지 빌더.",
    url: "https://monopage.kr",
    siteName: "모노페이지",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "모노페이지 — 나를 위한 단 하나의 페이지",
    description: "나를 위한 단 하나의 페이지. 링크, 프로필, 소개까지 하나의 URL로 완성하는 가장 심플한 웹 페이지 빌더.",
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
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
      </head>
      <body className="antialiased text-[#0a0a0a] bg-white">{children}</body>
    </html>
  );
}
