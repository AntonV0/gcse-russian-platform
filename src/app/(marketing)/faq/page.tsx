import type { Metadata } from "next";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
import MarketingBreadcrumbs from "@/components/marketing/marketing-breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import { buildPublicMetadata } from "@/lib/seo/site";
import { buildFaqJsonLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Course FAQ",
  description:
    "Answers to common questions about the GCSE Russian Course Platform, trial access, pricing, checkout, and the future www/app site split.",
  path: "/faq",
});

const faqs = [
  {
    question: "Should students start with a trial?",
    answer:
      "Yes. The intended flow is to create a trial account, try the platform, and upgrade from inside the app when ready.",
  },
  {
    question: "Where does checkout happen?",
    answer:
      "Checkout and upgrade actions live in the authenticated app account area so billing can use the signed-in student's account state.",
  },
  {
    question: "Can this support future subdomains?",
    answer:
      "Yes. Marketing and platform pages now live in separate route groups, which keeps URLs clean while preparing for future subdomain routing.",
  },
];

export default function MarketingFaqPage() {
  return (
    <>
      <JsonLd data={buildFaqJsonLd(faqs)} />
      <MarketingBreadcrumbs
        items={[
          { label: "Home", href: "/marketing" },
          { label: "FAQ", href: "/faq" },
        ]}
      />
      <div className="space-y-8 py-8 md:py-12">
        <PageIntroPanel
          tone="neutral"
          eyebrow="FAQ"
          title="Common questions"
          description="A small starter FAQ for the public site. This can grow into a fuller SEO and support section later."
          badges={
            <Badge tone="muted" icon="info">
              Public site scaffold
            </Badge>
          }
          actions={
            <Button href="/signup" variant="primary" icon="create">
              Start trial
            </Button>
          }
        />

        <section className="grid gap-4">
          {faqs.map((item) => (
            <SectionCard
              key={item.question}
              title={item.question}
              description={item.answer}
              tone="muted"
              density="compact"
            />
          ))}
        </section>
      </div>
    </>
  );
}
