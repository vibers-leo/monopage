// src/app/mall/cart/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

// 예시 장바구니 데이터
const initialCartItems = [
  {
    id: 1,
    productId: 1,
    title: "김민지 작가 '색의 여정' 포스터",
    artist: "김민지",
    price: 35000,
    image: "/gallery1.png",
    quantity: 1,
  },
  {
    id: 2,
    productId: 2,
    title: "전통 도예 컬렉션 엽서 세트",
    artist: "5인 작가",
    price: 18000,
    image: "/gallery2.png",
    quantity: 2,
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 50000 ? 0 : 3000;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <section className="pt-20 pb-12 border-b border-border">
          <div className="max-w-screen-xl mx-auto px-6">
            <h1 className="text-4xl font-serif font-light text-foreground">
              장바구니
            </h1>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="text-center py-20">
              <ShoppingBag size={64} className="mx-auto mb-6 text-muted-foreground opacity-20" />
              <h2 className="text-2xl font-serif text-foreground mb-4">
                장바구니가 비어있습니다
              </h2>
              <p className="text-muted-foreground mb-8">
                마음에 드는 상품을 담아보세요
              </p>
              <Link
                href="/mall"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                <span>쇼핑 계속하기</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-20 pb-12 border-b border-border">
        <div className="max-w-screen-xl mx-auto px-6">
          <h1 className="text-4xl font-serif font-light text-foreground">
            장바구니
          </h1>
          <p className="text-muted-foreground mt-2">
            {cartItems.length}개의 상품
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* 왼쪽: 장바구니 아이템 */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-card border border-border rounded-lg"
                >
                  {/* 상품 이미지 */}
                  <Link href={`/mall/${item.productId}`} className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </Link>

                  {/* 상품 정보 */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/mall/${item.productId}`}>
                      <p className="text-xs text-muted-foreground mb-1">{item.artist}</p>
                      <h3 className="text-base font-medium text-foreground hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-lg font-serif text-foreground mt-2">
                      ₩{item.price.toLocaleString()}
                    </p>
                  </div>

                  {/* 수량 조절 */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 rounded border border-border hover:border-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded border border-border hover:border-foreground transition-colors flex items-center justify-center"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 오른쪽: 주문 요약 */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 bg-card border border-border rounded-lg space-y-4">
                <h2 className="text-xl font-serif text-foreground mb-4">
                  주문 요약
                </h2>

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
                  {subtotal < 50000 && (
                    <p className="text-xs text-muted-foreground">
                      ₩{(50000 - subtotal).toLocaleString()} 더 담으면 무료배송
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-baseline py-4">
                  <span className="text-lg font-medium text-foreground">총 결제금액</span>
                  <span className="text-2xl font-serif text-primary">
                    ₩{total.toLocaleString()}
                  </span>
                </div>

                <Link
                  href="/mall/checkout"
                  className="block w-full py-3 bg-primary text-white text-center rounded-md hover:bg-primary/90 transition-colors"
                >
                  주문하기
                </Link>

                <Link
                  href="/mall"
                  className="block w-full py-3 border border-border text-center rounded-md hover:bg-muted/30 transition-colors"
                >
                  쇼핑 계속하기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
