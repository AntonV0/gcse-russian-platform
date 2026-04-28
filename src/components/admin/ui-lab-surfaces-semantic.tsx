import type { ReactNode } from "react";
import {
  surfaceIntentGuides,
} from "@/components/admin/ui-lab-surfaces-data";
import UiLabSection from "@/components/admin/ui-lab-section";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card, { CardBody } from "@/components/ui/card";
import LessonSurfaceCard from "@/components/ui/lesson-surface-card";
import PracticeSurfaceCard from "@/components/ui/practice-surface-card";
import LockedContentCard from "@/components/ui/locked-content-card";
import AssessmentSurfaceCard from "@/components/ui/assessment-surface-card";
import Surface from "@/components/ui/surface";

function SurfaceIntentGuideCard({
  badge,
  badgeTone,
  title,
  description,
}: {
  badge: string;
  badgeTone: "muted" | "info" | "warning" | "danger";
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardBody className="space-y-3">
        <Badge tone={badgeTone}>{badge}</Badge>
        <div className="font-semibold text-[var(--text-primary)]">{title}</div>
        <p className="text-sm app-text-muted">{description}</p>
      </CardBody>
    </Card>
  );
}

function SemanticSurfaceExample({
  eyebrow,
  title,
  description,
  badges,
  actions,
  surfaceVariant = "default",
}: {
  eyebrow: string;
  title: string;
  description: string;
  badges?: ReactNode;
  actions?: ReactNode;
  surfaceVariant?: "default" | "muted" | "brand";
}) {
  return (
    <Surface variant={surfaceVariant} className="p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] app-text-soft">
            {eyebrow}
          </div>
          <div className="font-semibold text-[var(--text-primary)]">{title}</div>
        </div>

        {badges ? <div className="flex shrink-0 flex-wrap gap-2">{badges}</div> : null}
      </div>

      <p className="text-sm app-text-muted">{description}</p>

      {actions ? <div className="mt-4 flex flex-wrap gap-3">{actions}</div> : null}
    </Surface>
  );
}

export function SemanticSurfacePatternsSection() {
  return (
    <UiLabSection
      id="semantic-surfaces"
      title="Semantic content surface patterns"
      description="These are higher-level patterns for specific product experiences. The strongest ones below are now extracted into shared components."
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <LessonSurfaceCard
          title="Lesson overview surface"
          description="Use for lesson entry points, lesson overview cards, and content summaries where the main job is orientation and structure."
          levelLabel="Higher"
          metaLabel="6 sections"
          primaryActionLabel="Open lesson"
          secondaryActionLabel="Preview content"
        />

        <PracticeSurfaceCard
          title="Practice task surface"
          description="Use for task blocks, revision prompts, and practice wrappers that need slightly more emphasis than a neutral content card."
          statusLabel="In progress"
          themeLabel="Theme 2"
          primaryActionLabel="Start practice"
          secondaryActionLabel="Back to module"
        />

        <div className="xl:col-span-2">
          <LockedContentCard
            title="Locked or premium surface"
            description="Use for premium upgrade prompts, locked blocks, or access-aware CTAs where you actually want more emotional weight and visibility."
            accessLabel="Full access"
            statusLabel="Locked"
            primaryActionLabel="Unlock full course"
            secondaryActionLabel="Compare access"
          />
        </div>
      </div>
    </UiLabSection>
  );
}

export function SemanticExtractionDirectionSection() {
  return (
    <UiLabSection
      title="Semantic extraction direction"
      description="These examples are still page-level references for now, but they help define what should become reusable components later."
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <AssessmentSurfaceCard
          title="Quiz or mock exam surface"
          description="Assessment wrappers should feel self-contained and serious, but not as promotional as a branded surface."
          typeLabel="Mock exam"
          metaLabel="12 questions"
          urgencyLabel="Timed"
          primaryActionLabel="Start mock exam"
          secondaryActionLabel="View instructions"
        />

        <SemanticSurfaceExample
          eyebrow="Progress / momentum"
          title="Revision milestone surface"
          surfaceVariant="default"
          badges={
            <>
              <Badge tone="success" icon="completed">
                Milestone reached
              </Badge>
              <Badge tone="default" icon="courses">
                Next module ready
              </Badge>
            </>
          }
          description="This kind of surface works for progress summaries, revision momentum moments, and encouraging next-step blocks."
          actions={
            <>
              <Button variant="soft" icon="next" iconPosition="right">
                Continue revision
              </Button>
              <Button variant="secondary" icon="preview">
                View progress
              </Button>
            </>
          }
        />
      </div>
    </UiLabSection>
  );
}

export function SurfaceIntentGuideSection() {
  return (
    <UiLabSection
      title="Surface intent guide"
      description="These rules make it easier to decide whether you should create a new semantic surface component or just reuse an existing foundational surface."
    >
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {surfaceIntentGuides.map((guide) => (
          <SurfaceIntentGuideCard
            key={guide.badge}
            badge={guide.badge}
            badgeTone={guide.badgeTone}
            title={guide.title}
            description={guide.description}
          />
        ))}
      </div>
    </UiLabSection>
  );
}
