import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import { getCurrentUser } from "@/lib/auth/auth";
import {
  getPublishedVocabularySetsDb,
  getVocabularyListModeLabel,
  getVocabularyTierLabel,
} from "@/lib/vocabulary/vocabulary-helpers-db";

export default async function VocabularyPage() {
  const user = await getCurrentUser();
  const vocabularySets = await getPublishedVocabularySetsDb();

  return (
    <main className="space-y-8">
      <PageHeader
        title="Vocabulary"
        description="Revise database-backed GCSE Russian vocabulary sets grouped for lessons, revision, and future study tools."
      />

      <section className="app-surface-brand app-section-padding-lg">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_320px] xl:items-start">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon="language">
                Vocabulary hub
              </Badge>
              <Badge tone="muted" icon="school">
                GCSE Russian
              </Badge>
            </div>

            <div className="space-y-2">
              <h2 className="app-title">Grow your word bank</h2>
              <p className="app-subtitle max-w-2xl">
                Browse reusable vocabulary sets from the platform database. This is the
                first version of the vocabulary area and will later grow into richer
                study, filtering, and revision tools.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button href="/courses" variant="primary" icon="courses">
                Back to courses
              </Button>

              <Button href="/dashboard" variant="secondary" icon="dashboard">
                Dashboard
              </Button>
            </div>
          </div>

          <DashboardCard title="What is already live">
            <div className="space-y-3">
              <p>
                This page now reads published vocabulary sets from the database instead of
                using placeholder theme cards.
              </p>

              <ul className="space-y-2">
                <li>• Published vocabulary sets</li>
                <li>• Item counts</li>
                <li>• Tier labels</li>
                <li>• List mode labels</li>
              </ul>
            </div>
          </DashboardCard>
        </div>
      </section>

      {vocabularySets.length === 0 ? (
        <DashboardCard title="No vocabulary sets published yet">
          <div className="space-y-3">
            <p>
              Once vocabulary sets are created in admin and published, they will appear
              here for students to browse and revise.
            </p>

            <Link
              href="/grammar"
              className="inline-flex items-center gap-2 font-medium app-brand-text"
            >
              Explore grammar
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </DashboardCard>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {vocabularySets.map((vocabularySet) => (
            <DashboardCard key={vocabularySet.id} title={vocabularySet.title}>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge tone="muted" icon="language">
                    {getVocabularyListModeLabel(vocabularySet.list_mode)}
                  </Badge>

                  <Badge tone="muted" icon="school">
                    {getVocabularyTierLabel(vocabularySet.tier)}
                  </Badge>
                </div>

                <p className="text-sm text-[var(--text-secondary)]">
                  {vocabularySet.description ?? "Vocabulary set ready for student use."}
                </p>

                <div className="rounded-xl bg-[var(--background-muted)] px-3 py-2 text-sm text-[var(--text-primary)]">
                  {vocabularySet.item_count} item
                  {vocabularySet.item_count === 1 ? "" : "s"}
                </div>

                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] px-3 py-2">
                    <span className="block text-xs font-medium uppercase tracking-wide app-text-soft">
                      Theme
                    </span>
                    <span className="text-[var(--text-primary)]">
                      {vocabularySet.theme_key ?? "General"}
                    </span>
                  </div>

                  <div className="rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] px-3 py-2">
                    <span className="block text-xs font-medium uppercase tracking-wide app-text-soft">
                      Topic
                    </span>
                    <span className="text-[var(--text-primary)]">
                      {vocabularySet.topic_key ?? "Mixed"}
                    </span>
                  </div>
                </div>
              </div>
            </DashboardCard>
          ))}
        </section>
      )}

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <DashboardCard title="What can come next">
          <div className="space-y-3">
            <p>
              The next vocabulary upgrades can add search, theme/topic filters,
              required-vs-extended separation, lesson linking, and richer vocab display
              modes.
            </p>

            <ul className="space-y-2">
              <li>• Required vs extended vocabulary</li>
              <li>• Theme and topic filters</li>
              <li>• Student-friendly display variants</li>
              <li>• Direct links into lessons</li>
            </ul>
          </div>
        </DashboardCard>

        <DashboardCard title="Keep learning">
          <div className="space-y-3">
            <p>
              Vocabulary works best when combined with lesson study, regular practice, and
              grammar support.
            </p>

            <Link
              href="/grammar"
              className="inline-flex items-center gap-2 font-medium app-brand-text"
            >
              Explore grammar
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </DashboardCard>
      </section>

      {!user ? (
        <DashboardCard title="Not signed in">
          Log in to connect future vocabulary tools to your student dashboard and course
          experience.
        </DashboardCard>
      ) : null}
    </main>
  );
}
