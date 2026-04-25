'use client';

import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-[680px] mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <h1 className="font-paperlogy text-[28px] sm:text-[32px] font-extrabold tracking-tight mb-2">이용약관</h1>
        <p className="text-[15px] text-[#a3a3a3] mb-10">최종 수정일: 2026년 4월 20일</p>

        <div className="flex flex-col gap-8 text-[15px] leading-[1.8] text-[#525252]">
          <section>
            <h2 className="text-[18px] font-bold text-[#0a0a0a] mb-3">제1조 (목적)</h2>
            <p>이 약관은 계발자들(Vibers, 이하 "회사")이 운영하는 모노페이지(monopage.kr, 이하 "서비스")의 이용 조건 및 절차에 관한 사항을 규정해요.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#0a0a0a] mb-3">제2조 (용어의 정의)</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li><strong>회원:</strong> 서비스에 가입하여 이용 계약을 체결한 개인 또는 단체</li>
              <li><strong>페이지:</strong> 회원이 서비스를 통해 생성한 개인 웹페이지</li>
              <li><strong>콘텐츠:</strong> 회원이 페이지에 등록한 텍스트, 이미지, 링크 등 모든 정보</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#0a0a0a] mb-3">제3조 (약관의 효력)</h2>
            <p>이 약관은 서비스 화면에 게시하거나 기타 방법으로 공지함으로써 효력이 발생해요. 회사가 약관을 변경할 경우, 적용일 7일 전부터 공지해요.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#0a0a0a] mb-3">제4조 (이용 계약의 성립)</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>이용 계약은 회원이 약관에 동의하고 가입 신청을 한 후 회사가 승낙함으로써 성립해요.</li>
              <li>소셜 로그인(카카오, 구글, 네이버)을 통한 가입도 동일하게 적용돼요.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#0a0a0a] mb-3">제5조 (서비스의 내용)</h2>
            <p>회사는 다음 서비스를 제공해요.</p>
            <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
              <li>개인 웹페이지 생성 및 편집</li>
              <li>링크 관리 및 자동 감지</li>
              <li>포트폴리오 갤러리</li>
              <li>테마 선택 및 커스터마이징</li>
              <li>방문자 통계 (조회수, 클릭 분석)</li>
              <li>SNS 계정 연동 (Instagram 등)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#0a0a0a] mb-3">제6조 (서비스 이용 제한)</h2>
            <p>현재 오픈 베타 기간으로 1인 1페이지를 제공해요. 추가 페이지는 별도 신청을 통해 개설할 수 있어요.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#0a0a0a] mb-3">제7조 (회원의 의무)</h2>
            <p>회원은 다음 행위를 하면 안 돼요.</p>
            <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
              <li>타인의 개인정보를 도용하거나 허위 정보를 등록하는 행위</li>
              <li>서비스를 이용한 불법 콘텐츠 배포</li>
              <li>다른 회원의 서비스 이용을 방해하는 행위</li>
              <li>서비스의 안정적 운영을 방해하는 행위</li>
              <li>저작권 등 타인의 권리를 침해하는 콘텐츠 게시</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#0a0a0a] mb-3">제8조 (콘텐츠의 권리)</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>회원이 게시한 콘텐츠의 저작권은 회원에게 있어요.</li>
              <li>회사는 서비스 운영 목적으로 콘텐츠를 표시·배포할 수 있어요.</li>
              <li>회원 탈퇴 시 콘텐츠는 즉시 삭제돼요. 단, 다른 회원이 공유·인용한 경우 해당 부분은 삭제되지 않을 수 있어요.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#0a0a0a] mb-3">제9조 (서비스의 변경 및 중단)</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>회사는 서비스 개선을 위해 사전 공지 후 서비스 내용을 변경할 수 있어요.</li>
              <li>천재지변, 시스템 장애 등 불가피한 경우 서비스를 일시 중단할 수 있어요.</li>
              <li>무료 서비스의 특성상, 서비스 종료 시 30일 전에 공지해요.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#0a0a0a] mb-3">제10조 (면책 사항)</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>회사는 무료로 제공하는 서비스에 대해 별도의 보증을 하지 않아요.</li>
              <li>회원의 콘텐츠로 인해 발생한 분쟁에 대해 회사는 책임지지 않아요.</li>
              <li>외부 링크(회원이 등록한 URL)의 내용에 대해 회사는 책임지지 않아요.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#0a0a0a] mb-3">제11조 (회원 탈퇴 및 이용 제한)</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>회원은 어드민 페이지에서 언제든지 탈퇴할 수 있어요.</li>
              <li>탈퇴 시 모든 개인정보와 콘텐츠가 즉시 삭제돼요.</li>
              <li>약관을 위반한 회원에 대해 회사는 서비스 이용을 제한하거나 계약을 해지할 수 있어요.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#0a0a0a] mb-3">제12조 (분쟁 해결)</h2>
            <p>서비스 이용과 관련한 분쟁은 대한민국 법을 적용하며, 관할 법원은 회사의 소재지를 관할하는 법원으로 해요.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#0a0a0a] mb-3">제13조 (문의)</h2>
            <ul className="list-none flex flex-col gap-1">
              <li><strong>사업자:</strong> 계발자들 (Vibers)</li>
              <li><strong>이메일:</strong> vibers.leo@gmail.com</li>
            </ul>
          </section>
        </div>
      </main>

      <footer className="py-8 border-t border-[#e5e5e5]">
        <div className="max-w-[680px] mx-auto px-5 sm:px-8 flex items-center justify-between">
          <p className="text-[14px] text-[#a3a3a3]">&copy; 2026 Monopage by Vibers</p>
          <Link href="/privacy" className="text-[14px] text-[#a3a3a3] hover:text-[#0a0a0a] transition-colors">개인정보처리방침</Link>
        </div>
      </footer>
    </div>
  );
}
