-- ─── Reality Labs Dashboard — Supabase Schema ────────────────────────────────
-- Run this entire file in Supabase → SQL Editor → New Query → Run

-- ─── Extensions ───────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Profiles ─────────────────────────────────────────────────────────────────
-- Extends Supabase auth.users — one row per user
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  role text not null default 'client' check (role in ('admin', 'client')),
  username text unique,
  first_name text not null,
  last_name text not null,
  is_active boolean not null default true,
  interview_completed boolean not null default false,
  interview_completed_at timestamptz,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- ─── Client Profiles (from interview) ─────────────────────────────────────────
create table public.client_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  desired_reality text,
  current_reality text,
  core_beliefs jsonb default '[]',
  blocks jsonb default '[]',
  identity text,
  values jsonb default '[]',
  why text,
  key_language jsonb default '[]',
  updated_at timestamptz not null default now()
);

-- ─── Interview Transcripts ─────────────────────────────────────────────────────
create table public.interview_transcripts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  messages jsonb not null default '[]',
  updated_at timestamptz not null default now()
);

-- ─── Daily Check-Ins ──────────────────────────────────────────────────────────
create table public.check_ins (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  alignment_score integer check (alignment_score between 1 and 10),
  gratitude text,
  supporting_belief text,
  limiting_belief text,
  today_action text,
  energy_score integer check (energy_score between 1 and 10),
  focus_score integer check (focus_score between 1 and 10),
  emotional_score integer check (emotional_score between 1 and 10),
  ai_reflection text,
  created_at timestamptz not null default now(),
  unique(user_id, date)
);

-- ─── Client Exercises ─────────────────────────────────────────────────────────
create table public.client_exercises (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  exercise_id text not null,
  status text not null default 'assigned' check (status in ('assigned', 'in_progress', 'completed')),
  response text,
  assigned_at timestamptz not null default now(),
  completed_at timestamptz,
  assigned_by uuid references public.profiles(id)
);

-- ─── Client Meditations ───────────────────────────────────────────────────────
create table public.client_meditations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  meditation_id text not null,
  completed_dates jsonb default '[]',
  last_completed_at timestamptz,
  reflection_note text,
  unique(user_id, meditation_id)
);

-- ─── Journal Entries ──────────────────────────────────────────────────────────
create table public.journal_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null default current_date,
  mode text not null check (mode in ('prompted', 'free', 'scripting')),
  prompt text,
  content text not null,
  word_count integer default 0,
  tags jsonb default '[]',
  coach_access_enabled boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Homework ─────────────────────────────────────────────────────────────────
create table public.homework (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  due_date date,
  type text check (type in ('Reading', 'Exercise', 'Real-World Action', 'Reflection', 'Challenge')),
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'submitted', 'reviewed')),
  submission_text text,
  coach_feedback text,
  assigned_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  submitted_at timestamptz,
  reviewed_at timestamptz
);

-- ─── Vision Boards ────────────────────────────────────────────────────────────
create table public.vision_boards (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  vision_statement text,
  core_desires jsonb default '[]',
  identity_statements jsonb default '[]',
  values jsonb default '[]',
  why text,
  board_images jsonb default '[]',
  vision_interview_done boolean default false,
  updated_at timestamptz not null default now()
);

