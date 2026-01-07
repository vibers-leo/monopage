// src/app/mall/[id]/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Share2, Minus, Plus, ChevronLeft } from "lucide-react";

// 예시 상품 데이터 (실제로는 DB에서 가져옴)
const productData: Record<string, any> = {
  "1": {
    id: 1,
    title: "김민지 작가 '색의 여정' 포스터",
    artist: "김민지",
    price: 35000,
    originalPrice: 45000,
    images: ["/gallery1.png", "/gallery2.png"],
    category: "포스터",
    size: "A2 (420 x 594mm)",
    material: "고급 아트지 인쇄",
    description: "현대 추상화의 새로운 해석을 보여주는 김민지 작가의 대표작 '색의 여정'을 고품질 포스터로 만나보세요. 전통 색채와 현대적 감각이 어우러진 작품을 일상 공간에서 감상하실 수 있습니다.",
    details: [
      "한정판 500부 제작",
      "작가 서명 포함",
      "고급 아트지 사용",
      "UV 코팅 처리",
      "액자 미포함"
    ],
    stock: 15
  },
  "2": {
    id: 2,
    title: "전통 도예 컬렉션 엽서 세트",
    artist: "5인 작가",
    price: 18000,
    images: ["/gallery2.png", "/gallery1.png"],
    category: "엽서",
    size: "10 x 15cm (10장 세트)",
    material: "프리미엄 용지",
    description: "전통 도예 기법을 현대적으로 재해석한 5인의 도예가 작품을 엽서로 담았습니다. 각 작품의 섬세한 디테일을 고화질로 인쇄하여 소장 가치가 높습니다.",
    details: [
      "10장 세트 구성",
      "개별 투명 케이스 포장",
      "고급 용지 사용",
      "작품 설명 카드 포함"
    ],
    stock: 30
  }
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = productData[params.id] || productData["1"];
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const totalPrice = product.price * quantity;

  return (
    <div className="min-h-screen bg-background">
      {/* 상단 네비게이션 */}
      <section className="pt-20 pb-6 border-b border-border">
        <div className="max-w-screen-xl mx-auto px-6">
          <Link 
            href="/mall" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Shop으로 돌아가기</span>
          </Link>
        </div>
      </section>

      {/* 상품 상세 */}
      <section className="py-12">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* 왼쪽: 이미지 */}
            <div className="space-y-4">
              {/* 메인 이미지 */}
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted border border-border">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* 썸네일 */}
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                        selectedImage === idx 
                          ? "border-primary" 
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.title} ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 오른쪽: 정보 */}
            <div className="space-y-6">
              {/* 카테고리 */}
              <div>
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  {product.category}
                </span>
              </div>

              {/* 제목 */}
              <div>
                <h1 className="text-3xl font-serif font-light text-foreground mb-2">
                  {product.title}
                </h1>
                <p className="text-muted-foreground">{product.artist}</p>
              </div>

              {/* 가격 */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-serif text-foreground">
                  ₩{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ₩{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* 설명 */}
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* 상세 정보 */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">크기</span>
                  <span className="text-foreground">{product.size}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">재질</span>
                  <span className="text-foreground">{product.material}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">재고</span>
                  <span className="text-foreground">{product.stock}개</span>
                </div>
              </div>

              {/* 수량 선택 */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">수량</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-md border border-border hover:border-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 rounded-md border border-border hover:border-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* 총 가격 */}
              <div className="flex justify-between items-center py-4 border-y border-border">
                <span className="text-lg font-medium text-foreground">총 금액</span>
                <span className="text-2xl font-serif text-primary">
                  ₩{totalPrice.toLocaleString()}
                </span>
              </div>

              {/* 버튼 그룹 */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`w-12 h-12 rounded-md border transition-all flex items-center justify-center ${
                    isLiked 
                      ? "border-primary bg-primary/10 text-primary" 
                      : "border-border hover:border-foreground"
                  }`}
                >
                  <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                </button>
                
                <button className="flex-1 h-12 bg-background border border-border rounded-md hover:border-foreground transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart size={18} />
                  <span>장바구니</span>
                </button>
                
                <Link
                  href="/mall/checkout"
                  className="flex-1 h-12 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <span>바로 구매</span>
                </Link>
              </div>

              {/* 상품 특징 */}
              <div className="pt-6 space-y-2">
                <h3 className="font-medium text-foreground mb-3">상품 특징</h3>
                <ul className="space-y-2">
                  {product.details.map((detail: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-1">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 추가 정보 섹션 */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="font-medium text-foreground mb-2">무료 배송</h3>
              <p className="text-sm text-muted-foreground">
                5만원 이상 구매 시<br />전국 무료 배송
              </p>
            </div>
            
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="font-medium text-foreground mb-2">교환/반품</h3>
              <p className="text-sm text-muted-foreground">
                수령 후 7일 이내<br />무료 교환/반품
              </p>
            </div>
            
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="font-medium text-foreground mb-2">안전 포장</h3>
              <p className="text-sm text-muted-foreground">
                작품 보호를 위한<br />특수 포장 제공
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
