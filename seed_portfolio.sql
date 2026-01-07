-- Insert Art Page Template (Main Landing)
insert into portfolios (title, description, category, internal_path, is_active, thumbnail_url)
values 
(
  'Art Page Platform', 
  '예술과 기술이 만나는 아트페이지 플랫폼 메인 랜딩 페이지입니다.', 
  'Platform', 
  '/', 
  true, 
  'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=2574&auto=format&fit=crop'
);

-- Insert Demo Page
insert into portfolios (title, description, category, internal_path, is_active, thumbnail_url)
values 
(
  'Bukchon Art Gallery (Demo)', 
  '북촌 아트 갤러리 데모 페이지입니다.', 
  'Template', 
  '/demo', 
  true, 
  '/images/view.jpg' -- Assuming a view image exists or generic one from project
);
