import Header from "@/components/Header";
import Link from 'next/link';

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="py-12 border-t border-border bg-background">
        <div className="max-w-screen-xl mx-auto px-6 text-center text-muted-foreground text-sm">
          <p className="mb-4">© 2024 Brand Name. All rights reserved.</p>
          <div className="flex justify-center gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Instagram</Link>
          </div>
          <p className="mt-8 text-xs opacity-50">
            Powered by <Link href="/" className="hover:underline">Platform Name</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
