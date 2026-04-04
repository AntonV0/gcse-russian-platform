import {
  createSectionAction,
  createTextBlockAction,
  createNoteBlockAction,
} from "@/app/actions/admin-lesson-builder-actions";

type AdminLessonBuilderProps = {
  lessonId: string;
  courseId: string;
  variantId: string;
  moduleId: string;
  lessonSlug: string;
  courseSlug: string;
  variantSlug: string;
  moduleSlug: string;
  sections: {
    id: string;
    title: string;
    description?: string | null;
    section_kind: string;
    position: number;
    is_published: boolean;
    blocks: {
      id: string;
      block_type: string;
      position: number;
      is_published: boolean;
      data: Record<string, unknown>;
    }[];
  }[];
};

function BuilderHiddenFields(props: {
  courseId: string;
  variantId: string;
  moduleId: string;
  lessonId: string;
  courseSlug: string;
  variantSlug: string;
  moduleSlug: string;
  lessonSlug: string;
}) {
  return (
    <>
      <input type="hidden" name="courseId" value={props.courseId} />
      <input type="hidden" name="variantId" value={props.variantId} />
      <input type="hidden" name="moduleId" value={props.moduleId} />
      <input type="hidden" name="lessonId" value={props.lessonId} />
      <input type="hidden" name="courseSlug" value={props.courseSlug} />
      <input type="hidden" name="variantSlug" value={props.variantSlug} />
      <input type="hidden" name="moduleSlug" value={props.moduleSlug} />
      <input type="hidden" name="lessonSlug" value={props.lessonSlug} />
    </>
  );
}

function renderBlockPreview(block: {
  block_type: string;
  data: Record<string, unknown>;
}) {
  switch (block.block_type) {
    case "text":
      return typeof block.data.content === "string" ? block.data.content : "Text block";
    case "note":
      return typeof block.data.title === "string" ? block.data.title : "Note block";
    default:
      return block.block_type;
  }
}

export default function AdminLessonBuilder({
  lessonId,
  courseId,
  variantId,
  moduleId,
  lessonSlug,
  courseSlug,
  variantSlug,
  moduleSlug,
  sections,
}: AdminLessonBuilderProps) {
  const routeFields = {
    courseId,
    variantId,
    moduleId,
    lessonId,
    courseSlug,
    variantSlug,
    moduleSlug,
    lessonSlug,
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-gray-50 p-4">
        <h3 className="mb-2 font-medium">How to use</h3>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-gray-600">
          <li>Create a section first.</li>
          <li>Add blocks inside that section.</li>
          <li>Open the public lesson to check the result.</li>
        </ol>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <h3 className="mb-3 font-medium">Add Section</h3>

        <form action={createSectionAction} className="space-y-3">
          <BuilderHiddenFields {...routeFields} />

          <div>
            <label className="mb-1 block text-sm font-medium">Section title</label>
            <input
              name="title"
              required
              placeholder="Introduction"
              className="w-full rounded border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <input
              name="description"
              placeholder="Optional short description"
              className="w-full rounded border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Section kind</label>
            <select
              name="sectionKind"
              defaultValue="content"
              className="w-full rounded border px-3 py-2 text-sm"
            >
              <option value="intro">intro</option>
              <option value="content">content</option>
              <option value="grammar">grammar</option>
              <option value="practice">practice</option>
              <option value="reading_practice">reading_practice</option>
              <option value="writing_practice">writing_practice</option>
              <option value="speaking_practice">speaking_practice</option>
              <option value="listening_practice">listening_practice</option>
              <option value="summary">summary</option>
            </select>
          </div>

          <button
            type="submit"
            className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Add section
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {sections.length === 0 ? (
          <div className="rounded-lg border bg-white px-4 py-6 text-sm text-gray-500">
            No sections yet. Create your first section above.
          </div>
        ) : (
          sections.map((section) => (
            <div key={section.id} className="rounded-lg border bg-white p-4 space-y-4">
              <div>
                <div className="font-medium">{section.title}</div>
                <div className="mt-1 text-xs text-gray-500">
                  Kind: {section.section_kind} · Position: {section.position} ·{" "}
                  {section.is_published ? "Published" : "Draft"}
                </div>
                {section.description ? (
                  <div className="mt-1 text-sm text-gray-600">{section.description}</div>
                ) : null}
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Blocks</div>

                {section.blocks.length === 0 ? (
                  <div className="rounded border border-dashed px-3 py-3 text-sm text-gray-500">
                    No blocks in this section yet.
                  </div>
                ) : (
                  section.blocks.map((block) => (
                    <div
                      key={block.id}
                      className="rounded border px-3 py-2 text-sm flex items-start justify-between gap-4"
                    >
                      <div>
                        <div className="font-medium">{block.block_type}</div>
                        <div className="text-gray-600">{renderBlockPreview(block)}</div>
                      </div>

                      <div className="text-xs text-gray-500">
                        Position {block.position}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded border bg-gray-50 p-3">
                  <div className="mb-2 text-sm font-medium">Add Text Block</div>

                  <form action={createTextBlockAction} className="space-y-2">
                    <BuilderHiddenFields {...routeFields} />
                    <input type="hidden" name="sectionId" value={section.id} />

                    <textarea
                      name="content"
                      required
                      rows={4}
                      placeholder="Write the text content here..."
                      className="w-full rounded border px-3 py-2 text-sm"
                    />

                    <button
                      type="submit"
                      className="rounded border px-3 py-2 text-sm hover:bg-white"
                    >
                      Add text block
                    </button>
                  </form>
                </div>

                <div className="rounded border bg-gray-50 p-3">
                  <div className="mb-2 text-sm font-medium">Add Note Block</div>

                  <form action={createNoteBlockAction} className="space-y-2">
                    <BuilderHiddenFields {...routeFields} />
                    <input type="hidden" name="sectionId" value={section.id} />

                    <input
                      name="title"
                      required
                      placeholder="Study tip"
                      className="w-full rounded border px-3 py-2 text-sm"
                    />

                    <textarea
                      name="content"
                      required
                      rows={4}
                      placeholder="Write the note content here..."
                      className="w-full rounded border px-3 py-2 text-sm"
                    />

                    <button
                      type="submit"
                      className="rounded border px-3 py-2 text-sm hover:bg-white"
                    >
                      Add note block
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
