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

function DemoFontSystemPreview() {
  return (
    <div className="space-y-4">
      <PanelCard
        title="Live direction now applied"
        description="The base UI direction is now a warmer humanist sans stack with a neutral sans fallback."
        contentClassName="space-y-4"
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="success">Current direction</Badge>
          <Badge tone="muted">Humanist sans</Badge>
          <Badge tone="muted">English + Russian safe stack</Badge>
        </div>

        <p className="text-sm app-text-muted">
          This is still a system-stack direction, not a final hosted font decision. It
          lets the product feel warmer right now while keeping performance and
          implementation simple.
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
