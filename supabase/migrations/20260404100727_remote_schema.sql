drop extension if exists "pg_net";


  create table "public"."assignment_items" (
    "id" uuid not null default gen_random_uuid(),
    "assignment_id" uuid not null,
    "item_type" text not null,
    "lesson_id" uuid,
    "question_set_id" uuid,
    "custom_prompt" text,
    "position" integer not null default 0
      );


alter table "public"."assignment_items" enable row level security;


  create table "public"."assignment_submissions" (
    "id" uuid not null default gen_random_uuid(),
    "assignment_id" uuid not null,
    "student_user_id" uuid not null,
    "status" text not null default 'not_started'::text,
    "submitted_text" text,
    "submitted_at" timestamp with time zone,
    "mark" numeric(6,2),
    "feedback" text,
    "reviewed_by" uuid,
    "reviewed_at" timestamp with time zone,
    "submitted_file_path" text,
    "submitted_file_name" text
      );


alter table "public"."assignment_submissions" enable row level security;


  create table "public"."assignments" (
    "id" uuid not null default gen_random_uuid(),
    "group_id" uuid not null,
    "title" text not null,
    "instructions" text,
    "due_at" timestamp with time zone,
    "status" text not null default 'published'::text,
    "created_by" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "allow_file_upload" boolean not null default false
      );


