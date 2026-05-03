import DevComponentMarker from "@/components/ui/dev-component-marker";

type TextBlockProps = {
  content: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";
const INLINE_TOKEN_PATTERN =
  /(\*\*[^*]+\*\*|==[^=]+==|\[\[(?:ru|en|key|accent|muted):[^\]]+\]\])/g;

type LessonProseBlock =
  | { type: "paragraph"; content: string; variant: "body" | "lead" | "key" }
  | { type: "quoteGroup"; lines: string[] }
  | { type: "list"; ordered: boolean; items: string[] };

function parseLessonProse(content: string): LessonProseBlock[] {
  const blocks: LessonProseBlock[] = [];
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  let paragraphLines: string[] = [];
  let listItems: string[] = [];
  let quoteLines: string[] = [];
  let listOrdered = false;

  function flushParagraph() {
    if (paragraphLines.length === 0) return;

    const rawContent = paragraphLines.join(" ").trim();
    paragraphLines = [];

    if (!rawContent) return;

    if (rawContent.startsWith("!! ")) {
      blocks.push({
        type: "paragraph",
        content: rawContent.slice(3).trim(),
        variant: "key",
      });
      return;
    }

    if (rawContent.startsWith("! ")) {
      blocks.push({
        type: "paragraph",
        content: rawContent.slice(2).trim(),
        variant: "lead",
      });
      return;
    }

    blocks.push({ type: "paragraph", content: rawContent, variant: "body" });
  }

  function flushList() {
    if (listItems.length === 0) return;

    blocks.push({ type: "list", ordered: listOrdered, items: listItems });
    listItems = [];
  }

  function flushQuotes() {
    if (quoteLines.length === 0) return;

    blocks.push({ type: "quoteGroup", lines: quoteLines });
    quoteLines = [];
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      flushQuotes();
      continue;
    }

    const orderedMatch = trimmed.match(/^\d+[.)]\s+(.+)$/);
    const unorderedMatch = trimmed.match(/^[-*]\s+(.+)$/);

    if (orderedMatch || unorderedMatch) {
      flushParagraph();
      flushQuotes();
      const nextOrdered = Boolean(orderedMatch);

      if (listItems.length > 0 && listOrdered !== nextOrdered) {
        flushList();
      }

      listOrdered = nextOrdered;
      listItems.push((orderedMatch?.[1] ?? unorderedMatch?.[1] ?? "").trim());
      continue;
    }

    flushList();

    if (trimmed.startsWith("> ")) {
      flushParagraph();
      quoteLines.push(trimmed.slice(2).trim());
      continue;
    }

    flushQuotes();
    paragraphLines.push(trimmed);
  }

  flushParagraph();
  flushList();
  flushQuotes();

  return blocks;
}

function renderInlineLessonText(content: string) {
  return content.split(INLINE_TOKEN_PATTERN).map((part, index) => {
    if (!part) return null;

    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-[var(--text-primary)]">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("==") && part.endsWith("==")) {
      return (
        <mark
          key={index}
          className="bg-transparent font-semibold text-[var(--accent-ink)] underline decoration-[color-mix(in_srgb,var(--accent)_34%,transparent)] decoration-2 underline-offset-4"
        >
          {part.slice(2, -2)}
        </mark>
      );
    }

    if (part.startsWith("[[") && part.endsWith("]]")) {
      const token = part.slice(2, -2);
      const separatorIndex = token.indexOf(":");
      const kind = token.slice(0, separatorIndex);
      const value = token.slice(separatorIndex + 1).trim();

      if (!value) return null;

      if (kind === "ru") {
        return (
          <span
            key={index}
            lang="ru"
            className="font-semibold text-[var(--text-primary)]"
          >
            {value}
          </span>
        );
      }

      if (kind === "en") {
        return (
          <span key={index} className="text-[var(--text-secondary)]">
            {value}
          </span>
        );
      }

      if (kind === "key" || kind === "accent") {
        return (
          <span key={index} className="font-semibold text-[var(--accent-ink)]">
            {value}
          </span>
        );
      }

      if (kind === "muted") {
        return (
          <span key={index} className="text-[var(--text-secondary)]">
            {value}
          </span>
        );
      }
    }

    return part;
  });
}

export default function TextBlock({ content }: TextBlockProps) {
  const blocks = parseLessonProse(content);

  return (
    <div className="dev-marker-host relative">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="TextBlock"
          filePath="src/components/lesson-blocks/text-block.tsx"
          tier="semantic"
          componentRole="Lesson text content block for prose instruction or explanation"
          bestFor="Student lesson sections that need focused explanatory text, grammar notes, or reading guidance."
          usageExamples={[
            "Grammar explanation",
            "Course introduction text",
            "Past paper strategy note",
            "Vocabulary context paragraph",
          ]}
          notes="Use for prose content only. Do not use for callouts, exam tips, vocabulary tables, or interactive questions."
        />
      ) : null}

      <section className="max-w-3xl space-y-4 px-1">
        {blocks.map((block, blockIndex) => {
          if (block.type === "paragraph") {
            const className =
              block.variant === "key"
                ? "border-l-2 border-[var(--accent-fill)] py-1 pl-4 text-base font-semibold leading-7 text-[var(--text-primary)]"
                : block.variant === "lead"
                  ? "text-lg leading-8 text-[var(--text-primary)]"
                  : "text-base leading-8 text-[var(--text-primary)]";

            return (
              <p key={blockIndex} className={className}>
                {renderInlineLessonText(block.content)}
              </p>
            );
          }

          if (block.type === "quoteGroup") {
            return (
              <div
                key={blockIndex}
                className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)]"
              >
                <div className="border-b border-[var(--border-subtle)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] app-text-soft">
                  Model
                </div>

                <div className="divide-y divide-[var(--border-subtle)]">
                  {block.lines.map((line, lineIndex) => (
                    <div
                      key={`${blockIndex}-${lineIndex}`}
                      className="grid gap-2 px-4 py-3 text-base leading-7 text-[var(--text-primary)] sm:grid-cols-[1.5rem_minmax(0,1fr)]"
                    >
                      <span className="pt-0.5 text-xs font-semibold app-text-soft">
                        {lineIndex + 1}
                      </span>
                      <p>{renderInlineLessonText(line)}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          const ListTag = block.ordered ? "ol" : "ul";

          return (
            <ListTag
              key={blockIndex}
              className={[
                "space-y-2 text-base leading-7 text-[var(--text-primary)]",
                block.ordered ? "list-decimal pl-6" : "list-disc pl-6",
              ].join(" ")}
            >
              {block.items.map((item, itemIndex) => (
                <li key={`${blockIndex}-${itemIndex}`}>{renderInlineLessonText(item)}</li>
              ))}
            </ListTag>
          );
        })}
      </section>
    </div>
  );
}
