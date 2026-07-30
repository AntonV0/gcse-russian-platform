alter table "public"."profiles"
add column if not exists "signup_source" text,
add column if not exists "signup_entry_path" text;

alter table "public"."profiles"
drop constraint if exists profiles_signup_source_check,
add constraint profiles_signup_source_check
check (
  signup_source is null
  or signup_source in ('app', 'marketing', 'unknown')
);

alter table "public"."profiles"
drop constraint if exists profiles_signup_entry_path_length_check,
add constraint profiles_signup_entry_path_length_check
check (
  signup_entry_path is null
  or char_length(signup_entry_path) <= 500
);