alter table "public"."assignments" enable row level security;


  create table "public"."course_variants" (
    "id" uuid not null default gen_random_uuid(),
    "course_id" uuid not null,
    "slug" text not null,
    "title" text not null,
    "description" text,
    "position" integer not null default 0,
    "is_active" boolean not null default true,
    "is_published" boolean not null default false,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."course_variants" enable row level security;


  create table "public"."courses" (
    "id" uuid not null default gen_random_uuid(),
    "slug" text not null,
    "title" text not null,
    "description" text,
    "is_active" boolean not null default true,
    "is_published" boolean not null default false,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."courses" enable row level security;


  create table "public"."lesson_progress" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "course_slug" text not null,
    "module_slug" text not null,
    "lesson_slug" text not null,
    "completed" boolean not null default false,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "variant_slug" text not null default 'foundation'::text
      );


alter table "public"."lesson_progress" enable row level security;


  create table "public"."lesson_question_sets" (
    "lesson_id" uuid not null,
    "question_set_id" uuid not null,
    "position" integer not null default 0
      );


alter table "public"."lesson_question_sets" enable row level security;


  create table "public"."lessons" (
    "id" uuid not null default gen_random_uuid(),
    "module_id" uuid not null,
    "slug" text not null,
    "title" text not null,
    "summary" text,
    "lesson_type" text not null default 'standard'::text,
    "position" integer not null,
    "estimated_minutes" integer,
    "is_published" boolean not null default false,
    "is_trial_visible" boolean not null default false,
    "requires_paid_access" boolean not null default false,
    "available_in_volna" boolean not null default true,
    "content_source" text not null default 'code'::text,
    "content_key" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."lessons" enable row level security;


  create table "public"."modules" (
    "id" uuid not null default gen_random_uuid(),
    "course_variant_id" uuid not null,
    "slug" text not null,
    "title" text not null,
    "description" text,
    "position" integer not null,
    "is_published" boolean not null default false,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."modules" enable row level security;


  create table "public"."prices" (
    "id" uuid not null default gen_random_uuid(),
    "product_id" uuid not null,
    "billing_type" text not null,
    "interval_unit" text,
    "interval_count" integer,
    "amount_gbp" integer not null,
    "stripe_price_id" text,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."prices" enable row level security;


  create table "public"."products" (
    "id" uuid not null default gen_random_uuid(),
    "code" text not null,
    "name" text not null,
    "product_type" text not null,
    "course_id" uuid,
    "course_variant_id" uuid,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."products" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null,
    "full_name" text,
    "role" text not null default 'student'::text,
    "created_at" timestamp with time zone not null default now(),
    "display_name" text,
    "email" text,
    "is_admin" boolean not null default false,
    "is_teacher" boolean not null default false
      );


alter table "public"."profiles" enable row level security;


  create table "public"."question_accepted_answers" (
    "id" uuid not null default gen_random_uuid(),
    "question_id" uuid not null,
    "answer_text" text not null,
    "normalized_answer" text,
    "is_primary" boolean not null default false,
    "case_sensitive" boolean not null default false,
    "notes" text
      );


alter table "public"."question_accepted_answers" enable row level security;


  create table "public"."question_attempts" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "question_id" uuid not null,
    "lesson_id" uuid,
    "submitted_text" text,
    "submitted_payload" jsonb,
    "is_correct" boolean,
    "awarded_marks" numeric(6,2),
    "feedback" text,
    "submitted_at" timestamp with time zone not null default now()
      );


alter table "public"."question_attempts" enable row level security;


  create table "public"."question_options" (
    "id" uuid not null default gen_random_uuid(),
    "question_id" uuid not null,
    "option_text" text,
    "option_rich" jsonb,
    "is_correct" boolean,
    "match_group" text,
    "position" integer not null
      );


alter table "public"."question_options" enable row level security;


  create table "public"."question_progress" (
    "user_id" uuid not null,
    "question_id" uuid not null,
    "total_attempts" integer not null default 0,
    "correct_attempts" integer not null default 0,
    "best_score" numeric(6,2),
    "last_score" numeric(6,2),
    "first_answered_at" timestamp with time zone,
    "last_answered_at" timestamp with time zone
      );


alter table "public"."question_progress" enable row level security;


  create table "public"."question_sets" (
    "id" uuid not null default gen_random_uuid(),
    "slug" text,
    "title" text not null,
    "description" text,
    "instructions" text,
    "source_type" text not null default 'lesson'::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "is_template" boolean not null default false,
    "template_type" text
      );


alter table "public"."question_sets" enable row level security;


  create table "public"."questions" (
    "id" uuid not null default gen_random_uuid(),
    "question_set_id" uuid not null,
    "question_type" text not null,
    "prompt" text not null,
    "prompt_rich" jsonb,
    "explanation" text,
    "difficulty" smallint,
    "marks" numeric(6,2) not null default 1,
    "audio_path" text,
    "image_path" text,
    "metadata" jsonb not null default '{}'::jsonb,
    "position" integer not null,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."questions" enable row level security;


  create table "public"."subscriptions" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "product_id" uuid not null,
    "provider" text not null default 'stripe'::text,
    "provider_customer_id" text,
    "provider_subscription_id" text,
    "status" text not null,
    "current_period_start" timestamp with time zone,
    "current_period_end" timestamp with time zone,
    "cancel_at_period_end" boolean not null default false,
    "canceled_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."subscriptions" enable row level security;


  create table "public"."teaching_group_members" (
    "group_id" uuid not null,
    "user_id" uuid not null,
    "member_role" text not null default 'student'::text,
    "joined_at" timestamp with time zone not null default now()
      );


alter table "public"."teaching_group_members" enable row level security;


  create table "public"."teaching_groups" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "course_id" uuid,
    "course_variant_id" uuid,
    "academic_year" text,
    "is_active" boolean not null default true,
    "created_by" uuid,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."teaching_groups" enable row level security;


  create table "public"."user_access_grants" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "product_id" uuid not null,
    "access_mode" text not null,
    "source" text not null,
    "starts_at" timestamp with time zone,
    "ends_at" timestamp with time zone,
    "is_active" boolean not null default true,
    "granted_by" uuid,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."user_access_grants" enable row level security;


  create table "public"."user_course_access" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "course_slug" text not null,
    "created_at" timestamp with time zone not null default now(),
    "course_variant" text not null default 'default'::text,
    "access_mode" text not null default 'trial'::text
      );


alter table "public"."user_course_access" enable row level security;


  create table "public"."vocabulary_items" (
    "id" uuid not null default gen_random_uuid(),
    "vocabulary_set_id" uuid not null,
    "russian" text not null,
    "english" text not null,
    "transliteration" text,
    "example_ru" text,
    "example_en" text,
    "audio_path" text,
    "notes" text,
    "position" integer not null default 0,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."vocabulary_items" enable row level security;


  create table "public"."vocabulary_sets" (
    "id" uuid not null default gen_random_uuid(),
    "slug" text,
    "title" text not null,
    "description" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."vocabulary_sets" enable row level security;

CREATE UNIQUE INDEX assignment_items_pkey ON public.assignment_items USING btree (id);

CREATE UNIQUE INDEX assignment_submissions_assignment_id_student_user_id_key ON public.assignment_submissions USING btree (assignment_id, student_user_id);

CREATE UNIQUE INDEX assignment_submissions_pkey ON public.assignment_submissions USING btree (id);

CREATE UNIQUE INDEX assignments_pkey ON public.assignments USING btree (id);

CREATE UNIQUE INDEX course_variants_course_id_position_key ON public.course_variants USING btree (course_id, "position");

CREATE UNIQUE INDEX course_variants_course_id_slug_key ON public.course_variants USING btree (course_id, slug);

CREATE UNIQUE INDEX course_variants_pkey ON public.course_variants USING btree (id);

CREATE UNIQUE INDEX courses_pkey ON public.courses USING btree (id);

CREATE UNIQUE INDEX courses_slug_key ON public.courses USING btree (slug);

CREATE UNIQUE INDEX lesson_progress_pkey ON public.lesson_progress USING btree (id);

CREATE UNIQUE INDEX lesson_progress_unique ON public.lesson_progress USING btree (user_id, course_slug, variant_slug, module_slug, lesson_slug);

CREATE UNIQUE INDEX lesson_progress_unique_idx ON public.lesson_progress USING btree (user_id, course_slug, variant_slug, module_slug, lesson_slug);

CREATE UNIQUE INDEX lesson_question_sets_pkey ON public.lesson_question_sets USING btree (lesson_id, question_set_id);

CREATE UNIQUE INDEX lessons_module_id_position_key ON public.lessons USING btree (module_id, "position");

CREATE UNIQUE INDEX lessons_module_id_slug_key ON public.lessons USING btree (module_id, slug);

CREATE UNIQUE INDEX lessons_pkey ON public.lessons USING btree (id);

CREATE UNIQUE INDEX modules_course_variant_id_position_key ON public.modules USING btree (course_variant_id, "position");

CREATE UNIQUE INDEX modules_course_variant_id_slug_key ON public.modules USING btree (course_variant_id, slug);

CREATE UNIQUE INDEX modules_pkey ON public.modules USING btree (id);

CREATE UNIQUE INDEX prices_pkey ON public.prices USING btree (id);

CREATE UNIQUE INDEX products_code_key ON public.products USING btree (code);

CREATE UNIQUE INDEX products_pkey ON public.products USING btree (id);

CREATE UNIQUE INDEX profiles_email_unique_idx ON public.profiles USING btree (email) WHERE (email IS NOT NULL);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX question_accepted_answers_pkey ON public.question_accepted_answers USING btree (id);

CREATE UNIQUE INDEX question_attempts_pkey ON public.question_attempts USING btree (id);

CREATE UNIQUE INDEX question_options_pkey ON public.question_options USING btree (id);

CREATE UNIQUE INDEX question_progress_pkey ON public.question_progress USING btree (user_id, question_id);

CREATE UNIQUE INDEX question_sets_pkey ON public.question_sets USING btree (id);

CREATE UNIQUE INDEX question_sets_slug_key ON public.question_sets USING btree (slug);

CREATE UNIQUE INDEX questions_pkey ON public.questions USING btree (id);

CREATE UNIQUE INDEX questions_question_set_id_position_key ON public.questions USING btree (question_set_id, "position");

CREATE UNIQUE INDEX subscriptions_pkey ON public.subscriptions USING btree (id);

CREATE UNIQUE INDEX teaching_group_members_pkey ON public.teaching_group_members USING btree (group_id, user_id);

CREATE UNIQUE INDEX teaching_groups_pkey ON public.teaching_groups USING btree (id);

CREATE UNIQUE INDEX user_access_grants_pkey ON public.user_access_grants USING btree (id);

CREATE UNIQUE INDEX user_course_access_pkey ON public.user_course_access USING btree (id);

CREATE UNIQUE INDEX user_course_access_unique ON public.user_course_access USING btree (user_id, course_slug, course_variant);

CREATE UNIQUE INDEX vocabulary_items_pkey ON public.vocabulary_items USING btree (id);

CREATE UNIQUE INDEX vocabulary_sets_pkey ON public.vocabulary_sets USING btree (id);

CREATE UNIQUE INDEX vocabulary_sets_slug_key ON public.vocabulary_sets USING btree (slug);

alter table "public"."assignment_items" add constraint "assignment_items_pkey" PRIMARY KEY using index "assignment_items_pkey";

alter table "public"."assignment_submissions" add constraint "assignment_submissions_pkey" PRIMARY KEY using index "assignment_submissions_pkey";

alter table "public"."assignments" add constraint "assignments_pkey" PRIMARY KEY using index "assignments_pkey";

alter table "public"."course_variants" add constraint "course_variants_pkey" PRIMARY KEY using index "course_variants_pkey";

alter table "public"."courses" add constraint "courses_pkey" PRIMARY KEY using index "courses_pkey";

alter table "public"."lesson_progress" add constraint "lesson_progress_pkey" PRIMARY KEY using index "lesson_progress_pkey";

alter table "public"."lesson_question_sets" add constraint "lesson_question_sets_pkey" PRIMARY KEY using index "lesson_question_sets_pkey";

alter table "public"."lessons" add constraint "lessons_pkey" PRIMARY KEY using index "lessons_pkey";

alter table "public"."modules" add constraint "modules_pkey" PRIMARY KEY using index "modules_pkey";

alter table "public"."prices" add constraint "prices_pkey" PRIMARY KEY using index "prices_pkey";

alter table "public"."products" add constraint "products_pkey" PRIMARY KEY using index "products_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."question_accepted_answers" add constraint "question_accepted_answers_pkey" PRIMARY KEY using index "question_accepted_answers_pkey";

alter table "public"."question_attempts" add constraint "question_attempts_pkey" PRIMARY KEY using index "question_attempts_pkey";

alter table "public"."question_options" add constraint "question_options_pkey" PRIMARY KEY using index "question_options_pkey";

alter table "public"."question_progress" add constraint "question_progress_pkey" PRIMARY KEY using index "question_progress_pkey";

alter table "public"."question_sets" add constraint "question_sets_pkey" PRIMARY KEY using index "question_sets_pkey";

alter table "public"."questions" add constraint "questions_pkey" PRIMARY KEY using index "questions_pkey";

alter table "public"."subscriptions" add constraint "subscriptions_pkey" PRIMARY KEY using index "subscriptions_pkey";

alter table "public"."teaching_group_members" add constraint "teaching_group_members_pkey" PRIMARY KEY using index "teaching_group_members_pkey";

alter table "public"."teaching_groups" add constraint "teaching_groups_pkey" PRIMARY KEY using index "teaching_groups_pkey";

alter table "public"."user_access_grants" add constraint "user_access_grants_pkey" PRIMARY KEY using index "user_access_grants_pkey";

alter table "public"."user_course_access" add constraint "user_course_access_pkey" PRIMARY KEY using index "user_course_access_pkey";

alter table "public"."vocabulary_items" add constraint "vocabulary_items_pkey" PRIMARY KEY using index "vocabulary_items_pkey";

alter table "public"."vocabulary_sets" add constraint "vocabulary_sets_pkey" PRIMARY KEY using index "vocabulary_sets_pkey";

alter table "public"."assignment_items" add constraint "assignment_items_assignment_id_fkey" FOREIGN KEY (assignment_id) REFERENCES public.assignments(id) ON DELETE CASCADE not valid;

alter table "public"."assignment_items" validate constraint "assignment_items_assignment_id_fkey";

alter table "public"."assignment_items" add constraint "assignment_items_lesson_id_fkey" FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE SET NULL not valid;

alter table "public"."assignment_items" validate constraint "assignment_items_lesson_id_fkey";

alter table "public"."assignment_items" add constraint "assignment_items_question_set_id_fkey" FOREIGN KEY (question_set_id) REFERENCES public.question_sets(id) ON DELETE SET NULL not valid;

alter table "public"."assignment_items" validate constraint "assignment_items_question_set_id_fkey";

alter table "public"."assignment_submissions" add constraint "assignment_submissions_assignment_id_fkey" FOREIGN KEY (assignment_id) REFERENCES public.assignments(id) ON DELETE CASCADE not valid;

alter table "public"."assignment_submissions" validate constraint "assignment_submissions_assignment_id_fkey";

alter table "public"."assignment_submissions" add constraint "assignment_submissions_assignment_id_student_user_id_key" UNIQUE using index "assignment_submissions_assignment_id_student_user_id_key";

alter table "public"."assignment_submissions" add constraint "assignment_submissions_reviewed_by_fkey" FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."assignment_submissions" validate constraint "assignment_submissions_reviewed_by_fkey";

alter table "public"."assignment_submissions" add constraint "assignment_submissions_student_user_id_fkey" FOREIGN KEY (student_user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."assignment_submissions" validate constraint "assignment_submissions_student_user_id_fkey";

alter table "public"."assignments" add constraint "assignments_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE RESTRICT not valid;

alter table "public"."assignments" validate constraint "assignments_created_by_fkey";

alter table "public"."assignments" add constraint "assignments_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public.teaching_groups(id) ON DELETE CASCADE not valid;

alter table "public"."assignments" validate constraint "assignments_group_id_fkey";

alter table "public"."course_variants" add constraint "course_variants_course_id_fkey" FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE not valid;

alter table "public"."course_variants" validate constraint "course_variants_course_id_fkey";

alter table "public"."course_variants" add constraint "course_variants_course_id_position_key" UNIQUE using index "course_variants_course_id_position_key";

alter table "public"."course_variants" add constraint "course_variants_course_id_slug_key" UNIQUE using index "course_variants_course_id_slug_key";

alter table "public"."courses" add constraint "courses_slug_key" UNIQUE using index "courses_slug_key";

alter table "public"."lesson_progress" add constraint "lesson_progress_unique" UNIQUE using index "lesson_progress_unique";

alter table "public"."lesson_progress" add constraint "lesson_progress_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."lesson_progress" validate constraint "lesson_progress_user_id_fkey";

alter table "public"."lesson_question_sets" add constraint "lesson_question_sets_lesson_id_fkey" FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE not valid;

alter table "public"."lesson_question_sets" validate constraint "lesson_question_sets_lesson_id_fkey";

alter table "public"."lesson_question_sets" add constraint "lesson_question_sets_question_set_id_fkey" FOREIGN KEY (question_set_id) REFERENCES public.question_sets(id) ON DELETE CASCADE not valid;

alter table "public"."lesson_question_sets" validate constraint "lesson_question_sets_question_set_id_fkey";

alter table "public"."lessons" add constraint "lessons_module_id_fkey" FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE not valid;

alter table "public"."lessons" validate constraint "lessons_module_id_fkey";

alter table "public"."lessons" add constraint "lessons_module_id_position_key" UNIQUE using index "lessons_module_id_position_key";

alter table "public"."lessons" add constraint "lessons_module_id_slug_key" UNIQUE using index "lessons_module_id_slug_key";

alter table "public"."modules" add constraint "modules_course_variant_id_fkey" FOREIGN KEY (course_variant_id) REFERENCES public.course_variants(id) ON DELETE CASCADE not valid;

alter table "public"."modules" validate constraint "modules_course_variant_id_fkey";

alter table "public"."modules" add constraint "modules_course_variant_id_position_key" UNIQUE using index "modules_course_variant_id_position_key";

alter table "public"."modules" add constraint "modules_course_variant_id_slug_key" UNIQUE using index "modules_course_variant_id_slug_key";

alter table "public"."prices" add constraint "prices_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."prices" validate constraint "prices_product_id_fkey";

alter table "public"."products" add constraint "products_code_key" UNIQUE using index "products_code_key";

alter table "public"."products" add constraint "products_course_id_fkey" FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE SET NULL not valid;

alter table "public"."products" validate constraint "products_course_id_fkey";

alter table "public"."products" add constraint "products_course_variant_id_fkey" FOREIGN KEY (course_variant_id) REFERENCES public.course_variants(id) ON DELETE SET NULL not valid;

alter table "public"."products" validate constraint "products_course_variant_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."question_accepted_answers" add constraint "question_accepted_answers_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE not valid;

alter table "public"."question_accepted_answers" validate constraint "question_accepted_answers_question_id_fkey";

alter table "public"."question_attempts" add constraint "question_attempts_lesson_id_fkey" FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE SET NULL not valid;

alter table "public"."question_attempts" validate constraint "question_attempts_lesson_id_fkey";

alter table "public"."question_attempts" add constraint "question_attempts_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE not valid;

alter table "public"."question_attempts" validate constraint "question_attempts_question_id_fkey";

alter table "public"."question_attempts" add constraint "question_attempts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."question_attempts" validate constraint "question_attempts_user_id_fkey";

alter table "public"."question_options" add constraint "question_options_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE not valid;

alter table "public"."question_options" validate constraint "question_options_question_id_fkey";

alter table "public"."question_progress" add constraint "question_progress_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE not valid;

alter table "public"."question_progress" validate constraint "question_progress_question_id_fkey";

alter table "public"."question_progress" add constraint "question_progress_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."question_progress" validate constraint "question_progress_user_id_fkey";

alter table "public"."question_sets" add constraint "question_sets_slug_key" UNIQUE using index "question_sets_slug_key";

alter table "public"."questions" add constraint "questions_question_set_id_fkey" FOREIGN KEY (question_set_id) REFERENCES public.question_sets(id) ON DELETE CASCADE not valid;

alter table "public"."questions" validate constraint "questions_question_set_id_fkey";

alter table "public"."questions" add constraint "questions_question_set_id_position_key" UNIQUE using index "questions_question_set_id_position_key";

alter table "public"."subscriptions" add constraint "subscriptions_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_product_id_fkey";

alter table "public"."subscriptions" add constraint "subscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_user_id_fkey";

alter table "public"."teaching_group_members" add constraint "teaching_group_members_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public.teaching_groups(id) ON DELETE CASCADE not valid;

alter table "public"."teaching_group_members" validate constraint "teaching_group_members_group_id_fkey";

alter table "public"."teaching_group_members" add constraint "teaching_group_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."teaching_group_members" validate constraint "teaching_group_members_user_id_fkey";

alter table "public"."teaching_groups" add constraint "teaching_groups_course_id_fkey" FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE SET NULL not valid;

alter table "public"."teaching_groups" validate constraint "teaching_groups_course_id_fkey";

alter table "public"."teaching_groups" add constraint "teaching_groups_course_variant_id_fkey" FOREIGN KEY (course_variant_id) REFERENCES public.course_variants(id) ON DELETE SET NULL not valid;

alter table "public"."teaching_groups" validate constraint "teaching_groups_course_variant_id_fkey";

alter table "public"."teaching_groups" add constraint "teaching_groups_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."teaching_groups" validate constraint "teaching_groups_created_by_fkey";

alter table "public"."user_access_grants" add constraint "user_access_grants_granted_by_fkey" FOREIGN KEY (granted_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."user_access_grants" validate constraint "user_access_grants_granted_by_fkey";

alter table "public"."user_access_grants" add constraint "user_access_grants_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."user_access_grants" validate constraint "user_access_grants_product_id_fkey";

alter table "public"."user_access_grants" add constraint "user_access_grants_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."user_access_grants" validate constraint "user_access_grants_user_id_fkey";

alter table "public"."user_course_access" add constraint "user_course_access_unique" UNIQUE using index "user_course_access_unique";

alter table "public"."user_course_access" add constraint "user_course_access_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_course_access" validate constraint "user_course_access_user_id_fkey";

alter table "public"."vocabulary_items" add constraint "vocabulary_items_vocabulary_set_id_fkey" FOREIGN KEY (vocabulary_set_id) REFERENCES public.vocabulary_sets(id) ON DELETE CASCADE not valid;

alter table "public"."vocabulary_items" validate constraint "vocabulary_items_vocabulary_set_id_fkey";

alter table "public"."vocabulary_sets" add constraint "vocabulary_sets_slug_key" UNIQUE using index "vocabulary_sets_slug_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_current_user_admin()
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and is_admin = true
  );
$function$
;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$
;

grant delete on table "public"."assignment_items" to "anon";

grant insert on table "public"."assignment_items" to "anon";

grant references on table "public"."assignment_items" to "anon";

grant select on table "public"."assignment_items" to "anon";

grant trigger on table "public"."assignment_items" to "anon";

grant truncate on table "public"."assignment_items" to "anon";

grant update on table "public"."assignment_items" to "anon";

grant delete on table "public"."assignment_items" to "authenticated";

grant insert on table "public"."assignment_items" to "authenticated";

grant references on table "public"."assignment_items" to "authenticated";

grant select on table "public"."assignment_items" to "authenticated";

grant trigger on table "public"."assignment_items" to "authenticated";

grant truncate on table "public"."assignment_items" to "authenticated";

grant update on table "public"."assignment_items" to "authenticated";

grant delete on table "public"."assignment_items" to "service_role";

grant insert on table "public"."assignment_items" to "service_role";

grant references on table "public"."assignment_items" to "service_role";

grant select on table "public"."assignment_items" to "service_role";

grant trigger on table "public"."assignment_items" to "service_role";

grant truncate on table "public"."assignment_items" to "service_role";

grant update on table "public"."assignment_items" to "service_role";

grant delete on table "public"."assignment_submissions" to "anon";

grant insert on table "public"."assignment_submissions" to "anon";

grant references on table "public"."assignment_submissions" to "anon";

grant select on table "public"."assignment_submissions" to "anon";

grant trigger on table "public"."assignment_submissions" to "anon";

grant truncate on table "public"."assignment_submissions" to "anon";

grant update on table "public"."assignment_submissions" to "anon";

grant delete on table "public"."assignment_submissions" to "authenticated";

grant insert on table "public"."assignment_submissions" to "authenticated";

grant references on table "public"."assignment_submissions" to "authenticated";

grant select on table "public"."assignment_submissions" to "authenticated";

grant trigger on table "public"."assignment_submissions" to "authenticated";

grant truncate on table "public"."assignment_submissions" to "authenticated";

grant update on table "public"."assignment_submissions" to "authenticated";

grant delete on table "public"."assignment_submissions" to "service_role";

grant insert on table "public"."assignment_submissions" to "service_role";

grant references on table "public"."assignment_submissions" to "service_role";

grant select on table "public"."assignment_submissions" to "service_role";

grant trigger on table "public"."assignment_submissions" to "service_role";

grant truncate on table "public"."assignment_submissions" to "service_role";

grant update on table "public"."assignment_submissions" to "service_role";

grant delete on table "public"."assignments" to "anon";

grant insert on table "public"."assignments" to "anon";

grant references on table "public"."assignments" to "anon";

grant select on table "public"."assignments" to "anon";

grant trigger on table "public"."assignments" to "anon";

grant truncate on table "public"."assignments" to "anon";

grant update on table "public"."assignments" to "anon";

grant delete on table "public"."assignments" to "authenticated";

grant insert on table "public"."assignments" to "authenticated";

grant references on table "public"."assignments" to "authenticated";

grant select on table "public"."assignments" to "authenticated";

grant trigger on table "public"."assignments" to "authenticated";

grant truncate on table "public"."assignments" to "authenticated";

grant update on table "public"."assignments" to "authenticated";

grant delete on table "public"."assignments" to "service_role";

grant insert on table "public"."assignments" to "service_role";

grant references on table "public"."assignments" to "service_role";

grant select on table "public"."assignments" to "service_role";

grant trigger on table "public"."assignments" to "service_role";

grant truncate on table "public"."assignments" to "service_role";

grant update on table "public"."assignments" to "service_role";

grant delete on table "public"."course_variants" to "anon";

grant insert on table "public"."course_variants" to "anon";

grant references on table "public"."course_variants" to "anon";

grant select on table "public"."course_variants" to "anon";

grant trigger on table "public"."course_variants" to "anon";

grant truncate on table "public"."course_variants" to "anon";

grant update on table "public"."course_variants" to "anon";

grant delete on table "public"."course_variants" to "authenticated";

grant insert on table "public"."course_variants" to "authenticated";

grant references on table "public"."course_variants" to "authenticated";

grant select on table "public"."course_variants" to "authenticated";

grant trigger on table "public"."course_variants" to "authenticated";

grant truncate on table "public"."course_variants" to "authenticated";

grant update on table "public"."course_variants" to "authenticated";

grant delete on table "public"."course_variants" to "service_role";

grant insert on table "public"."course_variants" to "service_role";

grant references on table "public"."course_variants" to "service_role";

grant select on table "public"."course_variants" to "service_role";

grant trigger on table "public"."course_variants" to "service_role";

grant truncate on table "public"."course_variants" to "service_role";

grant update on table "public"."course_variants" to "service_role";

grant delete on table "public"."courses" to "anon";

grant insert on table "public"."courses" to "anon";

grant references on table "public"."courses" to "anon";

grant select on table "public"."courses" to "anon";

grant trigger on table "public"."courses" to "anon";

grant truncate on table "public"."courses" to "anon";

grant update on table "public"."courses" to "anon";

grant delete on table "public"."courses" to "authenticated";

grant insert on table "public"."courses" to "authenticated";

grant references on table "public"."courses" to "authenticated";

grant select on table "public"."courses" to "authenticated";

grant trigger on table "public"."courses" to "authenticated";

grant truncate on table "public"."courses" to "authenticated";

grant update on table "public"."courses" to "authenticated";

grant delete on table "public"."courses" to "service_role";

grant insert on table "public"."courses" to "service_role";

grant references on table "public"."courses" to "service_role";

grant select on table "public"."courses" to "service_role";

grant trigger on table "public"."courses" to "service_role";

grant truncate on table "public"."courses" to "service_role";

grant update on table "public"."courses" to "service_role";

grant delete on table "public"."lesson_progress" to "anon";

grant insert on table "public"."lesson_progress" to "anon";

grant references on table "public"."lesson_progress" to "anon";

grant select on table "public"."lesson_progress" to "anon";

grant trigger on table "public"."lesson_progress" to "anon";

grant truncate on table "public"."lesson_progress" to "anon";

grant update on table "public"."lesson_progress" to "anon";

grant delete on table "public"."lesson_progress" to "authenticated";

grant insert on table "public"."lesson_progress" to "authenticated";

grant references on table "public"."lesson_progress" to "authenticated";

grant select on table "public"."lesson_progress" to "authenticated";

grant trigger on table "public"."lesson_progress" to "authenticated";

grant truncate on table "public"."lesson_progress" to "authenticated";

grant update on table "public"."lesson_progress" to "authenticated";

grant delete on table "public"."lesson_progress" to "service_role";

grant insert on table "public"."lesson_progress" to "service_role";

grant references on table "public"."lesson_progress" to "service_role";

grant select on table "public"."lesson_progress" to "service_role";

grant trigger on table "public"."lesson_progress" to "service_role";

grant truncate on table "public"."lesson_progress" to "service_role";

grant update on table "public"."lesson_progress" to "service_role";

grant delete on table "public"."lesson_question_sets" to "anon";

grant insert on table "public"."lesson_question_sets" to "anon";

grant references on table "public"."lesson_question_sets" to "anon";

grant select on table "public"."lesson_question_sets" to "anon";

grant trigger on table "public"."lesson_question_sets" to "anon";

grant truncate on table "public"."lesson_question_sets" to "anon";

grant update on table "public"."lesson_question_sets" to "anon";

grant delete on table "public"."lesson_question_sets" to "authenticated";

grant insert on table "public"."lesson_question_sets" to "authenticated";

grant references on table "public"."lesson_question_sets" to "authenticated";

grant select on table "public"."lesson_question_sets" to "authenticated";

grant trigger on table "public"."lesson_question_sets" to "authenticated";

grant truncate on table "public"."lesson_question_sets" to "authenticated";

grant update on table "public"."lesson_question_sets" to "authenticated";

grant delete on table "public"."lesson_question_sets" to "service_role";

grant insert on table "public"."lesson_question_sets" to "service_role";

grant references on table "public"."lesson_question_sets" to "service_role";

grant select on table "public"."lesson_question_sets" to "service_role";

grant trigger on table "public"."lesson_question_sets" to "service_role";

grant truncate on table "public"."lesson_question_sets" to "service_role";

grant update on table "public"."lesson_question_sets" to "service_role";

grant delete on table "public"."lessons" to "anon";

grant insert on table "public"."lessons" to "anon";

grant references on table "public"."lessons" to "anon";

grant select on table "public"."lessons" to "anon";

grant trigger on table "public"."lessons" to "anon";

grant truncate on table "public"."lessons" to "anon";

grant update on table "public"."lessons" to "anon";

grant delete on table "public"."lessons" to "authenticated";

grant insert on table "public"."lessons" to "authenticated";

grant references on table "public"."lessons" to "authenticated";

grant select on table "public"."lessons" to "authenticated";

grant trigger on table "public"."lessons" to "authenticated";

grant truncate on table "public"."lessons" to "authenticated";

grant update on table "public"."lessons" to "authenticated";

grant delete on table "public"."lessons" to "service_role";

grant insert on table "public"."lessons" to "service_role";

grant references on table "public"."lessons" to "service_role";

grant select on table "public"."lessons" to "service_role";

grant trigger on table "public"."lessons" to "service_role";

grant truncate on table "public"."lessons" to "service_role";

grant update on table "public"."lessons" to "service_role";

grant delete on table "public"."modules" to "anon";

grant insert on table "public"."modules" to "anon";

grant references on table "public"."modules" to "anon";

grant select on table "public"."modules" to "anon";

grant trigger on table "public"."modules" to "anon";

grant truncate on table "public"."modules" to "anon";

grant update on table "public"."modules" to "anon";

grant delete on table "public"."modules" to "authenticated";

grant insert on table "public"."modules" to "authenticated";

grant references on table "public"."modules" to "authenticated";

grant select on table "public"."modules" to "authenticated";

grant trigger on table "public"."modules" to "authenticated";

grant truncate on table "public"."modules" to "authenticated";

grant update on table "public"."modules" to "authenticated";

grant delete on table "public"."modules" to "service_role";

grant insert on table "public"."modules" to "service_role";

grant references on table "public"."modules" to "service_role";

grant select on table "public"."modules" to "service_role";

grant trigger on table "public"."modules" to "service_role";

grant truncate on table "public"."modules" to "service_role";

grant update on table "public"."modules" to "service_role";

grant delete on table "public"."prices" to "anon";

grant insert on table "public"."prices" to "anon";

grant references on table "public"."prices" to "anon";

grant select on table "public"."prices" to "anon";

grant trigger on table "public"."prices" to "anon";

grant truncate on table "public"."prices" to "anon";

grant update on table "public"."prices" to "anon";

grant delete on table "public"."prices" to "authenticated";

grant insert on table "public"."prices" to "authenticated";

grant references on table "public"."prices" to "authenticated";

grant select on table "public"."prices" to "authenticated";

grant trigger on table "public"."prices" to "authenticated";

grant truncate on table "public"."prices" to "authenticated";

grant update on table "public"."prices" to "authenticated";

grant delete on table "public"."prices" to "service_role";

grant insert on table "public"."prices" to "service_role";

grant references on table "public"."prices" to "service_role";

grant select on table "public"."prices" to "service_role";

grant trigger on table "public"."prices" to "service_role";

grant truncate on table "public"."prices" to "service_role";

grant update on table "public"."prices" to "service_role";

grant delete on table "public"."products" to "anon";

grant insert on table "public"."products" to "anon";

grant references on table "public"."products" to "anon";

grant select on table "public"."products" to "anon";

grant trigger on table "public"."products" to "anon";

grant truncate on table "public"."products" to "anon";

grant update on table "public"."products" to "anon";

grant delete on table "public"."products" to "authenticated";

grant insert on table "public"."products" to "authenticated";

grant references on table "public"."products" to "authenticated";

grant select on table "public"."products" to "authenticated";

grant trigger on table "public"."products" to "authenticated";

grant truncate on table "public"."products" to "authenticated";

grant update on table "public"."products" to "authenticated";

grant delete on table "public"."products" to "service_role";

grant insert on table "public"."products" to "service_role";

grant references on table "public"."products" to "service_role";

grant select on table "public"."products" to "service_role";

grant trigger on table "public"."products" to "service_role";

grant truncate on table "public"."products" to "service_role";

grant update on table "public"."products" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."question_accepted_answers" to "anon";

grant insert on table "public"."question_accepted_answers" to "anon";

grant references on table "public"."question_accepted_answers" to "anon";

grant select on table "public"."question_accepted_answers" to "anon";

grant trigger on table "public"."question_accepted_answers" to "anon";

grant truncate on table "public"."question_accepted_answers" to "anon";

grant update on table "public"."question_accepted_answers" to "anon";

grant delete on table "public"."question_accepted_answers" to "authenticated";

grant insert on table "public"."question_accepted_answers" to "authenticated";

grant references on table "public"."question_accepted_answers" to "authenticated";

grant select on table "public"."question_accepted_answers" to "authenticated";

grant trigger on table "public"."question_accepted_answers" to "authenticated";

grant truncate on table "public"."question_accepted_answers" to "authenticated";

grant update on table "public"."question_accepted_answers" to "authenticated";

grant delete on table "public"."question_accepted_answers" to "service_role";

grant insert on table "public"."question_accepted_answers" to "service_role";

grant references on table "public"."question_accepted_answers" to "service_role";

grant select on table "public"."question_accepted_answers" to "service_role";

grant trigger on table "public"."question_accepted_answers" to "service_role";

grant truncate on table "public"."question_accepted_answers" to "service_role";

grant update on table "public"."question_accepted_answers" to "service_role";

grant delete on table "public"."question_attempts" to "anon";

grant insert on table "public"."question_attempts" to "anon";

grant references on table "public"."question_attempts" to "anon";

grant select on table "public"."question_attempts" to "anon";

grant trigger on table "public"."question_attempts" to "anon";

grant truncate on table "public"."question_attempts" to "anon";

grant update on table "public"."question_attempts" to "anon";

grant delete on table "public"."question_attempts" to "authenticated";

grant insert on table "public"."question_attempts" to "authenticated";

grant references on table "public"."question_attempts" to "authenticated";

grant select on table "public"."question_attempts" to "authenticated";

grant trigger on table "public"."question_attempts" to "authenticated";

grant truncate on table "public"."question_attempts" to "authenticated";

grant update on table "public"."question_attempts" to "authenticated";

grant delete on table "public"."question_attempts" to "service_role";

grant insert on table "public"."question_attempts" to "service_role";

grant references on table "public"."question_attempts" to "service_role";

grant select on table "public"."question_attempts" to "service_role";

grant trigger on table "public"."question_attempts" to "service_role";

grant truncate on table "public"."question_attempts" to "service_role";

grant update on table "public"."question_attempts" to "service_role";

grant delete on table "public"."question_options" to "anon";

grant insert on table "public"."question_options" to "anon";

grant references on table "public"."question_options" to "anon";

grant select on table "public"."question_options" to "anon";

grant trigger on table "public"."question_options" to "anon";

grant truncate on table "public"."question_options" to "anon";

grant update on table "public"."question_options" to "anon";

grant delete on table "public"."question_options" to "authenticated";

grant insert on table "public"."question_options" to "authenticated";

grant references on table "public"."question_options" to "authenticated";

grant select on table "public"."question_options" to "authenticated";

grant trigger on table "public"."question_options" to "authenticated";

grant truncate on table "public"."question_options" to "authenticated";

grant update on table "public"."question_options" to "authenticated";

grant delete on table "public"."question_options" to "service_role";

grant insert on table "public"."question_options" to "service_role";

grant references on table "public"."question_options" to "service_role";

grant select on table "public"."question_options" to "service_role";

grant trigger on table "public"."question_options" to "service_role";

grant truncate on table "public"."question_options" to "service_role";

grant update on table "public"."question_options" to "service_role";

grant delete on table "public"."question_progress" to "anon";

grant insert on table "public"."question_progress" to "anon";

grant references on table "public"."question_progress" to "anon";

grant select on table "public"."question_progress" to "anon";

grant trigger on table "public"."question_progress" to "anon";

grant truncate on table "public"."question_progress" to "anon";

grant update on table "public"."question_progress" to "anon";

grant delete on table "public"."question_progress" to "authenticated";

grant insert on table "public"."question_progress" to "authenticated";

grant references on table "public"."question_progress" to "authenticated";

grant select on table "public"."question_progress" to "authenticated";

grant trigger on table "public"."question_progress" to "authenticated";

grant truncate on table "public"."question_progress" to "authenticated";

grant update on table "public"."question_progress" to "authenticated";

grant delete on table "public"."question_progress" to "service_role";

grant insert on table "public"."question_progress" to "service_role";

grant references on table "public"."question_progress" to "service_role";

grant select on table "public"."question_progress" to "service_role";

grant trigger on table "public"."question_progress" to "service_role";

grant truncate on table "public"."question_progress" to "service_role";

grant update on table "public"."question_progress" to "service_role";

grant delete on table "public"."question_sets" to "anon";

grant insert on table "public"."question_sets" to "anon";

grant references on table "public"."question_sets" to "anon";

grant select on table "public"."question_sets" to "anon";

grant trigger on table "public"."question_sets" to "anon";

grant truncate on table "public"."question_sets" to "anon";

grant update on table "public"."question_sets" to "anon";

grant delete on table "public"."question_sets" to "authenticated";

grant insert on table "public"."question_sets" to "authenticated";

grant references on table "public"."question_sets" to "authenticated";

grant select on table "public"."question_sets" to "authenticated";

grant trigger on table "public"."question_sets" to "authenticated";

grant truncate on table "public"."question_sets" to "authenticated";

grant update on table "public"."question_sets" to "authenticated";

grant delete on table "public"."question_sets" to "service_role";

grant insert on table "public"."question_sets" to "service_role";

grant references on table "public"."question_sets" to "service_role";

grant select on table "public"."question_sets" to "service_role";

grant trigger on table "public"."question_sets" to "service_role";

grant truncate on table "public"."question_sets" to "service_role";

grant update on table "public"."question_sets" to "service_role";

grant delete on table "public"."questions" to "anon";

grant insert on table "public"."questions" to "anon";

grant references on table "public"."questions" to "anon";

grant select on table "public"."questions" to "anon";

grant trigger on table "public"."questions" to "anon";

grant truncate on table "public"."questions" to "anon";

grant update on table "public"."questions" to "anon";

grant delete on table "public"."questions" to "authenticated";

grant insert on table "public"."questions" to "authenticated";

grant references on table "public"."questions" to "authenticated";

grant select on table "public"."questions" to "authenticated";

grant trigger on table "public"."questions" to "authenticated";

grant truncate on table "public"."questions" to "authenticated";

grant update on table "public"."questions" to "authenticated";

grant delete on table "public"."questions" to "service_role";

grant insert on table "public"."questions" to "service_role";

grant references on table "public"."questions" to "service_role";

grant select on table "public"."questions" to "service_role";

grant trigger on table "public"."questions" to "service_role";

grant truncate on table "public"."questions" to "service_role";

grant update on table "public"."questions" to "service_role";

grant delete on table "public"."subscriptions" to "anon";

grant insert on table "public"."subscriptions" to "anon";

grant references on table "public"."subscriptions" to "anon";

grant select on table "public"."subscriptions" to "anon";

grant trigger on table "public"."subscriptions" to "anon";

grant truncate on table "public"."subscriptions" to "anon";

grant update on table "public"."subscriptions" to "anon";

grant delete on table "public"."subscriptions" to "authenticated";

grant insert on table "public"."subscriptions" to "authenticated";

grant references on table "public"."subscriptions" to "authenticated";

grant select on table "public"."subscriptions" to "authenticated";

grant trigger on table "public"."subscriptions" to "authenticated";

grant truncate on table "public"."subscriptions" to "authenticated";

grant update on table "public"."subscriptions" to "authenticated";

grant delete on table "public"."subscriptions" to "service_role";

grant insert on table "public"."subscriptions" to "service_role";

grant references on table "public"."subscriptions" to "service_role";

grant select on table "public"."subscriptions" to "service_role";

grant trigger on table "public"."subscriptions" to "service_role";

grant truncate on table "public"."subscriptions" to "service_role";

grant update on table "public"."subscriptions" to "service_role";

grant delete on table "public"."teaching_group_members" to "anon";

grant insert on table "public"."teaching_group_members" to "anon";

grant references on table "public"."teaching_group_members" to "anon";

grant select on table "public"."teaching_group_members" to "anon";

grant trigger on table "public"."teaching_group_members" to "anon";

grant truncate on table "public"."teaching_group_members" to "anon";

grant update on table "public"."teaching_group_members" to "anon";

grant delete on table "public"."teaching_group_members" to "authenticated";

grant insert on table "public"."teaching_group_members" to "authenticated";

grant references on table "public"."teaching_group_members" to "authenticated";

grant select on table "public"."teaching_group_members" to "authenticated";

grant trigger on table "public"."teaching_group_members" to "authenticated";

grant truncate on table "public"."teaching_group_members" to "authenticated";

grant update on table "public"."teaching_group_members" to "authenticated";

grant delete on table "public"."teaching_group_members" to "service_role";

grant insert on table "public"."teaching_group_members" to "service_role";

grant references on table "public"."teaching_group_members" to "service_role";

grant select on table "public"."teaching_group_members" to "service_role";

grant trigger on table "public"."teaching_group_members" to "service_role";

grant truncate on table "public"."teaching_group_members" to "service_role";

grant update on table "public"."teaching_group_members" to "service_role";

grant delete on table "public"."teaching_groups" to "anon";

grant insert on table "public"."teaching_groups" to "anon";

grant references on table "public"."teaching_groups" to "anon";

grant select on table "public"."teaching_groups" to "anon";

grant trigger on table "public"."teaching_groups" to "anon";

grant truncate on table "public"."teaching_groups" to "anon";

grant update on table "public"."teaching_groups" to "anon";

grant delete on table "public"."teaching_groups" to "authenticated";

grant insert on table "public"."teaching_groups" to "authenticated";

grant references on table "public"."teaching_groups" to "authenticated";

grant select on table "public"."teaching_groups" to "authenticated";

grant trigger on table "public"."teaching_groups" to "authenticated";

grant truncate on table "public"."teaching_groups" to "authenticated";

grant update on table "public"."teaching_groups" to "authenticated";

grant delete on table "public"."teaching_groups" to "service_role";

grant insert on table "public"."teaching_groups" to "service_role";

grant references on table "public"."teaching_groups" to "service_role";

grant select on table "public"."teaching_groups" to "service_role";

grant trigger on table "public"."teaching_groups" to "service_role";

grant truncate on table "public"."teaching_groups" to "service_role";

grant update on table "public"."teaching_groups" to "service_role";

grant delete on table "public"."user_access_grants" to "anon";

grant insert on table "public"."user_access_grants" to "anon";

grant references on table "public"."user_access_grants" to "anon";

grant select on table "public"."user_access_grants" to "anon";

grant trigger on table "public"."user_access_grants" to "anon";

grant truncate on table "public"."user_access_grants" to "anon";

grant update on table "public"."user_access_grants" to "anon";

grant delete on table "public"."user_access_grants" to "authenticated";

grant insert on table "public"."user_access_grants" to "authenticated";

grant references on table "public"."user_access_grants" to "authenticated";

grant select on table "public"."user_access_grants" to "authenticated";

grant trigger on table "public"."user_access_grants" to "authenticated";

grant truncate on table "public"."user_access_grants" to "authenticated";

grant update on table "public"."user_access_grants" to "authenticated";

grant delete on table "public"."user_access_grants" to "service_role";

grant insert on table "public"."user_access_grants" to "service_role";

grant references on table "public"."user_access_grants" to "service_role";

grant select on table "public"."user_access_grants" to "service_role";

grant trigger on table "public"."user_access_grants" to "service_role";

grant truncate on table "public"."user_access_grants" to "service_role";

grant update on table "public"."user_access_grants" to "service_role";

grant delete on table "public"."user_course_access" to "anon";

grant insert on table "public"."user_course_access" to "anon";

grant references on table "public"."user_course_access" to "anon";

grant select on table "public"."user_course_access" to "anon";

grant trigger on table "public"."user_course_access" to "anon";

grant truncate on table "public"."user_course_access" to "anon";

grant update on table "public"."user_course_access" to "anon";

grant delete on table "public"."user_course_access" to "authenticated";

grant insert on table "public"."user_course_access" to "authenticated";

grant references on table "public"."user_course_access" to "authenticated";

grant select on table "public"."user_course_access" to "authenticated";

grant trigger on table "public"."user_course_access" to "authenticated";

grant truncate on table "public"."user_course_access" to "authenticated";

grant update on table "public"."user_course_access" to "authenticated";

grant delete on table "public"."user_course_access" to "service_role";

grant insert on table "public"."user_course_access" to "service_role";

grant references on table "public"."user_course_access" to "service_role";

grant select on table "public"."user_course_access" to "service_role";

grant trigger on table "public"."user_course_access" to "service_role";

grant truncate on table "public"."user_course_access" to "service_role";

grant update on table "public"."user_course_access" to "service_role";

grant delete on table "public"."vocabulary_items" to "anon";

grant insert on table "public"."vocabulary_items" to "anon";

grant references on table "public"."vocabulary_items" to "anon";

grant select on table "public"."vocabulary_items" to "anon";

grant trigger on table "public"."vocabulary_items" to "anon";

grant truncate on table "public"."vocabulary_items" to "anon";

grant update on table "public"."vocabulary_items" to "anon";

grant delete on table "public"."vocabulary_items" to "authenticated";

grant insert on table "public"."vocabulary_items" to "authenticated";

grant references on table "public"."vocabulary_items" to "authenticated";

grant select on table "public"."vocabulary_items" to "authenticated";

grant trigger on table "public"."vocabulary_items" to "authenticated";

grant truncate on table "public"."vocabulary_items" to "authenticated";

grant update on table "public"."vocabulary_items" to "authenticated";

grant delete on table "public"."vocabulary_items" to "service_role";

grant insert on table "public"."vocabulary_items" to "service_role";

grant references on table "public"."vocabulary_items" to "service_role";

grant select on table "public"."vocabulary_items" to "service_role";

grant trigger on table "public"."vocabulary_items" to "service_role";

grant truncate on table "public"."vocabulary_items" to "service_role";

grant update on table "public"."vocabulary_items" to "service_role";

grant delete on table "public"."vocabulary_sets" to "anon";

grant insert on table "public"."vocabulary_sets" to "anon";

grant references on table "public"."vocabulary_sets" to "anon";

grant select on table "public"."vocabulary_sets" to "anon";

grant trigger on table "public"."vocabulary_sets" to "anon";

grant truncate on table "public"."vocabulary_sets" to "anon";

grant update on table "public"."vocabulary_sets" to "anon";

grant delete on table "public"."vocabulary_sets" to "authenticated";

grant insert on table "public"."vocabulary_sets" to "authenticated";

grant references on table "public"."vocabulary_sets" to "authenticated";

grant select on table "public"."vocabulary_sets" to "authenticated";

grant trigger on table "public"."vocabulary_sets" to "authenticated";

grant truncate on table "public"."vocabulary_sets" to "authenticated";

grant update on table "public"."vocabulary_sets" to "authenticated";

grant delete on table "public"."vocabulary_sets" to "service_role";

grant insert on table "public"."vocabulary_sets" to "service_role";

grant references on table "public"."vocabulary_sets" to "service_role";

grant select on table "public"."vocabulary_sets" to "service_role";

grant trigger on table "public"."vocabulary_sets" to "service_role";

grant truncate on table "public"."vocabulary_sets" to "service_role";

grant update on table "public"."vocabulary_sets" to "service_role";


  create policy "Admins can create assignment items"
  on "public"."assignment_items"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = auth.uid()) AND (p.is_admin = true)))));



  create policy "Admins can delete assignment items"
  on "public"."assignment_items"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = auth.uid()) AND (p.is_admin = true)))));



  create policy "Admins can read assignment items"
  on "public"."assignment_items"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Teachers can create assignment items for their assignments"
  on "public"."assignment_items"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM (public.assignments a
     JOIN public.teaching_group_members tgm ON ((tgm.group_id = a.group_id)))
  WHERE ((a.id = assignment_items.assignment_id) AND (tgm.user_id = auth.uid()) AND (tgm.member_role = ANY (ARRAY['teacher'::text, 'assistant'::text]))))));



  create policy "Teachers can delete assignment items for their assignments"
  on "public"."assignment_items"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM (public.assignments a
     JOIN public.teaching_group_members tgm ON ((tgm.group_id = a.group_id)))
  WHERE ((a.id = assignment_items.assignment_id) AND (tgm.user_id = auth.uid()) AND (tgm.member_role = ANY (ARRAY['teacher'::text, 'assistant'::text]))))));



  create policy "Users can read assignment items for visible assignments"
  on "public"."assignment_items"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM (public.assignments a
     JOIN public.teaching_group_members tgm ON ((tgm.group_id = a.group_id)))
  WHERE ((a.id = assignment_items.assignment_id) AND (tgm.user_id = auth.uid())))));



  create policy "Admins can read assignment submissions"
  on "public"."assignment_submissions"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Students can insert their own assignment submissions"
  on "public"."assignment_submissions"
  as permissive
  for insert
  to authenticated
