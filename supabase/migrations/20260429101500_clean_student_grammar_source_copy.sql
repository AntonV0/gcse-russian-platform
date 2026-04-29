begin;

update public.grammar_sets
set
  description = trim(
    both ' '
    from replace(
      replace(description, ' from Appendix 2.', '.'),
      ' from Appendix 2',
      ''
    )
  ),
  updated_at = now()
where source_key = 'edexcel_gcse_russian_appendix_2'
  and description ilike '%from Appendix 2%';

update public.grammar_points
set
  spec_reference = null,
  updated_at = now()
where source_key = 'edexcel_gcse_russian_appendix_2'
  and spec_reference = 'Appendix 2: Grammar list';

commit;
