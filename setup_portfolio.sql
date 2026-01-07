-- Create Portfolios Table
create table if not exists portfolios (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  thumbnail_url text,
  external_url text, -- For deployed sites like Art Way, Art Hyun
  internal_path text, -- For internal templates e.g. /art-way
  category text, -- e.g., "Web", "Exhibition", "Archive"
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table portfolios enable row level security;

create policy "Portfolios are viewable by everyone"
  on portfolios for select
  using ( is_active = true );

create policy "Portfolios are insertable by admins"
  on portfolios for insert
  with check ( auth.role() = 'service_role' or auth.role() = 'authenticated' );
  -- Note: Adjust 'authenticated' to specific admin check if needed

create policy "Portfolios are updateable by admins"
  on portfolios for update
  using ( auth.role() = 'service_role' or auth.role() = 'authenticated' );

create policy "Portfolios are deletable by admins"
  on portfolios for delete
  using ( auth.role() = 'service_role' or auth.role() = 'authenticated' );

-- Storage Bucket for Portfolio Images
insert into storage.buckets (id, name, public) 
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

create policy "Portfolio images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'portfolio' );

create policy "Portfolio images are uploadable by admins"
  on storage.objects for insert
  with check ( bucket_id = 'portfolio' and (auth.role() = 'service_role' or auth.role() = 'authenticated') );

create policy "Portfolio images are updateable by admins"
  on storage.objects for update
  using ( bucket_id = 'portfolio' and (auth.role() = 'service_role' or auth.role() = 'authenticated') );

create policy "Portfolio images are deletable by admins"
  on storage.objects for delete
  using ( bucket_id = 'portfolio' and (auth.role() = 'service_role' or auth.role() = 'authenticated') );