with check ((student_user_id = auth.uid()));



  create policy "Students can read their own assignment submissions"
  on "public"."assignment_submissions"
  as permissive
  for select
  to authenticated
using ((student_user_id = auth.uid()));



  create policy "Students can update their own assignment submissions"
  on "public"."assignment_submissions"
  as permissive
  for update
  to authenticated
using ((student_user_id = auth.uid()))
with check ((student_user_id = auth.uid()));



  create policy "Teachers can read submissions for their groups"
  on "public"."assignment_submissions"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM (public.assignments a
     JOIN public.teaching_group_members tgm ON ((tgm.group_id = a.group_id)))
  WHERE ((a.id = assignment_submissions.assignment_id) AND (tgm.user_id = auth.uid()) AND (tgm.member_role = ANY (ARRAY['teacher'::text, 'assistant'::text]))))));



  create policy "Teachers can update submissions for their groups"
  on "public"."assignment_submissions"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM (public.assignments a
     JOIN public.teaching_group_members tgm ON ((tgm.group_id = a.group_id)))
  WHERE ((a.id = assignment_submissions.assignment_id) AND (tgm.user_id = auth.uid()) AND (tgm.member_role = ANY (ARRAY['teacher'::text, 'assistant'::text]))))))
with check ((EXISTS ( SELECT 1
   FROM (public.assignments a
     JOIN public.teaching_group_members tgm ON ((tgm.group_id = a.group_id)))
  WHERE ((a.id = assignment_submissions.assignment_id) AND (tgm.user_id = auth.uid()) AND (tgm.member_role = ANY (ARRAY['teacher'::text, 'assistant'::text]))))));



  create policy "Admins can read assignments"
  on "public"."assignments"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Admins can update assignments"
  on "public"."assignments"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = auth.uid()) AND (p.is_admin = true)))))
