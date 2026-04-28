"use client";

import { useMemo, useState } from "react";
import { updateGrammarSetBlockAction } from "@/app/actions/admin/admin-lesson-builder-actions";
import type { LessonBuilderGrammarSetOption } from "@/components/admin/lesson-builder/lesson-builder-types";
import {
  BuilderHiddenFields,
  PendingStatusText,
  PendingSubmitButton,
  BUILDER_FIELD_CLASS,
  BUILDER_MUTED_INFO_BOX_CLASS,
  BUILDER_SECONDARY_BUTTON_CLASS,
  BUILDER_SELECT_CLASS,
} from "@/components/admin/lesson-builder/lesson-builder-ui";
import type { BlockEditorProps } from "./shared";

type GrammarSetBlockEditorProps = BlockEditorProps & {
  defaultTitle: string;
  defaultSlug: string;
  grammarSetOptions: LessonBuilderGrammarSetOption[];
};

export function GrammarSetBlockEditor(props: GrammarSetBlockEditorProps) {
  const hasMatchingOption = props.grammarSetOptions.some(
    (option) => option.slug === props.defaultSlug
  );
  const initialValue =
    hasMatchingOption || !props.defaultSlug
      ? props.defaultSlug
      : `__missing__:${props.defaultSlug}`;
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");

  const filteredGrammarSetOptions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return props.grammarSetOptions.filter((option) => {
      if (tierFilter !== "all" && option.tier !== tierFilter && option.tier !== "both") {
        return false;
      }

      if (!normalizedSearch) return true;

      return [
        option.title,
        option.slug,
        option.tier,
        option.themeKey,
        option.topicKey,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [props.grammarSetOptions, search, tierFilter]);

  const selectedGrammarSet = selectedValue.startsWith("__missing__:")
    ? null
    : (props.grammarSetOptions.find((option) => option.slug === selectedValue) ?? null);

  if (props.grammarSetOptions.length === 0 && !props.defaultSlug) {
    return (
      <div className="space-y-2 rounded-2xl border border-dashed border-[var(--border)] px-4 py-4 text-sm app-text-muted">
        <div>No grammar sets with slugs are available yet.</div>
        <div>Create a grammar set first, then return to attach it here.</div>
      </div>
    );
  }

  return (
    <form action={updateGrammarSetBlockAction} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="blockId" value={props.blockId} />

      <input
        name="title"
        defaultValue={props.defaultTitle}
        placeholder="Optional heading"
        className={BUILDER_FIELD_CLASS}
      />

      <div className="grid gap-2 md:grid-cols-2">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.preventDefault();
          }}
          placeholder="Filter grammar sets..."
          className={`${BUILDER_FIELD_CLASS} md:col-span-2`}
          aria-label="Filter grammar sets"
        />
        <select
          value={tierFilter}
          onChange={(event) => setTierFilter(event.target.value)}
          className={BUILDER_SELECT_CLASS}
          aria-label="Filter grammar sets by tier"
        >
          <option value="all">All tiers</option>
          <option value="foundation">Foundation</option>
          <option value="higher">Higher</option>
          <option value="both">Both tiers</option>
        </select>
      </div>

      <select
        name="grammarSetSlug"
        required
        value={selectedValue}
        onChange={(event) => setSelectedValue(event.target.value)}
        className={BUILDER_SELECT_CLASS}
      >
        {!hasMatchingOption && props.defaultSlug ? (
          <option value={`__missing__:${props.defaultSlug}`}>
            Missing set - {props.defaultSlug}
          </option>
        ) : null}
        <option value="" disabled>
          Choose a grammar set
        </option>

        {filteredGrammarSetOptions.map((option) => (
          <option key={option.id} value={option.slug}>
            {option.title} - {option.slug} - {option.tier}
            {option.isPublished ? "" : " - draft"}
          </option>
        ))}
      </select>

      <div className="text-xs app-text-soft">
        Showing {filteredGrammarSetOptions.length} of {props.grammarSetOptions.length}{" "}
        grammar set{props.grammarSetOptions.length === 1 ? "" : "s"}.
      </div>

      {!hasMatchingOption && props.defaultSlug ? (
        <div className="rounded-2xl border border-[color-mix(in_srgb,var(--warning)_24%,transparent)] bg-[var(--warning-soft)] px-3 py-3 text-sm text-[var(--warning)]">
          The currently linked grammar set slug no longer matches an available option.
          Choose a new set before saving.
        </div>
      ) : null}

      {selectedGrammarSet ? (
        <div className={BUILDER_MUTED_INFO_BOX_CLASS}>
          <div className="font-medium text-[var(--text-primary)]">
            {selectedGrammarSet.title}
          </div>
          <div className="mt-1 text-xs app-text-soft">
            Slug: {selectedGrammarSet.slug}
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-[var(--border)] bg-[var(--background-elevated)] px-2 py-1 text-[var(--text-secondary)]">
              {selectedGrammarSet.isPublished ? "Published" : "Draft"}
            </span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--background-elevated)] px-2 py-1 text-[var(--text-secondary)]">
              Tier: {selectedGrammarSet.tier}
            </span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--background-elevated)] px-2 py-1 text-[var(--text-secondary)]">
              {selectedGrammarSet.pointCount} point
              {selectedGrammarSet.pointCount === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel="Save grammar-set block"
          pendingLabel="Saving grammar-set block..."
          className={BUILDER_SECONDARY_BUTTON_CLASS}
        />
        <PendingStatusText pendingText="Updating linked grammar set..." />
      </div>
    </form>
  );
}
