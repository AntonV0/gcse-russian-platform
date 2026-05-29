import type { Metadata } from "next";
import Image from "next/image";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
import VocabularyFilterForm from "@/components/vocabulary/vocabulary-filter-form";
import VocabularySetSectionList from "@/components/vocabulary/vocabulary-set-section-list";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import { getVocabularyThemeLabel } from "@/lib/vocabulary/shared/labels";
import {
  getPublishedStudentVocabularySetsDb,
  getVocabularySetsDb,
} from "@/lib/vocabulary/sets/set-list-queries";
import { getVocabularySetThemeKeysDb } from "@/lib/vocabulary/sets/set-options";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata } from "@/lib/seo/site";
import type { VocabularySetFilters } from "@/lib/vocabulary/shared/types";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Vocabulary",
  description:
    "Preview structured GCSE Russian vocabulary practice for Pearson Edexcel 1RU0, with lesson-linked word sets and saved study progress after signup.",
  path: "/vocabulary",
  ogTitle: "GCSE Russian Vocabulary",
  ogDescription:
    "See how GCSE Russian vocabulary practice unlocks through the course journey.",
  ogImagePath: getOgImagePath("vocabulary"),
});

type VocabularyPageProps = {
  searchParams?: Promise<{
    search?: string;
    tier?: string;
    listMode?: string;
    themeKey?: string;
  }>;
};

function normalizeTierFilter(value?: string): VocabularySetFilters["tier"] {
  if (
    value === "foundation" ||
    value === "higher" ||
    value === "both" ||
    value === "unknown"
  ) {
    return value;
  }

  return "all";
}

function normalizeListModeFilter(value?: string): VocabularySetFilters["listMode"] {
  if (
    value === "spec_only" ||
    value === "extended_only" ||
    value === "spec_and_extended" ||
    value === "custom"
  ) {
    return value;
  }

  return "all";
}

function getTopicOptions(themeKeys: string[]) {
  return themeKeys.map((themeKey) => ({
    value: themeKey,
    label: getVocabularyThemeLabel(themeKey),
  }));
}

export default async function VocabularyPage({ searchParams }: VocabularyPageProps) {
  const params = (await searchParams) ?? {};
  const dashboard = await getDashboardInfo();

  if (dashboard.role === "guest") {
    return <GuestVocabularyPreview />;
  }

  const filters: VocabularySetFilters = {
    search: params.search ?? null,
    tier: normalizeTierFilter(params.tier),
    listMode: normalizeListModeFilter(params.listMode),
    themeKey: params.themeKey ?? null,
  };
  const canSeeDrafts = dashboard.role === "admin" || dashboard.role === "teacher";
  const canSeeCoverage = dashboard.role === "admin";
  const [vocabularySets, themeKeys] = await Promise.all([
    canSeeDrafts
      ? getVocabularySetsDb({ filters })
      : getPublishedStudentVocabularySetsDb(filters),
    getVocabularySetThemeKeysDb({
      publishedOnly: !canSeeDrafts,
      excludeSetTypes: canSeeDrafts ? undefined : ["specification"],
    }),
  ]);
  const draftCount = vocabularySets.filter((set) => !set.is_published).length;
  const topicOptions = getTopicOptions(themeKeys);

  return (
    <main className="flex flex-col gap-4">
      <PageIntroPanel
        className="order-1"
        tone="student"
        eyebrow="Vocabulary"
        title="Vocabulary"
        description="Find a set, open a study queue, and keep returning to the words that still need practice."
        badges={
          <>
            <Badge tone="info" icon="vocabulary">
              Vocabulary hub
            </Badge>
            <Badge tone="muted" icon="school">
              GCSE Russian
            </Badge>
            <Badge tone="success" icon="success">
              Saved study states
            </Badge>
            {canSeeDrafts && draftCount > 0 ? (
              <Badge tone="warning" icon="draft">
                {draftCount} draft visible to staff
              </Badge>
            ) : null}
          </>
        }
        actions={
          <>
            <Button href="/dashboard" variant="secondary" icon="dashboard">
              Dashboard
            </Button>
            <Button href="/grammar" variant="secondary" icon="grammar">
              Grammar
            </Button>
          </>
        }
        visual={
          <Image
            src="/illustrations/vocabulary-hub-v1.png"
            alt="Vocabulary cards and study tools illustration"
            width={1720}
            height={914}
            priority
            sizes="(min-width: 1280px) 320px, 80vw"
            className="h-auto w-full max-w-[360px] drop-shadow-[0_18px_34px_color-mix(in_srgb,var(--text-primary)_10%,transparent)]"
          />
        }
      />

      <SectionCard
        className="order-2"
        title="Find vocabulary"
        description="Search by keyword, then narrow by tier, list type, or topic."
        tone="student"
      >
        <VocabularyFilterForm
          search={params.search}
          filters={filters}
          topicOptions={topicOptions}
        />
      </SectionCard>

      <SectionCard
        className="order-3"
        title="Vocabulary sets"
        description={`${vocabularySets.length} set${vocabularySets.length === 1 ? "" : "s"} available${canSeeDrafts ? " to your staff view" : ""}.`}
        tone="student"
        actions={
          <Button href="/vocabulary?tier=foundation" variant="secondary" icon="school">
            Foundation
          </Button>
        }
      >
        {vocabularySets.length === 0 ? (
          <EmptyState
            icon="vocabulary"
            iconTone="brand"
            title="No vocabulary sets found"
            description={
              canSeeDrafts
                ? "Try clearing filters, or publish vocabulary sets so students can see them."
                : "Try clearing filters, or check back once more vocabulary sets have been added."
            }
          />
        ) : (
          <VocabularySetSectionList
            vocabularySets={vocabularySets}
            canSeeCoverage={canSeeCoverage}
          />
        )}
      </SectionCard>
    </main>
  );
}

