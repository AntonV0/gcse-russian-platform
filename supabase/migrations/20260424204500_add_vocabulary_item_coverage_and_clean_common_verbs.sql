begin;

alter table public.vocabulary_items
  add column if not exists spec_russian text;

update public.vocabulary_items
set spec_russian = russian
where source_key = 'pearson_edexcel_gcse_russian_1ru0'
  and source_section_ref = 'Section 1: High-frequency language / Common verbs'
  and spec_russian is null;

with cleaned_items (import_key, russian, note) as (
  values
    ('section-1:high-frequency-language:common-verbs:item-006', $$купаться / искупаться$$, $$Student-facing form expanded from spec shorthand: купаться/ис-.$$),
    ('section-1:high-frequency-language:common-verbs:item-009', $$болеть / заболеть$$, $$Student-facing form expanded from spec shorthand: болеть/за-.$$),
    ('section-1:high-frequency-language:common-verbs:item-010', $$интересоваться / заинтересоваться$$, $$Student-facing form expanded from spec shorthand: интересоваться/за-.$$),
    ('section-1:high-frequency-language:common-verbs:item-014', $$верить / поверить$$, $$Student-facing form expanded from spec shorthand: верить/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-016', $$носить / нести / понести$$, $$Student-facing separators normalised from spec notation: носить/нести//понести.$$),
    ('section-1:high-frequency-language:common-verbs:item-021', $$чистить / почистить$$, $$Student-facing form expanded from spec shorthand: чистить/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-032', $$готовить / приготовить$$, $$Student-facing form expanded from spec shorthand: готовить/при-.$$),
    ('section-1:high-frequency-language:common-verbs:item-034', $$копировать / скопировать$$, $$Student-facing form expanded from spec shorthand: копировать/с-.$$),
    ('section-1:high-frequency-language:common-verbs:item-037', $$плакать / заплакать$$, $$Student-facing form expanded from spec shorthand: плакать/за-.$$),
    ('section-1:high-frequency-language:common-verbs:item-045', $$рисовать / нарисовать$$, $$Student-facing form expanded from spec shorthand: рисовать/на-.$$),
    ('section-1:high-frequency-language:common-verbs:item-046', $$пить / выпить$$, $$Student-facing form expanded from spec shorthand: пить/вы-.$$),
    ('section-1:high-frequency-language:common-verbs:item-047', $$водить / вести / повести машину$$, $$Student-facing separators normalised from spec notation: водить/вести//повести машину.$$),
    ('section-1:high-frequency-language:common-verbs:item-049', $$есть / съесть$$, $$Student-facing form expanded from spec shorthand: есть/съ-.$$),
    ('section-1:high-frequency-language:common-verbs:item-050', $$кушать / покушать$$, $$Student-facing form expanded from spec shorthand: кушать/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-060', $$кормить / покормить$$, $$Student-facing form expanded from spec shorthand: кормить/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-065', $$летать / лететь / полететь$$, $$Student-facing separators normalised from spec notation: летать/лететь//полететь.$$),
    ('section-1:high-frequency-language:common-verbs:item-066', $$следовать / последовать$$, $$Student-facing form expanded from spec shorthand: следовать/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-076', $$дарить / подарить$$, $$Student-facing form expanded from spec shorthand: дарить/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-078', $$ходить / идти / пойти$$, $$Student-facing separators normalised from spec notation: ходить/идти//пойти.$$),
    ('section-1:high-frequency-language:common-verbs:item-080', $$ездить / ехать / поехать (в машине)$$, $$Student-facing separators normalised from spec notation: ездить/ехать//поехать (в машине).$$),
    ('section-1:high-frequency-language:common-verbs:item-082', $$гулять / погулять$$, $$Student-facing form expanded from spec shorthand: гулять/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-086', $$расти / вырасти$$, $$Student-facing form expanded from spec shorthand: расти/вы-.$$),
    ('section-1:high-frequency-language:common-verbs:item-088', $$вредить / повредить$$, $$Student-facing form expanded from spec shorthand: вредить/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-089', $$ненавидеть / возненавидеть$$, $$Student-facing form expanded from spec shorthand: ненавидеть/воз-.$$),
    ('section-1:high-frequency-language:common-verbs:item-090', $$завтракать / позавтракать$$, $$Student-facing form expanded from spec shorthand: завтракать/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-091', $$обедать / пообедать$$, $$Student-facing form expanded from spec shorthand: обедать/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-092', $$ужинать / поужинать$$, $$Student-facing form expanded from spec shorthand: ужинать/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-093', $$слышать / услышать$$, $$Student-facing form expanded from spec shorthand: слышать/у-.$$),
    ('section-1:high-frequency-language:common-verbs:item-097', $$держать / подержать$$, $$Student-facing form expanded from spec shorthand: держать/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-099', $$спешить / поспешить$$, $$Student-facing form expanded from spec shorthand: спешить/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-104', $$интересовать / заинтересовать$$, $$Student-facing form expanded from spec shorthand: интересовать/за-.$$),
    ('section-1:high-frequency-language:common-verbs:item-107', $$гладить / погладить$$, $$Student-facing form expanded from spec shorthand: гладить/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-116', $$смеяться / засмеяться$$, $$Student-facing form expanded from spec shorthand: смеяться/за-.$$),
    ('section-1:high-frequency-language:common-verbs:item-117', $$водить / вести / повести$$, $$Student-facing separators normalised from spec notation: водить/вести//повести.$$),
    ('section-1:high-frequency-language:common-verbs:item-122', $$лежать / полежать$$, $$Student-facing form expanded from spec shorthand: лежать/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-125', $$нравиться / понравиться$$, $$Student-facing form expanded from spec shorthand: нравиться/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-126', $$слушать / послушать$$, $$Student-facing form expanded from spec shorthand: слушать/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-129', $$искать / поискать$$, $$Student-facing form expanded from spec shorthand: искать/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-130', $$терять / потерять$$, $$Student-facing form expanded from spec shorthand: терять/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-132', $$любить / полюбить$$, $$Student-facing form expanded from spec shorthand: любить/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-145', $$парковаться / припарковаться$$, $$Student-facing form expanded from spec shorthand: парковаться/при-.$$),
    ('section-1:high-frequency-language:common-verbs:item-146', $$ставить / поставить (машину)$$, $$Student-facing form expanded from spec shorthand: ставить/по- (машину).$$),
    ('section-1:high-frequency-language:common-verbs:item-147', $$платить / заплатить$$, $$Student-facing form expanded from spec shorthand: платить/за-.$$),
    ('section-1:high-frequency-language:common-verbs:item-148', $$звонить / позвонить$$, $$Student-facing form expanded from spec shorthand: звонить/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-149', $$играть / поиграть$$, $$Student-facing form expanded from spec shorthand: играть/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-160', $$читать / прочитать$$, $$Student-facing form expanded from spec shorthand: читать/про-.$$),
    ('section-1:high-frequency-language:common-verbs:item-166', $$помнить / вспомнить$$, $$Student-facing form expanded from spec shorthand: помнить/вс-.$$),
    ('section-1:high-frequency-language:common-verbs:item-168', $$чинить / починить$$, $$Student-facing form expanded from spec shorthand: чинить/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-172', $$исследовать / от-$$, $$Spec shorthand retained for review: исследовать/от-.$$),
    ('section-1:high-frequency-language:common-verbs:item-178', $$звонить / позвонить$$, $$Student-facing form expanded from spec shorthand: звонить/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-179', $$бегать / бежать / побежать$$, $$Student-facing separators normalised from spec notation: бегать/бежать//побежать.$$),
    ('section-1:high-frequency-language:common-verbs:item-182', $$видеть / увидеть$$, $$Student-facing form expanded from spec shorthand: видеть/у-.$$),
    ('section-1:high-frequency-language:common-verbs:item-183', $$казаться / показаться$$, $$Student-facing form expanded from spec shorthand: казаться/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-189', $$петь / спеть$$, $$Student-facing form expanded from spec shorthand: петь/с-.$$),
    ('section-1:high-frequency-language:common-verbs:item-190', $$сидеть / посидеть$$, $$Student-facing form expanded from spec shorthand: сидеть/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-192', $$садить / посадить$$, $$Student-facing form expanded from spec shorthand: садить/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-195', $$спать / поспать$$, $$Student-facing form expanded from spec shorthand: спать/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-197', $$курить / выкурить$$, $$Student-facing form expanded from spec shorthand: курить/вы-.$$),
    ('section-1:high-frequency-language:common-verbs:item-200', $$тратить / потратить (деньги)$$, $$Student-facing form expanded from spec shorthand: тратить/по- (деньги).$$),
    ('section-1:high-frequency-language:common-verbs:item-202', $$стоять / постоять$$, $$Student-facing form expanded from spec shorthand: стоять/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-204', $$красть / украсть$$, $$Student-facing form expanded from spec shorthand: красть/у-.$$),
    ('section-1:high-frequency-language:common-verbs:item-206', $$гулять / погулять$$, $$Student-facing form expanded from spec shorthand: гулять/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-210', $$плавать / плыть / поплыть$$, $$Student-facing separators normalised from spec notation: плавать/плыть//поплыть.$$),
    ('section-1:high-frequency-language:common-verbs:item-216', $$пробовать / попробовать$$, $$Student-facing form expanded from spec shorthand: пробовать/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-219', $$благодарить / поблагодарить$$, $$Student-facing form expanded from spec shorthand: благодарить/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-220', $$думать / подумать (о чём-либо)$$, $$Student-facing form expanded from spec shorthand: думать/по- (о чём-либо).$$),
    ('section-1:high-frequency-language:common-verbs:item-224', $$пробовать / попробовать$$, $$Student-facing form expanded from spec shorthand: пробовать/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-227', $$пользоваться / ис-$$, $$Spec shorthand retained for review: пользоваться/ис-.$$),
    ('section-1:high-frequency-language:common-verbs:item-228', $$пылесосить / пропылесосить$$, $$Student-facing form expanded from spec shorthand: пылесосить/про-.$$),
    ('section-1:high-frequency-language:common-verbs:item-233', $$ходить / идти / пойти$$, $$Student-facing separators normalised from spec notation: ходить/идти//пойти.$$),
    ('section-1:high-frequency-language:common-verbs:item-234', $$хотеть / захотеть$$, $$Student-facing form expanded from spec shorthand: хотеть/за-.$$),
    ('section-1:high-frequency-language:common-verbs:item-236', $$мыть / вымыть$$, $$Student-facing form expanded from spec shorthand: мыть/вы-.$$),
    ('section-1:high-frequency-language:common-verbs:item-238', $$стирать / постирать$$, $$Student-facing form expanded from spec shorthand: стирать/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-239', $$смотреть / посмотреть$$, $$Student-facing form expanded from spec shorthand: смотреть/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-240', $$носить / нести / понести$$, $$Student-facing separators normalised from spec notation: носить/нести//понести.$$),
    ('section-1:high-frequency-language:common-verbs:item-244', $$желать / пожелать$$, $$Student-facing form expanded from spec shorthand: желать/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-245', $$работать / поработать$$, $$Student-facing form expanded from spec shorthand: работать/по-.$$),
    ('section-1:high-frequency-language:common-verbs:item-246', $$писать / написать$$, $$Student-facing form expanded from spec shorthand: писать/на-.$$)
)
update public.vocabulary_items items
set
  russian = cleaned_items.russian,
  notes = trim(
    both E'\n' from concat_ws(
      E'\n',
      nullif(items.notes, ''),
      cleaned_items.note
    )
  ),
  updated_at = now()
from cleaned_items
where items.source_key = 'pearson_edexcel_gcse_russian_1ru0'
  and items.import_key = cleaned_items.import_key;

update public.vocabulary_items
set
  notes = nullif(
    trim(
      both E'\n' from regexp_replace(
        regexp_replace(
          regexp_replace(
            regexp_replace(
              regexp_replace(
                regexp_replace(
                  coalesce(notes, ''),
                  E'(^|\n)Spec gives perfective prefix shorthand\\.',
                  '',
                  'g'
                ),
                E'(^|\n)Student-facing form expanded from spec shorthand: [^\n]*',
                '',
                'g'
              ),
              E'(^|\n)Student-facing separators normalised from spec notation: [^\n]*',
              '',
              'g'
            ),
            E'(^|\n)Spec shorthand retained for review: [^\n]*',
            '',
            'g'
          ),
          E'(^|\n)Corrected obvious OCR from source text\\.',
          '',
          'g'
        ),
        E'(^|\n)Line break corrected from source text\\.',
        '',
        'g'
      )
    ),
    ''
  ),
  updated_at = now()
where source_key = 'pearson_edexcel_gcse_russian_1ru0'
  and source_section_ref = 'Section 1: High-frequency language / Common verbs';

update public.vocabulary_items
set
  notes = replace(
    replace(notes, 'Imperfective only in source.', 'Imperfective only.'),
    'Perfective only in source.',
    'Perfective only.'
  ),
  updated_at = now()
where source_key = 'pearson_edexcel_gcse_russian_1ru0'
  and source_section_ref = 'Section 1: High-frequency language / Common verbs'
  and notes is not null;

update public.vocabulary_items
set
  russian = regexp_replace(
    replace(replace(russian, '//', ' / '), '/', ' / '),
    '[[:space:]]+',
    ' ',
    'g'
  ),
  updated_at = now()
where source_key = 'pearson_edexcel_gcse_russian_1ru0'
  and source_section_ref = 'Section 1: High-frequency language / Common verbs'
  and russian like '%/%';

create or replace view public.vocabulary_item_coverage as
select
  items.id as vocabulary_item_id,
  exists (
    select 1
    from public.lesson_vocabulary_set_usages usages
    where usages.vocabulary_set_id = items.vocabulary_set_id
      and usages.variant = 'foundation'
    union
    select 1
    from public.lesson_vocabulary_links links
    where links.variant = 'foundation'
      and (
        links.vocabulary_item_id = items.id
        or links.vocabulary_set_id = items.vocabulary_set_id
        or exists (
          select 1
          from public.vocabulary_list_items list_items
          where list_items.vocabulary_list_id = links.vocabulary_list_id
            and list_items.vocabulary_item_id = items.id
        )
      )
  ) as used_in_foundation,
  exists (
    select 1
    from public.lesson_vocabulary_set_usages usages
    where usages.vocabulary_set_id = items.vocabulary_set_id
      and usages.variant = 'higher'
    union
    select 1
    from public.lesson_vocabulary_links links
    where links.variant = 'higher'
      and (
        links.vocabulary_item_id = items.id
        or links.vocabulary_set_id = items.vocabulary_set_id
        or exists (
          select 1
          from public.vocabulary_list_items list_items
          where list_items.vocabulary_list_id = links.vocabulary_list_id
            and list_items.vocabulary_item_id = items.id
        )
      )
  ) as used_in_higher,
  exists (
    select 1
    from public.lesson_vocabulary_set_usages usages
    where usages.vocabulary_set_id = items.vocabulary_set_id
      and usages.variant = 'volna'
    union
    select 1
    from public.lesson_vocabulary_links links
    where links.variant = 'volna'
      and (
        links.vocabulary_item_id = items.id
        or links.vocabulary_set_id = items.vocabulary_set_id
        or exists (
          select 1
          from public.vocabulary_list_items list_items
          where list_items.vocabulary_list_id = links.vocabulary_list_id
            and list_items.vocabulary_item_id = items.id
        )
      )
  ) as used_in_volna,
  exists (
    select 1
    from public.vocabulary_list_items list_items
    join public.vocabulary_lists lists
      on lists.id = list_items.vocabulary_list_id
    where list_items.vocabulary_item_id = items.id
      and lists.list_mode = 'custom'
  ) as used_in_custom_list
from public.vocabulary_items items;

grant select on public.vocabulary_item_coverage to authenticated;

commit;
