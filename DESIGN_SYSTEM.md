# 북촌 아트 스페이스 디자인 시스템

## 📐 레이아웃 시스템

### 컨테이너 너비

```css
/* 메인 컨테이너 */
max-width: 1280px;  /* max-w-screen-xl */
padding: 0 24px;    /* px-6 */

/* Tailwind 클래스 */
className="max-w-screen-xl mx-auto px-6"
```

### 섹션 여백

```css
/* 페이지 상단 여백 (헤더 고려) */
padding-top: 64px; /* pt-16 (헤더 높이) */

/* 섹션 간 여백 */
padding-y: 80px; /* py-20 (큰 섹션) */
padding-y: 64px; /* py-16 (중간 섹션) */
padding-y: 48px; /* py-12 (작은 섹션) */

/* 요소 간 여백 */
margin-bottom: 48px; /* mb-12 (제목-내용) */
margin-bottom: 32px; /* mb-8 (내용-내용) */
margin-bottom: 16px; /* mb-4 (작은 간격) */
```

---

## 📝 타이포그래피 시스템

### 제목 계층

#### H1 - 페이지 메인 제목

```css
font-size: 48px;      /* text-5xl */
font-weight: 300;     /* font-light */
line-height: 1.2;
margin-bottom: 24px;  /* mb-6 */
font-family: Noto Serif KR;

/* Tailwind */
className="text-5xl font-serif font-light mb-6"
```

#### H2 - 섹션 제목

```css
font-size: 36px;      /* text-4xl */
font-weight: 300;     /* font-light */
line-height: 1.3;
margin-bottom: 48px;  /* mb-12 */
font-family: Noto Serif KR;

/* Tailwind */
className="text-4xl font-serif font-light mb-12"
```

#### H3 - 서브 섹션 제목

```css
font-size: 24px;      /* text-2xl */
font-weight: 400;     /* font-normal */
line-height: 1.4;
margin-bottom: 16px;  /* mb-4 */
font-family: Noto Serif KR;

/* Tailwind */
className="text-2xl font-serif mb-4"
```

#### H4 - 카드 제목

```css
font-size: 20px;      /* text-xl */
font-weight: 400;     /* font-normal */
line-height: 1.4;
margin-bottom: 12px;  /* mb-3 */
font-family: Noto Serif KR;

/* Tailwind */
className="text-xl font-serif mb-3"
```

### 본문 텍스트

#### 본문 (기본)

```css
font-size: 16px;      /* text-base */
line-height: 1.75;    /* leading-relaxed */
font-family: Inter;

/* Tailwind */
className="text-base leading-relaxed"
```

#### 본문 (큰 글씨)

```css
font-size: 18px;      /* text-lg */
line-height: 1.75;
font-family: Inter;

/* Tailwind */
className="text-lg leading-relaxed"
```

#### 본문 (작은 글씨)

```css
font-size: 14px;      /* text-sm */
line-height: 1.6;
font-family: Inter;

/* Tailwind */
className="text-sm leading-normal"
```

---

## 🎨 색상 사용

### 텍스트 색상

```css
/* 주요 텍스트 */
color: hsl(0 0% 10%); /* text-foreground */

/* 보조 텍스트 */
color: hsl(0 0% 40%); /* text-muted-foreground */

/* 링크/강조 */
color: hsl(195 85% 35%); /* text-primary */
```

---

## 📦 컴포넌트 패턴

### 페이지 래퍼

```tsx
<div className="min-h-screen bg-background">{/* 페이지 내용 */}</div>
```

### 섹션 래퍼

```tsx
<section className="py-20">
  <div className="max-w-screen-xl mx-auto px-6">{/* 섹션 내용 */}</div>
</section>
```

### 제목 + 설명 패턴

```tsx
<div className="text-center mb-12">
  <h2 className="text-4xl font-serif font-light text-foreground mb-4">
    섹션 제목
  </h2>
  <p className="text-muted-foreground max-w-2xl mx-auto">섹션 설명</p>
</div>
```

### 그리드 레이아웃

```tsx
{
  /* 2열 그리드 */
}
<div className="grid md:grid-cols-2 gap-8">{/* 아이템 */}</div>;

{
  /* 3열 그리드 */
}
<div className="grid md:grid-cols-3 gap-8">{/* 아이템 */}</div>;
```

---

## 📏 간격 시스템

### Spacing Scale

```css
/* 4px 단위 */
gap-1  = 4px
gap-2  = 8px
gap-3  = 12px
gap-4  = 16px
gap-6  = 24px
gap-8  = 32px
gap-12 = 48px
gap-16 = 64px
gap-20 = 80px
```

### 사용 예시

```tsx
{/* 카드 간격 */}
<div className="grid md:grid-cols-2 gap-8">

{/* 텍스트 블록 간격 */}
<div className="space-y-6">

{/* 섹션 여백 */}
<section className="py-20">
```

---

## 🎯 반응형 브레이크포인트

```css
/* Mobile First */
sm: 640px   /* @media (min-width: 640px) */
md: 768px   /* @media (min-width: 768px) */
lg: 1024px  /* @media (min-width: 1024px) */
xl: 1280px  /* @media (min-width: 1280px) */
2xl: 1536px /* @media (min-width: 1536px) */
```

### 사용 예시

```tsx
{/* 모바일: 1열, 태블릿 이상: 2열 */}
<div className="grid md:grid-cols-2 gap-8">

{/* 모바일: 숨김, 데스크톱: 표시 */}
<div className="hidden md:block">
```

---

## ✅ 체크리스트

모든 페이지는 다음을 준수해야 합니다:

- [ ] 최대 너비: `max-w-screen-xl` (1280px)
- [ ] 좌우 패딩: `px-6` (24px)
- [ ] 섹션 여백: `py-20` (80px)
- [ ] H1: `text-5xl font-serif font-light`
- [ ] H2: `text-4xl font-serif font-light mb-12`
- [ ] H3: `text-2xl font-serif mb-4`
- [ ] 본문: `text-base leading-relaxed`
- [ ] 그리드 간격: `gap-8` (32px)
- [ ] 제목-내용 간격: `mb-12` (48px)

---

**일관성이 디자인의 핵심입니다!**
