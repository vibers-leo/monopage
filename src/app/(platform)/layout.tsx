import PlatformHeader from "./components/PlatformHeader";
import Link from "next/link";
import { Instagram, Twitter, MessageCircle } from "lucide-react";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen theme-platform">
      <PlatformHeader />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-background border-t border-border pt-20 pb-12">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="inline-block mb-6">
                <span className="text-2xl font-serif font-medium">ArtPage</span>
              </Link>
              <p className="text-muted-foreground max-w-sm mb-8">
                아티스트와 갤러리를 위한 올인원 웹사이트 빌더.<br />
                당신의 예술을 세상과 연결합니다.
              </p>
              <div className="flex gap-4">
                <a href="#" className="p-2 bg-muted rounded-full text-muted-foreground hover:bg-foreground hover:text-background transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="p-2 bg-muted rounded-full text-muted-foreground hover:bg-foreground hover:text-background transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="p-2 bg-muted rounded-full text-muted-foreground hover:bg-foreground hover:text-background transition-colors">
                  <MessageCircle size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/templates" className="hover:text-foreground transition-colors">Templates</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/experts" className="hover:text-foreground transition-colors">Experts</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2024 ArtPage Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
