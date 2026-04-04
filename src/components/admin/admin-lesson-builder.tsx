import {
  createNoteBlockAction,
  createQuestionSetBlockAction,
  createSectionAction,
  createTextBlockAction,
  createVocabularySetBlockAction,
  deleteBlockAction,
  deleteSectionAction,
  moveBlockAction,
  moveSectionAction,
  toggleBlockPublishedAction,
  toggleSectionPublishedAction,
  updateNoteBlockAction,
  updateQuestionSetBlockAction,
  updateSectionAction,
  updateTextBlockAction,
  updateVocabularySetBlockAction,
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

function TextBlockEditor(props: {
  block: {
    id: string;
    data: Record<string, unknown>;
  };
  routeFields: {
    courseId: string;
    variantId: string;
    moduleId: string;
    lessonId: string;
    courseSlug: string;
    variantSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  };
}) {
  const content =
    typeof props.block.data.content === "string" ? props.block.data.content : "";

  return (
    <form action={updateTextBlockAction} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="blockId" value={props.block.id} />

      <textarea
        name="content"
        required
        rows={4}
        defaultValue={content}
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <button type="submit" className="rounded border px-3 py-2 text-sm hover:bg-gray-50">
        Save text block
      </button>
    </form>
  );
}

function NoteBlockEditor(props: {
  block: {
    id: string;
    data: Record<string, unknown>;
  };
  routeFields: {
    courseId: string;
    variantId: string;
    moduleId: string;
    lessonId: string;
    courseSlug: string;
    variantSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  };
}) {
  const title = typeof props.block.data.title === "string" ? props.block.data.title : "";
  const content =
    typeof props.block.data.content === "string" ? props.block.data.content : "";

  return (
    <form action={updateNoteBlockAction} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="blockId" value={props.block.id} />

      <input
        name="title"
        required
        defaultValue={title}
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <textarea
        name="content"
        required
        rows={4}
        defaultValue={content}
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <button type="submit" className="rounded border px-3 py-2 text-sm hover:bg-gray-50">
        Save note block
      </button>
    </form>
  );
}

function QuestionSetBlockEditor(props: {
  block: {
    id: string;
    data: Record<string, unknown>;
  };
  routeFields: {
    courseId: string;
    variantId: string;
    moduleId: string;
    lessonId: string;
    courseSlug: string;
    variantSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  };
}) {
  const title = typeof props.block.data.title === "string" ? props.block.data.title : "";
  const questionSetSlug =
    typeof props.block.data.questionSetSlug === "string"
      ? props.block.data.questionSetSlug
      : "";

  return (
    <form action={updateQuestionSetBlockAction} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="blockId" value={props.block.id} />

      <input
        name="title"
        defaultValue={title}
        placeholder="Optional heading"
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <input
        name="questionSetSlug"
        required
        defaultValue={questionSetSlug}
        placeholder="question-set-slug"
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <button type="submit" className="rounded border px-3 py-2 text-sm hover:bg-gray-50">
        Save question-set block
      </button>
    </form>
  );
}

function VocabularySetBlockEditor(props: {
  block: {
    id: string;
    data: Record<string, unknown>;
  };
  routeFields: {
    courseId: string;
    variantId: string;
    moduleId: string;
    lessonId: string;
    courseSlug: string;
    variantSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  };
}) {
  const title = typeof props.block.data.title === "string" ? props.block.data.title : "";
  const vocabularySetSlug =
    typeof props.block.data.vocabularySetSlug === "string"
      ? props.block.data.vocabularySetSlug
      : "";

  return (
    <form action={updateVocabularySetBlockAction} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="blockId" value={props.block.id} />

      <input
        name="title"
        defaultValue={title}
        placeholder="Optional heading"
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <input
        name="vocabularySetSlug"
        required
        defaultValue={vocabularySetSlug}
        placeholder="vocabulary-set-slug"
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <button type="submit" className="rounded border px-3 py-2 text-sm hover:bg-gray-50">
        Save vocabulary-set block
      </button>
    </form>
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
    case "question-set":
      return typeof block.data.questionSetSlug === "string"
        ? block.data.questionSetSlug
        : "Question set block";
    case "vocabulary-set":
      return typeof block.data.vocabularySetSlug === "string"
        ? block.data.vocabularySetSlug
        : "Vocabulary set block";
    default:
      return block.block_type;
  }
}

function BlockEditPanel(props: {
  block: {
    id: string;
    block_type: string;
    data: Record<string, unknown>;
  };
  routeFields: {
    courseId: string;
    variantId: string;
    moduleId: string;
    lessonId: string;
    courseSlug: string;
    variantSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  };
}) {
  switch (props.block.block_type) {
    case "text":
      return <TextBlockEditor block={props.block} routeFields={props.routeFields} />;
    case "note":
      return <NoteBlockEditor block={props.block} routeFields={props.routeFields} />;
    case "question-set":
      return (
        <QuestionSetBlockEditor block={props.block} routeFields={props.routeFields} />
      );
    case "vocabulary-set":
      return (
        <VocabularySetBlockEditor block={props.block} routeFields={props.routeFields} />
      );
    default:
      return (
        <div className="text-sm text-gray-500">
          Editing is not supported yet for this block type.
        </div>
      );
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
          <li>Use edit panels to refine content.</li>
          <li>Use publish controls to show or hide content.</li>
          <li>Use arrows to reorder sections and blocks.</li>
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
          sections.map((section, sectionIndex) => (
            <div key={section.id} className="rounded-lg border bg-white p-4 space-y-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="font-medium">{section.title}</div>
                  <div className="mt-1 text-xs text-gray-500">
                    Kind: {section.section_kind} · Position: {section.position} ·{" "}
                    {section.is_published ? "Published" : "Draft"}
                  </div>
                  {section.description ? (
                    <div className="mt-1 text-sm text-gray-600">
                      {section.description}
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  <form action={moveSectionAction}>
                    <BuilderHiddenFields {...routeFields} />
                    <input type="hidden" name="sectionId" value={section.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button
                      type="submit"
                      disabled={sectionIndex === 0}
                      className="rounded border px-3 py-1 text-sm disabled:opacity-50"
                    >
                      ↑
                    </button>
                  </form>

                  <form action={moveSectionAction}>
                    <BuilderHiddenFields {...routeFields} />
                    <input type="hidden" name="sectionId" value={section.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button
                      type="submit"
                      disabled={sectionIndex === sections.length - 1}
                      className="rounded border px-3 py-1 text-sm disabled:opacity-50"
                    >
                      ↓
                    </button>
                  </form>

                  <form action={toggleSectionPublishedAction}>
                    <BuilderHiddenFields {...routeFields} />
                    <input type="hidden" name="sectionId" value={section.id} />
                    <input
                      type="hidden"
                      name="nextState"
                      value={section.is_published ? "draft" : "published"}
                    />
                    <button
                      type="submit"
                      className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
                    >
                      {section.is_published ? "Unpublish" : "Publish"}
                    </button>
                  </form>

                  <form action={deleteSectionAction}>
                    <BuilderHiddenFields {...routeFields} />
                    <input type="hidden" name="sectionId" value={section.id} />
                    <button
                      type="submit"
                      className="rounded border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                    >
                      Delete section
                    </button>
                  </form>
                </div>
              </div>

              <details className="rounded border bg-gray-50 p-3">
                <summary className="cursor-pointer text-sm font-medium">
                  Edit section metadata
                </summary>

                <form action={updateSectionAction} className="mt-3 space-y-2">
                  <BuilderHiddenFields {...routeFields} />
                  <input type="hidden" name="sectionId" value={section.id} />

                  <input
                    name="title"
                    required
                    defaultValue={section.title}
                    className="w-full rounded border px-3 py-2 text-sm"
                  />

                  <input
                    name="description"
                    defaultValue={section.description ?? ""}
                    className="w-full rounded border px-3 py-2 text-sm"
                  />

                  <select
                    name="sectionKind"
                    defaultValue={section.section_kind}
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

                  <button
                    type="submit"
                    className="rounded border px-3 py-2 text-sm hover:bg-white"
                  >
                    Save section
                  </button>
                </form>
              </details>

              <div className="space-y-2">
                <div className="text-sm font-medium">Blocks</div>

                {section.blocks.length === 0 ? (
                  <div className="rounded border border-dashed px-3 py-3 text-sm text-gray-500">
                    No blocks in this section yet.
                  </div>
                ) : (
                  section.blocks.map((block, blockIndex) => (
                    <div
                      key={block.id}
                      className="rounded border px-3 py-3 text-sm space-y-3"
                    >
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="font-medium">{block.block_type}</div>
                          <div className="text-gray-600">{renderBlockPreview(block)}</div>
                          <div className="mt-1 text-xs text-gray-500">
                            Position {block.position} ·{" "}
                            {block.is_published ? "Published" : "Draft"}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <form action={moveBlockAction}>
                            <BuilderHiddenFields {...routeFields} />
                            <input type="hidden" name="sectionId" value={section.id} />
                            <input type="hidden" name="blockId" value={block.id} />
                            <input type="hidden" name="direction" value="up" />
                            <button
                              type="submit"
                              disabled={blockIndex === 0}
                              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
                            >
                              ↑
                            </button>
                          </form>

                          <form action={moveBlockAction}>
                            <BuilderHiddenFields {...routeFields} />
                            <input type="hidden" name="sectionId" value={section.id} />
                            <input type="hidden" name="blockId" value={block.id} />
                            <input type="hidden" name="direction" value="down" />
                            <button
                              type="submit"
                              disabled={blockIndex === section.blocks.length - 1}
                              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
                            >
                              ↓
                            </button>
                          </form>

                          <form action={toggleBlockPublishedAction}>
                            <BuilderHiddenFields {...routeFields} />
                            <input type="hidden" name="blockId" value={block.id} />
                            <input
                              type="hidden"
                              name="nextState"
                              value={block.is_published ? "draft" : "published"}
                            />
                            <button
                              type="submit"
                              className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
                            >
                              {block.is_published ? "Unpublish" : "Publish"}
                            </button>
                          </form>

                          <form action={deleteBlockAction}>
                            <BuilderHiddenFields {...routeFields} />
                            <input type="hidden" name="blockId" value={block.id} />
                            <button
                              type="submit"
                              className="rounded border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                            >
                              Delete block
                            </button>
                          </form>
                        </div>
                      </div>

                      <details className="rounded border bg-gray-50 p-3">
                        <summary className="cursor-pointer text-sm font-medium">
                          Edit block
                        </summary>

                        <div className="mt-3">
                          <BlockEditPanel block={block} routeFields={routeFields} />
                        </div>
                      </details>
                    </div>
                  ))
                )}
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded border bg-gray-50 p-3 space-y-4">
                  <div>
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

                  <div>
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

                <div className="rounded border bg-gray-50 p-3 space-y-4">
                  <div>
                    <div className="mb-2 text-sm font-medium">Add Question Set Block</div>

                    <form action={createQuestionSetBlockAction} className="space-y-2">
                      <BuilderHiddenFields {...routeFields} />
                      <input type="hidden" name="sectionId" value={section.id} />

                      <input
                        name="title"
                        placeholder="Optional heading"
                        className="w-full rounded border px-3 py-2 text-sm"
                      />

                      <input
                        name="questionSetSlug"
                        required
                        placeholder="question-set-slug"
                        className="w-full rounded border px-3 py-2 text-sm"
                      />

                      <button
                        type="submit"
                        className="rounded border px-3 py-2 text-sm hover:bg-white"
                      >
                        Add question-set block
                      </button>
                    </form>
                  </div>

                  <div>
                    <div className="mb-2 text-sm font-medium">
                      Add Vocabulary Set Block
                    </div>

                    <form action={createVocabularySetBlockAction} className="space-y-2">
                      <BuilderHiddenFields {...routeFields} />
                      <input type="hidden" name="sectionId" value={section.id} />

                      <input
                        name="title"
                        placeholder="Optional heading"
                        className="w-full rounded border px-3 py-2 text-sm"
                      />

                      <input
                        name="vocabularySetSlug"
                        required
                        placeholder="vocabulary-set-slug"
                        className="w-full rounded border px-3 py-2 text-sm"
                      />

                      <button
                        type="submit"
                        className="rounded border px-3 py-2 text-sm hover:bg-white"
                      >
                        Add vocabulary-set block
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