-- ─── Admin Notes ──────────────────────────────────────────────────────────────
create table public.admin_notes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  is_pinned boolean default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ─── Activity Feed ────────────────────────────────────────────────────────────
create table public.activity_feed (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null,
  title text,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

-- ─── Coach Reactions (likes/comments on client activity) ─────────────────────
create table public.coach_reactions (
  activity_id uuid references public.activity_feed(id) on delete cascade not null,
  coach_id uuid references public.profiles(id) on delete cascade not null,
  liked boolean default false,
  comment text,
  updated_at timestamptz not null default now(),
  primary key (activity_id, coach_id)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY — This is what keeps client data private
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.client_profiles enable row level security;
alter table public.interview_transcripts enable row level security;
alter table public.check_ins enable row level security;
alter table public.client_exercises enable row level security;
alter table public.client_meditations enable row level security;
alter table public.journal_entries enable row level security;
alter table public.homework enable row level security;
alter table public.vision_boards enable row level security;
alter table public.admin_notes enable row level security;
alter table public.activity_feed enable row level security;
alter table public.coach_reactions enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ─── Profiles policies ────────────────────────────────────────────────────────
create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Admin can read all profiles" on public.profiles
  for select using (public.is_admin());
create policy "Admin can update all profiles" on public.profiles
  for update using (public.is_admin());
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- ─── Client profiles policies ─────────────────────────────────────────────────
create policy "Users can manage own client profile" on public.client_profiles
  for all using (auth.uid() = user_id);
create policy "Admin can read all client profiles" on public.client_profiles
  for select using (public.is_admin());
create policy "Admin can update all client profiles" on public.client_profiles
  for update using (public.is_admin());

-- ─── Interview transcripts policies ──────────────────────────────────────────
create policy "Users can manage own transcript" on public.interview_transcripts
  for all using (auth.uid() = user_id);
create policy "Admin can read all transcripts" on public.interview_transcripts
  for select using (public.is_admin());

-- ─── Check-ins policies ───────────────────────────────────────────────────────
create policy "Users can manage own check-ins" on public.check_ins
  for all using (auth.uid() = user_id);
create policy "Admin can read all check-ins" on public.check_ins
  for select using (public.is_admin());

-- ─── Client exercises policies ────────────────────────────────────────────────
create policy "Users can manage own exercises" on public.client_exercises
  for all using (auth.uid() = user_id);
create policy "Admin can manage all exercises" on public.client_exercises
  for all using (public.is_admin());

-- ─── Client meditations policies ─────────────────────────────────────────────
create policy "Users can manage own meditations" on public.client_meditations
  for all using (auth.uid() = user_id);
create policy "Admin can read all meditations" on public.client_meditations
  for select using (public.is_admin());

-- ─── Journal policies ─────────────────────────────────────────────────────────
create policy "Users can manage own journal" on public.journal_entries
  for all using (auth.uid() = user_id);
create policy "Admin can read coach-enabled journal entries" on public.journal_entries
  for select using (public.is_admin() and coach_access_enabled = true);

-- ─── Homework policies ────────────────────────────────────────────────────────
create policy "Users can read and update own homework" on public.homework
  for select using (auth.uid() = user_id);
create policy "Users can update own homework" on public.homework
  for update using (auth.uid() = user_id);
create policy "Admin can manage all homework" on public.homework
  for all using (public.is_admin());

-- ─── Vision board policies ────────────────────────────────────────────────────
create policy "Users can manage own vision board" on public.vision_boards
  for all using (auth.uid() = user_id);
create policy "Admin can read all vision boards" on public.vision_boards
  for select using (public.is_admin());

-- ─── Admin notes policies ─────────────────────────────────────────────────────
create policy "Users can read own notes" on public.admin_notes
  for select using (auth.uid() = user_id);
create policy "Admin can manage all notes" on public.admin_notes
  for all using (public.is_admin());

-- ─── Activity feed policies ───────────────────────────────────────────────────
create policy "Users can read own activity" on public.activity_feed
  for select using (auth.uid() = user_id);
create policy "Admin can read all activity" on public.activity_feed
  for select using (public.is_admin());
create policy "Users can insert own activity" on public.activity_feed
  for insert with check (auth.uid() = user_id);
create policy "Admin can insert any activity" on public.activity_feed
  for insert with check (public.is_admin());

-- ─── Coach reactions policies ─────────────────────────────────────────────────
create policy "Admin can manage reactions" on public.coach_reactions
  for all using (public.is_admin());
create policy "Users can read reactions on own activity" on public.coach_reactions
  for select using (
    exists (select 1 from public.activity_feed a where a.id = activity_id and a.user_id = auth.uid())
  );

-- ─── Auto-create profile on signup ───────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, first_name, last_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', 'User'),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'client')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
