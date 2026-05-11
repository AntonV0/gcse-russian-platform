import {
  TYPOGRAPHY_FONT_EXAMPLES,
  TYPOGRAPHY_FUTURE_ITEMS,
  TYPOGRAPHY_RULES,
} from "@/components/admin/ui-lab/typography/ui-lab-typography-data";
import UiLabFutureSection from "@/components/admin/ui-lab/shell/ui-lab-future-section";
import UiLabSection from "@/components/admin/ui-lab/shell/ui-lab-section";
import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PanelCard from "@/components/ui/panel-card";

const FONT_QA_SPECIMENS = [
  {
    title: "English hierarchy",
    label: "Student dashboard heading",
    content: "Build confidence before the exam",
    description:
      "Checks whether the chosen heading weight feels premium, direct, and warm without shouting.",
    language: "en",
    className: "text-3xl font-extrabold leading-[1.08]",
  },
  {
    title: "Cyrillic vocabulary",
    label: "Phrase card",
    content: "Здравствуйте. Меня зовут...",
    description: "Checks common student-facing Cyrillic at a strong vocabulary weight.",
    language: "ru",
    className: "text-2xl font-bold leading-snug",
  },
  {
    title: "Long Russian words",
    label: "Stress case",
    content: "достопримечательность, путешествовать, преподавательница",
    description: "Checks wrapping, counters, and dense Cyrillic rhythm in longer words.",
    language: "ru",
    className: "text-xl font-bold leading-snug",
  },
  {
    title: "Glyph clarity",
    label: "ё / й / щ / ж",
    content: "семьёй, хороший, ещё, жизнь, следующий",
    description: "Checks the Russian letters students often misread or mistype.",
    language: "ru",
    className: "text-xl font-semibold leading-snug",
  },
  {
    title: "Mixed prompt",
    label: "Translation prompt",
    content: "Next summer I am going to travel with my family.",
    russianContent: "Следующим летом я буду путешествовать с семьёй.",
    description: "Checks English and Russian in one learning surface.",
    language: "mixed",
    className: "text-lg font-bold leading-snug",
  },
  {
    title: "Compact UI",
    label: "Metadata and numbers",
    content: "Step 7 of 8 · 12 questions ready · 1RU0 Foundation",
    description: "Checks labels, numerals, and exam-code text in small UI.",
    language: "en",
    className: "text-sm font-semibold leading-6",
  },
] as const;

function DemoFontQa() {
  return (
    <div className="space-y-4">
      <PanelCard
        title="Chosen font"
        description="Manrope is now the primary app font. This section exists to keep English, Cyrillic, and mixed learning text under review."
        contentClassName="space-y-4"
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="success">Manrope</Badge>
          <Badge tone="muted">Latin + Cyrillic</Badge>
          <Badge tone="muted">Single product font</Badge>
        </div>

        <p className="max-w-3xl app-text-body-muted">
          Use one font family across headings, lesson prose, navigation, forms, and admin.
          Distinction comes from role-based weights and spacing, not from switching
          typefaces.
        </p>
      </PanelCard>

      <div className="grid gap-4 xl:grid-cols-3">
        {FONT_QA_SPECIMENS.map((specimen) => (
          <PanelCard
            key={specimen.title}
            title={specimen.title}
            description={specimen.description}
            contentClassName="space-y-4"
          >
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] app-text-soft">
              {specimen.label}
            </div>
            {specimen.language === "mixed" ? (
              <p className={[specimen.className, "text-[var(--text-primary)]"].join(" ")}>
                <span>{specimen.content}</span>{" "}
                <span lang="ru">{specimen.russianContent}</span>
              </p>
            ) : (
              <p
                lang={specimen.language === "ru" ? "ru" : undefined}
                className={[specimen.className, "text-[var(--text-primary)]"].join(" ")}
              >
                {specimen.content}
              </p>
            )}
          </PanelCard>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PanelCard
          title="Lesson card QA"
          description="A compact learning surface with the same role weights used in real lessons."
          contentClassName="space-y-4"
        >
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-muted)] p-4">
            <div className="text-sm font-semibold text-[var(--text-primary)]">
              Vocabulary check
            </div>
            <div lang="ru" className="mt-3 text-2xl font-bold leading-snug">
              Здравствуйте. Меня зовут...
            </div>
            <div className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              Hello / good day. My name is...
            </div>
          </div>
        </PanelCard>

        <PanelCard
          title="Mixed-script prompt QA"
          description="Prompt and model-answer text should feel related, not like a fallback font changed underneath."
          contentClassName="space-y-4"
        >
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-4">
            <div className="text-sm font-semibold text-[var(--accent-ink)]">
              Translation prompt
            </div>
            <p className="mt-2 text-lg font-bold leading-snug text-[var(--text-primary)]">
              Next summer I am going to travel with my family.
            </p>
            <p lang="ru" className="mt-3 text-base font-medium leading-7">
              Следующим летом я буду путешествовать с семьёй.
            </p>
          </div>
        </PanelCard>
      </div>
    </div>
  );
}

