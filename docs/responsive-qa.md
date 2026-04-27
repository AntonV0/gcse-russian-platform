# Responsive QA Notes

This document records the high-confidence responsive and authenticated QA checks
for the GCSE Russian Course Platform.

## Current Baseline

- Public marketing routes have been swept anonymously across mobile, tablet, and desktop viewport ranges.
- Authenticated platform routes have been swept in the in-app browser session.
- Admin can remain tablet/desktop-first, but routes should not be broken on mobile.
- The production build should be restarted after layout or data-loading changes before browser QA.

## Authenticated Routes To Recheck

Recheck these after changes to layout, navigation, vocabulary, questions, or lesson builder code:

- `/dashboard`
- `/courses`
- `/courses/gcse-russian`
- `/courses/gcse-russian/foundation`
- `/courses/gcse-russian/foundation/modules/introduction-to-the-course`
- `/question-sets/foundation-intro-russian-output-test`
- `/vocabulary`
- `/vocabulary/foundation-intro-starter-vocabulary`
- `/admin/vocabulary`
- `/admin/ui/lesson-builder`
- `/admin/content/courses/[courseId]/variants/[variantId]/modules/[moduleId]/lessons/[lessonId]`
- `/settings`

## Expected Signals

- Protected routes should remain signed in and should not redirect to `/login`.
- Page headings should render after navigation instead of staying on skeleton/loading shells.
- Browser console warnings/errors should remain empty for the sweep.
- Vocabulary list and detail pages should render real content for staff/admin users.
- The admin lesson builder should show lesson heading, content health, lesson content, editor, and inspector panels.

## Known Caveats

- The in-app authenticated browser verifies the real signed-in session, but it does not currently provide the same viewport matrix used for anonymous responsive sweeps.
- True signed-in mobile/tablet visual checks still require either manual browser resizing while signed in or a future authenticated Playwright setup.
- Admin authoring remains best on tablet or desktop; mobile should show usable, non-broken controls rather than becoming the primary authoring target.

## Regression Watch

- Staff/admin vocabulary pages use the server-side admin Supabase client after role checks to avoid expensive authenticated RLS paths through vocabulary summary views.
- Student/non-staff vocabulary access should continue to use the normal authenticated client and published-only filters.
- If `/vocabulary` or `/admin/vocabulary` shows only the shell/skeleton, recheck the vocabulary summary and theme-key data-loading paths first.
