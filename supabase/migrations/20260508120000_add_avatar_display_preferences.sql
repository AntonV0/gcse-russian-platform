alter table public.profiles
add column if not exists avatar_background_key text not null default 'sky',
add column if not exists equipped_avatar_frame_key text;

alter table public.profiles
drop constraint if exists profiles_avatar_background_key_check,
add constraint profiles_avatar_background_key_check
check (
  avatar_background_key in (
    'sky',
    'mint',
    'sunset',
    'rose',
    'lilac',
    'amber',
    'volna',
    'midnight',
    'birch',
    'ruby',
    'forest',
    'ocean',
    'grape',
    'blush'
  )
);

alter table public.profiles
drop constraint if exists profiles_equipped_avatar_frame_key_check,
add constraint profiles_equipped_avatar_frame_key_check
check (
  equipped_avatar_frame_key is null
  or equipped_avatar_frame_key in (
    'first-lesson',
    'five-lessons',
    'ten-lessons',
    'course-complete'
  )
);
