// src/app/contact/page.tsx

import { MapPin, Phone, Clock, Mail, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* 통일된 페이지 헤더 */}
      <section className="pt-20 pb-12 border-b border-border">
        <div className="max-w-screen-xl mx-auto px-6">
          <h1 className="text-4xl font-serif font-light text-foreground">
            Contact
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            북촌 아트 스페이스에 문의하시거나 방문 계획이 있으시다면 아래 정보를 참고해주세요.
          </p>
        </div>
      </section>

      {/* 메인 컨텐츠 */}
      <section className="py-20">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* 왼쪽: 문의 폼 */}
            <div>
              <h2 className="text-2xl font-serif font-light text-foreground mb-8">
                Send us a message
              </h2>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      이름 *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
                      placeholder="홍길동"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      이메일 *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    연락처
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
                    placeholder="010-1234-5678"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    제목 *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
                    placeholder="문의 제목을 입력해주세요"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    메시지 *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground resize-none"
                    placeholder="문의 내용을 자세히 작성해주세요"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  <span>메시지 보내기</span>
                </button>
              </form>
            </div>

            {/* 오른쪽: 연락처 정보 */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-serif font-light text-foreground mb-8">
                  Visit Information
                </h2>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-foreground mb-2">주소</h3>
                      <p className="text-muted-foreground">서울특별시 종로구 북촌로 12길 15</p>
                      <p className="text-sm text-muted-foreground/60 mt-1">
                        서울, 대한민국 03058
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="text-secondary" size={20} />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-foreground mb-2">운영시간</h3>
                      <p className="text-muted-foreground">화 - 일: 11:00 - 18:00</p>
                      <p className="text-sm text-muted-foreground/60 mt-1">
                        * 매주 월요일 휴관<br />
                        * 공휴일 정상 운영
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="text-accent" size={20} />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-foreground mb-2">연락처</h3>
                      <p className="text-muted-foreground">T. 02-1234-5678</p>
                      <p className="text-muted-foreground">F. 02-1234-5679</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-foreground mb-2">이메일</h3>
                      <p className="text-muted-foreground">info@bukchonart.kr</p>
                      <p className="text-muted-foreground">press@bukchonart.kr</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 지도 플레이스홀더 */}
              <div className="rounded-lg overflow-hidden border border-border bg-muted/30 h-80 flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin size={48} className="mx-auto mb-4 text-muted-foreground opacity-20" />
                  <p className="text-muted-foreground text-sm">
                    Google Maps 또는<br />
                    Kakao Map 임베드
                  </p>
                </div>
              </div>

              {/* 교통 정보 */}
              <div className="p-6 bg-muted/30 rounded-lg">
                <h3 className="font-serif text-lg text-foreground mb-4">
                  대중교통
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>지하철 3호선 안국역 2번 출구 도보 7분</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>버스: 109, 151, 162, 171, 172, 272, 601</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>주차: 인근 북촌문화센터 공영주차장 이용</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
