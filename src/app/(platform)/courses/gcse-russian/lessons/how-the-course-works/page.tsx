import PageHeader from "@/components/layout/page-header";

export default function HowTheCourseWorksLessonPage() {
  return (
    <main>
      <PageHeader
        title="How the course works"
        description="This is the first placeholder lesson page."
      />

      <section className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <p className="text-gray-700">
          This page will later render structured lesson blocks such as text,
          notes, vocabulary, audio, and question sets.
        </p>

        <p className="text-gray-700">
          For now, this confirms that the lesson route structure works.
        </p>
      </section>
    </main>
  );
}