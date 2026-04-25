begin;

create or replace function public.profile_self_insert_allowed(
  target_id uuid,
  target_role text,
  target_is_admin boolean,
  target_is_teacher boolean
)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select auth.uid() = target_id
    and target_role = 'student'
    and target_is_admin = false
    and target_is_teacher = false;
$$;

create or replace function public.profile_self_update_allowed(
  target_id uuid,
  target_role text,
  target_is_admin boolean,
  target_is_teacher boolean
)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select auth.uid() = target_id
    and exists (
      select 1
      from public.profiles existing_profile
      where existing_profile.id = target_id
        and existing_profile.role = target_role
        and existing_profile.is_admin = target_is_admin
        and existing_profile.is_teacher = target_is_teacher
    );
$$;

revoke all on function public.profile_self_insert_allowed(uuid, text, boolean, boolean) from public;
revoke all on function public.profile_self_update_allowed(uuid, text, boolean, boolean) from public;

grant execute on function public.profile_self_insert_allowed(uuid, text, boolean, boolean) to anon;
grant execute on function public.profile_self_insert_allowed(uuid, text, boolean, boolean) to authenticated;
grant execute on function public.profile_self_insert_allowed(uuid, text, boolean, boolean) to service_role;

grant execute on function public.profile_self_update_allowed(uuid, text, boolean, boolean) to anon;
grant execute on function public.profile_self_update_allowed(uuid, text, boolean, boolean) to authenticated;
grant execute on function public.profile_self_update_allowed(uuid, text, boolean, boolean) to service_role;

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles
  as permissive
  for insert
  to public
  with check (
    public.profile_self_insert_allowed(id, role, is_admin, is_teacher)
  );

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles
  as permissive
  for update
  to public
  using (auth.uid() = id)
  with check (
    public.profile_self_update_allowed(id, role, is_admin, is_teacher)
  );

create table if not exists public.lesson_section_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  section_id uuid not null references public.lesson_sections(id) on delete cascade,
  first_visited_at timestamp with time zone not null default now(),
  last_visited_at timestamp with time zone not null default now(),
  visit_count integer not null default 1,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint lesson_section_progress_user_lesson_section_key unique (user_id, lesson_id, section_id),
  constraint lesson_section_progress_visit_count_check check (visit_count > 0)
);

create index if not exists lesson_section_progress_user_lesson_idx
  on public.lesson_section_progress (user_id, lesson_id);

create index if not exists lesson_section_progress_section_idx
  on public.lesson_section_progress (section_id);

alter table public.lesson_section_progress enable row level security;

grant select, insert, update, delete on table public.lesson_section_progress to authenticated;
grant select, insert, update, delete on table public.lesson_section_progress to service_role;

drop policy if exists "Users can view their own lesson section progress" on public.lesson_section_progress;
create policy "Users can view their own lesson section progress"
  on public.lesson_section_progress
  as permissive
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own lesson section progress" on public.lesson_section_progress;
create policy "Users can insert their own lesson section progress"
  on public.lesson_section_progress
  as permissive
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own lesson section progress" on public.lesson_section_progress;
create policy "Users can update their own lesson section progress"
  on public.lesson_section_progress
  as permissive
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Admins can manage lesson section progress" on public.lesson_section_progress;
create policy "Admins can manage lesson section progress"
  on public.lesson_section_progress
  as permissive
  for all
  to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

commit;
