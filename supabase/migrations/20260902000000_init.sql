-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Buttons table
create table if not exists buttons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  icon_url text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

-- Links table
create table if not exists links (
  id uuid primary key default gen_random_uuid(),
  button_id uuid not null references buttons(id) on delete cascade,
  label text not null,
  url text not null,
  position integer not null default 0
);

create index if not exists links_button_id_idx on links(button_id);
create index if not exists buttons_position_idx on buttons(position);
create index if not exists links_position_idx on links(button_id, position);

-- Row Level Security
alter table buttons enable row level security;
alter table links enable row level security;

-- Public read access (this is a personal link-tree, content is meant to be public)
create policy "Public can read buttons"
  on buttons for select
  using (true);

create policy "Public can read links"
  on links for select
  using (true);

-- No public write policies are created: all writes go through the
-- server-side Supabase client using the service role key (admin actions),
-- which bypasses RLS. Anonymous/public clients cannot insert, update or delete.
