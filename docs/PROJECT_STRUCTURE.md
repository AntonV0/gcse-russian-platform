# Project Structure

Snapshot of the current project structure for the **GCSE Russian Course Platform**.

Purpose:

- provide quick architectural context at the start of new development chats
- make file locations easier to find without uploading the full repo
- keep planning grounded in the real project structure
- avoid confusion when multiple chats are working on different areas

Notes:

- this snapshot includes only project-relevant areas
- local machine paths are intentionally excluded
- build output and dependency folders such as `.next` and `node_modules` are excluded
- this version reflects the current state after the lesson builder, UI Lab, billing, vocabulary, pricing UI, account/settings, theme system, grammar, past papers, mock exams, marketing SEO pages, and structure refactor work

---

## Top-level included areas

- `src/`
- `docs/`
- `supabase/`

---

## Current structure

```text
src/
  proxy.ts

  app/
    favicon.ico
    globals.css
    layout.tsx
    page.tsx

    (platform)/
      layout.tsx

      account/
        page.tsx
        billing/
          page.tsx

      assignments/
        page.tsx
        [assignmentId]/
          page.tsx

      courses/
        page.tsx
        [courseSlug]/
          page.tsx
          [variantSlug]/
            page.tsx
            modules/
              [moduleSlug]/
                page.tsx
                lessons/
                  [lessonSlug]/
                    page.tsx

      dashboard/
        page.tsx

      grammar/
        page.tsx

      online-classes/
        page.tsx

      past-papers/
        page.tsx

      profile/
        page.tsx

      question-sets/
        [questionSetSlug]/
          page.tsx

      settings/
        page.tsx

      teacher/
        assignments/
          page.tsx
          new/
            page.tsx
          [assignmentId]/
            page.tsx
            edit/
              page.tsx

      vocabulary/
        page.tsx

    (marketing)/
      layout.tsx

      marketing/
        page.tsx

        about/
          page.tsx

        blog/
          page.tsx

        faq/
          page.tsx

        pricing/
          page.tsx

      (auth)/
        layout.tsx
        login/
          page.tsx
        signup/
          page.tsx

    actions/
      shared/
        form-data.ts

      admin/
        admin-content-actions.ts
        admin-lesson-builder-actions.ts
        admin-lesson-builder-block-actions.ts
        admin-lesson-builder-section-actions.ts
        admin-lesson-builder-shared.ts
        admin-lesson-builder-template-actions.ts
        admin-question-actions.ts
        admin-teaching-group-actions.ts
        admin-user-actions.ts
        admin-vocabulary-actions.ts
        admin-vocabulary-items-actions.ts

        content/
          course-actions.ts
          lesson-actions.ts
          module-actions.ts
          shared.ts
          variant-actions.ts

        lesson-builder-block-actions/
          block-management-actions.ts
          content-block-actions.ts
          linked-block-actions.ts
          media-block-actions.ts
          preset-actions.ts
          shared.ts

        lesson-template-actions/
          block-preset-actions.ts
          insert-actions.ts
          lesson-template-actions.ts
          section-template-actions.ts
          shared.ts

        questions/
          question-actions.ts
          question-duplication-actions.ts
          question-order-actions.ts
          question-set-actions.ts
          shared.ts

      assignments/
        assignment-actions.ts

      auth/
        auth.ts

      progress/
        progress.ts

      questions/
        question-actions.ts

      teacher/
        teacher-assignment-actions.ts
        teacher-create-assignment-actions.ts
        teacher-delete-assignment-actions.ts
        teacher-update-assignment-actions.ts

    admin/
      layout.tsx
      page.tsx

      content/
        page.tsx
        courses/
          [courseId]/
            page.tsx
            edit/
              page.tsx
            variants/
              [variantId]/
                page.tsx
                edit/
                  page.tsx
                modules/
                  [moduleId]/
                    page.tsx
                    edit/
                      page.tsx
                    lessons/
                      [lessonId]/
                        page.tsx
                        edit/
                          page.tsx

      lesson-templates/
        page.tsx
        block-presets/
          page.tsx
          [presetId]/
            page.tsx
        lesson-templates/
          page.tsx
          [templateId]/
            page.tsx
        section-templates/
          page.tsx
          [templateId]/
            page.tsx

      question-sets/
        page.tsx
        create/
          page.tsx
        templates/
          page.tsx
          [templateQuestionSetId]/
            create/
              page.tsx
        [questionSetId]/
          page.tsx

      questions/
        [questionId]/
          page.tsx

      students/
        page.tsx
        [userId]/
          page.tsx

      teachers/
        page.tsx
        [userId]/
          page.tsx

      teaching-groups/
        page.tsx
        new/
          page.tsx
        [groupId]/
          page.tsx
          edit/
            page.tsx

      ui/
        page.tsx
        admin-patterns/
          page.tsx
        buttons/
          page.tsx
        components/
          page.tsx
        feedback/
          page.tsx
        forms/
          page.tsx
        icons/
          page.tsx
        layout/
          page.tsx
        lesson-builder/
          page.tsx
        lesson-content/
          page.tsx
        navigation/
          page.tsx
        surfaces/
          page.tsx
        tables/
          page.tsx
        theme/
          page.tsx
        typography/
          page.tsx

      vocabulary/
        page.tsx
        create/
          page.tsx
        [vocabularySetId]/
          edit/
            page.tsx
          items/
            page.tsx

    api/
      stripe/
        checkout/
          route.ts
        webhook/
          route.ts

  components/
    admin/
      admin-confirm-button.tsx
      admin-feedback-banner.tsx
      admin-lesson-builder-workspace.tsx
      admin-lesson-builder.tsx
      admin-question-form.tsx
      admin-route-tracker.tsx
      admin-sidebar.tsx
      all-icons-browser.tsx
      continue-where-left-off-panel.tsx
      debug-billing-panel.tsx
      expandable-admin-form-panel.tsx
      ui-lab-future-section.tsx
      ui-lab-page-nav.tsx
      ui-lab-section.tsx
      ui-lab-shell.tsx

      lesson-builder/
        add-block-composer.tsx
        block-editors.tsx
        draggable-block-list.tsx
        lesson-builder-types.ts
        lesson-builder-ui.tsx
        lesson-inspector-panel.tsx
        lesson-section-editor.tsx
        lesson-section-sidebar.tsx

        add-block-composer/
          block-preset-list.tsx
          block-type-button.tsx
          media-block-forms.tsx
          selected-block-form.tsx
          shared.ts
          text-block-forms.tsx
          vocabulary-block-forms.tsx

        block-editors/
          media-editors.tsx
          shared.ts
          slug-block-editor.tsx
          text-editors.tsx
          vocabulary-block-editor.tsx
          vocabulary-set-block-editor.tsx

        lesson-section-sidebar/
          add-section-form.tsx
          section-list.tsx
          section-template-list.tsx
          sidebar-primitives.tsx

    assignments/
      assignment-submission-form.tsx
      delete-assignment-button.tsx
      reopen-submission-button.tsx
      teacher-access-denied.tsx
      teacher-assignments-list.tsx
      teacher-create-assignment-form.tsx
      teacher-submission-review-form.tsx

    billing/
      checkout-button.tsx

      pricing/
        data.tsx
        foundation-plan-panel.tsx
        higher-plan-panel.tsx
        plan-card.tsx
        plan-state-elements.tsx
        types.ts

    layout/
      app-shell.tsx
      lesson-footer-nav.tsx
      lesson-header.tsx
      logout-button.tsx
      page-container.tsx
      page-header.tsx
      platform-sidebar.tsx
      site-footer.tsx
      site-header.tsx

    marketing/
      marketing-site-footer.tsx
      marketing-site-header.tsx

    lesson-blocks/
      lesson-completion-form.tsx
      lesson-page-template.tsx
      lesson-renderer.tsx
      note-block.tsx
      question-set-block.tsx
      structure-blocks.tsx
      text-block.tsx
      vocabulary-block.tsx
      vocabulary-set-block.tsx

      lesson-page-template/
        lesson-completion-panel.tsx
        lesson-step-routes.ts
        progress-helpers.ts
        section-pager.tsx
        step-meta-bar.tsx
        step-tracker.tsx

    providers/
      theme-provider.tsx

    questions/
      audio-player.tsx
      multiple-choice-block.tsx
      question-card.tsx
      question-feedback.tsx
      question-renderer.tsx
      selection-based-block.tsx
      sentence-builder-block.tsx
      short-answer-block.tsx
      tracked-multiple-choice-block.tsx
      tracked-short-answer-block.tsx
      translation-block.tsx

    settings/
      theme-mode-selector.tsx

    ui/
      admin-row.tsx
      app-icon.tsx
      assessment-surface-card.tsx
      back-nav.tsx
      badge.tsx
      button.tsx
      card-list-item.tsx
      card.tsx
      checkbox-field.tsx
      danger-zone.tsx
      dashboard-card.tsx
      data-table.tsx
      detail-list.tsx
      dev-component-marker.tsx
      empty-state.tsx
      feedback-banner.tsx
      form-field.tsx
      icon-stack-actions.tsx
      info-row.tsx
      inline-actions.tsx
      input.tsx
      lesson-surface-card.tsx
      locked-content-card.tsx
      page-intro-panel.tsx
      panel-card.tsx
      practice-surface-card.tsx
      section-card.tsx
      section-header.tsx
      select.tsx
      status-badge.tsx
      status-summary-card.tsx
      summary-stat-card.tsx
      surface.tsx
      table-shell.tsx
      table-toolbar.tsx
      textarea.tsx
      theme-toggle.tsx
      visual-placeholder.tsx

  lib/
    access/
      access-helpers-db.ts
      access.ts
      routes.ts

    assignments/
      assignment-helpers-db.ts
      assignment-progress.ts
      assignment-status.ts

      assignment-helpers-db/
        auth.ts
        options.ts
        student-assignments.ts
        teacher-assignments.ts
        types.ts

    auth/
      admin-auth.ts
      auth.ts
      teacher-auth.ts

    billing/
      account-helpers.ts
      catalog.ts
      grants.ts
      pricing-ui.ts
      stripe.ts
      subscriptions.ts
      webhook-handlers.ts

      catalog/
        checkout-resolution.ts
        db.ts
        price-matching.ts
        types.ts
        upgrade-pricing.ts
        upgrade-quotes.ts

    courses/
      course-helpers-db.ts

    curriculum/
      assessment-objectives.ts
      content-purpose.ts
      grammar-tags.ts
      index.ts
      paper-tasks.ts
      papers.ts
      skills.ts
      taxonomy-types.ts
      themes.ts
      tiers.ts
      topics.ts
      vocabulary-tags.ts

    dashboard/
      dashboard-helpers.ts
      student-messaging.ts

    lesson-content/
      index.ts
      gcse-russian/
        introduction-to-the-course/
          getting-started.ts
          how-the-course-works.ts
          index.ts

    lessons/
      lesson-admin-helpers-db.ts
      lesson-blocks.ts
      lesson-content-helpers-db.ts
      lesson-template-helpers-db.ts

    progress/
      cross-variant-sync.ts
      progress-module.ts
      progress.ts

    questions/
      question-engine.ts
      question-helpers-db.ts
      question-progress.ts

    shared/
      icons.ts
      media.ts
      storage-helpers.ts

    supabase/
      admin.ts
      client.ts
      env.ts
      server.ts

    ui/
      ui-lab.ts

    users/
      admin-user-helpers-db.ts

    vocabulary/
      vocabulary-helpers-db.ts
      vocabulary-usage-sync.ts

    volna/
      volna-helpers-db.ts

  styles/
    badges.css
    base.css
    buttons.css
    dev-markers.css
    feedback.css
    forms.css
    surfaces.css
    tokens.css
    typography.css

  types/
    lesson.ts

docs/
  architecture.md
  decisions.md
  image-strategy.md
  PROJECT_STRUCTURE.md
  ui-system-guidelines.md

  page-ui-private/
    01-ui-lab-overview-dark.png
    01-ui-lab-overview-light.png
    02-ui-lab-buttons-dark.png
    02-ui-lab-buttons-light.png
    03-ui-lab-components-dark.png
    03-ui-lab-components-light.png
    04-ui-lab-feedback-dark.png
    04-ui-lab-feedback-light.png
    05-ui-lab-forms-dark.png
    05-ui-lab-forms-light.png
    06-ui-lab-icons-dark.png
    06-ui-lab-icons-light.png
    07-ui-lab-layout-dark.png
    07-ui-lab-layout-light.png
    08-ui-lab-navigation-dark.png
    08-ui-lab-navigation-light.png
    09-ui-lab-surfaces-dark.png
    09-ui-lab-surfaces-light.png
    10-ui-lab-tables-dark.png
    10-ui-lab-tables-light.png
    11-ui-lab-typography-dark.png
    11-ui-lab-typography-light.png

  spec-private/
    exam/
      01_exam-structure.md

    grammar/
      11_grammar-foundation.md
      12_grammar-higher.md

    markschemes/
      07_markschemes-speaking-foundation.md
      08_markschemes-speaking-higher.md
      09_markschemes-writing-foundation.md
      10_markschemes-writing-higher.md
      11_markschemes-writing-overview.md
      12_markschemes-speaking-overview.md
      13_markschemes-listening-reading-overview.md

    overview/
      00_qualification-overview.md
      01_themes-and-topics.md
      02_assessment-objectives.md

    papers/
      03_paper-1-listening.md
      04_paper-2-speaking.md
      05_paper-3-reading.md
      06_paper-4-writing.md
      07_writing-task-breakdown.md
      08_speaking-task-breakdown.md
      09_listening-question-types.md
      10_reading-question-types.md

    system/
      block-templates.md
      course-map-design.md
      lesson-system-design.md
      lesson-templates.md
      module-core-high-frequency-vocab.md
      vocabulary-system-design.md

    vocabulary/
      13_vocab-high-frequency.md
      14_vocab-theme-1-identity-and-culture.md
      15_vocab-theme-2-local-area-holiday-travel.md
      16_vocab-theme-3-school.md
      17_vocab-theme-4-future-aspirations-study-work.md
      18_vocab-theme-5-international-global-dimension.md

supabase/
  .gitignore
  config.toml

  .temp/
    cli-latest
    gotrue-version
    pooler-url
    postgres-version
    project-ref
    rest-version
    storage-migration
    storage-version

  migrations/
    20260403211956_remote_schema.sql
    20260404100727_remote_schema.sql
    20260404104144_create_lesson_sections_and_blocks.sql
    20260406091833_create_lesson_section_progress.sql
    20260415191931_create_lesson_template_tables.sql
    20260418145812_add_avatar_key_to_profiles.sql.sql
    20260418154343_add_lesson_section_visibility_fields.sql.sql
    20260419120657_rename_lesson_section_visibility_to_variant_visibility.sql
    20260419220421_add_price_id_to_grants_and_subscriptions.sql
    20260420091747_seed_higher_upgrade_product_and_prices.sql.sql
    20260420110803_add_upgrade_source_price_id_to_prices.sql
    20260420110816_seed_source_aware_higher_upgrade_prices.sql
    20260420143656_expand_vocabulary_system.sql
    20260420212332_create_lesson_vocabulary_set_usages.sql
```

