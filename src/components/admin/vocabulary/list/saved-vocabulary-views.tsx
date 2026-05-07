import Button from "@/components/ui/button";

const VOCABULARY_ADMIN_SAVED_FILTERS = [
  {
    label: "Spec sets",
    href: "/admin/vocabulary?setType=specification&published=published",
    description: "Published specification vocabulary only.",
  },
  {
    label: "Custom lesson sets",
    href: "/admin/vocabulary?setType=lesson_custom",
    description: "Teacher-built sets for lessons.",
  },
  {
    label: "Unused spec sets",
    href: "/admin/vocabulary?setType=specification&usageVariant=unused",
    description: "Spec sets not attached to lessons yet.",
  },
  {
    label: "Foundation coverage",
    href: "/admin/vocabulary?setType=specification&usageVariant=foundation",
    description: "Spec sets already used in Foundation lessons.",
  },
  {
    label: "Higher coverage",
    href: "/admin/vocabulary?setType=specification&usageVariant=higher",
    description: "Spec sets already used in Higher lessons.",
  },
] as const;

export default function SavedVocabularyViews() {
  return (
    <section className="app-surface px-4 py-3 sm:px-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <h2 className="app-heading-subsection">Saved vocabulary views</h2>
          <p className="mt-1 app-text-caption">
            Shortcuts for planning, coverage checks, and lesson-specific sets.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {VOCABULARY_ADMIN_SAVED_FILTERS.map((filter) => (
            <Button
              key={filter.href}
              href={filter.href}
              variant="secondary"
              size="sm"
              icon="filter"
              title={filter.description}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
