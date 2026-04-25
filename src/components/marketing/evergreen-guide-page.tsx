import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
import {
  MarketingCtaBand,
  MarketingRelatedLinks,
} from "@/components/marketing/marketing-page-sections";
import type { AppIconKey } from "@/lib/shared/icons";

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
  ctaTitle: string;
  ctaDescription: string;
  ctaSecondaryHref?: string;
  ctaSecondaryLabel?: string;
};

export default function EvergreenGuidePage({
  eyebrow,
  title,
  description,
  badges,
  primaryAction = {
    href: "/signup",
    label: "Start trial",
    icon: "create",
  },
  secondaryAction = {
    href: "/marketing/gcse-russian-course",
    label: "View course",
    icon: "courses",
  },
  sections,
  relatedLinks,
  ctaTitle,
  ctaDescription,
  ctaSecondaryHref = "/marketing/gcse-russian-course",
  ctaSecondaryLabel = "View course",
}: EvergreenGuidePageProps) {
  return (
    <div className="space-y-8 py-8 md:py-12">
      <PageIntroPanel
        tone="brand"
        eyebrow={eyebrow}
        title={title}
        description={description}
        badges={
          <>
            {badges.map((badge) => (
              <Badge
                key={badge.label}
                tone={badge.tone ?? "muted"}
                icon={badge.icon}
              >
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
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      ))}

      <MarketingRelatedLinks links={relatedLinks} />

      <MarketingCtaBand
        title={ctaTitle}
        description={ctaDescription}
        secondaryHref={ctaSecondaryHref}
        secondaryLabel={ctaSecondaryLabel}
      />
    </div>
  );
}
