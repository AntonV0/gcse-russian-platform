import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import JsonLd from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

export type MarketingBreadcrumbItem = {
  label: string;
  href: string;
};

type MarketingBreadcrumbsProps = {
  items: MarketingBreadcrumbItem[];
};

export default function MarketingBreadcrumbs({ items }: MarketingBreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(
          items.map((item) => ({
            name: item.label,
            path: item.href,
          }))
        )}
      />
      <nav aria-label="Breadcrumb" className="pt-6">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-[var(--text-secondary)]">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={item.href} className="flex min-w-0 items-center gap-2">
                {index > 0 ? (
                  <AppIcon icon="next" size={14} className="app-text-soft" />
                ) : null}
                {isLast ? (
                  <span aria-current="page" className="font-medium text-[var(--text-primary)]">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="app-nav-link">
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
