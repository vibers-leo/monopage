// src/app/archive/page.tsx
import { supabase } from "@/lib/supabase";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { Plus } from "lucide-react";
import ArchiveClient from "@/components/ArchiveClient";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function ArchivePage() {
  // 1. 전시 데이터 가져오기
  const { data: exhibitions } = await supabase
    .from("exhibitions")
    .select("*")
    .order("start_date", { ascending: false });

  // 2. 관리자 로그인 여부 확인
  const cookieStore = await cookies();
  const supabaseServer = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );

  const {
    data: { user },
  } = await supabaseServer.auth.getUser();
  const isAdmin = !!user;

  return (
    <div className="min-h-screen bg-background">
      {/* 통일된 페이지 헤더 */}
      <section className="pt-20 pb-12 border-b border-border">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex justify-between items-end">
            <h1 className="text-4xl font-serif font-light text-foreground">
              Exhibition Archive
            </h1>

            {/* 관리자 전용 버튼 */}
            {isAdmin && (
              <Button
                asChild
                className="bg-primary text-white hover:bg-primary/90 gap-2"
              >
                <Link href="/admin/exhibition/write">
                  <Plus size={16} /> 전시 등록
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* 전시 목록 */}
      <section className="py-20">
        <div className="max-w-screen-xl mx-auto px-6">
          <ArchiveClient initialData={exhibitions || []} />
        </div>
      </section>
    </div>
  );
}
