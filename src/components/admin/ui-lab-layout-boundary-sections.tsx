import { UiLabLayoutDemoBlock } from "@/components/admin/ui-lab-layout-demo-block";
import UiLabSection from "@/components/admin/ui-lab-section";
import LessonFooterNav from "@/components/layout/lesson-footer-nav";
import LessonHeader from "@/components/layout/lesson-header";
import PageContainer from "@/components/layout/page-container";
import PageHeader from "@/components/layout/page-header";
import PlatformSidebar from "@/components/layout/platform-sidebar";
import SiteFooter from "@/components/layout/site-footer";
import Card from "@/components/ui/card";
import StatusSummaryCard from "@/components/ui/status-summary-card";
import Surface from "@/components/ui/surface";

function DemoProductionBoundaries() {
  return (
    <>
      <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Card className="max-h-[620px] overflow-auto p-3">
          <PlatformSidebar role="student" accessMode="full" pathname="/courses" />
        </Card>

        <div className="space-y-4">
          <Surface variant="muted" padding="md">
            <LessonHeader
              backHref="/courses"
              backLabel="Back to Theme 1"
              moduleTitle="Theme 1 / Identity and culture"
              lessonTitle="School and daily routine"
              lessonDescription="A realistic lesson header using the production reading-page component."
            />

            <Card className="p-4">
              <p className="text-sm app-text-muted">
                Lesson content sits between the header and footer navigation in the real
                student learning flow.
              </p>
            </Card>

            <LessonFooterNav
              moduleHref="/courses/theme-1"
              previousLesson={{
                href: "/courses/theme-1/family",
                label: "Family and relationships",
              }}
              nextLesson={{
                href: "/courses/theme-1/free-time",
                label: "Free time activities",
              }}
            />
          </Surface>

          <Card className="overflow-hidden">
            <SiteFooter />
          </Card>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatusSummaryCard
          title="AppShell"
          description="Active around the page; avoid rendering nested app shells inside UI Lab examples."
          badgeTone="info"
          badgeLabel="Boundary"
        />
        <StatusSummaryCard
          title="SiteHeader"
          description="Active at the top of the page, including theme and account utilities."
          badgeTone="success"
          badgeLabel="Visible"
        />
        <StatusSummaryCard
          title="LogoutButton"
          description="Displayed through PlatformSidebar and SiteHeader utility areas."
          badgeTone="muted"
          badgeLabel="Utility"
        />
      </div>
    </>
  );
}

function DemoPageBoundaries() {
  return (
    <PageContainer>
      <Surface variant="muted" padding="md">
        <PageHeader
          title="Vocabulary management"
          description="Manage GCSE Russian vocabulary sets, item counts, publication status, and theme coverage."
        />
        <div className="grid gap-4 md:grid-cols-3">
          <UiLabLayoutDemoBlock
            title="Sets"
            description="12 vocabulary sets configured."
          />
          <UiLabLayoutDemoBlock title="Items" description="438 words and phrases." />
          <UiLabLayoutDemoBlock title="Coverage" description="Themes 1-5 in progress." />
        </div>
      </Surface>
    </PageContainer>
  );
}

export function UiLabLayoutBoundarySections() {
  return (
    <>
      <UiLabSection
        id="boundary-components"
        title="Production layout boundaries"
        description="These are the real shared layout components, shown separately from future layout ideas. AppShell and SiteHeader are already active around this UI Lab page, so they are documented here rather than nested again."
      >
        <DemoProductionBoundaries />
      </UiLabSection>

      <UiLabSection
        id="page-boundaries"
        title="Page boundaries"
        description="Use PageContainer and PageHeader at the page layout boundary before composing internal sections."
      >
        <DemoPageBoundaries />
      </UiLabSection>
    </>
  );
}
