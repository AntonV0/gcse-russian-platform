create table "public"."lesson_block_presets" (
  "id" uuid not null default gen_random_uuid(),
  "slug" text not null,
  "title" text not null,
  "description" text,
  "is_active" boolean not null default true,
  "created_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone not null default now()
);
alter table "public"."lesson_block_presets" enable row level security;
create table "public"."lesson_block_preset_blocks" (
  "id" uuid not null default gen_random_uuid(),
  "lesson_block_preset_id" uuid not null,
  "block_type" text not null,
  "position" integer not null,
  "data" jsonb not null default '{}'::jsonb,
  "is_active" boolean not null default true,
  "created_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone not null default now()
);
alter table "public"."lesson_block_preset_blocks" enable row level security;
create table "public"."lesson_section_templates" (
  "id" uuid not null default gen_random_uuid(),
  "slug" text not null,
  "title" text not null,
  "description" text,
  "default_section_title" text not null,
  "default_section_kind" text not null default 'content'::text,
  "is_active" boolean not null default true,
  "created_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone not null default now()
);
alter table "public"."lesson_section_templates" enable row level security;
create table "public"."lesson_section_template_presets" (
  "lesson_section_template_id" uuid not null,
  "lesson_block_preset_id" uuid not null,
  "position" integer not null
);
alter table "public"."lesson_section_template_presets" enable row level security;
create table "public"."lesson_templates" (
  "id" uuid not null default gen_random_uuid(),
  "slug" text not null,
  "title" text not null,
  "description" text,
  "is_active" boolean not null default true,
  "created_at" timestamp with time zone not null default now(),
  "updated_at" timestamp with time zone not null default now()
);
alter table "public"."lesson_templates" enable row level security;
create table "public"."lesson_template_sections" (
  "id" uuid not null default gen_random_uuid(),
  "lesson_template_id" uuid not null,
  "lesson_section_template_id" uuid not null,
  "title_override" text,
  "section_kind_override" text,
  "position" integer not null
);
alter table "public"."lesson_template_sections" enable row level security;
create unique index lesson_block_presets_pkey on public.lesson_block_presets using btree (id);
create unique index lesson_block_presets_slug_key on public.lesson_block_presets using btree (slug);
create unique index lesson_block_preset_blocks_pkey on public.lesson_block_preset_blocks using btree (id);
create unique index lesson_block_preset_blocks_preset_id_position_key on public.lesson_block_preset_blocks using btree (lesson_block_preset_id, position);
create unique index lesson_section_templates_pkey on public.lesson_section_templates using btree (id);
create unique index lesson_section_templates_slug_key on public.lesson_section_templates using btree (slug);
create unique index lesson_section_template_presets_pkey on public.lesson_section_template_presets using btree (
  lesson_section_template_id,
  lesson_block_preset_id
);
create unique index lesson_section_template_presets_template_id_position_key on public.lesson_section_template_presets using btree (lesson_section_template_id, position);
create unique index lesson_templates_pkey on public.lesson_templates using btree (id);
create unique index lesson_templates_slug_key on public.lesson_templates using btree (slug);
create unique index lesson_template_sections_pkey on public.lesson_template_sections using btree (id);
create unique index lesson_template_sections_template_id_position_key on public.lesson_template_sections using btree (lesson_template_id, position);
alter table "public"."lesson_block_presets"
add constraint "lesson_block_presets_pkey" primary key using index "lesson_block_presets_pkey";
alter table "public"."lesson_block_presets"
add constraint "lesson_block_presets_slug_key" unique using index "lesson_block_presets_slug_key";
alter table "public"."lesson_block_preset_blocks"
add constraint "lesson_block_preset_blocks_pkey" primary key using index "lesson_block_preset_blocks_pkey";
alter table "public"."lesson_block_preset_blocks"
add constraint "lesson_block_preset_blocks_preset_id_position_key" unique using index "lesson_block_preset_blocks_preset_id_position_key";
alter table "public"."lesson_section_templates"
add constraint "lesson_section_templates_pkey" primary key using index "lesson_section_templates_pkey";
alter table "public"."lesson_section_templates"
add constraint "lesson_section_templates_slug_key" unique using index "lesson_section_templates_slug_key";
alter table "public"."lesson_section_template_presets"
add constraint "lesson_section_template_presets_pkey" primary key using index "lesson_section_template_presets_pkey";
alter table "public"."lesson_section_template_presets"
add constraint "lesson_section_template_presets_template_id_position_key" unique using index "lesson_section_template_presets_template_id_position_key";
alter table "public"."lesson_templates"
add constraint "lesson_templates_pkey" primary key using index "lesson_templates_pkey";
alter table "public"."lesson_templates"
add constraint "lesson_templates_slug_key" unique using index "lesson_templates_slug_key";
alter table "public"."lesson_template_sections"
add constraint "lesson_template_sections_pkey" primary key using index "lesson_template_sections_pkey";
alter table "public"."lesson_template_sections"
add constraint "lesson_template_sections_template_id_position_key" unique using index "lesson_template_sections_template_id_position_key";
alter table "public"."lesson_block_preset_blocks"
add constraint "lesson_block_preset_blocks_lesson_block_preset_id_fkey" foreign key (lesson_block_preset_id) references public.lesson_block_presets(id) on delete cascade not valid;
alter table "public"."lesson_block_preset_blocks" validate constraint "lesson_block_preset_blocks_lesson_block_preset_id_fkey";
alter table "public"."lesson_section_template_presets"
add constraint "lesson_section_template_presets_lesson_section_template_id_fkey" foreign key (lesson_section_template_id) references public.lesson_section_templates(id) on delete cascade not valid;
alter table "public"."lesson_section_template_presets" validate constraint "lesson_section_template_presets_lesson_section_template_id_fkey";
alter table "public"."lesson_section_template_presets"
add constraint "lesson_section_template_presets_lesson_block_preset_id_fkey" foreign key (lesson_block_preset_id) references public.lesson_block_presets(id) on delete cascade not valid;
alter table "public"."lesson_section_template_presets" validate constraint "lesson_section_template_presets_lesson_block_preset_id_fkey";
alter table "public"."lesson_template_sections"
add constraint "lesson_template_sections_lesson_template_id_fkey" foreign key (lesson_template_id) references public.lesson_templates(id) on delete cascade not valid;
alter table "public"."lesson_template_sections" validate constraint "lesson_template_sections_lesson_template_id_fkey";
alter table "public"."lesson_template_sections"
add constraint "lesson_template_sections_lesson_section_template_id_fkey" foreign key (lesson_section_template_id) references public.lesson_section_templates(id) on delete restrict not valid;
alter table "public"."lesson_template_sections" validate constraint "lesson_template_sections_lesson_section_template_id_fkey";
grant delete on table "public"."lesson_block_presets" to "anon";
grant insert on table "public"."lesson_block_presets" to "anon";
grant references on table "public"."lesson_block_presets" to "anon";
grant select on table "public"."lesson_block_presets" to "anon";
grant trigger on table "public"."lesson_block_presets" to "anon";
grant truncate on table "public"."lesson_block_presets" to "anon";
grant update on table "public"."lesson_block_presets" to "anon";
grant delete on table "public"."lesson_block_presets" to "authenticated";
grant insert on table "public"."lesson_block_presets" to "authenticated";
grant references on table "public"."lesson_block_presets" to "authenticated";
grant select on table "public"."lesson_block_presets" to "authenticated";
grant trigger on table "public"."lesson_block_presets" to "authenticated";
grant truncate on table "public"."lesson_block_presets" to "authenticated";
grant update on table "public"."lesson_block_presets" to "authenticated";
grant delete on table "public"."lesson_block_presets" to "service_role";
grant insert on table "public"."lesson_block_presets" to "service_role";
grant references on table "public"."lesson_block_presets" to "service_role";
grant select on table "public"."lesson_block_presets" to "service_role";
grant trigger on table "public"."lesson_block_presets" to "service_role";
grant truncate on table "public"."lesson_block_presets" to "service_role";
grant update on table "public"."lesson_block_presets" to "service_role";
grant delete on table "public"."lesson_block_preset_blocks" to "anon";
grant insert on table "public"."lesson_block_preset_blocks" to "anon";
grant references on table "public"."lesson_block_preset_blocks" to "anon";
grant select on table "public"."lesson_block_preset_blocks" to "anon";
grant trigger on table "public"."lesson_block_preset_blocks" to "anon";
grant truncate on table "public"."lesson_block_preset_blocks" to "anon";
grant update on table "public"."lesson_block_preset_blocks" to "anon";
grant delete on table "public"."lesson_block_preset_blocks" to "authenticated";
grant insert on table "public"."lesson_block_preset_blocks" to "authenticated";
grant references on table "public"."lesson_block_preset_blocks" to "authenticated";
grant select on table "public"."lesson_block_preset_blocks" to "authenticated";
grant trigger on table "public"."lesson_block_preset_blocks" to "authenticated";
grant truncate on table "public"."lesson_block_preset_blocks" to "authenticated";
grant update on table "public"."lesson_block_preset_blocks" to "authenticated";
grant delete on table "public"."lesson_block_preset_blocks" to "service_role";
grant insert on table "public"."lesson_block_preset_blocks" to "service_role";
grant references on table "public"."lesson_block_preset_blocks" to "service_role";
grant select on table "public"."lesson_block_preset_blocks" to "service_role";
grant trigger on table "public"."lesson_block_preset_blocks" to "service_role";
grant truncate on table "public"."lesson_block_preset_blocks" to "service_role";
grant update on table "public"."lesson_block_preset_blocks" to "service_role";
grant delete on table "public"."lesson_section_templates" to "anon";
grant insert on table "public"."lesson_section_templates" to "anon";
grant references on table "public"."lesson_section_templates" to "anon";
grant select on table "public"."lesson_section_templates" to "anon";
grant trigger on table "public"."lesson_section_templates" to "anon";
grant truncate on table "public"."lesson_section_templates" to "anon";
grant update on table "public"."lesson_section_templates" to "anon";
grant delete on table "public"."lesson_section_templates" to "authenticated";
grant insert on table "public"."lesson_section_templates" to "authenticated";
grant references on table "public"."lesson_section_templates" to "authenticated";
grant select on table "public"."lesson_section_templates" to "authenticated";
grant trigger on table "public"."lesson_section_templates" to "authenticated";
grant truncate on table "public"."lesson_section_templates" to "authenticated";
grant update on table "public"."lesson_section_templates" to "authenticated";
grant delete on table "public"."lesson_section_templates" to "service_role";
grant insert on table "public"."lesson_section_templates" to "service_role";
grant references on table "public"."lesson_section_templates" to "service_role";
grant select on table "public"."lesson_section_templates" to "service_role";
grant trigger on table "public"."lesson_section_templates" to "service_role";
grant truncate on table "public"."lesson_section_templates" to "service_role";
grant update on table "public"."lesson_section_templates" to "service_role";
grant delete on table "public"."lesson_section_template_presets" to "anon";
grant insert on table "public"."lesson_section_template_presets" to "anon";
grant references on table "public"."lesson_section_template_presets" to "anon";
grant select on table "public"."lesson_section_template_presets" to "anon";
grant trigger on table "public"."lesson_section_template_presets" to "anon";
grant truncate on table "public"."lesson_section_template_presets" to "anon";
grant update on table "public"."lesson_section_template_presets" to "anon";
grant delete on table "public"."lesson_section_template_presets" to "authenticated";
grant insert on table "public"."lesson_section_template_presets" to "authenticated";
grant references on table "public"."lesson_section_template_presets" to "authenticated";
grant select on table "public"."lesson_section_template_presets" to "authenticated";
grant trigger on table "public"."lesson_section_template_presets" to "authenticated";
grant truncate on table "public"."lesson_section_template_presets" to "authenticated";
grant update on table "public"."lesson_section_template_presets" to "authenticated";
grant delete on table "public"."lesson_section_template_presets" to "service_role";
grant insert on table "public"."lesson_section_template_presets" to "service_role";
grant references on table "public"."lesson_section_template_presets" to "service_role";
grant select on table "public"."lesson_section_template_presets" to "service_role";
grant trigger on table "public"."lesson_section_template_presets" to "service_role";
grant truncate on table "public"."lesson_section_template_presets" to "service_role";
grant update on table "public"."lesson_section_template_presets" to "service_role";
grant delete on table "public"."lesson_templates" to "anon";
grant insert on table "public"."lesson_templates" to "anon";
grant references on table "public"."lesson_templates" to "anon";
grant select on table "public"."lesson_templates" to "anon";
grant trigger on table "public"."lesson_templates" to "anon";
grant truncate on table "public"."lesson_templates" to "anon";
grant update on table "public"."lesson_templates" to "anon";
grant delete on table "public"."lesson_templates" to "authenticated";
grant insert on table "public"."lesson_templates" to "authenticated";
grant references on table "public"."lesson_templates" to "authenticated";
grant select on table "public"."lesson_templates" to "authenticated";
grant trigger on table "public"."lesson_templates" to "authenticated";
grant truncate on table "public"."lesson_templates" to "authenticated";
grant update on table "public"."lesson_templates" to "authenticated";
grant delete on table "public"."lesson_templates" to "service_role";
grant insert on table "public"."lesson_templates" to "service_role";
grant references on table "public"."lesson_templates" to "service_role";
grant select on table "public"."lesson_templates" to "service_role";
grant trigger on table "public"."lesson_templates" to "service_role";
grant truncate on table "public"."lesson_templates" to "service_role";
grant update on table "public"."lesson_templates" to "service_role";
grant delete on table "public"."lesson_template_sections" to "anon";
grant insert on table "public"."lesson_template_sections" to "anon";
grant references on table "public"."lesson_template_sections" to "anon";
grant select on table "public"."lesson_template_sections" to "anon";
grant trigger on table "public"."lesson_template_sections" to "anon";
grant truncate on table "public"."lesson_template_sections" to "anon";
grant update on table "public"."lesson_template_sections" to "anon";
grant delete on table "public"."lesson_template_sections" to "authenticated";
grant insert on table "public"."lesson_template_sections" to "authenticated";
grant references on table "public"."lesson_template_sections" to "authenticated";
grant select on table "public"."lesson_template_sections" to "authenticated";
grant trigger on table "public"."lesson_template_sections" to "authenticated";
grant truncate on table "public"."lesson_template_sections" to "authenticated";
grant update on table "public"."lesson_template_sections" to "authenticated";
grant delete on table "public"."lesson_template_sections" to "service_role";
grant insert on table "public"."lesson_template_sections" to "service_role";
grant references on table "public"."lesson_template_sections" to "service_role";
grant select on table "public"."lesson_template_sections" to "service_role";
grant trigger on table "public"."lesson_template_sections" to "service_role";
grant truncate on table "public"."lesson_template_sections" to "service_role";
grant update on table "public"."lesson_template_sections" to "service_role";
create policy "Allow authenticated read on lesson_block_presets" on "public"."lesson_block_presets" as permissive for
select to authenticated using (true);
create policy "Allow admin insert on lesson_block_presets" on "public"."lesson_block_presets" as permissive for
insert to authenticated with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.is_admin = true
    )
  );
