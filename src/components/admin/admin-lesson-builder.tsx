import {
  createSectionAction,
  createTextBlockAction,
  createNoteBlockAction,
} from "@/app/actions/admin-lesson-builder-actions";

export default function AdminLessonBuilder({
  lessonId,
  sections,
}: {
  lessonId: string;
  sections: any[];
}) {
  return (
    <div className="space-y-6">
      {/* CREATE SECTION */}
      <form action={createSectionAction} className="flex gap-2">
        <input type="hidden" name="lessonId" value={lessonId} />
        <input
          name="title"
          placeholder="New section title"
          className="border px-2 py-1"
        />
        <button className="border px-3 py-1">Add section</button>
      </form>

      {/* SECTIONS */}
      {sections.map((section) => (
        <div key={section.id} className="rounded border p-4 space-y-4">
          <div className="font-semibold">{section.title}</div>

          {/* BLOCKS */}
          <div className="space-y-2 text-sm text-gray-700">
            {section.blocks.map((block: any) => (
              <div key={block.id} className="border p-2 rounded">
                {block.block_type}
              </div>
            ))}
          </div>

          {/* ADD TEXT BLOCK */}
          <form action={createTextBlockAction} className="flex gap-2">
            <input type="hidden" name="sectionId" value={section.id} />
            <input
              name="content"
              placeholder="Text content"
              className="border px-2 py-1"
            />
            <button className="border px-2">+ Text</button>
          </form>

          {/* ADD NOTE BLOCK */}
          <form action={createNoteBlockAction} className="flex gap-2">
            <input type="hidden" name="sectionId" value={section.id} />
            <input name="title" placeholder="Note title" className="border px-2 py-1" />
            <input
              name="content"
              placeholder="Note content"
              className="border px-2 py-1"
            />
            <button className="border px-2">+ Note</button>
          </form>
        </div>
      ))}
    </div>
  );
}
