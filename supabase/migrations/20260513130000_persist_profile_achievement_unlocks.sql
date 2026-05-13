begin;

update public.profiles
set avatar_key = null
where avatar_key is not null
  and avatar_key not in (
    'student',
    'star',
    'sparkles',
    'rocket',
    'book',
    'scientist',
    'artist',
    'astronaut',
    'programmer',
    'mage',
    'robot',
    'musician',
    'writer',
    'teacher',
    'detective',
    'explorer',
    'pilot',
    'chef',
    'engineer',
    'gardener',
    'globe',
    'compass',
    'medal',
    'cat',
    'dog',
    'panda',
    'rabbit',
    'penguin',
    'turtle',
    'dolphin',
    'butterfly',
    'snow-fox',
    'owl',
    'koala',
    'hedgehog',
    'palette',
    'camera',
    'guitar',
    'football',
    'gem',
    'crown',
    'sun',
    'moon',
    'mountain',
    'wave',
    'anchor',
    'unicorn',
    'wolf',
    'tiger',
    'lion',
    'bear',
    'monkey',
    'frog',
    'parrot',
    'eagle',
    'whale',
    'octopus',
    'crab',
    'dragon'
  );

alter table public.profiles
drop constraint if exists profiles_avatar_key_check,
add constraint profiles_avatar_key_check
check (
  avatar_key is null
  or avatar_key in (
    'student',
    'star',
    'sparkles',
    'rocket',
    'book',
    'scientist',
    'artist',
    'astronaut',
    'programmer',
    'mage',
    'robot',
    'musician',
    'writer',
    'teacher',
    'detective',
    'explorer',
    'pilot',
    'chef',
    'engineer',
    'gardener',
    'globe',
    'compass',
    'medal',
    'cat',
    'dog',
    'panda',
    'rabbit',
    'penguin',
    'turtle',
    'dolphin',
    'butterfly',
    'snow-fox',
    'owl',
    'koala',
    'hedgehog',
    'palette',
    'camera',
    'guitar',
    'football',
    'gem',
    'crown',
    'sun',
    'moon',
    'mountain',
    'wave',
    'anchor',
    'unicorn',
    'wolf',
    'tiger',
    'lion',
    'bear',
    'monkey',
    'frog',
    'parrot',
    'eagle',
    'whale',
    'octopus',
    'crab',
    'dragon'
  )
);

create table if not exists public.profile_achievement_unlocks (
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_key text not null,
  achievement_type text not null default 'avatar_frame',
  earned_at timestamp with time zone not null default now(),
  source text not null default 'lesson_progress',
  source_course_slug text,
  source_variant_slug text,
  metadata jsonb not null default '{}'::jsonb,
  primary key (user_id, achievement_type, achievement_key),
  constraint profile_achievement_unlocks_avatar_frame_key_check check (
    achievement_type <> 'avatar_frame'
    or achievement_key in (
      'first-lesson',
      'five-lessons',
      'ten-lessons',
      'course-complete'
    )
  )
);

create index if not exists profile_achievement_unlocks_user_type_idx
  on public.profile_achievement_unlocks (user_id, achievement_type);

alter table public.profile_achievement_unlocks enable row level security;

grant select on table public.profile_achievement_unlocks to authenticated;
grant select, insert, update, delete on table public.profile_achievement_unlocks to service_role;

drop policy if exists "Users can view their own profile achievement unlocks"
  on public.profile_achievement_unlocks;
create policy "Users can view their own profile achievement unlocks"
  on public.profile_achievement_unlocks
  as permissive
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Admins can manage profile achievement unlocks"
  on public.profile_achievement_unlocks;
create policy "Admins can manage profile achievement unlocks"
  on public.profile_achievement_unlocks
  as permissive
  for all
  to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

commit;
