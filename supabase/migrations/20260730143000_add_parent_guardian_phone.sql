alter table public.profiles
add column if not exists parent_guardian_phone text;

alter table public.profiles
drop constraint if exists profiles_parent_guardian_phone_length_check,
add constraint profiles_parent_guardian_phone_length_check
check (
  parent_guardian_phone is null
  or char_length(parent_guardian_phone) <= 32
);

comment on column public.profiles.parent_guardian_phone is
  'Optional parent or guardian phone number. When guardian contact is supplied, the application requires name, email, phone, and adult awareness confirmation.';
