// src/app/about/page.tsx

import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 py-20 md:py-32">
      
      {/* 1. 텍스트 영역 */}
      <div className="text-center mb-16 space-y-6 animate-fade-in-up">
        <h1 className="text-2xl md:text-4xl font-serif font-medium leading-relaxed text-gray-900">
          &quot;오랜 시간 멈춰있던 공간이 <br className="hidden md:block" />
           예술의 숨결로 다시 깨어났습니다.&quot;
        </h1>
        
        <p className="text-gray-500 text-sm md:text-base leading-loose max-w-2xl mx-auto break-keep">
          부산 동구 좌천동, 오랜 시간 멈춰있던 공간이 예술의 숨결로 다시 깨어났습니다. 
          아트웨이 갤러리는 방치되었던 유휴 공간을 지역 예술가들의 열정과 동구청의 협력으로 
          재탄생시킨 문화거점 공간입니다. 이번엔 어떤 전시가 열릴까요?
        </p>
      </div>

      {/* 2. 이미지 영역 (회색 박스 대신 실제 이미지 적용) */}
      <div className="relative w-full aspect-[16/10] md:aspect-[21/9] bg-gray-50 overflow-hidden shadow-sm animate-fade-in">
        <Image
          src="/view.jpg" // 👈 public 폴더에 저장한 파일명
          alt="Artway Gallery View"
          fill
          className="object-cover hover:scale-100 transition-transform duration-1000 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
          priority // 페이지 로딩 시 가장 먼저 불러옴
        />
      </div>

      {/* 추가: 갤러리 정보 섹션 (선택사항) */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left border-t border-gray-100 pt-16">
        <div>
          <h3 className="font-serif text-lg font-bold mb-2">Location</h3>
          <p className="text-gray-500 text-sm">부산광역시 동구 정공단로 9</p>
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold mb-2">Contact</h3>
          <p className="text-gray-500 text-sm">0507-1369-8386</p>
          <p className="text-gray-500 text-sm">artway_gallery@naver.com</p>
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold mb-2">Hours</h3>
          <p className="text-gray-500 text-sm">Open : 11:00 - 17:30</p>
          <p className="text-gray-400 text-xs mt-1">* 매주 월, 화요일 휴관</p>
        </div>
      </div>

    </div>
  );
}