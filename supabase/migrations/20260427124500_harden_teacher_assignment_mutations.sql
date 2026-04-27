create or replace function public.update_assignment_with_items(
  target_assignment_id uuid,
  target_group_id uuid,
  target_title text,
  target_instructions text,
  target_due_at timestamp with time zone,
  target_allow_file_upload boolean,
  target_items jsonb
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if target_assignment_id is null then
    raise exception 'assignment_id_required' using errcode = '22023';
  end if;

  if target_group_id is null then
    raise exception 'group_id_required' using errcode = '22023';
  end if;

  if nullif(btrim(coalesce(target_title, '')), '') is null then
    raise exception 'title_required' using errcode = '22023';
  end if;

  if target_items is null
    or jsonb_typeof(target_items) <> 'array'
    or jsonb_array_length(target_items) = 0 then
    raise exception 'assignment_items_required' using errcode = '22023';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(target_items) as items(item)
    where item ->> 'item_type' not in ('lesson', 'question_set', 'custom_task')
  ) then
    raise exception 'invalid_assignment_item_type' using errcode = '22023';
  end if;

  update public.assignments
  set
    group_id = target_group_id,
    title = btrim(target_title),
    instructions = nullif(btrim(coalesce(target_instructions, '')), ''),
    due_at = target_due_at,
    allow_file_upload = coalesce(target_allow_file_upload, false),
    updated_at = now()
  where id = target_assignment_id;

  if not found then
    raise exception 'assignment_not_found' using errcode = 'P0002';
  end if;

  delete from public.assignment_items
  where assignment_id = target_assignment_id;

  insert into public.assignment_items (
    assignment_id,
    item_type,
    lesson_id,
    question_set_id,
    custom_prompt,
    position
  )
  select
    target_assignment_id,
    item ->> 'item_type',
    case
      when item ->> 'item_type' = 'lesson'
        then nullif(item ->> 'lesson_id', '')::uuid
      else null
    end,
    case
      when item ->> 'item_type' = 'question_set'
        then nullif(item ->> 'question_set_id', '')::uuid
      else null
    end,
    case
      when item ->> 'item_type' = 'custom_task'
        then nullif(btrim(coalesce(item ->> 'custom_prompt', '')), '')
      else null
    end,
    coalesce((item ->> 'position')::integer, item_position::integer)
  from jsonb_array_elements(target_items) with ordinality as items(item, item_position);
end;
$$;

grant execute on function public.update_assignment_with_items(
  uuid,
  uuid,
  text,
  text,
  timestamp with time zone,
  boolean,
  jsonb
) to authenticated;

drop policy if exists "Admins can create assignments" on public.assignments;
create policy "Admins can create assignments"
on public.assignments
as permissive
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin = true
  )
);

drop policy if exists "Admins can delete assignments" on public.assignments;
create policy "Admins can delete assignments"
on public.assignments
as permissive
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin = true
  )
);

drop policy if exists "Admins can update assignment submissions" on public.assignment_submissions;
create policy "Admins can update assignment submissions"
on public.assignment_submissions
as permissive
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin = true
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin = true
  )
);
