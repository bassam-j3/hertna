-- Profiles Table
create table public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  avatar_url text,
  neighborhood text default 'دمشق - حي الروضة',
  trust_score numeric(2,1) default 5.0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Items Table
create table public.items (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references public.profiles(id) not null,
  title text not null,
  category text,
  type text check (type in ('lend', 'gift', 'urgent')) not null,
  max_borrow_days integer,
  latitude double precision not null,
  longitude double precision not null,
  image_url text,
  status text check (status in ('available', 'borrowed', 'unavailable')) default 'available',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Exchanges Table
create table public.exchanges (
  id uuid default gen_random_uuid() primary key,
  item_id uuid references public.items(id) not null,
  borrower_id uuid references public.profiles(id) not null,
  status text check (status in ('pending', 'active', 'completed', 'rejected')) default 'pending',
  start_date timestamp with time zone default timezone('utc'::text, now()),
  due_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Spatial Distance Helper (Haversine in km)
create or replace function public.calculate_distance(lat1 float, lon1 float, lat2 float, lon2 float)
returns float as $$
declare
    r float = 6371; -- Earth's radius in kilometers
    p float = pi() / 180;
    a float = 0.5 - cos((lat2 - lat1) * p) / 2 + cos(lat1 * p) * cos(lat2 * p) * (1 - cos((lon2 - lon1) * p)) / 2;
begin
    return 2 * r * asin(sqrt(a));
end;
$$ language plpgsql immutable;

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.items enable row level security;
alter table public.exchanges enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Policies for items
create policy "Items are viewable by everyone." on public.items
  for select using (true);

create policy "Users can insert their own items." on public.items
  for insert with check (auth.uid() = owner_id);

create policy "Users can update own items." on public.items
  for update using (auth.uid() = owner_id);

create policy "Users can delete own items." on public.items
  for delete using (auth.uid() = owner_id);

-- Policies for exchanges
create policy "Exchanges viewable by involved parties" on public.exchanges
  for select using (auth.uid() = borrower_id or auth.uid() in (select owner_id from items where items.id = item_id));

create policy "Users can create exchange requests" on public.exchanges
  for insert with check (auth.uid() = borrower_id);

create policy "Item owners can update exchange status" on public.exchanges
  for update using (auth.uid() in (select owner_id from items where items.id = item_id));
