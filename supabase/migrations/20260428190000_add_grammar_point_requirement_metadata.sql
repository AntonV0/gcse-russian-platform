begin;

alter table public.grammar_points
  add column if not exists knowledge_requirement text not null default 'productive',
  add column if not exists receptive_scope text,
  add column if not exists source_key text,
  add column if not exists source_version text,
  add column if not exists import_key text;

alter table public.grammar_points
  drop constraint if exists grammar_points_knowledge_requirement_check;

alter table public.grammar_points
  add constraint grammar_points_knowledge_requirement_check
    check (knowledge_requirement in ('productive', 'receptive', 'mixed', 'unknown'));

create unique index if not exists grammar_points_source_import_key_idx
  on public.grammar_points (source_key, import_key)
  where source_key is not null and import_key is not null;

create index if not exists grammar_points_knowledge_requirement_idx
  on public.grammar_points (knowledge_requirement);

commit;
