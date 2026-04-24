alter table "public"."profiles"
add column if not exists "theme_preference" text not null default 'system',
add column if not exists "accent_preference" text not null default 'blue';

alter table "public"."profiles"
drop constraint if exists profiles_theme_preference_check,
add constraint profiles_theme_preference_check
check ("theme_preference" in ('light', 'dark', 'system'));

alter table "public"."profiles"
drop constraint if exists profiles_accent_preference_check,
add constraint profiles_accent_preference_check
check (
  "accent_preference" in (
    'blue',
    'purple',
    'pink',
    'red',
    'orange',
    'yellow',
    'green',
    'teal',
    'brown',
    'slate'
  )
);