create policy "Allow admin update on lesson_block_presets" on "public"."lesson_block_presets" as permissive for
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
create policy "Allow admin delete on lesson_block_presets" on "public"."lesson_block_presets" as permissive for delete to authenticated using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.is_admin = true
  )
);
create policy "Allow authenticated read on lesson_block_preset_blocks" on "public"."lesson_block_preset_blocks" as permissive for
select to authenticated using (true);
create policy "Allow admin insert on lesson_block_preset_blocks" on "public"."lesson_block_preset_blocks" as permissive for
insert to authenticated with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.is_admin = true
    )
  );
create policy "Allow admin update on lesson_block_preset_blocks" on "public"."lesson_block_preset_blocks" as permissive for
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
create policy "Allow admin delete on lesson_block_preset_blocks" on "public"."lesson_block_preset_blocks" as permissive for delete to authenticated using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.is_admin = true
  )
);
create policy "Allow authenticated read on lesson_section_templates" on "public"."lesson_section_templates" as permissive for
select to authenticated using (true);
create policy "Allow admin insert on lesson_section_templates" on "public"."lesson_section_templates" as permissive for
insert to authenticated with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.is_admin = true
    )
  );
create policy "Allow admin update on lesson_section_templates" on "public"."lesson_section_templates" as permissive for
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
create policy "Allow admin delete on lesson_section_templates" on "public"."lesson_section_templates" as permissive for delete to authenticated using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.is_admin = true
  )
);
create policy "Allow authenticated read on lesson_section_template_presets" on "public"."lesson_section_template_presets" as permissive for
select to authenticated using (true);
create policy "Allow admin insert on lesson_section_template_presets" on "public"."lesson_section_template_presets" as permissive for
insert to authenticated with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.is_admin = true
    )
  );
