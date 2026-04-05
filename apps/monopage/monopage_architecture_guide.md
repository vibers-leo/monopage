# Monopage Architecture & Integration Guide (v1.0)

이 문서는 '모노페이지(Monopage)' 프로젝트의 현재 아키텍처와 핵심 설계를 요약한 공식 가이드입니다. 클라우드코드(Claude Code) 등으로 기존 프로젝트(Artpage 등)와 병합하거나 기능을 확장할 때 이 정보를 바탕으로 작업을 수행하세요.

---

## 1. 핵심 기술 스택
- **Frontend**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4 (CSS-only config 기반) + Framer Motion
- **Backend**: Ruby on Rails 8 (API Mode) + PostgreSQL
- **Background Worker**: Sidekiq + Redis (Token Lifecycle & SNS Sync)
- **UI Concept**: Premium B&W Minimalism (Glassmorphism & Neon Point Colors)

---

## 2. 데이터베이스 & 스키마 설계 (JSONB 핵심)
모든 SNS 데이터를 유연하게 수용하기 위해 PostgreSQL의 `JSONB`를 적극 활용합니다.

### Profile (`profiles` table)
- `theme_config`: (JSONB) `--accent-neon`, `bg_tone`, `font_family` 등 다이나믹 테마 정보 저장.
- `ai_metadata`: (JSONB) Gemini AI가 생성한 자기소개, 카테고리 정보 저장.

### Post (`posts` table)
- `data`: (JSONB) 인스타그램, 유튜브 등의 원본 데이터를 **단일 규격**으로 정규화하여 저장.
  - 규격 예시: `{ "media_url": string, "permalink": string, "media_type": "IMAGE"|"VIDEO", "caption": string }`
  - 이 구조 덕분에 프론트엔드에서 SNS 플랫폼 구분 없이 하나의 `Mixed Gallery`로 렌더링 가능합니다.

---

## 3. 백엔드 로직 (Token & Sync)
- **Token Manager**: 인스타그램 60일 토큰 및 유튜브 Refresh 토큰의 만료일을 관리하고, `Sidekiq` 워커(`SNS::TokenRefreshWorker`)를 통해 자동 갱신합니다.
- **Sync Service**: 주기적인 동기화(`SNS::SyncWorker`)를 통해 최신 게시물을 가져와 `Post` 테이블의 JSONB 컬럼에 밀어 넣습니다.

---

## 4. 프론트엔드 동적 테마 (Dynamic Theming)
- **Magic Onboarding**: 사용자가 업로드한 프로필 사진에서 팔레트를 추출하여 백엔드에서 컬러 코드를 반환합니다.
- **CSS Variable Injection**: `[username]/page.tsx`(Server Component)에서 테마 정보를 읽어 `ProfileView`(Client Component)에 CSS 변수로 주입합니다.
  - 예: `style={{ '--accent-neon': profile.theme_config.neon_color } as React.CSSProperties}`

---

## 5. 병합/확장 전략 (Merge Logic)
기존 프로젝트(Artpage 등)의 로직을 본 프로젝트로 가져올 때 다음 순서를 권장합니다:

1. **디자인 통일**: 기존 UI 로직을 `SnsGallery`, `LinkCard`, `ProfileHeader` 등의 현재 컴포넌트 내부로 이식하세요.
2. **데이터 정규화**: 기존 SNS 테이블 구조가 다르다면, 본 프로젝트의 `JSONB` 규격에 맞춰 데이터를 마이그레이션하세요.
3. **토큰 워커 이식**: 기존의 인증/토큰 관리 로직을 `Sidekiq` 워커인 `TokenRefreshWorker` 내부로 통합하여 라이프사이클을 자동화하세요.
4. **Tailwind v4 호환**: Tailwind v4는 `@import "tailwindcss";`와 `@theme` 블록을 사용합니다. 기존 CSS는 이 방식에 맞춰 `globals.css` 내에 통합되어야 합니다.

---

## 6. 핵심 파일 경로 (Ref)
- **UI Components**: `frontend/src/components/*`
- **Dynamic Profile Page**: `frontend/src/app/[username]/page.tsx`
- **Onboarding UX**: `frontend/src/app/onboard/page.tsx`
- **SNS Sync Service**: `backend/app/services/sns/sync_service.rb`
- **Token Lifecycle**: `backend/app/workers/sns/token_refresh_worker.rb`

이 아키텍처를 유지하며 병합 작업을 수행하면 매우 프리미엄하고 견고한 플랫폼이 완성될 것입니다. 🚀
