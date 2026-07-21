-- Add vision_interview_done column to vision_boards
alter table public.vision_boards
  add column if not exists vision_interview_done boolean default false;
