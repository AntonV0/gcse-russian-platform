import {
  createAudioBlockAction,
  createCalloutBlockAction,
  createDividerBlockAction,
  createExamTipBlockAction,
  createHeaderBlockAction,
  createImageBlockAction,
  createNoteBlockAction,
  createQuestionSetBlockAction,
  createSectionAction,
  createSubheaderBlockAction,
  createTextBlockAction,
  createVocabularyBlockAction,
  createVocabularySetBlockAction,
  deleteBlockAction,
  deleteSectionAction,
  moveBlockAction,
  moveSectionAction,
  toggleBlockPublishedAction,
  toggleSectionPublishedAction,
  updateAudioBlockAction,
  updateCalloutBlockAction,
  updateExamTipBlockAction,
  updateHeaderBlockAction,
  updateImageBlockAction,
  updateNoteBlockAction,
  updateQuestionSetBlockAction,
  updateSectionAction,
  updateSubheaderBlockAction,
  updateTextBlockAction,
  updateVocabularyBlockAction,
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

type RouteFields = {
  courseId: string;
  variantId: string;
  moduleId: string;
  lessonId: string;
  courseSlug: string;
  variantSlug: string;
  moduleSlug: string;
  lessonSlug: string;
};

function stringifyVocabularyItems(items: unknown): string {
  if (!Array.isArray(items)) return "";

  return items
    .map((item) => {
      if (!item || typeof item !== "object") return "";

      const record = item as Record<string, unknown>;
      const russian = typeof record.russian === "string" ? record.russian : "";
      const english = typeof record.english === "string" ? record.english : "";

      return russian && english ? `${russian} | ${english}` : "";
    })
    .filter(Boolean)
    .join("\n");
}

function BuilderHiddenFields(props: RouteFields) {
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

function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "success" | "muted" | "warning";
}) {
  const classes =
    tone === "success"
      ? "border-green-200 bg-green-50 text-green-700"
      : tone === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : tone === "muted"
          ? "border-gray-200 bg-gray-50 text-gray-600"
          : "border-blue-200 bg-blue-50 text-blue-700";

  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${classes}`}>
      {children}
    </span>
  );
}

function SectionShell({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="rounded-lg border bg-white [&_summary::-webkit-details-marker]:hidden"
    >
      <summary className="cursor-pointer select-none px-4 py-3 font-medium hover:bg-gray-50">
        {title}
      </summary>
      <div className="border-t px-4 py-4">{children}</div>
    </details>
  );
}

function TextLikeEditor(props: {
  blockId: string;
  routeFields: RouteFields;
  defaultValue: string;
  action: (formData: FormData) => void | Promise<void>;
  label: string;
}) {
  return (
    <form action={props.action} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="blockId" value={props.blockId} />

      <textarea
        name="content"
        required
        rows={3}
        defaultValue={props.defaultValue}
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <button type="submit" className="rounded border px-3 py-2 text-sm hover:bg-gray-50">
        Save {props.label}
      </button>
    </form>
  );
}

function TitledContentEditor(props: {
  blockId: string;
  routeFields: RouteFields;
  defaultTitle: string;
  defaultContent: string;
  action: (formData: FormData) => void | Promise<void>;
  label: string;
  titleRequired?: boolean;
}) {
  return (
    <form action={props.action} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="blockId" value={props.blockId} />

      <input
        name="title"
        required={props.titleRequired ?? false}
        defaultValue={props.defaultTitle}
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <textarea
        name="content"
        required
        rows={4}
        defaultValue={props.defaultContent}
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <button type="submit" className="rounded border px-3 py-2 text-sm hover:bg-gray-50">
        Save {props.label}
      </button>
    </form>
  );
}

function SlugBlockEditor(props: {
  blockId: string;
  routeFields: RouteFields;
  defaultTitle: string;
  defaultSlug: string;
  slugFieldName: "questionSetSlug" | "vocabularySetSlug";
  action: (formData: FormData) => void | Promise<void>;
  label: string;
}) {
  return (
    <form action={props.action} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="blockId" value={props.blockId} />

      <input
        name="title"
        defaultValue={props.defaultTitle}
        placeholder="Optional heading"
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <input
        name={props.slugFieldName}
        required
        defaultValue={props.defaultSlug}
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <button type="submit" className="rounded border px-3 py-2 text-sm hover:bg-gray-50">
        Save {props.label}
      </button>
    </form>
  );
}

function ImageBlockEditor(props: {
  blockId: string;
  routeFields: RouteFields;
  defaultSrc: string;
  defaultAlt: string;
  defaultCaption: string;
}) {
  return (
    <form action={updateImageBlockAction} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="blockId" value={props.blockId} />

      <input
        name="src"
        required
        defaultValue={props.defaultSrc}
        placeholder="https://..."
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <input
        name="alt"
        defaultValue={props.defaultAlt}
        placeholder="Alt text"
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <input
        name="caption"
        defaultValue={props.defaultCaption}
        placeholder="Optional caption"
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <button type="submit" className="rounded border px-3 py-2 text-sm hover:bg-gray-50">
        Save image block
      </button>
    </form>
  );
}

function AudioBlockEditor(props: {
  blockId: string;
  routeFields: RouteFields;
  defaultTitle: string;
  defaultSrc: string;
  defaultCaption: string;
  defaultAutoPlay: boolean;
}) {
  return (
    <form action={updateAudioBlockAction} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="blockId" value={props.blockId} />

      <input
        name="title"
        defaultValue={props.defaultTitle}
        placeholder="Optional title"
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <input
        name="src"
        required
        defaultValue={props.defaultSrc}
        placeholder="https://..."
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <input
        name="caption"
        defaultValue={props.defaultCaption}
        placeholder="Optional caption"
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="autoPlay"
          value="true"
          defaultChecked={props.defaultAutoPlay}
        />
        Auto play
      </label>

      <button type="submit" className="rounded border px-3 py-2 text-sm hover:bg-gray-50">
        Save audio block
      </button>
    </form>
  );
}

function VocabularyBlockEditor(props: {
  blockId: string;
  routeFields: RouteFields;
  defaultTitle: string;
  defaultItems: unknown;
}) {
  return (
    <form action={updateVocabularyBlockAction} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="blockId" value={props.blockId} />

      <input
        name="title"
        required
        defaultValue={props.defaultTitle}
        placeholder="Key vocabulary"
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <textarea
        name="items"
        required
        rows={6}
        defaultValue={stringifyVocabularyItems(props.defaultItems)}
        placeholder={`дом | house\nшкола | school`}
        className="w-full rounded border px-3 py-2 font-mono text-sm"
      />

      <p className="text-xs text-gray-500">
        Use one item per line in the format: russian | english
      </p>

      <button type="submit" className="rounded border px-3 py-2 text-sm hover:bg-gray-50">
        Save vocabulary block
      </button>
    </form>
  );
}

function renderBlockPreview(block: {
  block_type: string;
  data: Record<string, unknown>;
}) {
  switch (block.block_type) {
    case "header":
    case "subheader":
    case "text":
      return typeof block.data.content === "string"
        ? block.data.content
        : block.block_type;

    case "note":
    case "callout":
    case "exam-tip":
      return typeof block.data.title === "string"
        ? block.data.title
        : typeof block.data.content === "string"
          ? block.data.content
          : block.block_type;

    case "image":
      return typeof block.data.caption === "string"
        ? block.data.caption
        : typeof block.data.src === "string"
          ? block.data.src
          : "Image block";

    case "audio":
      return typeof block.data.title === "string"
        ? block.data.title
        : typeof block.data.src === "string"
          ? block.data.src
          : "Audio block";

    case "vocabulary":
      return typeof block.data.title === "string" ? block.data.title : "Vocabulary block";

    case "question-set":
      return typeof block.data.questionSetSlug === "string"
        ? block.data.questionSetSlug
        : "Question set block";

    case "vocabulary-set":
      return typeof block.data.vocabularySetSlug === "string"
        ? block.data.vocabularySetSlug
        : "Vocabulary set block";

    case "divider":
      return "Divider";

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
  routeFields: RouteFields;
}) {
  switch (props.block.block_type) {
    case "header":
      return (
        <TextLikeEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultValue={
            typeof props.block.data.content === "string" ? props.block.data.content : ""
          }
          action={updateHeaderBlockAction}
          label="header block"
        />
      );

    case "subheader":
      return (
        <TextLikeEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultValue={
            typeof props.block.data.content === "string" ? props.block.data.content : ""
          }
          action={updateSubheaderBlockAction}
          label="subheader block"
        />
      );

    case "text":
      return (
        <TextLikeEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultValue={
            typeof props.block.data.content === "string" ? props.block.data.content : ""
          }
          action={updateTextBlockAction}
          label="text block"
        />
      );

    case "note":
      return (
        <TitledContentEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultTitle={
            typeof props.block.data.title === "string" ? props.block.data.title : ""
          }
          defaultContent={
            typeof props.block.data.content === "string" ? props.block.data.content : ""
          }
          action={updateNoteBlockAction}
          label="note block"
          titleRequired
        />
      );

    case "callout":
      return (
        <TitledContentEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultTitle={
            typeof props.block.data.title === "string" ? props.block.data.title : ""
          }
          defaultContent={
            typeof props.block.data.content === "string" ? props.block.data.content : ""
          }
          action={updateCalloutBlockAction}
          label="callout block"
        />
      );

    case "exam-tip":
      return (
        <TitledContentEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultTitle={
            typeof props.block.data.title === "string" ? props.block.data.title : ""
          }
          defaultContent={
            typeof props.block.data.content === "string" ? props.block.data.content : ""
          }
          action={updateExamTipBlockAction}
          label="exam tip block"
        />
      );

    case "image":
      return (
        <ImageBlockEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultSrc={
            typeof props.block.data.src === "string" ? props.block.data.src : ""
          }
          defaultAlt={
            typeof props.block.data.alt === "string" ? props.block.data.alt : ""
          }
          defaultCaption={
            typeof props.block.data.caption === "string" ? props.block.data.caption : ""
          }
        />
      );

    case "audio":
      return (
        <AudioBlockEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultTitle={
            typeof props.block.data.title === "string" ? props.block.data.title : ""
          }
          defaultSrc={
            typeof props.block.data.src === "string" ? props.block.data.src : ""
          }
          defaultCaption={
            typeof props.block.data.caption === "string" ? props.block.data.caption : ""
          }
          defaultAutoPlay={
            typeof props.block.data.autoPlay === "boolean"
              ? props.block.data.autoPlay
              : false
          }
        />
      );

    case "vocabulary":
      return (
        <VocabularyBlockEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultTitle={
            typeof props.block.data.title === "string" ? props.block.data.title : ""
          }
          defaultItems={props.block.data.items}
        />
      );

    case "question-set":
      return (
        <SlugBlockEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultTitle={
            typeof props.block.data.title === "string" ? props.block.data.title : ""
          }
          defaultSlug={
            typeof props.block.data.questionSetSlug === "string"
              ? props.block.data.questionSetSlug
              : ""
          }
          slugFieldName="questionSetSlug"
          action={updateQuestionSetBlockAction}
          label="question-set block"
        />
      );

    case "vocabulary-set":
      return (
        <SlugBlockEditor
          blockId={props.block.id}
          routeFields={props.routeFields}
          defaultTitle={
            typeof props.block.data.title === "string" ? props.block.data.title : ""
          }
          defaultSlug={
            typeof props.block.data.vocabularySetSlug === "string"
              ? props.block.data.vocabularySetSlug
              : ""
          }
          slugFieldName="vocabularySetSlug"
          action={updateVocabularySetBlockAction}
          label="vocabulary-set block"
        />
      );

    case "divider":
      return (
        <div className="text-sm text-gray-500">Divider blocks do not need editing.</div>
      );

    default:
      return (
        <div className="text-sm text-gray-500">
          Editing is not supported yet for this block type.
        </div>
      );
  }
}

function AddSimpleTextBlockForm(props: {
  title: string;
  placeholder: string;
  sectionId: string;
  routeFields: RouteFields;
  action: (formData: FormData) => void | Promise<void>;
  buttonLabel: string;
}) {
  return (
    <form action={props.action} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="sectionId" value={props.sectionId} />

      <textarea
        name="content"
        required
        rows={3}
        placeholder={props.placeholder}
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <button type="submit" className="rounded border px-3 py-2 text-sm hover:bg-white">
        {props.buttonLabel}
      </button>
    </form>
  );
}

function AddTitledContentBlockForm(props: {
  sectionId: string;
  routeFields: RouteFields;
  action: (formData: FormData) => void | Promise<void>;
  buttonLabel: string;
  titlePlaceholder: string;
  contentPlaceholder: string;
}) {
  return (
    <form action={props.action} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="sectionId" value={props.sectionId} />

      <input
        name="title"
        placeholder={props.titlePlaceholder}
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <textarea
        name="content"
        required
        rows={4}
        placeholder={props.contentPlaceholder}
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <button type="submit" className="rounded border px-3 py-2 text-sm hover:bg-white">
        {props.buttonLabel}
      </button>
    </form>
  );
}

function AddSlugBlockForm(props: {
  sectionId: string;
  routeFields: RouteFields;
  action: (formData: FormData) => void | Promise<void>;
  buttonLabel: string;
  slugFieldName: "questionSetSlug" | "vocabularySetSlug";
  slugPlaceholder: string;
}) {
  return (
    <form action={props.action} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="sectionId" value={props.sectionId} />

      <input
        name="title"
        placeholder="Optional heading"
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <input
        name={props.slugFieldName}
        required
        placeholder={props.slugPlaceholder}
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <button type="submit" className="rounded border px-3 py-2 text-sm hover:bg-white">
        {props.buttonLabel}
      </button>
    </form>
  );
}

function AddImageBlockForm(props: { sectionId: string; routeFields: RouteFields }) {
  return (
    <form action={createImageBlockAction} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="sectionId" value={props.sectionId} />

      <input
        name="src"
        required
        placeholder="https://..."
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <input
        name="alt"
        placeholder="Alt text"
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <input
        name="caption"
        placeholder="Optional caption"
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <button type="submit" className="rounded border px-3 py-2 text-sm hover:bg-white">
        Add image block
      </button>
    </form>
  );
}

function AddAudioBlockForm(props: { sectionId: string; routeFields: RouteFields }) {
  return (
    <form action={createAudioBlockAction} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="sectionId" value={props.sectionId} />

      <input
        name="title"
        placeholder="Optional title"
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <input
        name="src"
        required
        placeholder="https://..."
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <input
        name="caption"
        placeholder="Optional caption"
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="autoPlay" value="true" />
        Auto play
      </label>

      <button type="submit" className="rounded border px-3 py-2 text-sm hover:bg-white">
        Add audio block
      </button>
    </form>
  );
}

function AddVocabularyBlockForm(props: { sectionId: string; routeFields: RouteFields }) {
  return (
    <form action={createVocabularyBlockAction} className="space-y-2">
      <BuilderHiddenFields {...props.routeFields} />
      <input type="hidden" name="sectionId" value={props.sectionId} />

      <input
        name="title"
        required
        placeholder="Key vocabulary"
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <textarea
        name="items"
        required
        rows={6}
        placeholder={`дом | house\nшкола | school`}
        className="w-full rounded border px-3 py-2 font-mono text-sm"
      />

      <p className="text-xs text-gray-500">
        Use one item per line in the format: russian | english
      </p>

      <button type="submit" className="rounded border px-3 py-2 text-sm hover:bg-white">
        Add vocabulary block
      </button>
    </form>
  );
}

function AddBlockGroup({
  title,
  description,
  children,
  defaultOpen = false,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="rounded-lg border bg-gray-50 [&_summary::-webkit-details-marker]:hidden"
    >
      <summary className="cursor-pointer select-none px-4 py-3 hover:bg-gray-100">
        <div className="font-medium">{title}</div>
        <div className="text-sm text-gray-500">{description}</div>
      </summary>
      <div className="border-t px-4 py-4">{children}</div>
    </details>
  );
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
      <SectionShell title="Builder guide" defaultOpen>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-gray-600">
          <li>Create a section first.</li>
          <li>Add structure blocks like header, subheader, and divider.</li>
          <li>
            Add explanation blocks like text, note, callout, exam tip, and vocabulary.
          </li>
          <li>Add media blocks like image and audio.</li>
          <li>Add embedded practice with question-set and vocabulary-set blocks.</li>
          <li>Use edit panels to refine content.</li>
          <li>Use publish controls to show or hide content.</li>
          <li>Use arrows to reorder sections and blocks.</li>
          <li>Open the public lesson to check the result.</li>
        </ol>
      </SectionShell>

      <SectionShell title="Add section" defaultOpen>
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
      </SectionShell>

      <div className="space-y-4">
        {sections.length === 0 ? (
          <div className="rounded-lg border bg-white px-4 py-6 text-sm text-gray-500">
            No sections yet. Create your first section above.
          </div>
        ) : (
          sections.map((section, sectionIndex) => (
            <div key={section.id} className="rounded-xl border bg-white shadow-sm">
              <div className="border-b px-4 py-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">{section.title}</h3>
                      <Badge tone={section.is_published ? "success" : "warning"}>
                        {section.is_published ? "Published" : "Draft"}
                      </Badge>
                      <Badge tone="muted">{section.section_kind}</Badge>
                      <Badge tone="default">{section.blocks.length} block(s)</Badge>
                    </div>

                    <div className="text-sm text-gray-500">
                      Position {section.position}
                    </div>

                    {section.description ? (
                      <div className="text-sm text-gray-600">{section.description}</div>
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
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-4">
                <details className="rounded-lg border bg-gray-50 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="cursor-pointer px-4 py-3 font-medium hover:bg-gray-100">
                    Edit section metadata
                  </summary>

                  <div className="border-t px-4 py-4">
                    <form action={updateSectionAction} className="space-y-2">
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
                  </div>
                </details>

                <div className="space-y-3">
                  {section.blocks.length === 0 ? (
                    <div className="rounded-lg border border-dashed px-4 py-6 text-sm text-gray-500">
                      No blocks in this section yet.
                    </div>
                  ) : (
                    section.blocks.map((block, blockIndex) => (
                      <details
                        key={block.id}
                        className="rounded-lg border bg-white [&_summary::-webkit-details-marker]:hidden"
                      >
                        <summary className="cursor-pointer px-4 py-3 hover:bg-gray-50">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-medium">{block.block_type}</span>
                                <Badge tone={block.is_published ? "success" : "warning"}>
                                  {block.is_published ? "Published" : "Draft"}
                                </Badge>
                                <Badge tone="muted">Position {block.position}</Badge>
                              </div>
                              <div className="max-w-3xl text-sm text-gray-600 line-clamp-2">
                                {renderBlockPreview(block)}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <form action={moveBlockAction}>
                                <BuilderHiddenFields {...routeFields} />
                                <input
                                  type="hidden"
                                  name="sectionId"
                                  value={section.id}
                                />
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
                                <input
                                  type="hidden"
                                  name="sectionId"
                                  value={section.id}
                                />
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
                                  Delete
                                </button>
                              </form>
                            </div>
                          </div>
                        </summary>

                        <div className="border-t px-4 py-4">
                          <BlockEditPanel block={block} routeFields={routeFields} />
                        </div>
                      </details>
                    ))
                  )}
                </div>

                <div className="space-y-3">
                  <AddBlockGroup
                    title="Add structure block"
                    description="Headers and dividers for lesson layout"
                    defaultOpen={section.blocks.length === 0}
                  >
                    <div className="grid gap-4 lg:grid-cols-3">
                      <AddSimpleTextBlockForm
                        title="Header"
                        placeholder="Big heading for this section"
                        sectionId={section.id}
                        routeFields={routeFields}
                        action={createHeaderBlockAction}
                        buttonLabel="Add header block"
                      />

                      <AddSimpleTextBlockForm
                        title="Subheader"
                        placeholder="Smaller heading for this section"
                        sectionId={section.id}
                        routeFields={routeFields}
                        action={createSubheaderBlockAction}
                        buttonLabel="Add subheader block"
                      />

                      <div>
                        <div className="mb-2 text-sm font-medium">Divider</div>
                        <form action={createDividerBlockAction} className="space-y-2">
                          <BuilderHiddenFields {...routeFields} />
                          <input type="hidden" name="sectionId" value={section.id} />
                          <button
                            type="submit"
                            className="rounded border px-3 py-2 text-sm hover:bg-white"
                          >
                            Add divider block
                          </button>
                        </form>
                      </div>
                    </div>
                  </AddBlockGroup>

                  <AddBlockGroup
                    title="Add teaching block"
                    description="Explanations, notes, callouts, tips, and vocabulary"
                  >
                    <div className="grid gap-4 lg:grid-cols-2">
                      <AddSimpleTextBlockForm
                        title="Text"
                        placeholder="Write the text content here..."
                        sectionId={section.id}
                        routeFields={routeFields}
                        action={createTextBlockAction}
                        buttonLabel="Add text block"
                      />

                      <AddTitledContentBlockForm
                        sectionId={section.id}
                        routeFields={routeFields}
                        action={createNoteBlockAction}
                        buttonLabel="Add note block"
                        titlePlaceholder="Study tip"
                        contentPlaceholder="Write the note content here..."
                      />

                      <AddTitledContentBlockForm
                        sectionId={section.id}
                        routeFields={routeFields}
                        action={createCalloutBlockAction}
                        buttonLabel="Add callout block"
                        titlePlaceholder="Optional title"
                        contentPlaceholder="Important information or reminder..."
                      />

                      <AddTitledContentBlockForm
                        sectionId={section.id}
                        routeFields={routeFields}
                        action={createExamTipBlockAction}
                        buttonLabel="Add exam tip block"
                        titlePlaceholder="Optional title"
                        contentPlaceholder="Advice for exam success..."
                      />

                      <AddVocabularyBlockForm
                        sectionId={section.id}
                        routeFields={routeFields}
                      />
                    </div>
                  </AddBlockGroup>

                  <AddBlockGroup
                    title="Add media block"
                    description="Images and audio for explanations and listening practice"
                  >
                    <div className="grid gap-4 lg:grid-cols-2">
                      <AddImageBlockForm
                        sectionId={section.id}
                        routeFields={routeFields}
                      />

                      <AddAudioBlockForm
                        sectionId={section.id}
                        routeFields={routeFields}
                      />
                    </div>
                  </AddBlockGroup>

                  <AddBlockGroup
                    title="Add embedded practice block"
                    description="Pull in reusable question sets or vocabulary sets"
                  >
                    <div className="grid gap-4 lg:grid-cols-2">
                      <AddSlugBlockForm
                        sectionId={section.id}
                        routeFields={routeFields}
                        action={createQuestionSetBlockAction}
                        buttonLabel="Add question-set block"
                        slugFieldName="questionSetSlug"
                        slugPlaceholder="question-set-slug"
                      />

                      <AddSlugBlockForm
                        sectionId={section.id}
                        routeFields={routeFields}
                        action={createVocabularySetBlockAction}
                        buttonLabel="Add vocabulary-set block"
                        slugFieldName="vocabularySetSlug"
                        slugPlaceholder="vocabulary-set-slug"
                      />
                    </div>
                  </AddBlockGroup>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
