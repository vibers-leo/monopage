import { MapPin, Phone, Clock, Train, Car } from "lucide-react";
import Image from "next/image";
import ContactForm from "@/components/templates/art-way/ContactForm";

export default function ContactPage() {
  return (
    <div className="w-full">
      {/* 1. 상단 정보 & 지도 섹션 */}
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col md:flex-row gap-12">
        {/* 텍스트 정보 */}
        <div className="md:w-1/3 space-y-10 ">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-6 ">Visit Us</h2>
            <p className="text-gray-600 leading-relaxed">
              아트웨이 갤러리는 부산 동구 좌천동 역사문화마을에 위치하고 있습니다.
              골목의 정취와 예술의 향기를 느껴보세요.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <MapPin className="text-blue-600 shrink-0" />
              <div>
                <p className="font-bold">주소</p>
                <p className="text-gray-600">부산시 동구 정공단로 9 (좌천동)</p>
                <p className="text-xs text-gray-400 mt-1">
                  아트웨이 갤러리 F1-F3
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Clock className="text-blue-600 shrink-0" />
              <div>
                <p className="font-bold">운영 시간</p>
                <p className="text-gray-600">수 ~ 일요일 11:00 - 17:30</p>
                <p className="text-xs text-red-400">매주 월, 화 휴관</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone className="text-blue-600 shrink-0" />
              <div>
                <p className="font-bold">문의</p>
                <p className="text-gray-600">0507-1369-8386</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Train size={18} /> 오시는 길
            </h3>
            <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
              <li>
                지하철 1호선{" "}
                <span className="text-orange-500 font-bold">좌천역</span> 1, 3번
                출구 도보 1분
              </li>
              <li>버스: 좌천역, 좌천삼거리 하차</li>
            </ul>
          </div>

          <div className="pt-2">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Car size={18} /> 주차
            </h3>
            <p className="text-sm text-gray-600">
              인근 공영주차장 이용 (노상 공영주차장)
            </p>
          </div>
        </div>

        {/* 지도 영역 */}
        <div className="md:w-2/3 rounded-xl overflow-hidden relative shadow-lg">
          <Image
            src="/images/map.png"
            alt="아트웨이 갤러리 오시는 길"
            width={1200}
            height={800}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      </div>

      {/* 2. 하단 문의 폼 섹션 (NEW) */}
      <div className="bg-gray-50 py-20 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-serif font-bold mb-4">Contact & Application</h2>
                <p className="text-gray-500">전시 대관 신청 및 기타 문의사항을 남겨주세요.</p>
            </div>
            
            <ContactForm />
        </div>
      </div>
    </div>
  );
}
