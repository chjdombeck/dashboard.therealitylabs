-- ─── Activity Feed & Coach Reactions ─────────────────────────────────────────
-- Run in Supabase → SQL Editor → New Query → Run

-- Activity feed: one row per notable client action
create table public.activity_feed (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('exercise_complete', 'checkin_streak', 'coach_post', 'coach_assigned_exercise', 'coach_feedback')),
  title text not null,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

create index activity_feed_user_id_idx on public.activity_feed(user_id);
create index activity_feed_created_at_idx on public.activity_feed(created_at desc);

-- Coach reactions: likes + comments on activity items
create table public.coach_reactions (
  id uuid primary key default uuid_generate_v4(),
  activity_id uuid references public.activity_feed(id) on delete cascade not null,
  coach_id uuid references public.profiles(id) on delete cascade not null,
  liked boolean not null default false,
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(activity_id, coach_id)
);

-- RLS
alter table public.activity_feed enable row level security;
alter table public.coach_reactions enable row level security;

-- Clients can insert their own activity; everyone can read
create policy "Users can insert own activity" on public.activity_feed
  for insert with check (auth.uid() = user_id);
create policy "Anyone authenticated can read activity" on public.activity_feed
  for select using (auth.role() = 'authenticated');

-- Admins can insert/update reactions; clients can read reactions on their own activities
create policy "Admin can manage reactions" on public.coach_reactions
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
create policy "Client can read own reactions" on public.coach_reactions
  for select using (
    exists (
      select 1 from public.activity_feed
      where activity_feed.id = coach_reactions.activity_id
        and activity_feed.user_id = auth.uid()
    )
  );
