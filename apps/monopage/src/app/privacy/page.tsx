import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 — 모노페이지',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#e5e5e5] px-5 sm:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="font-paperlogy font-extrabold text-[18px] tracking-tight text-[#0a0a0a]">Monopage</Link>
        <Link href="/" className="text-[15px] font-medium text-[#a3a3a3] hover:text-[#0a0a0a] transition-colors">홈으로</Link>
      </nav>

      <main className="max-w-[680px] mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <h1 className="font-paperlogy text-[28px] sm:text-[32px] font-extrabold tracking-tight mb-2">개인정보처리방침</h1>
        <p className="text-[15px] text-[#a3a3a3] mb-10">최종 수정일: 2026년 4월 20일</p>

        <div className="flex flex-col gap-8 text-[15px] leading-[1.8] text-[#525252]">
          <section>
            <h2 className="text-[18px] font-bold text-[#0a0a0a] mb-3">1. 수집하는 개인정보</h2>
            <p>모노페이지(이하 "서비스")는 회원가입 및 서비스 이용을 위해 다음 정보를 수집해요.</p>
            <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
              <li><strong>필수 항목:</strong> 이메일 주소, 비밀번호(암호화 저장), 사용자명(페이지 주소)</li>
              <li><strong>선택 항목:</strong> 프로필 사진, 자기소개</li>
              <li><strong>자동 수집:</strong> 페이지 방문 통계(조회수, 링크 클릭수), IP 주소, 접속 시간</li>
              <li><strong>소셜 로그인 시:</strong> 카카오/구글/네이버 계정의 이메일, 프로필 정보(닉네임, 프로필 이미지)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#0a0a0a] mb-3">2. 개인정보의 이용 목적</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>회원 식별 및 서비스 제공</li>
              <li>페이지 생성·편집·공유 기능 제공</li>
              <li>방문자 통계 제공 (조회수, 링크 클릭 분석)</li>
              <li>서비스 개선 및 신규 기능 개발</li>
              <li>문의 응대 및 공지사항 전달</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#0a0a0a] mb-3">3. 개인정보의 보유 및 파기</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>회원 탈퇴 시 즉시 파기해요. 단, 관련 법령에 따라 일정 기간 보관이 필요한 정보는 해당 기간 동안 별도 보관 후 파기해요.</li>
              <li>전자상거래법에 따른 계약·거래 기록: 5년</li>
              <li>통신비밀보호법에 따른 접속 로그: 3개월</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#0a0a0a] mb-3">4. 개인정보의 제3자 제공</h2>
            <p>서비스는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않아요. 다만 다음의 경우는 예외예요.</p>
            <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
              <li>법령에 의한 요청이 있는 경우</li>
              <li>이용자가 사전에 동의한 경우</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#0a0a0a] mb-3">5. 개인정보의 안전성 확보</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>비밀번호는 단방향 암호화(bcrypt)하여 저장해요.</li>
              <li>HTTPS를 통한 데이터 전송 암호화를 적용해요.</li>
              <li>개인정보 접근 권한을 최소화하고 있어요.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#0a0a0a] mb-3">6. 이용자의 권리</h2>
            <p>이용자는 언제든지 다음 권리를 행사할 수 있어요.</p>
            <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
              <li>개인정보 열람, 수정, 삭제 요청</li>
              <li>회원 탈퇴를 통한 개인정보 일괄 삭제</li>
              <li>마케팅 수신 거부</li>
            </ul>
            <p className="mt-2">어드민 페이지의 설정 탭에서 직접 처리하거나, 아래 연락처로 요청해주세요.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#0a0a0a] mb-3">7. 쿠키 및 분석 도구</h2>
            <p>서비스는 로그인 세션 유지를 위해 쿠키(또는 로컬스토리지)를 사용해요. 방문자 통계는 자체 시스템으로 수집하며, 외부 분석 도구(Google Analytics 등)는 현재 사용하지 않아요.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#0a0a0a] mb-3">8. 개인정보 보호책임자</h2>
            <ul className="list-none flex flex-col gap-1">
              <li><strong>사업자:</strong> 계발자들 (Vibers)</li>
              <li><strong>이메일:</strong> vibers.leo@gmail.com</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#0a0a0a] mb-3">9. 방침 변경</h2>
            <p>이 방침이 변경되면 서비스 내 공지를 통해 안내드려요. 중요한 변경 사항은 이메일로도 알려드려요.</p>
          </section>
        </div>
      </main>

      <footer className="py-8 border-t border-[#e5e5e5]">
        <div className="max-w-[680px] mx-auto px-5 sm:px-8 flex items-center justify-between">
          <p className="text-[14px] text-[#a3a3a3]">&copy; 2026 Monopage by Vibers</p>
          <Link href="/terms" className="text-[14px] text-[#a3a3a3] hover:text-[#0a0a0a] transition-colors">이용약관</Link>
        </div>
      </footer>
    </div>
  );
}
