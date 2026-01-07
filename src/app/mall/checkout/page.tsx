// src/app/mall/checkout/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, Truck, MapPin, Phone, Mail, ChevronLeft } from "lucide-react";

// 예시 주문 상품
const orderItems = [
  {
    id: 1,
    title: "김민지 작가 '색의 여정' 포스터",
    artist: "김민지",
    price: 35000,
    quantity: 1,
    image: "/gallery1.png",
  },
  {
    id: 2,
    title: "전통 도예 컬렉션 엽서 세트",
    artist: "5인 작가",
    price: 18000,
    quantity: 2,
    image: "/gallery2.png",
  },
];

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    addressDetail: "",
    zipcode: "",
    message: "",
  });

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 50000 ? 0 : 3000;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Toss Payments 연동
    console.log("결제 진행:", { shippingInfo, paymentMethod, total });
    alert("결제 기능은 Toss Payments API 연동 후 작동합니다.");
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-20 pb-6 border-b border-border">
        <div className="max-w-screen-xl mx-auto px-6">
          <Link 
            href="/mall/cart" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ChevronLeft size={16} />
            <span>장바구니로 돌아가기</span>
          </Link>
          <h1 className="text-4xl font-serif font-light text-foreground">
            주문/결제
          </h1>
        </div>
      </section>

      <form onSubmit={handleSubmit}>
        <section className="py-12">
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* 왼쪽: 배송 정보 */}
              <div className="lg:col-span-2 space-y-8">
                {/* 배송지 정보 */}
                <div className="p-6 bg-card border border-border rounded-lg">
                  <div className="flex items-center gap-2 mb-6">
                    <Truck className="text-primary" size={20} />
                    <h2 className="text-xl font-serif text-foreground">배송지 정보</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          받는 분 *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.name}
                          onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
                          className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                          placeholder="홍길동"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          연락처 *
                        </label>
                        <input
                          type="tel"
                          required
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                          className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                          placeholder="010-1234-5678"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        이메일
                      </label>
                      <input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                        className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                        placeholder="example@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        우편번호 *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={shippingInfo.zipcode}
                          onChange={(e) => setShippingInfo({...shippingInfo, zipcode: e.target.value})}
                          className="flex-1 px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                          placeholder="12345"
                        />
                        <button
                          type="button"
                          className="px-6 py-3 border border-border rounded-md hover:bg-muted/30 transition-colors"
                        >
                          주소 검색
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        주소 *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                        className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                        placeholder="서울시 종로구 북촌로 12길"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        상세 주소
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.addressDetail}
                        onChange={(e) => setShippingInfo({...shippingInfo, addressDetail: e.target.value})}
                        className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                        placeholder="동/호수"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        배송 메시지
                      </label>
                      <textarea
                        value={shippingInfo.message}
                        onChange={(e) => setShippingInfo({...shippingInfo, message: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background resize-none"
                        placeholder="배송 시 요청사항을 입력해주세요"
                      />
                    </div>
                  </div>
                </div>

                {/* 결제 수단 */}
                <div className="p-6 bg-card border border-border rounded-lg">
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="text-primary" size={20} />
                    <h2 className="text-xl font-serif text-foreground">결제 수단</h2>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border border-border rounded-md cursor-pointer hover:bg-muted/30 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="flex-1">신용/체크카드</span>
                      <span className="text-xs text-muted-foreground">Toss Payments</span>
                    </label>

                    <label className="flex items-center gap-3 p-4 border border-border rounded-md cursor-pointer hover:bg-muted/30 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="transfer"
                        checked={paymentMethod === "transfer"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="flex-1">계좌이체</span>
                    </label>

                    <label className="flex items-center gap-3 p-4 border border-border rounded-md cursor-pointer hover:bg-muted/30 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="kakaopay"
                        checked={paymentMethod === "kakaopay"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="flex-1">카카오페이</span>
                    </label>

                    <label className="flex items-center gap-3 p-4 border border-border rounded-md cursor-pointer hover:bg-muted/30 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="naverpay"
                        checked={paymentMethod === "naverpay"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="flex-1">네이버페이</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 오른쪽: 주문 요약 */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 p-6 bg-card border border-border rounded-lg space-y-4">
                  <h2 className="text-xl font-serif text-foreground mb-4">
                    주문 상품
                  </h2>

                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground">{item.artist}</p>
                          <p className="text-sm text-foreground line-clamp-2">{item.title}</p>
                          <p className="text-sm text-muted-foreground">수량: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            ₩{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 py-4 border-y border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">상품 금액</span>
                      <span className="text-foreground">₩{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">배송비</span>
                      <span className="text-foreground">
                        {shipping === 0 ? "무료" : `₩${shipping.toLocaleString()}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline py-4">
                    <span className="text-lg font-medium text-foreground">총 결제금액</span>
                    <span className="text-2xl font-serif text-primary">
                      ₩{total.toLocaleString()}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                  >
                    ₩{total.toLocaleString()} 결제하기
                  </button>

                  <p className="text-xs text-muted-foreground text-center">
                    주문 완료 시 개인정보 처리방침 및<br />
                    결제 대행 서비스 약관에 동의하게 됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
