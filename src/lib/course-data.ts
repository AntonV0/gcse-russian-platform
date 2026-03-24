import type { Course } from "@/types/course";

export const courses: Course[] = [
  {
    slug: "gcse-russian",
    title: "GCSE Russian",
    description: "Structured lessons, vocabulary, and exam practice for GCSE Russian.",
    variants: [
      {
        slug: "foundation",
        title: "Foundation",
        description: "Foundation tier GCSE Russian course.",
        modules: [
          {
            slug: "introduction-to-the-course",
            title: "Introduction to the course",
            description:
              "A sample module showing how modules and lessons will be structured.",
            lessons: [
              {
                slug: "how-the-course-works",
                title: "How the course works",
                description:
                  "This lesson shows the first version of the reusable lesson system.",
                access: "free",
              },
              {
                slug: "getting-started",
                title: "Getting started",
                description: "A placeholder second lesson for navigation flow.",
                access: "paid",
              },
            ],
          },
          {
            slug: "family-and-relationships",
            title: "Family and relationships",
            description: "Example topic module for GCSE Russian content.",
            lessons: [
              {
                slug: "talking-about-family",
                title: "Talking about family",
                description: "Placeholder lesson card.",
                access: "paid",
              },
              {
                slug: "describing-relationships",
                title: "Describing relationships",
                description: "Placeholder lesson card.",
                access: "paid",
              },
            ],
          },
        ],
      },
      {
        slug: "higher",
        title: "Higher",
        description: "Higher tier GCSE Russian course.",
        modules: [
          {
            slug: "introduction-to-the-course",
            title: "Introduction to the course",
            description: "Higher tier introduction module.",
            lessons: [
              {
                slug: "how-the-course-works",
                title: "How the course works",
                description: "Higher tier intro lesson.",
                access: "free",
              },
            ],
          },
        ],
      },
    ],
  },
];
