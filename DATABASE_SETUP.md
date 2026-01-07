# 데이터베이스 스키마 설정 가이드

이 프로젝트는 Supabase를 사용합니다. 아래 테이블들을 Supabase 대시보드에서 생성해주세요.

## 필수 테이블

### 1. exhibitions (전시 정보)

메인 슬라이더와 아카이브에 표시될 전시 정보를 저장합니다.

```sql
CREATE TABLE exhibitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- 전시 정보
  title TEXT NOT NULL,
  title_en TEXT,
  description TEXT,
  description_en TEXT,

  -- 이미지
  image_url TEXT,
  thumbnail_url TEXT,

  -- 날짜
  start_date DATE,
  end_date DATE,

  -- 위치
  location TEXT,
  location_en TEXT,

  -- 상태
  is_active BOOLEAN DEFAULT true,
  is_main_slider BOOLEAN DEFAULT false,

  -- 정렬 순서
  display_order INTEGER DEFAULT 0,

  -- 추가 정보
  artist_name TEXT,
  artist_name_en TEXT,
  category TEXT,
  tags TEXT[]
);

-- 인덱스 생성
CREATE INDEX idx_exhibitions_is_main_slider ON exhibitions(is_main_slider);
CREATE INDEX idx_exhibitions_is_active ON exhibitions(is_active);
CREATE INDEX idx_exhibitions_display_order ON exhibitions(display_order);
```

### 2. main_banner (메인 배너 설정)

메인 페이지의 배경 영상 URL을 관리합니다.

```sql
CREATE TABLE main_banner (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- 유튜브 URL
  youtube_url TEXT,

  -- 대체 이미지
  fallback_image_url TEXT,

  -- 상태
  is_active BOOLEAN DEFAULT true,

  -- 설명
  title TEXT,
  description TEXT
);

-- 활성화된 배너는 하나만 존재하도록 제약 조건 추가 (선택사항)
CREATE UNIQUE INDEX idx_main_banner_active ON main_banner(is_active) WHERE is_active = true;
```

### 3. media (미디어/뉴스)

미디어 페이지에 표시될 콘텐츠를 저장합니다.

```sql
CREATE TABLE media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- 콘텐츠 정보
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,

  -- 이미지
  featured_image_url TEXT,

  -- 카테고리
  category TEXT DEFAULT 'news',

  -- 상태
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,

  -- 작성자
  author TEXT,

  -- 태그
  tags TEXT[]
);

-- 인덱스
CREATE INDEX idx_media_is_published ON media(is_published);
CREATE INDEX idx_media_category ON media(category);
CREATE INDEX idx_media_published_at ON media(published_at DESC);
```

### 4. products (상품)

쇼핑몰 상품 정보를 저장합니다.

```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- 상품 정보
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  description_en TEXT,

  -- 가격
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),

  -- 이미지
  images TEXT[],
  thumbnail_url TEXT,

  -- 재고
  stock_quantity INTEGER DEFAULT 0,

  -- 카테고리
  category TEXT,

  -- 상태
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,

  -- 추가 정보
  artist TEXT,
  dimensions TEXT,
  materials TEXT,
  year INTEGER
);

-- 인덱스
CREATE INDEX idx_products_is_available ON products(is_available);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_category ON products(category);
```

## 샘플 데이터 삽입

### exhibitions 샘플 데이터

```sql
INSERT INTO exhibitions (title, title_en, description, is_main_slider, is_active, display_order)
VALUES
  ('한국 전통 미술전', 'Korean Traditional Art Exhibition', '한국의 아름다운 전통 미술을 만나보세요', true, true, 1),
  ('현대 민화전', 'Modern Minhwa Exhibition', '전통과 현대가 만나는 민화의 세계', true, true, 2),
  ('단청의 미학', 'Beauty of Dancheong', '궁궐 건축의 화려한 색채', true, true, 3);
```

### main_banner 샘플 데이터

```sql
INSERT INTO main_banner (youtube_url, is_active, title)
VALUES
  ('https://www.youtube.com/watch?v=YOUR_VIDEO_ID', true, '메인 배경 영상');
```

## Row Level Security (RLS) 설정

보안을 위해 RLS를 활성화하고 정책을 설정하세요:

```sql
-- exhibitions 테이블
ALTER TABLE exhibitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON exhibitions
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can insert" ON exhibitions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 다른 테이블들도 동일하게 설정
```

## 환경 변수 설정

`.env.local` 파일에 다음 내용을 추가하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Supabase 대시보드의 Settings > API에서 URL과 anon key를 확인할 수 있습니다.