with check ((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = auth.uid()) AND (p.is_admin = true)))));



  create policy "Teachers can create assignments for their groups"
  on "public"."assignments"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.teaching_group_members tgm
  WHERE ((tgm.group_id = assignments.group_id) AND (tgm.user_id = auth.uid()) AND (tgm.member_role = ANY (ARRAY['teacher'::text, 'assistant'::text]))))));



  create policy "Teachers can delete assignments for their groups"
  on "public"."assignments"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.teaching_group_members tgm
  WHERE ((tgm.group_id = assignments.group_id) AND (tgm.user_id = auth.uid()) AND (tgm.member_role = ANY (ARRAY['teacher'::text, 'assistant'::text]))))));



  create policy "Teachers can update assignments for their groups"
  on "public"."assignments"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.teaching_group_members tgm
  WHERE ((tgm.group_id = assignments.group_id) AND (tgm.user_id = auth.uid()) AND (tgm.member_role = ANY (ARRAY['teacher'::text, 'assistant'::text]))))))
with check ((EXISTS ( SELECT 1
   FROM public.teaching_group_members tgm
  WHERE ((tgm.group_id = assignments.group_id) AND (tgm.user_id = auth.uid()) AND (tgm.member_role = ANY (ARRAY['teacher'::text, 'assistant'::text]))))));



  create policy "Users can read assignments for groups they belong to"
  on "public"."assignments"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.teaching_group_members tgm
  WHERE ((tgm.group_id = assignments.group_id) AND (tgm.user_id = auth.uid())))));



  create policy "Allow admin delete on course_variants"
  on "public"."course_variants"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Allow admin insert on course_variants"
  on "public"."course_variants"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Allow admin update on course_variants"
  on "public"."course_variants"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))))
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Allow authenticated read on course_variants"
  on "public"."course_variants"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow authenticated read on courses"
  on "public"."courses"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Users can insert their own lesson progress"
  on "public"."lesson_progress"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update their own lesson progress"
  on "public"."lesson_progress"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view their own lesson progress"
  on "public"."lesson_progress"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Allow authenticated read on lesson_question_sets"
  on "public"."lesson_question_sets"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow admin delete on lessons"
  on "public"."lessons"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Allow admin insert on lessons"
  on "public"."lessons"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Allow admin update on lessons"
  on "public"."lessons"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))))
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Allow authenticated read on lessons"
  on "public"."lessons"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow admin delete on modules"
  on "public"."modules"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Allow admin insert on modules"
  on "public"."modules"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Allow admin update on modules"
  on "public"."modules"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))))
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Allow authenticated read on modules"
  on "public"."modules"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow authenticated read on prices"
  on "public"."prices"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow authenticated read on products"
  on "public"."products"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admins can read all profiles"
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using (public.is_current_user_admin());



  create policy "Admins can update profiles"
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using (public.is_current_user_admin())
with check (public.is_current_user_admin());



  create policy "Users can insert their own profile"
  on "public"."profiles"
  as permissive
  for insert
  to public