---

## Recent structure additions

### Marketing and platform route groups

- `src/app/(marketing)/`  
  Public marketing route group for marketing pages and auth entry points.
  During local/single-domain development, marketing pages live under
  `/marketing/*` so `/` can remain the app-facing landing page.

- `src/app/(platform)/`  
  Authenticated LMS route group for dashboard, courses, account, assignments,
  vocabulary, grammar, past papers, mock exams, and teacher workflows.

- `src/app/(platform)/account/billing/page.tsx`  
  Signed-in billing and Stripe checkout page. Public `/marketing/pricing`
  remains marketing-first and trial-focused until host-based routing maps
  marketing pages to `www.gcserussian.com`.

- `src/components/marketing/`  
  Marketing-only site chrome for public pages.

### Theme and appearance system

- `src/components/providers/theme-provider.tsx`  
  Global theme preference and resolved theme state

- `src/components/settings/theme-mode-selector.tsx`  
  Settings page appearance control

- `src/components/ui/theme-toggle.tsx`  
  Quick header theme override

---

### Component structure updates

- `src/components/admin/lesson-builder/add-block-composer/`  
  Focused block creation subcomponents and forms

- `src/components/admin/lesson-builder/block-editors/`  
  Focused block editor forms for text, media, slug, and vocabulary blocks