function GuestVocabularyPreview() {
  const previewFeatures = [
    {
      title: "Lesson-linked vocabulary",
      description:
        "Word sets open in context as students work through the course, so revision follows the route they are actually studying.",
    },
    {
      title: "Tier-aware study",
      description:
        "Foundation and Higher students see the vocabulary path that matches their course choice, trial access, and paid plan.",
    },
    {
      title: "Saved study states",
      description:
        "Signed-in students can return to words marked new, needs practice, or mastered instead of starting from scratch each time.",
    },
  ];

  const studyFlow = [
    "Create a trial account and choose a course path.",
    "Open lessons to unlock the vocabulary needed for that part of the course.",
    "Use the study view to practise, mark progress, and return to weaker words.",
  ];

  return (
    <main className="flex flex-col gap-4">
      <PageIntroPanel
        className="order-1"
        tone="student"
        eyebrow="Vocabulary"
        title="GCSE Russian vocabulary that unlocks with the course"
        description="The platform includes structured GCSE Russian vocabulary practice without exposing the full study lists to anonymous visitors."
        badges={
          <>
            <Badge tone="info" icon="vocabulary">
              Vocabulary preview
            </Badge>
            <Badge tone="muted" icon="school">
              Pearson Edexcel 1RU0
            </Badge>
            <Badge tone="success" icon="success">
              Progress saved after signup
            </Badge>
          </>
        }
        actions={
          <>
            <Button href="/signup" variant="primary" icon="create">
              Start trial
            </Button>
            <Button href="/gcse-russian-vocabulary" variant="secondary" icon="text">
              Vocabulary guide
            </Button>
          </>
        }
        visual={
          <Image
            src="/illustrations/vocabulary-hub-v1.png"
            alt="Vocabulary cards and study tools illustration"
            width={1720}
            height={914}
            priority
            sizes="(min-width: 1280px) 320px, 80vw"
            className="h-auto w-full max-w-[360px] drop-shadow-[0_18px_34px_color-mix(in_srgb,var(--text-primary)_10%,transparent)]"
          />
        }
      />

      <section className="order-2 grid gap-4 md:grid-cols-3">
        {previewFeatures.map((feature) => (
          <SectionCard key={feature.title} title={feature.title} tone="student">
            <p className="app-text-body-muted">{feature.description}</p>
          </SectionCard>
        ))}
      </section>

      <SectionCard
        className="order-3"
        title="How vocabulary access works"
        description="Guests can see the learning model. Trial and paid accounts open the actual study lists as part of the course journey."
        tone="student"
        actions={
          <Button href="/courses" variant="secondary" icon="courses">
            Preview course
          </Button>
        }
      >
        <div className="grid gap-3 md:grid-cols-3">
          {studyFlow.map((step, index) => (
            <div
              key={step}
              className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-4"
            >
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full [background:var(--accent-gradient-selected)] text-sm font-semibold text-[var(--accent-on-soft)] ring-1 ring-[var(--accent-selected-border)]">
                {index + 1}
              </div>
              <p className="app-text-body-muted">{step}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </main>
  );
}
