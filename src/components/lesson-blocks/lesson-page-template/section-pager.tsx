"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import DevComponentMarker from "@/components/ui/dev-component-marker";
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
const DESKTOP_QUERY = "(min-width: 1280px)";
const DOCK_BOTTOM_GAP = 16;

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

    const mediaQuery = window.matchMedia(DESKTOP_QUERY);
    let frameId = 0;

    function resetDock() {
      dock.style.removeProperty("position");
      dock.style.removeProperty("left");
      dock.style.removeProperty("right");
      dock.style.removeProperty("bottom");
      dock.style.removeProperty("width");
      dock.style.removeProperty("z-index");
    }

    function updateDock() {
      window.cancelAnimationFrame(frameId);

      frameId = window.requestAnimationFrame(() => {
        if (!mediaQuery.matches) {
          resetDock();
          return;
        }

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
      });
    }

    updateDock();

    window.addEventListener("scroll", updateDock, { passive: true });
    window.addEventListener("resize", updateDock);
    window.visualViewport?.addEventListener("resize", updateDock);
    mediaQuery.addEventListener("change", updateDock);

    return () => {
      window.cancelAnimationFrame(frameId);
      resetDock();
      window.removeEventListener("scroll", updateDock);
      window.removeEventListener("resize", updateDock);
      window.visualViewport?.removeEventListener("resize", updateDock);
      mediaQuery.removeEventListener("change", updateDock);
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
      className="sticky bottom-0 z-30 -mb-8 overflow-hidden pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-5 lg:pb-3 xl:static xl:mb-0 xl:overflow-visible xl:bg-[var(--background)] xl:pb-0 xl:pt-0 xl:before:pointer-events-none xl:before:absolute xl:before:inset-x-0 xl:before:-top-10 xl:before:h-10 xl:before:bg-gradient-to-b xl:before:from-transparent xl:before:via-[color-mix(in_srgb,var(--background)_78%,transparent)] xl:before:to-[var(--background)] xl:before:content-[''] xl:after:pointer-events-none xl:after:absolute xl:after:inset-x-0 xl:after:-bottom-4 xl:after:h-4 xl:after:bg-[var(--background)] xl:after:content-['']"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-transparent via-[color-mix(in_srgb,var(--background-elevated)_82%,transparent)] to-[var(--background-elevated)] xl:hidden"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[calc(100%-1.25rem)] bg-[var(--background-elevated)] xl:hidden"
        aria-hidden="true"
      />
      <div className="dev-marker-host relative flex w-full flex-col gap-3 rounded-xl border border-[color-mix(in_srgb,var(--accent)_18%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--background-elevated)_96%,var(--accent-soft))] px-3 py-3 shadow-[0_6px_14px_color-mix(in_srgb,var(--text-primary)_6%,transparent)] sm:flex-row sm:items-center sm:justify-between">
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] app-text-soft">
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

        <div className="app-mobile-action-stack flex flex-col gap-3 sm:flex-row">
          {previousHref ? (
            <Link
              href={previousHref}
              prefetch={false}
              className="app-btn-base app-btn-secondary min-h-10 rounded-xl px-4 py-2 text-sm"
            >
              Back
            </Link>
          ) : (
            <span className="flex min-h-10 items-center justify-center rounded-xl border border-[var(--border)] px-4 py-2 text-sm app-text-soft">
              Back
            </span>
          )}

          {nextHref ? (
            <Link
              href={nextHref}
              prefetch={false}
              className="app-btn-base app-btn-primary min-h-10 rounded-xl px-4 py-2 text-sm !text-[var(--text-inverse)]"
            >
              Next
            </Link>
          ) : (
            <span className="flex min-h-10 items-center justify-center rounded-xl border border-[var(--border)] px-4 py-2 text-sm app-text-soft">
              Recap reached
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