- `src/components/admin/lesson-builder/lesson-section-sidebar/`  
  Sidebar section creation, listing, template, and primitive helpers

- `src/components/lesson-blocks/structure-blocks.tsx`  
  Shared renderer components for structural lesson blocks such as headers,
  dividers, callouts, images, and audio

- `src/components/lesson-blocks/lesson-page-template/`  
  Step routing, progress, pager, tracker, and completion panel helpers

---

### Styles

Global styling is split into focused files under `src/styles/`:

- `tokens.css`
- `base.css`
- `typography.css`
- `buttons.css`
- `badges.css`
- `forms.css`
- `feedback.css`
- `surfaces.css`
- `dev-markers.css`

---

### UI documentation

- `docs/ui-system-guidelines.md`

- `docs/page-ui-private/`  
  Private UI Lab screenshots for light/dark visual reference

---

### Billing and pricing UI

Pricing UI has been split into dedicated components under:

- `src/components/billing/pricing/`

Supporting pricing helpers:

- `src/lib/billing/pricing-ui.ts`

---

### Lesson builder actions

Lesson builder server actions have been split into focused files:

- `admin-lesson-builder-actions.ts`
- `admin-lesson-builder-block-actions.ts`
- `admin-lesson-builder-section-actions.ts`
- `admin-lesson-builder-template-actions.ts` compatibility barrel
- `lesson-template-actions/` focused template action files
- `lesson-builder-block-actions/` focused block action files
- `admin-lesson-builder-shared.ts`

