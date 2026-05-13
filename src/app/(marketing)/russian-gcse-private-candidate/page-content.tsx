import type { Metadata } from "next";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import MarketingBreadcrumbs from "@/components/marketing/marketing-breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata } from "@/lib/seo/site";
import { buildFaqJsonLd, buildLearningResourceJsonLd } from "@/lib/seo/structured-data";

import { faqs, relatedLinks } from "./private-candidate-data";
import {
  CandidatePlanVisual,
  CandidateTypesSection,
  CentreChecklistSection,
  CourseFitSection,
  Eyebrow,
  FaqSection,
  FirstDecisionsSection,
  PrepRouteSection,
  RelatedLinksSection,
} from "./private-candidate-sections";

export const metadata: Metadata = buildPublicMetadata({
  title: "Russian GCSE Private Candidate Guide",
  description:
    "A practical Russian GCSE private candidate guide covering exam-centre planning, speaking arrangements, tier choice, preparation structure, and course support.",
  path: "/russian-gcse-private-candidate",
  ogTitle: "Russian GCSE Private Candidate Guide",
  ogDescription:
    "Plan GCSE Russian preparation, tier choice, speaking support, and exam-centre questions.",
  ogImagePath: getOgImagePath("private-candidates"),
  ogImageAlt: "Russian GCSE private candidate guide",
});

export default function RussianGcsePrivateCandidatePage() {
  return (
    <>
      <JsonLd
        data={[
          buildLearningResourceJsonLd({
            name: "Russian GCSE Private Candidate Guide",
            description:
              "A practical guide for Russian GCSE private candidates and families planning exam preparation, course structure, online lessons, and exam-centre questions.",
            path: "/russian-gcse-private-candidate",
            keywords: [
              "Russian GCSE private candidate",
              "Russian GCSE exam centre",
              "GCSE Russian preparation",
            ],
            relatedLinks,
          }),
          buildFaqJsonLd(faqs),
        ]}
      />

      <MarketingBreadcrumbs
        items={[
          { label: "Home", href: "/marketing" },
          { label: "Resources", href: "/resources" },
          {
            label: "Private candidates",
            href: "/russian-gcse-private-candidate",
          },
        ]}
      />

      <div className="space-y-16 py-8 md:py-12">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.72fr)] lg:items-center">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge tone="info" icon="userCheck">
                Private candidate planning
              </Badge>
              <Badge tone="muted" icon="school">
                Pearson Edexcel 1RU0
              </Badge>
              <Badge tone="muted" icon="speaking">
                Speaking logistics
              </Badge>
            </div>

            <Eyebrow>Russian GCSE private candidates</Eyebrow>
            <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-none text-[var(--text-primary)] md:text-6xl">
              Prepare for GCSE Russian while exam entry is arranged separately.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
              Private candidates need a learning route and a logistics plan. The course
              can structure lessons, vocabulary, grammar, and practice while the family
              confirms centre entry, tier choice, and speaking arrangements.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="/signup" variant="primary" icon="create">
                Start trial
              </Button>
              <Button
                href="/online-gcse-russian-lessons"
                variant="secondary"
                icon="teacher"
              >
                Online lesson support
              </Button>
            </div>
          </div>

          <CandidatePlanVisual />
        </section>

        <FirstDecisionsSection />
        <PrepRouteSection />
        <CentreChecklistSection />
        <CandidateTypesSection />
        <CourseFitSection />
        <FaqSection />
        <RelatedLinksSection />

        <section className="rounded-lg marketing-dark-panel p-6 shadow-[var(--shadow-lg)] sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-extrabold leading-tight md:text-3xl">
                Give private-candidate preparation a clearer structure.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 opacity-80">
                Start with trial access, inspect the course flow, and decide whether
                self-study or live support is the right next step for the student.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/signup" variant="primary" icon="create">
                Create trial account
              </Button>
              <Button href="/gcse-russian-course" variant="secondary" icon="courses">
                View course
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
