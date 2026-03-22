import { requireAdminAccess } from "@/lib/admin-auth";
import PageHeader from "@/components/layout/page-header";
import { createQuestionSetAction } from "@/app/actions/admin-question-actions";

export default async function CreateQuestionSetPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <main className="max-w-xl">
      <PageHeader
        title="Create Question Set"
        description="Add a new reusable question set."
      />

      <form action={createQuestionSetAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            name="title"
            required
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Slug</label>
          <input
            name="slug"
            required
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Instructions</label>
          <textarea
            name="instructions"
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          Create question set
        </button>
      </form>
    </main>
  );
}