---

### Vocabulary usage sync

Vocabulary usage helpers now include:

- `src/lib/vocabulary/vocabulary-usage-sync.ts`

---

### Structure refactor notes

Newer feature domains should prefer focused folders over broad helper files:

- `src/lib/vocabulary/db.ts` is the implementation module behind the compatibility
  facade `src/lib/vocabulary/vocabulary-helpers-db.ts`.
- `src/lib/mock-exams/db.ts` is the implementation module behind the compatibility
  facade `src/lib/mock-exams/mock-exam-helpers-db.ts`.
- `src/lib/mock-exams/question-data/codecs.ts` owns mock exam question-data
  parsing and form serialization helpers.
- `src/lib/dashboard/learning-plan.ts` owns student learning-plan and dashboard
  next-step orchestration.
- `src/app/actions/admin/vocabulary/item-actions.ts` owns vocabulary item server
  actions. `src/app/actions/admin/admin-vocabulary-items-actions.ts` remains as
  a compatibility wrapper while older imports are migrated.
- `src/components/admin/vocabulary/items/` contains admin vocabulary item page UI
  extracted from the route loader.

Compatibility facades are allowed during refactors, but new imports should prefer
the domain folder path.

---

### Migration naming

Future Supabase migrations should use a single `.sql` suffix and a descriptive
timestamped name:

```text
YYYYMMDDHHMMSS_descriptive_change_name.sql
```

Historical migrations that have already been applied should not be renamed just
to fix naming drift. Existing `.sql.sql` files are treated as historical artifacts.
