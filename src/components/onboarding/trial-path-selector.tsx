"use client";

import { useState } from "react";
import { chooseTrialTierAction } from "@/app/actions/access/trial-access-actions";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";

type TrialTier = "foundation" | "higher";

const tierOptions = [
  {
    tier: "foundation",
    label: "Foundation Tier",
    gradeRange: "Targets grades 1–5",
    title: "A more supported route",
    description:
      "Best when Russian is new, confidence is still growing, or a more scaffolded pace would help.",
    tone: "success",
  },
  {
    tier: "higher",
    label: "Higher Tier",
    gradeRange: "Targets grades 4–9",
    title: "Keeps the top grades open",
    description:
      "Best when you already know some Russian or want to work towards the most ambitious GCSE grades.",
    tone: "info",
  },
] as const;

export default function TrialPathSelector({ nextPath }: { nextPath: string }) {
  const [selectedTier, setSelectedTier] = useState<TrialTier | null>(null);
  const selectedOption = tierOptions.find((option) => option.tier === selectedTier);

  return (
    <form action={chooseTrialTierAction} className="px-5 py-5 sm:px-6">
      <input type="hidden" name="source" value="onboarding" />
      <input type="hidden" name="next" value={nextPath} />
      <input type="hidden" name="tier" value={selectedTier ?? ""} />

      <fieldset>
        <legend className="sr-only">Choose a GCSE Russian trial tier</legend>
        <div className="grid gap-4 lg:grid-cols-2">
          {tierOptions.map((option) => {
            const selected = selectedTier === option.tier;

            return (
              <label
                key={option.tier}
                className={[
                  "relative flex cursor-pointer flex-col rounded-xl border p-5 transition",
                  selected
                    ? "border-[var(--accent-selected-border)] bg-[var(--surface-muted-bg)] shadow-[0_10px_24px_color-mix(in_srgb,var(--accent-border-ink)_14%,transparent)]"
                    : "border-[var(--border-subtle)] bg-[var(--background-muted)]/55 hover:border-[var(--accent-selected-border)]",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="tierChoice"
                  value={option.tier}
                  checked={selected}
                  onChange={() => setSelectedTier(option.tier)}
                  className="sr-only"
                />

                <span className="flex items-start justify-between gap-3">
                  <span className="flex flex-wrap gap-2">
                    <Badge tone={option.tone} icon="layers">
                      {option.label}
                    </Badge>
                    <Badge tone="muted">{option.gradeRange}</Badge>
                  </span>
                  <span
                    aria-hidden="true"
                    className={[
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
                      selected
                        ? "border-[var(--accent-selected-border)] bg-[var(--accent-fill)] text-[var(--accent-on-fill)]"
                        : "border-[var(--border-strong)] bg-[var(--background-elevated)] text-transparent",
                    ].join(" ")}
                  >
                    <AppIcon icon="completed" size={14} />
                  </span>
                </span>

                <span className="mt-4 app-heading-subsection">{option.title}</span>
                <span className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {option.description}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <section className="mt-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)]/55 p-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--background-elevated)] text-[var(--accent-ink)]">
            <AppIcon icon="info" size={16} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-[var(--text-primary)]">
              Not sure which tier to choose?
            </h2>
            <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
              Pick the description that sounds closest. You can review your route later
              from inside the app.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setSelectedTier("foundation")}
              >
                Russian is quite new
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setSelectedTier("higher")}
              >
                I know some Russian / aim for 7–9
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-live="polite"
        className={[
          "mt-4 rounded-xl border p-4",
          selectedOption
            ? "border-[var(--accent-selected-border)] bg-[var(--surface-muted-bg)]"
            : "border-[var(--border-subtle)] bg-[var(--background-elevated)]",
        ].join(" ")}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-[var(--text-primary)]">
              {selectedOption
                ? `${selectedOption.label} selected`
                : "Choose a tier to continue"}
            </p>
            <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
              {selectedOption
                ? `${selectedOption.gradeRange}. Your choice is not submitted until you continue.`
                : "Nothing has been changed yet."}
            </p>
          </div>
          <LoadingButton
            idleLabel={
              selectedOption ? `Continue with ${selectedOption.label}` : "Continue"
            }
            pendingLabel="Starting your trial..."
            idleIcon="next"
            iconPosition="right"
            variant="primary"
            disabled={!selectedOption}
            className="w-full sm:w-auto sm:shrink-0"
          />
        </div>
      </section>

      <div className="mt-5 flex flex-col gap-2 border-t border-[var(--border-subtle)] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            Looking for live teaching?
          </p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Volna School is separate from the self-study trial.
          </p>
        </div>
        <Button
          href="/online-classes"
          target="_blank"
          rel="noreferrer"
          variant="quiet"
          size="sm"
          icon="externalLink"
        >
          Compare Volna School
        </Button>
      </div>
    </form>
  );
}
