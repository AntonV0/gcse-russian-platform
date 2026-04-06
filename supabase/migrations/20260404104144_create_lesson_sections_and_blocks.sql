create table "public"."lesson_sections" (
  "id" uuid not null default gen_random_uuid(),
  "lesson_id" uuid not null,
  "title" text not null,
  "description" text,
  "section_kind" text not null default 'content'::text,
  "position" integer not null,
  "is_published" boolean not null default false,
  "settings" jsonb not null default '{}'::jsonb,
  "created_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone not null default now()
);
alter table "public"."lesson_sections" enable row level security;
create table "public"."lesson_blocks" (
  "id" uuid not null default gen_random_uuid(),
  "lesson_section_id" uuid not null,
  "block_type" text not null,
  "position" integer not null,
  "data" jsonb not null default '{}'::jsonb,
  "is_published" boolean not null default false,
  "settings" jsonb not null default '{}'::jsonb,
  "created_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone not null default now()
);
alter table "public"."lesson_blocks" enable row level security;
create unique index lesson_sections_pkey on public.lesson_sections using btree (id);
create unique index lesson_sections_lesson_id_position_key on public.lesson_sections using btree (lesson_id, position);
create unique index lesson_blocks_pkey on public.lesson_blocks using btree (id);
create unique index lesson_blocks_lesson_section_id_position_key on public.lesson_blocks using btree (lesson_section_id, position);
alter table "public"."lesson_sections"
add constraint "lesson_sections_pkey" primary key using index "lesson_sections_pkey";
alter table "public"."lesson_sections"
add constraint "lesson_sections_lesson_id_position_key" unique using index "lesson_sections_lesson_id_position_key";
alter table "public"."lesson_blocks"
add constraint "lesson_blocks_pkey" primary key using index "lesson_blocks_pkey";
alter table "public"."lesson_blocks"
add constraint "lesson_blocks_lesson_section_id_position_key" unique using index "lesson_blocks_lesson_section_id_position_key";
alter table "public"."lesson_sections"
add constraint "lesson_sections_lesson_id_fkey" foreign key (lesson_id) references public.lessons(id) on delete cascade not valid;
alter table "public"."lesson_sections" validate constraint "lesson_sections_lesson_id_fkey";
alter table "public"."lesson_blocks"
add constraint "lesson_blocks_lesson_section_id_fkey" foreign key (lesson_section_id) references public.lesson_sections(id) on delete cascade not valid;
alter table "public"."lesson_blocks" validate constraint "lesson_blocks_lesson_section_id_fkey";
grant delete on table "public"."lesson_sections" to "anon";
grant insert on table "public"."lesson_sections" to "anon";
grant references on table "public"."lesson_sections" to "anon";
grant select on table "public"."lesson_sections" to "anon";
grant trigger on table "public"."lesson_sections" to "anon";
grant truncate on table "public"."lesson_sections" to "anon";
grant update on table "public"."lesson_sections" to "anon";
grant delete on table "public"."lesson_sections" to "authenticated";
grant insert on table "public"."lesson_sections" to "authenticated";
grant references on table "public"."lesson_sections" to "authenticated";
grant select on table "public"."lesson_sections" to "authenticated";
grant trigger on table "public"."lesson_sections" to "authenticated";
grant truncate on table "public"."lesson_sections" to "authenticated";
grant update on table "public"."lesson_sections" to "authenticated";
grant delete on table "public"."lesson_sections" to "service_role";
grant insert on table "public"."lesson_sections" to "service_role";
grant references on table "public"."lesson_sections" to "service_role";
grant select on table "public"."lesson_sections" to "service_role";
grant trigger on table "public"."lesson_sections" to "service_role";
grant truncate on table "public"."lesson_sections" to "service_role";
grant update on table "public"."lesson_sections" to "service_role";
grant delete on table "public"."lesson_blocks" to "anon";
grant insert on table "public"."lesson_blocks" to "anon";
grant references on table "public"."lesson_blocks" to "anon";
grant select on table "public"."lesson_blocks" to "anon";
grant trigger on table "public"."lesson_blocks" to "anon";
grant truncate on table "public"."lesson_blocks" to "anon";
grant update on table "public"."lesson_blocks" to "anon";
grant delete on table "public"."lesson_blocks" to "authenticated";
grant insert on table "public"."lesson_blocks" to "authenticated";
grant references on table "public"."lesson_blocks" to "authenticated";
grant select on table "public"."lesson_blocks" to "authenticated";
grant trigger on table "public"."lesson_blocks" to "authenticated";
grant truncate on table "public"."lesson_blocks" to "authenticated";
grant update on table "public"."lesson_blocks" to "authenticated";
grant delete on table "public"."lesson_blocks" to "service_role";
grant insert on table "public"."lesson_blocks" to "service_role";
grant references on table "public"."lesson_blocks" to "service_role";
grant select on table "public"."lesson_blocks" to "service_role";
grant trigger on table "public"."lesson_blocks" to "service_role";
grant truncate on table "public"."lesson_blocks" to "service_role";
grant update on table "public"."lesson_blocks" to "service_role";
create policy "Allow authenticated read on lesson_sections" on "public"."lesson_sections" as permissive for
select to authenticated using (true);
create policy "Allow admin insert on lesson_sections" on "public"."lesson_sections" as permissive for
insert to authenticated with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.is_admin = true
    )
  );
create policy "Allow admin update on lesson_sections" on "public"."lesson_sections" as permissive for
update to authenticated using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.is_admin = true
    )
  ) with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.is_admin = true
    )
  );
create policy "Allow admin delete on lesson_sections" on "public"."lesson_sections" as permissive for delete to authenticated using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.is_admin = true
  )
);
create policy "Allow authenticated read on lesson_blocks" on "public"."lesson_blocks" as permissive for
select to authenticated using (true);
create policy "Allow admin insert on lesson_blocks" on "public"."lesson_blocks" as permissive for
insert to authenticated with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.is_admin = true
    )
  );
create policy "Allow admin update on lesson_blocks" on "public"."lesson_blocks" as permissive for
update to authenticated using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.is_admin = true
    )
  ) with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.is_admin = true
    )
  );
create policy "Allow admin delete on lesson_blocks" on "public"."lesson_blocks" as permissive for delete to authenticated using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.is_admin = true
  )
);