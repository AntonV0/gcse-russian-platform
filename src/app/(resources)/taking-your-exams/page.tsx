import type { Metadata } from "next";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "Taking Your GCSE Russian Exams",
  description:
    "A practical guide to registering for GCSE Russian as a private candidate, arranging the speaking exam, and preparing with Volna School support.",
});

const registrationSteps = [
  {
    title: "Check where you can sit the exam",
    description:
      "Ask your school, college, or local exam centres whether they accept private candidates for Pearson Edexcel GCSE Russian.",
  },
  {
    title: "Confirm the full exam entry",
    description:
      "GCSE Russian includes listening, speaking, reading, and writing. Make sure the centre can enter you for the correct papers and tier.",
  },
  {
    title: "Arrange the speaking exam early",
    description:
      "The speaking component needs a suitable Russian-speaking examiner. Some centres can arrange this, while others may ask you to help source one.",
  },
  {
    title: "Prepare with exam conditions in mind",
    description:
      "Practise timed papers, speaking role plays, photo cards, and conversation topics before the final exam window.",
  },
];

const supportOptions = [
  "Private candidate planning",
  "Speaking exam preparation",
  "Short intensive speaking course",
  "Private tuition with a Volna School teacher",
  "Potential examiner support depending on location and availability",
];

export default function TakingYourExamsPage() {
  return (
    <main className="space-y-8">
      <PageIntroPanel
        eyebrow="Exam prep"
        title="Taking your GCSE Russian exams"
        description="A practical starting point for students who are studying independently and need to understand how to register, prepare, and arrange the speaking part of GCSE Russian."
        tone="student"
        badges={
          <>
            <Badge tone="info" icon="exam">
              Private candidates
            </Badge>
            <Badge tone="muted" icon="speaking">
              Speaking exam
            </Badge>
          </>
        }
        actions={
          <>
            <Button href="/exam-calendar" variant="secondary" icon="calendar">
              Exam calendar
            </Button>
            <Button href="/online-classes" variant="primary" icon="school">
              Volna School support
            </Button>
          </>
        }
      >
        <p className="max-w-3xl text-sm app-text-muted">
          Exam arrangements are handled by schools, colleges, and exam centres, so always
          confirm details directly with your chosen centre before relying on any plan.
        </p>
      </PageIntroPanel>

      <section className="grid gap-4 md:grid-cols-2">
        {registrationSteps.map((step, index) => (
          <DashboardCard key={step.title} title={`${index + 1}. ${step.title}`}>
            <p>{step.description}</p>
          </DashboardCard>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <DashboardCard title="The speaking exam is the part to plan carefully">
          <div className="space-y-3">
            <p>
              GCSE Russian speaking exams are not just a written paper at a desk. The
              centre needs someone suitable to conduct the speaking assessment in Russian
              and follow the exam board requirements.
            </p>
            <p>
              If you are a private candidate, ask about this early. It can affect which
              centre you choose and how much support you need before the exam.
            </p>
          </div>
        </DashboardCard>

        <DashboardCard title="How Volna School may help">
          <div className="space-y-4">
            <p>
              For students who want more than self-study, Volna School can support exam
              preparation through live teaching and speaking-focused practice.
            </p>
            <ul className="grid gap-2">
              {supportOptions.map((option) => (
                <li
                  key={option}
                  className="rounded-xl bg-[var(--background-muted)] px-3 py-2 text-sm text-[var(--text-primary)]"
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        </DashboardCard>
      </section>
    </main>
  );
}
