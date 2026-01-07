# 북촌 아트 스페이스 브랜드 가이드

## 🎨 로고 시스템

### 로고 구성

북촌 아트 스페이스의 로고는 **한옥 지붕 아이콘**과 **타이포그래피**의 조합으로 구성됩니다.

#### 1. 심볼 (한옥 지붕 아이콘)

- 전통 한옥의 지붕 실루엣을 현대적으로 단순화
- 단청 청색(Primary Color)을 주 색상으로 사용
- SVG 벡터 형식으로 제작되어 모든 크기에서 선명

#### 2. 워드마크

- **한글**: "북촌" - Noto Serif KR (명조체)
- **영문**: "Art Space" - Inter (고딕체)
- 2단 구성으로 전통과 현대의 조화 표현

### 로고 변형

#### Dark 버전 (기본)

- 배경: 밝은 색 (흰색, 한지색 등)
- 심볼: 단청 청색 `hsl(195 85% 35%)`
- 텍스트: 먹색 `#1A1A1A`

#### Light 버전

- 배경: 어두운 색 (검정, 어두운 회색 등)
- 심볼: 흰색 `#FFFFFF`
- 텍스트: 흰색 `#FFFFFF`

### 사용 예시

```tsx
// Dark 버전 (밝은 배경)
<BukchonLogo variant="dark" />

// Light 버전 (어두운 배경)
<BukchonLogo variant="light" />
```

---

## 🎨 색상 팔레트

### 주요 색상 (오방색 기반)

#### Primary - 청색 (단청의 청록색)

- **HSL**: `195 85% 35%`
- **용도**: 주요 버튼, 링크, 강조 요소
- **의미**: 신뢰, 안정, 전통

#### Secondary - 주홍 (단청의 적색)

- **HSL**: `8 85% 55%`
- **용도**: 보조 버튼, 강조 텍스트
- **의미**: 열정, 에너지, 활력

#### Accent - 황금 (단청의 황색)

- **HSL**: `45 95% 50%`
- **용도**: 하이라이트, 특별 요소
- **의미**: 고귀함, 번영, 가치

### 중립 색상

#### Background - 한지색

- **HSL**: `40 30% 97%`
- **용도**: 페이지 배경
- **의미**: 전통 종이의 따뜻함

#### Foreground - 먹색

- **HSL**: `0 0% 10%`
- **용도**: 본문 텍스트
- **의미**: 서예의 깊이와 우아함

### 추가 전통 색상

- **녹청**: `hsl(150 40% 45%)` - 전통 청록색
- **자주**: `hsl(280 50% 45%)` - 고귀한 보라색
- **연지**: `hsl(340 70% 65%)` - 부드러운 분홍색

---

## 📐 타이포그래피

### 폰트 시스템

#### 제목 폰트 - Noto Serif KR

```css
font-family: "Noto Serif KR", serif;
font-weight: 300 | 400 | 600;
```

- **용도**: 제목, 헤딩, 강조 텍스트
- **특징**: 전통적이고 우아한 느낌
- **예시**: 갤러리명, 전시 제목

#### 본문 폰트 - Inter

```css
font-family: "Inter", sans-serif;
```

- **용도**: 본문, 설명, UI 텍스트
- **특징**: 현대적이고 읽기 쉬운 느낌
- **예시**: 전시 설명, 안내 문구

### 타이포그래피 스케일

```css
/* 대제목 */
.text-6xl {
  font-size: 3.75rem;
} /* 60px */

/* 중제목 */
.text-4xl {
  font-size: 2.25rem;
} /* 36px */

/* 소제목 */
.text-2xl {
  font-size: 1.5rem;
} /* 24px */

/* 본문 */
.text-base {
  font-size: 1rem;
} /* 16px */

/* 작은 텍스트 */
.text-sm {
  font-size: 0.875rem;
} /* 14px */
```

---

## 🎭 디자인 요소

### 단청 패턴 (GalleryPattern)

한국 전통 건축의 단청 문양을 현대적으로 재해석한 장식 요소입니다.

#### 사용법

```tsx
import GalleryPattern from "@/components/GalleryPattern";

// 심플 버전 (그라데이션)
<GalleryPattern className="w-32 h-1" />

// 단청 버전 (5색 레이어)
<GalleryPattern variant="dancheong" className="w-full h-4" />
```

#### 용도

- 섹션 구분선
- 헤더/푸터 장식
- 카드 상단 장식
- 페이지 전환 요소

---

## 📦 컴포넌트 라이브러리

### BukchonLogo

로고 컴포넌트

**Props**:

- `variant`: "light" | "dark"
- `className`: 추가 CSS 클래스

### ExhibitionCard

전시 정보 카드

**Props**:

- `title`: 전시 제목
- `artist`: 작가명
- `period`: 전시 기간
- `description`: 전시 설명
- `image`: 이미지 경로
- `status`: "ongoing" | "upcoming" | "past"
- `link`: 상세 페이지 링크

### GalleryPattern

단청 패턴 장식

**Props**:

- `variant`: "simple" | "dancheong"
- `className`: 추가 CSS 클래스

---

## 🎯 브랜드 사용 가이드

### Do's ✅

1. **로고 사용**

   - 충분한 여백 확보 (최소 로고 높이의 50%)
   - 명확한 가독성 유지
   - 적절한 배경 대비

2. **색상 사용**

   - 브랜드 색상 팔레트 준수
   - 전통 색상의 의미 존중
   - 접근성 고려 (WCAG 2.1 AA 이상)

3. **타이포그래피**
   - 제목은 명조체, 본문은 고딕체
   - 적절한 행간 (1.5-1.8)
   - 한글/영문 병기 시 크기 차이 고려

### Don'ts ❌

1. **로고 사용**

   - 로고 비율 변경 금지
   - 로고 색상 임의 변경 금지
   - 복잡한 배경 위 사용 지양

2. **색상 사용**

   - 브랜드 색상 외 원색 사용 금지
   - 과도한 색상 조합 지양
   - 낮은 대비 색상 조합 금지

3. **타이포그래피**
   - 과도한 폰트 변형 금지
   - 3개 이상 폰트 사용 지양
   - 너무 작은 글자 크기 (12px 미만) 금지

---

## 📱 반응형 가이드

### 브레이크포인트

```css
/* Mobile */
@media (max-width: 768px) {
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
}

/* Desktop */
@media (min-width: 1025px) {
}
```

### 로고 크기

- **Desktop**: 40px height
- **Tablet**: 36px height
- **Mobile**: 32px height

---

## 🎨 애니메이션 가이드

### 기본 원칙

- **Duration**: 300-500ms (빠른 상호작용), 700-1000ms (페이지 전환)
- **Easing**: ease-out (자연스러운 감속)
- **Subtlety**: 과하지 않은 미묘한 움직임

### 주요 애니메이션

```css
/* 페이드 인 */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

/* 페이드 인 업 */
.animate-fade-in-up {
  animation: fadeInUp 0.7s ease-out forwards;
}

/* 호버 효과 */
.hover:scale-105 {
  transition: transform 0.3s ease-out;
}
```

---

**Made with ❤️ for Bukchon Art Space**
