"use client";

import { useEffect, useRef } from "react";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import Button from "@/components/ui/button";
import { buildLessonStepHref } from "./lesson-step-routes";

type SectionPagerProps = {
  currentStepIndex: number;
  allowedMaxIndex: number;
  totalSteps: number;
  sectionTitle: string;
  courseSlug: string;
  variantSlug: string;
  moduleSlug: string;
  lessonSlug: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";
const DOCK_BOTTOM_GAP = 16;
const SHADOW_FADE_DISTANCE = 110;

export function SectionPager({
  currentStepIndex,
  allowedMaxIndex,
  totalSteps,
  sectionTitle,
  courseSlug,
  variantSlug,
  moduleSlug,
  lessonSlug,
}: SectionPagerProps) {
  const dockRef = useRef<HTMLDivElement>(null);
  const hasPrevious = currentStepIndex > 0;
  const hasNext = currentStepIndex < Math.min(allowedMaxIndex, totalSteps - 1);
  const currentStepNumber = currentStepIndex + 1;

  useEffect(() => {
    const dockElement = dockRef.current;
    if (dockElement === null) return;

    const dockColumn = dockElement.parentElement;
    if (dockColumn === null) return;

    const dock = dockElement;
    const column = dockColumn;

    let frameId = 0;

    function resetDock() {
      dock.style.removeProperty("position");
      dock.style.removeProperty("left");
      dock.style.removeProperty("right");
      dock.style.removeProperty("bottom");
      dock.style.removeProperty("width");
      dock.style.removeProperty("z-index");
      dock.style.removeProperty("--lesson-pager-bottom-offset");
      document.body.style.removeProperty("--lesson-bottom-backing-height");
      document.body.style.removeProperty("--lesson-bottom-backing-left");
      document.body.style.removeProperty("--lesson-bottom-backing-offset");
      document.body.style.removeProperty("--lesson-bottom-backing-width");
    }

    function updateShadowOpacity(bottomOffset = 0) {
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const dockHeight = dock.offsetHeight;
      const dockTop = viewportHeight - bottomOffset - dockHeight;
      const slotTop = column.getBoundingClientRect().top;
      const distanceToNaturalDock = slotTop - dockTop;
      const opacity = Math.max(
        0,
        Math.min(1, distanceToNaturalDock / SHADOW_FADE_DISTANCE)
      );
      const borderOpacity = 1 - opacity;

      dock.style.setProperty("--lesson-pager-shadow-opacity", opacity.toFixed(3));
      dock.style.setProperty(
        "--lesson-pager-top-border-opacity",
        borderOpacity.toFixed(3)
      );
      dock.style.setProperty(
        "--lesson-pager-top-border-color",
        `color-mix(in srgb, color-mix(in srgb, var(--accent-border-ink) 30%, var(--border-subtle)) ${(borderOpacity * 100).toFixed(1)}%, transparent)`
      );
    }

    function updateDock() {
      window.cancelAnimationFrame(frameId);

      frameId = window.requestAnimationFrame(() => {
        const columnRect = column.getBoundingClientRect();
        const footer = document.querySelector<HTMLElement>("[data-site-footer]");
        const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
        const footerTop = footer?.getBoundingClientRect().top ?? viewportHeight;
        const bottomOffset = Math.max(
          DOCK_BOTTOM_GAP,
          viewportHeight - footerTop + DOCK_BOTTOM_GAP
        );

        dock.style.position = "fixed";
        dock.style.left = `${(columnRect.left - 1).toFixed(2)}px`;
        dock.style.bottom = `${bottomOffset.toFixed(2)}px`;
        dock.style.width = `${(columnRect.width + 2).toFixed(2)}px`;
        dock.style.zIndex = "30";
        dock.style.setProperty(
          "--lesson-pager-bottom-offset",
          `${bottomOffset.toFixed(2)}px`
        );
        document.body.style.setProperty(
          "--lesson-bottom-backing-height",
          `${(dock.offsetHeight + DOCK_BOTTOM_GAP).toFixed(2)}px`
        );
        document.body.style.setProperty(
          "--lesson-bottom-backing-left",
          `${(columnRect.left - 1).toFixed(2)}px`
        );
        document.body.style.setProperty(
          "--lesson-bottom-backing-offset",
          `${Math.max(0, bottomOffset - DOCK_BOTTOM_GAP).toFixed(2)}px`
        );
        document.body.style.setProperty(
          "--lesson-bottom-backing-width",
          `${(columnRect.width + 2).toFixed(2)}px`
        );

        updateShadowOpacity(bottomOffset);
      });
    }

    updateDock();

    window.addEventListener("scroll", updateDock, { passive: true });
    window.addEventListener("resize", updateDock);
    window.visualViewport?.addEventListener("resize", updateDock);

    return () => {
      window.cancelAnimationFrame(frameId);
      resetDock();
      window.removeEventListener("scroll", updateDock);
      window.removeEventListener("resize", updateDock);
      window.visualViewport?.removeEventListener("resize", updateDock);
    };
  }, []);

  const previousHref = hasPrevious
    ? buildLessonStepHref({
        courseSlug,
        variantSlug,
        moduleSlug,
        lessonSlug,
        stepNumber: currentStepIndex,
      })
    : null;

  const nextHref = hasNext
    ? buildLessonStepHref({
        courseSlug,
        variantSlug,
        moduleSlug,
        lessonSlug,
        stepNumber: currentStepIndex + 2,
      })
    : null;

  return (
    <div
      ref={dockRef}
      className="app-section-pager-dock sticky bottom-0 z-30 -mb-8 overflow-visible pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-5 lg:pb-3 xl:static xl:mb-0 xl:pb-0 xl:pt-0"
    >
      <div className="app-section-pager-card dev-marker-host relative flex w-full flex-col gap-3 rounded-b-xl rounded-t-none border border-[color-mix(in_srgb,var(--accent-border-ink)_30%,var(--border-subtle))] px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        {SHOW_UI_DEBUG ? (
          <DevComponentMarker
            componentName="SectionPager"
            filePath="src/components/lesson-blocks/lesson-page-template/section-pager.tsx"
            tier="semantic"
            componentRole="In-lesson section pager for moving between unlocked lesson steps"
            bestFor="Section-based lesson pages where students move sequentially through unlocked content."
            usageExamples={[
              "Foundation lesson section navigation",
              "Higher lesson step flow",
              "Volna assignment lesson steps",
              "Student course progression",
            ]}
            notes="Use for section-step navigation inside one lesson. Do not use for previous/next lesson navigation."
          />
        ) : null}

        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] app-text-soft">
            Lesson section
          </p>
          <p className="mt-0.5 text-sm font-semibold text-[var(--text-primary)]">
            {sectionTitle}
            <span className="font-medium app-text-muted">
              {" "}
              - {currentStepNumber} of {totalSteps}
            </span>
          </p>
        </div>

        <div className="app-mobile-action-stack flex flex-row gap-2 sm:gap-3">
          {previousHref ? (
            <Button
              href={previousHref}
              prefetch={false}
              variant="secondary"
              size="sm"
              className="min-h-10 flex-1 rounded-xl px-4 py-2 text-sm sm:flex-none"
            >
              Back
            </Button>
          ) : (
            <span className="flex min-h-10 flex-1 items-center justify-center rounded-xl border border-[var(--border)] px-4 py-2 text-sm app-text-soft sm:flex-none">
              Back
            </span>
          )}

          {nextHref ? (
            <Button
              href={nextHref}
              prefetch={false}
              variant="journey"
              size="sm"
              icon="next"
              iconPosition="right"
              className="min-h-10 flex-1 rounded-xl px-4 py-2 text-sm !text-[var(--text-inverse)] sm:flex-none"
            >
              Next
            </Button>
          ) : (
            <span className="flex min-h-10 flex-1 items-center justify-center rounded-xl border border-[var(--border)] px-4 py-2 text-sm app-text-soft sm:flex-none">
              Recap reached
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
