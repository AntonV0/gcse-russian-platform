import Button from "@/components/ui/button";

const GRAMMAR_ADMIN_SAVED_FILTERS = [
  {
    label: "Spec grammar",
    href: "/admin/grammar?sourceKey=edexcel_gcse_russian_appendix_2&published=published",
    description: "Published Appendix 2 grammar sets.",
  },
  {
    label: "Unused grammar",
    href: "/admin/grammar?sourceKey=edexcel_gcse_russian_appendix_2&usageVariant=unused",
    description: "Specification grammar not attached to lessons yet.",
  },
  {
    label: "Foundation coverage",
    href: "/admin/grammar?sourceKey=edexcel_gcse_russian_appendix_2&usageVariant=foundation",
    description: "Grammar used in Foundation lessons.",
  },
  {
    label: "Higher coverage",
    href: "/admin/grammar?sourceKey=edexcel_gcse_russian_appendix_2&usageVariant=higher",
    description: "Grammar used in Higher lessons.",
  },
  {
    label: "Volna coverage",
    href: "/admin/grammar?sourceKey=edexcel_gcse_russian_appendix_2&usageVariant=volna",
    description: "Grammar used in Volna lessons.",
  },
] as const;

export default function SavedGrammarViews() {
  return (
    <section className="app-surface app-section-padding">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="app-heading-subsection">Saved grammar views</h2>
          <p className="mt-2 app-text-body-muted">
            Jump to the planning slices used when checking Appendix 2 coverage.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {GRAMMAR_ADMIN_SAVED_FILTERS.map((filter) => (
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
