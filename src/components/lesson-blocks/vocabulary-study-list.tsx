"use client";

import { useState } from "react";
import AppIcon from "@/components/ui/app-icon";
import Button from "@/components/ui/button";
import { RussianText } from "@/components/typography/russian-text";

type VocabularyStudyItem = {
  russian: string;
  english: string;
  transliteration?: string | null;
};

type VocabularyStudyListProps = {
  items: VocabularyStudyItem[];
};

type StudyMode = "list" | "cards";

function getItemKey(item: VocabularyStudyItem, index: number) {
  return `${index}-${item.russian}-${item.english}`;
}

export default function VocabularyStudyList({ items }: VocabularyStudyListProps) {
  const [studyMode, setStudyMode] = useState<StudyMode>("list");
  const [showAllEnglish, setShowAllEnglish] = useState(true);
  const [revealedItemKeys, setRevealedItemKeys] = useState<Set<string>>(() => new Set());
  const [cardIndex, setCardIndex] = useState(0);
  const [isCardAnswerVisible, setIsCardAnswerVisible] = useState(false);
  const currentCardIndex = Math.min(cardIndex, Math.max(items.length - 1, 0));
  const currentCard = items[currentCardIndex];
  const cardProgressPercent =
    items.length > 0 ? Math.round(((currentCardIndex + 1) / items.length) * 100) : 0;

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

  function showCard(index: number) {
    setCardIndex(Math.max(0, Math.min(index, items.length - 1)));
    setIsCardAnswerVisible(false);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1 rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-1 shadow-[var(--shadow-xs)]">
          <Button
            type="button"
            onClick={() => setStudyMode("list")}
            variant={studyMode === "list" ? "primary" : "quiet"}
            size="sm"
            icon="list"
            aria-pressed={studyMode === "list"}
          >
            List
          </Button>
          <Button
            type="button"
            onClick={() => {
              setStudyMode("cards");
              setIsCardAnswerVisible(false);
            }}
            variant={studyMode === "cards" ? "primary" : "quiet"}
            size="sm"
            icon="brain"
            aria-pressed={studyMode === "cards"}
          >
            Flashcards
          </Button>
        </div>

        {studyMode === "list" ? (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => {
                setShowAllEnglish((isShowing) => !isShowing);
                setRevealedItemKeys(new Set());
              }}
              variant={showAllEnglish ? "secondary" : "primary"}
              size="sm"
              icon={showAllEnglish ? "hidden" : "preview"}
            >
              {showAllEnglish ? "Hide English" : "Show English"}
            </Button>

            {!showAllEnglish ? (
              <Button
                type="button"
                onClick={() =>
                  setRevealedItemKeys(
                    new Set(items.map((item, index) => getItemKey(item, index)))
                  )
                }
                variant="secondary"
                size="sm"
                icon="success"
              >
                Reveal all
              </Button>
            ) : null}
          </div>
        ) : null}

        {studyMode === "list" && !showAllEnglish ? (
          <div className="app-text-caption">
            {revealedItemKeys.size} of {items.length} revealed
          </div>
        ) : null}
      </div>

      {studyMode === "cards" && currentCard ? (
        <div className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-raised-bg)] shadow-[var(--shadow-sm)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-4 py-3">
            <div className="app-text-caption">
              Card {currentCardIndex + 1} of {items.length}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={() => showCard(currentCardIndex - 1)}
                disabled={currentCardIndex === 0}
                variant="secondary"
                size="sm"
                icon="back"
              >
                Previous
              </Button>
              <Button
                type="button"
                onClick={() => showCard(currentCardIndex + 1)}
                disabled={currentCardIndex >= items.length - 1}
                variant="secondary"
                size="sm"
                icon="next"
                iconPosition="right"
              >
                Next
              </Button>
            </div>
          </div>

          <div
            className="h-1 bg-[var(--background-muted)]"
            role="progressbar"
            aria-label="Vocabulary flashcard progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={cardProgressPercent}
          >
            <div
              className="h-full [background:var(--accent-progress-gradient)]"
              style={{ width: `${cardProgressPercent}%` }}
            />
          </div>

          <button
            type="button"
            onClick={() => setIsCardAnswerVisible((isVisible) => !isVisible)}
            aria-expanded={isCardAnswerVisible}
            aria-label={
              isCardAnswerVisible
                ? `Hide answer for card ${currentCardIndex + 1}`
                : `Show answer for card ${currentCardIndex + 1}`
            }
            className="app-focus-ring block w-full px-5 py-8 text-left transition hover:bg-[color-mix(in_srgb,var(--accent)_4%,transparent)] sm:px-7 sm:py-10"
          >
            <span className="flex min-h-[13rem] flex-col justify-center gap-6">
              <span className="space-y-3">
                <span className="app-text-caption">Russian</span>
                <RussianText
                  variant="term"
                  className="block text-2xl leading-tight sm:text-3xl"
                >
                  {currentCard.russian}
                </RussianText>
                {currentCard.transliteration ? (
                  <span className="block text-base app-text-soft">
                    {currentCard.transliteration}
                  </span>
                ) : null}
              </span>

              <span className="block border-t border-[var(--border-subtle)] pt-5">
                {isCardAnswerVisible ? (
                  <span className="block space-y-2">
                    <span className="app-text-caption">English</span>
                    <span className="block text-lg font-medium text-[var(--text-primary)]">
                      {currentCard.english}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--background-muted)] px-3 py-2 text-sm font-semibold text-[var(--text-secondary)]">
                      <AppIcon icon="hidden" size={16} />
                      Hide answer
                    </span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--accent-border-ink)_30%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,var(--background-elevated))] px-3 py-2 text-sm font-semibold text-[var(--accent-ink)] shadow-[0_6px_14px_color-mix(in_srgb,var(--accent)_8%,transparent)]">
                    <AppIcon icon="preview" size={16} />
                    Check answer
                  </span>
                )}
              </span>
            </span>
          </button>
        </div>
      ) : null}

      {studyMode === "list" ? (
        <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)]">
          {items.map((item, index) => {
            const itemKey = getItemKey(item, index);
            const isEnglishVisible = showAllEnglish || revealedItemKeys.has(itemKey);

            return (
              <div
                key={itemKey}
                className="group relative border-b border-[var(--border-subtle)] transition last:border-b-0 hover:bg-[var(--background-muted)]/45"
              >
                <div className="grid min-h-[4rem] gap-3 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-center">
                  <div className="flex min-w-0 gap-3">
                    <span className="mt-0.5 w-5 shrink-0 text-sm font-semibold app-text-soft">
                      {index + 1}
                    </span>
                    <span className="min-w-0">
                      <RussianText variant="term" className="block">
                        {item.russian}
                      </RussianText>
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
                      <Button
                        type="button"
                        onClick={() => toggleItem(itemKey)}
                        variant="secondary"
                        size="sm"
                        icon="preview"
                        className="w-full justify-center sm:w-auto"
                      >
                        Check
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
