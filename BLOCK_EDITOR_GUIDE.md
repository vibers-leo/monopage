# ArtPage - 블록 기반 CMS 가이드

## 🎨 Tiptap 블록 에디터 시스템

### 기술 스택

- **Tiptap**: 블록 기반 리치 텍스트 에디터
- **@dnd-kit**: 드래그 앤 드롭
- **Supabase**: 블록 데이터 저장

---

## 🧱 블록 타입

### 1. Content Blocks (Tiptap 기반)

- **Heading** - 제목 (H1, H2, H3)
- **Paragraph** - 본문 텍스트
- **Image** - 이미지
- **Gallery** - 이미지 갤러리
- **Quote** - 인용구
- **List** - 목록 (순서/비순서)

### 2. Component Blocks (React 컴포넌트)

- **Hero Section** - 히어로 배너
- **Exhibition Grid** - 전시 그리드
- **Product Grid** - 상품 그리드
- **Contact Form** - 문의 폼
- **Instagram Feed** - Instagram 피드
- **Custom HTML** - 커스텀 HTML

---

## 📦 설치된 패키지

```bash
# Tiptap 에디터
@tiptap/react
@tiptap/starter-kit
@tiptap/extension-image
@tiptap/extension-link
@tiptap/extension-color
@tiptap/extension-text-style
@tiptap/extension-placeholder

# 드래그 앤 드롭
@dnd-kit/core
@dnd-kit/sortable
@dnd-kit/utilities
```

---

## 🎯 관리자 페이지 구조

```
/admin
├── /login                    # 관리자 로그인
├── /dashboard               # 대시보드
├── /pages                   # 페이지 관리
│   ├── /                   # 페이지 목록
│   ├── /[id]/edit          # 페이지 편집
│   └── /new                # 새 페이지
├── /media                   # 미디어 라이브러리
├── /products               # 상품 관리
├── /exhibitions            # 전시 관리
└── /settings               # 설정
```

---

## 💻 사용 방법

### 1. 관리자 로그인

```
URL: yourname.artpage.kr/admin/login
ID: admin@yourname.com
PW: (Supabase Auth)
```

### 2. 페이지 편집

1. `/admin/pages`에서 편집할 페이지 선택
2. 블록 추가/편집/삭제
3. 드래그로 순서 변경
4. 저장 & 게시

### 3. 블록 편집

- **텍스트**: 클릭해서 바로 편집
- **이미지**: 클릭 → 업로드/URL 입력
- **컴포넌트**: 설정 패널에서 옵션 변경

---

## 🔧 커스텀 블록 생성

### 예시: Hero Block

```typescript
// extensions/HeroBlock.ts
import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import HeroBlockComponent from "./HeroBlockComponent";

export const HeroBlock = Node.create({
  name: "heroBlock",
  group: "block",
  content: "inline*",

  addAttributes() {
    return {
      title: { default: "" },
      subtitle: { default: "" },
      backgroundImage: { default: "" },
      buttonText: { default: "" },
      buttonLink: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="hero-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { "data-type": "hero-block", ...HTMLAttributes }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(HeroBlockComponent);
  },
});
```

---

## 📊 데이터 구조

### Page Document

```json
{
  "id": "uuid",
  "slug": "about",
  "title": "소개",
  "content": {
    "type": "doc",
    "content": [
      {
        "type": "heroBlock",
        "attrs": {
          "title": "북촌 아트 스페이스",
          "subtitle": "전통과 현대의 조화",
          "backgroundImage": "/hero.jpg"
        }
      },
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "갤러리 소개..."
          }
        ]
      }
    ]
  },
  "published": true
}
```

---

## 🎨 UI/UX

### 편집 모드

- **툴바**: 상단 고정 (저장, 게시, 미리보기)
- **사이드바**: 블록 라이브러리
- **메인**: 에디터 영역
- **우측 패널**: 블록 설정

### 블록 인터랙션

- **호버**: 블록 툴바 표시 (이동, 삭제, 설정)
- **클릭**: 블록 선택 & 편집
- **드래그**: 순서 변경
- **+버튼**: 새 블록 추가

---

## 🚀 다음 단계

1. ✅ Tiptap 패키지 설치
2. 📋 기본 에디터 컴포넌트 생성
3. 📋 커스텀 블록 확장 개발
4. 📋 관리자 페이지 UI 구축
5. 📋 Supabase 연동
6. 📋 미디어 라이브러리
7. 📋 버전 관리

---

## 📝 참고 자료

- [Tiptap 공식 문서](https://tiptap.dev/)
- [Tiptap 블록 에디터 예시](https://tiptap.dev/examples/blocks)
- [dnd-kit 문서](https://docs.dndkit.com/)
