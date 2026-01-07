import { ShoppingBag } from "lucide-react";

export default function MallPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-400">
      <ShoppingBag size={48} className="mb-4 opacity-20" />
      <h2 className="text-xl font-serif text-black mb-2">
        Art Shop Coming Soon
      </h2>
      <p>아트웨이 작가들의 굿즈를 만날 수 있는 공간을 준비 중입니다.</p>
    </div>
  );
}