with check ((auth.uid() = id));



  create policy "Users can update their own profile"
  on "public"."profiles"
  as permissive
  for update
  to public
using ((auth.uid() = id));



  create policy "Users can view their own profile"
  on "public"."profiles"
  as permissive
  for select
  to public
using ((auth.uid() = id));



  create policy "Admins can delete accepted answers"
  on "public"."question_accepted_answers"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Admins can insert accepted answers"
  on "public"."question_accepted_answers"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Admins can update accepted answers"
  on "public"."question_accepted_answers"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))))
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Allow authenticated read on question_accepted_answers"
  on "public"."question_accepted_answers"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Users can insert their own question_attempts"
  on "public"."question_attempts"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = user_id));



  create policy "Users can read their own question_attempts"
  on "public"."question_attempts"
  as permissive
  for select
  to authenticated
using ((auth.uid() = user_id));



  create policy "Admins can delete question options"
  on "public"."question_options"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Admins can insert question options"
  on "public"."question_options"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Admins can update question options"
  on "public"."question_options"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))))
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Allow authenticated read on question_options"
  on "public"."question_options"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Users can insert their own question_progress"
  on "public"."question_progress"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = user_id));



  create policy "Users can read their own question_progress"
  on "public"."question_progress"
  as permissive
  for select
  to authenticated
