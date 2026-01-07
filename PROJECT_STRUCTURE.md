# ArtPage Platform - 프로젝트 구조 가이드

## 📁 디렉토리 구조

```
artpage/
├── src/app/                          # 메인 플랫폼 (artpage.kr)
│   ├── page.tsx                     # ✅ 랜딩 페이지 (LANDING_PAGE.tsx 참고)
│   ├── layout.tsx                   # 전역 레이아웃
│   ├── globals.css                  # 전역 스타일
│   │
│   ├── templates/                   # 템플릿 쇼케이스
│   │   ├── page.tsx                # 템플릿 목록
│   │   └── [slug]/                 # 템플릿 상세
│   │       └── page.tsx
│   │
│   ├── pricing/                     # 가격 정책
│   │   └── page.tsx
│   │
│   ├── auth/                        # ✅ 인증 (이미 구현됨)
│   │   ├── login/
│   │   └── signup/
│   │
│   ├── dashboard/                   # 사용자 대시보드
│   │   ├── page.tsx                # 대시보드 홈
│   │   ├── sites/                  # 내 사이트 관리
│   │   ├── settings/               # 설정
│   │   └── billing/                # 결제/구독 관리
│   │
│   ├── about/                       # ✅ 소개 (현재 북촌 템플릿)
│   ├── archive/                     # ✅ 전시 (현재 북촌 템플릿)
│   ├── media/                       # ✅ 미디어 (현재 북촌 템플릿)
│   ├── mall/                        # ✅ 상점 (현재 북촌 템플릿)
│   └── contact/                     # ✅ 문의 (현재 북촌 템플릿)
│
├── templates/                        # 템플릿 라이브러리
│   ├── gallery-modern/              # ✅ 북촌 아트 스페이스 (현재 구현)
│   │   ├── components/
│   │   ├── pages/
│   │   └── config.json
│   │
│   ├── gallery-minimal/             # 미니멀 갤러리 (예정)
│   ├── artist-portfolio/            # 아티스트 포트폴리오 (예정)
│   └── studio-creative/             # 스튜디오 템플릿 (예정)
│
├── tenant/                           # 테넌트 시스템 (서브도메인)
│   ├── middleware.ts                # 서브도메인 라우팅
│   └── [subdomain]/                 # 동적 서브도메인
│       └── page.tsx
│
├── components/                       # ✅ 공통 컴포넌트 (이미 구현됨)
│   ├── Header.tsx
│   ├── MobileMenu.tsx
│   ├── LanguageSwitcher.tsx
│   ├── BukchonLogo.tsx
│   ├── GalleryPattern.tsx
│   └── ExhibitionCard.tsx
│
├── lib/                              # ✅ 유틸리티 (이미 구현됨)
│   ├── supabase.ts
│   └── i18n/
│       ├── locales.ts
│       ├── translations.ts
│       └── LanguageContext.tsx
│
└── public/                           # 정적 파일
    ├── gallery1.png
    ├── gallery2.png
    └── images/
```

---

## 🎯 구현 상태

### ✅ 완료된 기능

1. **북촌 아트 스페이스 템플릿** (Gallery Modern)

   - 메인 페이지
   - About 페이지
   - Archive (전시) 페이지
   - Media (Instagram) 페이지
   - Shop (상품 목록, 상세, 장바구니, 결제)
   - Contact (문의 폼)
   - 다국어 지원 (한/영/일/중)

2. **인증 시스템**

   - 로그인 페이지
   - 회원가입 페이지

3. **디자인 시스템**
   - 1280px 통일 레이아웃
   - 한국 전통 색상 팔레트
   - 타이포그래피 시스템
   - 컴포넌트 라이브러리

### 🚧 진행 중

1. **메인 플랫폼 랜딩 페이지**
   - LANDING_PAGE.tsx 파일 생성 완료
   - src/app/page.tsx로 이동 필요

### 📋 예정

1. **템플릿 쇼케이스 페이지**
2. **사용자 대시보드**
3. **테넌트 시스템 (서브도메인)**
4. **결제/구독 시스템**
5. **추가 템플릿 개발**

---

## 🔄 마이그레이션 계획

### Step 1: 현재 북촌 템플릿을 템플릿 라이브러리로 이동

```bash
# 현재 구조
src/app/about/
src/app/archive/
src/app/media/
src/app/mall/
src/app/contact/

# 이동 후 구조
templates/gallery-modern/pages/about/
templates/gallery-modern/pages/archive/
templates/gallery-modern/pages/media/
templates/gallery-modern/pages/mall/
templates/gallery-modern/pages/contact/
```

### Step 2: 메인 플랫폼 페이지 구성

```bash
# LANDING_PAGE.tsx를 src/app/page.tsx로 이동
mv LANDING_PAGE.tsx src/app/page.tsx

# 템플릿 쇼케이스 페이지 생성
mkdir src/app/templates
touch src/app/templates/page.tsx

# 가격 정책 페이지 생성
mkdir src/app/pricing
touch src/app/pricing/page.tsx
```

### Step 3: 테넌트 시스템 구축

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const subdomain = hostname.split(".")[0];

  // 메인 도메인 또는 www
  if (subdomain === "artpage" || subdomain === "www") {
    return NextResponse.next();
  }

  // 서브도메인 → 테넌트 사이트
  return NextResponse.rewrite(
    new URL(`/tenant/${subdomain}${request.nextUrl.pathname}`, request.url)
  );
}
```

---

## 💾 데이터베이스 스키마

### Tenants (테넌트)

```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subdomain TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  template TEXT NOT NULL,
  custom_domain TEXT,
  settings JSONB,
  subscription_tier TEXT,
  subscription_status TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Subscriptions (구독)

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id),
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Transactions (거래)

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id),
  order_id UUID,
  amount INTEGER NOT NULL,
  commission_rate DECIMAL(5,2),
  commission_amount INTEGER,
  net_amount INTEGER,
  status TEXT,
  settled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 다음 단계

1. **LANDING_PAGE.tsx를 src/app/page.tsx로 이동**
2. **템플릿 쇼케이스 페이지 생성**
3. **가격 정책 페이지 생성**
4. **테넌트 미들웨어 구현**
5. **사용자 대시보드 구현**
6. **Supabase 데이터베이스 스키마 생성**
7. **결제 시스템 연동 (Toss Payments)**

---

## 📝 참고 사항

- 현재 프로젝트는 북촌 아트 스페이스 템플릿으로 작동 중
- 메인 플랫폼으로 전환하려면 page.tsx 교체 필요
- 템플릿 시스템은 점진적으로 구축 예정
- 서브도메인 라우팅은 Vercel 설정 필요
