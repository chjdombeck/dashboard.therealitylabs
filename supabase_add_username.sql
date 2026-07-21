-- Run this in Supabase SQL Editor if you've already run the main schema
-- Adds username field to profiles

alter table public.profiles add column if not exists username text unique;

-- Update the auto-create trigger to include username
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, first_name, last_name, role, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', 'User'),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    coalesce(new.raw_user_meta_data->>'username', null)
  );
  return new;
end;
$$;