using ((auth.uid() = user_id));



  create policy "Users can update their own question_progress"
  on "public"."question_progress"
  as permissive
  for update
  to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



  create policy "Admins can delete question sets"
  on "public"."question_sets"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Admins can insert question sets"
  on "public"."question_sets"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Admins can update question sets"
  on "public"."question_sets"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))))
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Allow authenticated read on question_sets"
  on "public"."question_sets"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admins can delete questions"
  on "public"."questions"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Admins can insert questions"
  on "public"."questions"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Admins can update questions"
  on "public"."questions"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))))
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Allow authenticated read on questions"
  on "public"."questions"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Users can read their own subscriptions"
  on "public"."subscriptions"
  as permissive
  for select
  to authenticated
using ((auth.uid() = user_id));



  create policy "Admins can delete teaching group members"
  on "public"."teaching_group_members"
  as permissive
  for delete
  to authenticated
using (public.is_current_user_admin());



  create policy "Admins can insert teaching group members"
  on "public"."teaching_group_members"
  as permissive
  for insert
  to authenticated
with check (public.is_current_user_admin());



  create policy "Admins can read teaching group members"
  on "public"."teaching_group_members"
  as permissive
  for select
  to authenticated
using (public.is_current_user_admin());



  create policy "Users can read their own group memberships"
  on "public"."teaching_group_members"
  as permissive
  for select
  to authenticated