create policy "Allow admin update on lesson_section_template_presets" on "public"."lesson_section_template_presets" as permissive for
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
create policy "Allow admin delete on lesson_section_template_presets" on "public"."lesson_section_template_presets" as permissive for delete to authenticated using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.is_admin = true
  )
);
create policy "Allow authenticated read on lesson_templates" on "public"."lesson_templates" as permissive for
select to authenticated using (true);
create policy "Allow admin insert on lesson_templates" on "public"."lesson_templates" as permissive for
insert to authenticated with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.is_admin = true
    )
  );
create policy "Allow admin update on lesson_templates" on "public"."lesson_templates" as permissive for
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
create policy "Allow admin delete on lesson_templates" on "public"."lesson_templates" as permissive for delete to authenticated using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.is_admin = true
  )
);
create policy "Allow authenticated read on lesson_template_sections" on "public"."lesson_template_sections" as permissive for
select to authenticated using (true);
create policy "Allow admin insert on lesson_template_sections" on "public"."lesson_template_sections" as permissive for
insert to authenticated with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.is_admin = true
    )
  );
create policy "Allow admin update on lesson_template_sections" on "public"."lesson_template_sections" as permissive for
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
create policy "Allow admin delete on lesson_template_sections" on "public"."lesson_template_sections" as permissive for delete to authenticated using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.is_admin = true
  )
);