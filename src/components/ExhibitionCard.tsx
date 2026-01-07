// components/ExhibitionCard.tsx
import Image from "next/image";
import Link from "next/link";

interface ExhibitionCardProps {
  title: string;
  artist?: string;
  period: string;
  description: string;
  image: string;
  status: "ongoing" | "upcoming" | "past";
  link?: string;
}

export default function ExhibitionCard({
  title,
  artist,
  period,
  description,
  image,
  status,
  link = "/archive"
}: ExhibitionCardProps) {
  const statusConfig = {
    ongoing: {
      label: "진행중",
      bgColor: "bg-primary/10",
      textColor: "text-primary"
    },
    upcoming: {
      label: "예정",
      bgColor: "bg-secondary/10",
      textColor: "text-secondary"
    },
    past: {
      label: "종료",
      bgColor: "bg-muted",
      textColor: "text-muted-foreground"
    }
  };

  const config = statusConfig[status];

  return (
    <div className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-2xl hover:border-primary/30 transition-all duration-500">
      {/* 이미지 */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {/* 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* 내용 */}
      <div className="p-6 space-y-3">
        {/* 상태 및 기간 */}
        <div className="flex items-center gap-2 text-xs">
          <span className={`px-2 py-1 ${config.bgColor} ${config.textColor} rounded font-medium`}>
            {config.label}
          </span>
          <span className="text-muted-foreground">{period}</span>
        </div>

        {/* 제목 */}
        <h3 className="text-2xl font-serif text-foreground group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>

        {/* 작가 */}
        {artist && (
          <p className="text-sm text-muted-foreground">
            작가: <span className="font-medium">{artist}</span>
          </p>
        )}

        {/* 설명 */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* 링크 */}
        <Link 
          href={link} 
          className="inline-flex items-center gap-1 text-sm text-primary hover:gap-2 transition-all duration-300 group/link"
        >
          <span>자세히 보기</span>
          <span className="group-hover/link:translate-x-1 transition-transform duration-300">→</span>
        </Link>
      </div>
    </div>
  );
}