using ((user_id = auth.uid()));



  create policy "Admins can delete teaching groups"
  on "public"."teaching_groups"
  as permissive
  for delete
  to authenticated
using (public.is_current_user_admin());



  create policy "Admins can insert teaching groups"
  on "public"."teaching_groups"
  as permissive
  for insert
  to authenticated
with check (public.is_current_user_admin());



  create policy "Admins can read teaching groups"
  on "public"."teaching_groups"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));



  create policy "Admins can update teaching groups"
  on "public"."teaching_groups"
  as permissive
  for update
  to authenticated
using (public.is_current_user_admin())
with check (public.is_current_user_admin());



  create policy "Users can read groups they belong to"
  on "public"."teaching_groups"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.teaching_group_members tgm
  WHERE ((tgm.group_id = teaching_groups.id) AND (tgm.user_id = auth.uid())))));



  create policy "Admins can delete access grants"
  on "public"."user_access_grants"
  as permissive
  for delete
  to authenticated
using (public.is_current_user_admin());



  create policy "Admins can insert access grants"
  on "public"."user_access_grants"
  as permissive
  for insert
  to authenticated
with check (public.is_current_user_admin());



  create policy "Admins can read all access grants"
  on "public"."user_access_grants"
  as permissive
  for select
  to authenticated
