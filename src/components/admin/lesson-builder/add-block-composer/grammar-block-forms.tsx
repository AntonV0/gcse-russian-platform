"use client";

import { useMemo, useState } from "react";
import { createGrammarSetBlockAction } from "@/app/actions/admin/admin-lesson-builder-actions";
import type { LessonBuilderGrammarSetOption } from "@/components/admin/lesson-builder/lesson-builder-types";
import {
  BuilderHiddenFields,
  PendingStatusText,
  PendingSubmitButton,
  BUILDER_FIELD_CLASS,
  BUILDER_MUTED_INFO_BOX_CLASS,
  BUILDER_PRIMARY_BUTTON_CLASS,
  BUILDER_SELECT_CLASS,
} from "@/components/admin/lesson-builder/lesson-builder-ui";
import { getDefaultBlockData } from "@/lib/lessons/lesson-blocks";
import type { AddBlockFormProps } from "./shared";

type AddGrammarSetBlockFormProps = AddBlockFormProps & {
  grammarSetOptions: LessonBuilderGrammarSetOption[];
};

export function AddGrammarSetBlockForm(props: AddGrammarSetBlockFormProps) {
  const defaultData = getDefaultBlockData("grammar-set") as {
    title?: string;
    grammarSetSlug?: string;
  };
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [selectedSlug, setSelectedSlug] = useState(
    String(defaultData.grammarSetSlug ?? props.grammarSetOptions[0]?.slug ?? "")
  );

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

  const selectedGrammarSet =
    props.grammarSetOptions.find((option) => option.slug === selectedSlug) ?? null;

  if (props.grammarSetOptions.length === 0) {
    return (
      <div className="space-y-3 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-elevated)] px-4 py-5">
        <div className="text-sm font-semibold text-[var(--text-primary)]">
          No grammar sets yet
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          Create at least one grammar set with a slug before attaching it to a lesson
          block.
        </p>
      </div>
    );
  }

  return (
    <form action={createGrammarSetBlockAction} className="space-y-3">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="sectionId" value={props.sectionId} />

      <input
        name="title"
        placeholder="Optional heading"
        defaultValue={String(defaultData.title ?? "")}
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

        <select
          name="grammarSetSlug"
          required
          value={selectedSlug}
          onChange={(event) => setSelectedSlug(event.target.value)}
          className={BUILDER_SELECT_CLASS}
        >
          {filteredGrammarSetOptions.map((option) => (
            <option key={option.id} value={option.slug}>
              {option.title} - {option.slug} - {option.tier}
              {option.isPublished ? "" : " - draft"}
            </option>
          ))}
        </select>
      </div>

      <div className="text-xs app-text-soft">
        Showing {filteredGrammarSetOptions.length} of {props.grammarSetOptions.length}{" "}
        grammar set{props.grammarSetOptions.length === 1 ? "" : "s"}.
      </div>

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
          idleLabel="Add grammar-set block"
          pendingLabel="Adding grammar-set block..."
          className={BUILDER_PRIMARY_BUTTON_CLASS}
        />
        <PendingStatusText pendingText="Saving linked grammar set block..." />
      </div>
    </form>
  );
}
