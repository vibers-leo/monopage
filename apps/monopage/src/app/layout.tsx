import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "모노페이지 | 1페이지 웹사이트 빌더",
  description: "누구나 1페이지 웹사이트를 쉽게 만들고 공유할 수 있는 빌더 서비스. 템플릿 선택부터 도메인 연결까지 논코딩으로 완성.",
  metadataBase: new URL("https://monopage.kr"),
  openGraph: {
    title: "모노페이지 | 1페이지 웹사이트 빌더",
    description: "누구나 1페이지 웹사이트를 쉽게 만들고 공유할 수 있는 빌더 서비스.",
    url: "https://monopage.kr",
    siteName: "모노페이지",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "모노페이지 | 1페이지 웹사이트 빌더",
    description: "누구나 1페이지 웹사이트를 쉽게 만들고 공유할 수 있는 빌더 서비스.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased text-black bg-white`}>{children}</body>
    </html>
  );
}
