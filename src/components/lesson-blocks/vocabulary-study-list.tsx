"use client";

import { useState } from "react";
import AppIcon from "@/components/ui/app-icon";
import { getButtonClassName } from "@/components/ui/button-styles";

type VocabularyStudyItem = {
  russian: string;
  english: string;
  transliteration?: string | null;
};

type VocabularyStudyListProps = {
  items: VocabularyStudyItem[];
};

function getItemKey(item: VocabularyStudyItem, index: number) {
  return `${index}-${item.russian}-${item.english}`;
}

export default function VocabularyStudyList({ items }: VocabularyStudyListProps) {
  const [showAllEnglish, setShowAllEnglish] = useState(true);
  const [revealedItemKeys, setRevealedItemKeys] = useState<Set<string>>(() => new Set());

  function toggleItem(itemKey: string) {
    setRevealedItemKeys((currentKeys) => {
      const nextKeys = new Set(currentKeys);

      if (nextKeys.has(itemKey)) {
        nextKeys.delete(itemKey);
      } else {
        nextKeys.add(itemKey);
      }

      return nextKeys;
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setShowAllEnglish((isShowing) => !isShowing);
              setRevealedItemKeys(new Set());
            }}
            className={getButtonClassName({
              variant: showAllEnglish ? "secondary" : "primary",
              size: "sm",
            })}
          >
            <AppIcon icon={showAllEnglish ? "hidden" : "preview"} size={15} />
            <span>{showAllEnglish ? "Hide English" : "Show English"}</span>
          </button>

          {!showAllEnglish ? (
            <button
              type="button"
              onClick={() =>
                setRevealedItemKeys(
                  new Set(items.map((item, index) => getItemKey(item, index)))
                )
              }
              className={getButtonClassName({ variant: "secondary", size: "sm" })}
            >
              <AppIcon icon="success" size={15} />
              <span>Reveal all</span>
            </button>
          ) : null}
        </div>

        {!showAllEnglish ? (
          <div className="app-text-caption">
            {revealedItemKeys.size} of {items.length} revealed
          </div>
        ) : null}
      </div>

      <div className="grid gap-2 xl:grid-cols-2">
        {items.map((item, index) => {
          const itemKey = getItemKey(item, index);
          const isEnglishVisible = showAllEnglish || revealedItemKeys.has(itemKey);

          return (
            <div
              key={itemKey}
              className="group relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-muted-bg)] shadow-[var(--shadow-xs)] transition hover:border-[color-mix(in_srgb,var(--accent)_24%,var(--border-strong))] hover:bg-[var(--background-elevated)]"
            >
              <div className="absolute inset-y-0 left-0 w-1 bg-[var(--accent-fill)] opacity-70" />

              <div className="grid min-h-[4.75rem] gap-3 px-4 py-3.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-center sm:pl-5">
                <div className="flex min-w-0 gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background-elevated)] text-xs font-semibold text-[var(--text-muted)]">
                    {index + 1}
                  </span>
                  <span className="min-w-0">
                    <span lang="ru" className="block app-vocab-term">
                      {item.russian}
                    </span>
                    {item.transliteration ? (
                      <span className="mt-1 block text-sm app-text-soft">
                        {item.transliteration}
                      </span>
                    ) : null}
                  </span>
                </div>

                <div className="min-w-0 border-t border-[var(--border-subtle)] pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
                  {isEnglishVisible ? (
                    <div className="text-[var(--text-secondary)]">{item.english}</div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleItem(itemKey)}
                      className={getButtonClassName({
                        variant: "secondary",
                        size: "sm",
                        className: "w-full justify-center sm:w-auto",
                      })}
                    >
                      <AppIcon icon="preview" size={15} />
                      <span>Check</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
