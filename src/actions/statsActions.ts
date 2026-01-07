"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// [방문자 수 증가] (누구나 호출 가능 - 내부적으로 처리)
export async function incrementVisitor() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
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

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // 1. 오늘 날짜 레코드 조회
  const { data: existing } = await supabase
    .from("daily_stats")
    .select("*")
    .eq("date", today)
    .single();

  if (existing) {
    // 2. 있으면 카운트 +1
    await supabase
      .from("daily_stats")
      .update({ count: existing.count + 1 })
      .eq("date", today);
  } else {
    // 3. 없으면 새로 생성 (count: 1)
    await supabase.from("daily_stats").insert({ date: today, count: 1 });
  }
}

// [대시보드 통계 조회] (관리자용)
export async function getDashboardStats() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
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

  // 1. 전체 전시 수
  const { count: exhibitionCount } = await supabase
    .from("exhibitions")
    .select("*", { count: "exact", head: true });

  // 2. 전체 미디어 수
  const { count: mediaCount } = await supabase
    .from("media_releases")
    .select("*", { count: "exact", head: true });

  // 3. 최근 7일 방문자 통계
  const { data: visitorStats } = await supabase
    .from("daily_stats")
    .select("*")
    .order("date", { ascending: true }) // 날짜순 정렬
    .limit(30); // 최대 30일

  // 4. 오늘의 방문자 수
  const today = new Date().toISOString().split("T")[0];
  const todayStat = visitorStats?.find((s) => s.date === today);

  return {
    exhibitionCount: exhibitionCount || 0,
    mediaCount: mediaCount || 0,
    todayVisitorCount: todayStat?.count || 0,
    visitorStats: visitorStats || [],
  };
}
