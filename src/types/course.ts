export type Lesson = {
  slug: string;
  title: string;
  description: string;
};

export type Module = {
  slug: string;
  title: string;
  description: string;
  lessons: Lesson[];
};

export type Course = {
  slug: string;
  title: string;
  description: string;
  modules: Module[];
};