function DemoFontSystemPreview() {
  return (
    <div className="space-y-4">
      <PanelCard
        title="Live direction now applied"
        description="Manrope is the product font for student learning, marketing, admin tools, and mixed English/Russian content."
        contentClassName="space-y-4"
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="success">Current direction</Badge>
          <Badge tone="muted">Manrope</Badge>
          <Badge tone="muted">English + Russian</Badge>
        </div>

        <p className="text-sm app-text-muted">
          The app uses one hosted font family for its core brand voice. Mono and emoji
          remain narrow exceptions for technical fields and avatar controls.
        </p>
      </PanelCard>

      <div className="grid gap-4 xl:grid-cols-2">
        {TYPOGRAPHY_FONT_EXAMPLES.map((example) => (
          <PanelCard
            key={example.title}
            title={example.title}
            description={example.note}
            contentClassName="space-y-4"
          >
            {example.kind === "title" ? (
              <div className="space-y-3">
                <div className="app-label">English</div>
                <div className="app-heading-page">{example.english}</div>

                <div className="app-label pt-2">Russian</div>
                <div lang="ru" className="app-heading-page">
                  {example.russian}
                </div>
              </div>
            ) : null}

            {example.kind === "section" ? (
              <div className="space-y-3">
                <div>
                  <div className="app-label">English</div>
                  <div className="mt-2 app-heading-section">{example.english}</div>
                </div>

                <div>
                  <div className="app-label">Russian</div>
                  <div lang="ru" className="mt-2 app-heading-section">
                    {example.russian}
                  </div>
                </div>
              </div>
            ) : null}

            {example.kind === "body" ? (
              <div className="space-y-4">
                <div>
                  <div className="app-label">English</div>
                  <p className="mt-2 app-lesson-prose">{example.english}</p>
                </div>

                <div>
                  <div className="app-label">Russian</div>
                  <p lang="ru" className="mt-2 app-russian-text">
                    {example.russian}
                  </p>
                </div>
              </div>
            ) : null}

            {example.kind === "form" ? (
              <div className="space-y-4">
                <FormField
                  label={example.english}
                  description="Shown in admin tools, CMS forms, and settings screens."
                >
                  <Input placeholder="School and daily routine" />
                </FormField>

                <FormField
                  label={example.russian}
                  description="Показывается в формах, настройках и редакторе контента."
                >
                  <Input placeholder="Школа и распорядок дня" />
                </FormField>
              </div>
            ) : null}
          </PanelCard>
        ))}
      </div>
    </div>
  );
}

function DemoLessonContentTypography() {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <PanelCard
        title="Vocabulary block"
        description="Lesson content should stay readable in both languages at a glance."
        contentClassName="space-y-3"
      >
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4">
          <div className="app-label">New word</div>
          <div lang="ru" className="mt-2 app-vocab-term">
            путешествовать
          </div>
          <div className="mt-2 app-text-caption">to travel</div>
          <p className="mt-3 app-text-body">
            Use it when talking about holidays, transport, and future plans.
          </p>
        </div>
      </PanelCard>

      <PanelCard
        title="Exam tip"
        description="Short guidance blocks need strong hierarchy and quick scanning."
        contentClassName="space-y-3"
      >
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)] p-4">
          <div className="app-label">Exam tip</div>
          <div className="mt-2 app-heading-card">Include a future time marker</div>
          <p className="mt-2 app-text-body-muted">
            Add words like{" "}
            <span lang="ru" className="app-russian-text inline font-medium">
              завтра
            </span>
            ,{" "}
            <span lang="ru" className="app-russian-text inline font-medium">
              на следующей неделе
            </span>
            , or{" "}
            <span lang="ru" className="app-russian-text inline font-medium">
              я буду
            </span>{" "}
            to make your timeframe clear.
          </p>
        </div>
      </PanelCard>

      <PanelCard
        title="Translation prompt"
        description="Prompt and answer areas need calm typography, not visual noise."
        contentClassName="space-y-3"
      >
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4">
          <div className="app-label">Translate into Russian</div>
          <p className="mt-2 app-question-prompt">
            Next summer I am going to travel to Russia with my family.
          </p>
          <div className="mt-4 rounded-xl border border-dashed border-[var(--border)] px-3 py-4 app-text-caption">
            Student answer area
          </div>
        </div>
      </PanelCard>
    </div>
  );
}

function DemoTypographyRules() {
  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {TYPOGRAPHY_RULES.map((rule) => (
        <Card key={rule} className="p-4">
          <p className="app-text-body-muted">{rule}</p>
        </Card>
      ))}
    </div>
  );
}

export function UiLabTypographyContentSections() {
  return (
    <>
      <UiLabSection
        title="Applied font direction"
        description="The current base direction is now tested against real English and Russian product content."
      >
        <DemoFontSystemPreview />
      </UiLabSection>

      <UiLabSection
        id="lesson-copy"
        title="Lesson-content typography"
        description="Typography should also hold up inside actual study patterns, not just admin UI."
      >
        <DemoLessonContentTypography />
      </UiLabSection>

      <UiLabSection
        title="Typography rules"
        description="Keep these principles stable as more product areas are built."
      >
        <DemoTypographyRules />
      </UiLabSection>

      <UiLabFutureSection items={TYPOGRAPHY_FUTURE_ITEMS} />
    </>
  );
}

export function UiLabTypographyFontPrototypeSection() {
  return (
    <UiLabSection
      id="font-prototypes"
      title="Font QA"
      description="Permanent Manrope checks for English, Cyrillic, mixed learning text, long words, glyph clarity, and compact labels."
    >
      <DemoFontQa />
    </UiLabSection>
  );
}