using (public.is_current_user_admin());



  create policy "Admins can update access grants"
  on "public"."user_access_grants"
  as permissive
  for update
  to authenticated
using (public.is_current_user_admin())
with check (public.is_current_user_admin());



  create policy "Users can read their own access grants"
  on "public"."user_access_grants"
  as permissive
  for select
  to authenticated
using ((auth.uid() = user_id));



  create policy "Users can insert their own course access"
  on "public"."user_course_access"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update their own course access"
  on "public"."user_course_access"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view their own course access"
  on "public"."user_course_access"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Allow authenticated read on vocabulary_items"
  on "public"."vocabulary_items"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow authenticated read on vocabulary_sets"
  on "public"."vocabulary_sets"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Students and teachers can read assignment files"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'assignment-submissions'::text) AND (((storage.foldername(name))[2] = (auth.uid())::text) OR (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))) OR (EXISTS ( SELECT 1
   FROM public.teaching_group_members
  WHERE ((teaching_group_members.user_id = auth.uid()) AND (teaching_group_members.member_role = ANY (ARRAY['teacher'::text, 'assistant'::text]))))))));



  create policy "Students can delete their own assignment files"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'assignment-submissions'::text) AND ((storage.foldername(name))[2] = (auth.uid())::text)));



  create policy "Students can update their own assignment files"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (((bucket_id = 'assignment-submissions'::text) AND ((storage.foldername(name))[2] = (auth.uid())::text)))
with check (((bucket_id = 'assignment-submissions'::text) AND ((storage.foldername(name))[2] = (auth.uid())::text)));



  create policy "Students can upload their own assignment files"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'assignment-submissions'::text) AND ((storage.foldername(name))[2] = (auth.uid())::text)));



