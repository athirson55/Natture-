create table if not exists public.products (
  id uuid primary key,
  name text not null,
  code text,
  quantity integer not null default 0,
  category text not null,
  updatedAt bigint not null default 0,
  deletedAt bigint
);

alter table public.products enable row level security;

drop policy if exists "Public read" on public.products;
drop policy if exists "Public write" on public.products;

create policy "Public read"
on public.products
for select
using (true);

create policy "Public write"
on public.products
for all
using (true)
with check (true);
