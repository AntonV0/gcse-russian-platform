export type LessonAccess = "free" | "paid";

export type Lesson = {
  slug: string;
  title: string;
  description: string;
  access: LessonAccess;
};

export type Module = {
  slug: string;
  title: string;
  description: string;
  lessons: Lesson[];
};

export type CourseVariant = {
  slug: string;
  title: string;
  description: string;
  modules: Module[];
};

export type Course = {
  slug: string;
  title: string;
  description: string;
  variants: CourseVariant[];
};
