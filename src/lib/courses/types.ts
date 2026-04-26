export type DbCourse = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  is_active: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type DbCourseVariant = {
  id: string;
  course_id: string;
  slug: string;
  title: string;
  description: string | null;
  position: number;
  is_active: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type DbModule = {
  id: string;
  course_variant_id: string;
  slug: string;
  title: string;
  description: string | null;
  position: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type DbLesson = {
  id: string;
  module_id: string;
  slug: string;
  title: string;
  summary: string | null;
  lesson_type: string;
  position: number;
  estimated_minutes: number | null;
  is_published: boolean;
  is_trial_visible: boolean;
  requires_paid_access: boolean;
  available_in_volna: boolean;
  content_source: string;
  content_key: string | null;
  created_at: string;
  updated_at: string;
};

export type LessonAccessMeta = {
  id: string;
  slug: string;
  is_trial_visible: boolean;
  requires_paid_access: boolean;
  available_in_volna: boolean;
};
