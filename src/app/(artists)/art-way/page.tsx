import { supabase } from "@/lib/supabase";
// 🚨 주의: MainSlider가 있는 경로를 확인하세요. 
// 스크린샷 기준으로는 "@/components/ui/MainSlider" 가 맞습니다.
import MainSlider from "@/components/templates/art-way/MainSlider"; 

// 데이터가 계속 바뀌므로 캐싱하지 않음 (새로고침 시 즉시 반영)
export const dynamic = "force-dynamic";

export default async function HomePage() {
  console.log("--------------- [메인 페이지 로드 시작] ---------------");

  // 1. 메인 슬라이더용 전시 데이터 가져오기
  // (테이블에 is_main_slider 컬럼이 없으면 에러가 날 수 있으니 꼭 추가해주세요!)
  const { data: exhibitions, error: exError } = await supabase
    .from("exhibitions")
    .select("*")
    .eq("is_main_slider", true) 
    .order("created_at", { ascending: false });

  if (exError) console.error("❌ 전시 데이터 에러:", exError.message);
  else console.log(`✅ 전시 데이터: ${exhibitions?.length}개 로드됨`);


  // 2. 배경 유튜브 URL 가져오기
  const { data: bannerData, error: bnError } = await supabase
    .from("main_banner")
    .select("youtube_url")
    .eq("is_active", true) // 활성화된 것만
    .limit(1)
    .maybeSingle(); // 데이터가 없어도 에러내지 않고 null 반환

  if (bnError) console.error("❌ 배너 데이터 에러:", bnError.message);
  console.log("✅ 배너 데이터:", bannerData);


  // 3. 데이터 가공
  const slides = exhibitions || [];

  return (
    // relative: 자식 요소들의 기준점
    // h-screen: 화면 꽉 채움
    // overflow-hidden: 영상이 튀어나가는 것 방지
    // bg-black: 영상 로딩 전 깜빡임 방지용 검은 배경
    <div className="relative w-full h-screen overflow-hidden bg-black">
      
      {/* =========================================
          🖼️ [컨텐츠 레이어] (슬라이더 + 배경)
          MainSlider 내부에서 배경 영상과 컨텐츠를 모두 처리합니다.
      ========================================= */}
      <div className="relative z-10 h-full w-full pt-16">
        {slides.length > 0 ? (
          <MainSlider 
            exhibitions={slides} 
            fallbackYoutubeUrl={bannerData?.youtube_url}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-white/40 gap-4">
            <p className="text-lg font-light tracking-widest">EXHIBITION PREPARING</p>
            <p className="text-xs">현재 진행 중인 전시가 준비 중입니다.</p>
          </div>
        )}
      </div>

    </div>
  );
}