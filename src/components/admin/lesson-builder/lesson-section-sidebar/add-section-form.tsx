"use client";

import { createSectionAction } from "@/app/actions/admin/admin-lesson-builder-actions";
import type { RouteFields } from "@/components/admin/lesson-builder/lesson-builder-types";
import { SECTION_KIND_OPTIONS } from "@/components/admin/lesson-builder/lesson-builder-types";
import {
  BuilderHiddenFields,
  PendingStatusText,
  PendingSubmitButton,
  BUILDER_FIELD_CLASS,
  BUILDER_PRIMARY_BUTTON_CLASS,
  BUILDER_SELECT_CLASS,
} from "@/components/admin/lesson-builder/lesson-builder-ui";
import { VARIANT_VISIBILITY_OPTIONS } from "./sidebar-primitives";

export function AddSectionForm({ routeFields }: { routeFields: RouteFields }) {
  return (
    <form action={createSectionAction} className="space-y-3">
      <BuilderHiddenFields {...routeFields} />

      <div>
        <label className="mb-1 block text-sm font-semibold text-[var(--text-primary)]">
          Section title
        </label>
        <input
          name="title"
          required
          placeholder="Introduction"
          className={BUILDER_FIELD_CLASS}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-[var(--text-primary)]">
          Description
        </label>
        <input
          name="description"
          placeholder="Optional short description"
          className={BUILDER_FIELD_CLASS}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-[var(--text-primary)]">
          Section kind
        </label>
        <select
          name="sectionKind"
          defaultValue="content"
          className={BUILDER_SELECT_CLASS}
        >
          {SECTION_KIND_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-[var(--text-primary)]">
          Variant visibility
        </label>
        <select
          name="variantVisibility"
          defaultValue="shared"
          className={BUILDER_SELECT_CLASS}
        >
          {VARIANT_VISIBILITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-[var(--text-primary)]">
          Canonical section key
        </label>
        <input
          name="canonicalSectionKey"
          placeholder="Optional shared progress key"
          className={BUILDER_FIELD_CLASS}
        />
      </div>

      <div className="space-y-2">
        <PendingSubmitButton
          idleLabel="Add section"
          pendingLabel="Adding section..."
          className={`w-full ${BUILDER_PRIMARY_BUTTON_CLASS}`}
        />
        <PendingStatusText pendingText="Creating section..." />
      </div>
    </form>
  );
}
