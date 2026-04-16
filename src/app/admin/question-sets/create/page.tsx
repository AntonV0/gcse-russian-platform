import { requireAdminAccess } from "@/lib/auth/admin-auth";
import PageHeader from "@/components/layout/page-header";
import { createQuestionSetAction } from "@/app/actions/admin/admin-question-actions";

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
          <input name="title" required className="w-full rounded border px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Slug</label>
          <input name="slug" required className="w-full rounded border px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea name="description" className="w-full rounded border px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Instructions</label>
          <textarea name="instructions" className="w-full rounded border px-3 py-2" />
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="mb-2 font-semibold">Template Settings</h2>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isTemplate" value="true" />
            Save as template
          </label>

          <div className="mt-4">
            <label className="block text-sm font-medium">Template type</label>
            <input
              name="templateType"
              className="w-full rounded border px-3 py-2"
              placeholder="translation_selection_based"
            />
          </div>
        </div>

        <button type="submit" className="rounded-lg bg-black px-4 py-2 text-white">
          Create question set
        </button>
      </form>
    </main>
  );
}
