import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
import {
  MarketingCtaBand,
  MarketingFaqSection,
  MarketingRelatedLinks,
  type MarketingFaqItem,
} from "@/components/marketing/marketing-page-sections";
import MarketingBreadcrumbs from "@/components/marketing/marketing-breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import type { AppIconKey } from "@/lib/shared/icons";
import { buildFaqJsonLd, buildLearningResourceJsonLd } from "@/lib/seo/structured-data";

export type GuideSection = {
  title: string;
  description: string;
  items: {
    title: string;
    description: string;
  }[];
};

export type GuideRelatedLink = {
  title: string;
  description: string;
  href: string;
  icon?: AppIconKey;
};

type EvergreenGuidePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  badges: {
    label: string;
    icon?: AppIconKey;
    tone?: "muted" | "info" | "success" | "warning";
  }[];
  primaryAction?: {
    href: string;
    label: string;
    icon?: AppIconKey;
  };
  secondaryAction?: {
    href: string;
    label: string;
    icon?: AppIconKey;
  };
  sections: GuideSection[];
  relatedLinks: GuideRelatedLink[];
  faqs?: MarketingFaqItem[];
  ctaTitle: string;
  ctaDescription: string;
  ctaSecondaryHref?: string;
  ctaSecondaryLabel?: string;
};

export default function EvergreenGuidePage({
  eyebrow,
  title,
  description,
  path,
  keywords = [],
  badges,
  primaryAction = {
    href: "/signup",
    label: "Start trial",
    icon: "create",
  },
  secondaryAction = {
    href: "/gcse-russian-course",
    label: "View course",
    icon: "courses",
  },
  sections,
  relatedLinks,
  faqs = [],
  ctaTitle,
  ctaDescription,
  ctaSecondaryHref = "/gcse-russian-course",
  ctaSecondaryLabel = "View course",
}: EvergreenGuidePageProps) {
  return (
    <>
      <JsonLd
        data={[
          buildLearningResourceJsonLd({
            name: title,
            description,
            path,
            keywords,
            relatedLinks,
          }),
          ...(faqs.length > 0 ? [buildFaqJsonLd(faqs)] : []),
        ]}
      />
      <MarketingBreadcrumbs
        items={[
          { label: "Home", href: "/marketing" },
          { label: "Resources", href: "/resources" },
          { label: title, href: path },
        ]}
      />
      <div className="space-y-8 py-8 md:py-12">
        <PageIntroPanel
          tone="brand"
          eyebrow={eyebrow}
          title={title}
          description={description}
          badges={
            <>
              {badges.map((badge) => (
                <Badge key={badge.label} tone={badge.tone ?? "muted"} icon={badge.icon}>
                  {badge.label}
                </Badge>
              ))}
            </>
          }
          actions={
            <>
              <Button
                href={primaryAction.href}
                variant="primary"
                icon={primaryAction.icon ?? "create"}
              >
                {primaryAction.label}
              </Button>
              <Button
                href={secondaryAction.href}
                variant="secondary"
                icon={secondaryAction.icon ?? "courses"}
              >
                {secondaryAction.label}
              </Button>
            </>
          }
        />

        {sections.map((section, sectionIndex) => (
          <SectionCard
            key={section.title}
            title={section.title}
            description={section.description}
            tone={sectionIndex === 0 ? "student" : sectionIndex === 1 ? "brand" : "muted"}
          >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {section.items.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4"
                >
                  <h3 className="app-heading-card">
                    {item.title}
                  </h3>
                  <p className="mt-2 app-text-body-muted">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        ))}

        <MarketingRelatedLinks links={relatedLinks} />

        <MarketingFaqSection items={faqs} />

        <MarketingCtaBand
          title={ctaTitle}
          description={ctaDescription}
          secondaryHref={ctaSecondaryHref}
          secondaryLabel={ctaSecondaryLabel}
        />
      </div>
    </>
  );
}
