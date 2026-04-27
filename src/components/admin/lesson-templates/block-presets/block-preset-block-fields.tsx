import CheckboxField from "@/components/ui/checkbox-field";
import EmptyState from "@/components/ui/empty-state";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";

export const templateBlockTypes = [
  "header",
  "subheader",
  "divider",
  "text",
  "note",
  "callout",
  "exam-tip",
  "vocabulary",
  "image",
  "audio",
  "question-set",
  "vocabulary-set",
] as const;

export function BlockPresetBlockFields({
  blockType,
  data,
  prefix = "",
}: {
  blockType: string;
  data?: Record<string, unknown>;
  prefix?: string;
}) {
  const name = (field: string) => `${prefix}${field}`;

  switch (blockType) {
    case "header":
    case "subheader":
    case "text":
      return (
        <FormField label="Content" required>
          <Textarea
            name={name("content")}
            required
            rows={3}
            defaultValue={typeof data?.content === "string" ? data.content : ""}
          />
        </FormField>
      );

    case "note":
      return (
        <div className="space-y-2">
          <FormField label="Title" required>
            <Input
              name={name("title")}
              required
              defaultValue={typeof data?.title === "string" ? data.title : ""}
            />
          </FormField>
          <FormField label="Content" required>
            <Textarea
              name={name("content")}
              required
              rows={4}
              defaultValue={typeof data?.content === "string" ? data.content : ""}
            />
          </FormField>
        </div>
      );

    case "callout":
    case "exam-tip":
      return (
        <div className="space-y-2">
          <FormField label="Title">
            <Input
              name={name("title")}
              defaultValue={typeof data?.title === "string" ? data.title : ""}
            />
          </FormField>
          <FormField label="Content" required>
            <Textarea
              name={name("content")}
              required
              rows={4}
              defaultValue={typeof data?.content === "string" ? data.content : ""}
            />
          </FormField>
        </div>
      );

    case "image":
      return (
        <div className="space-y-2">
          <FormField label="Image URL" required>
            <Input
              name={name("src")}
              required
              placeholder="https://..."
              defaultValue={typeof data?.src === "string" ? data.src : ""}
            />
          </FormField>
          <FormField label="Alt text">
            <Input
              name={name("alt")}
              placeholder="Alt text"
              defaultValue={typeof data?.alt === "string" ? data.alt : ""}
            />
          </FormField>
          <FormField label="Caption">
            <Input
              name={name("caption")}
              placeholder="Optional caption"
              defaultValue={typeof data?.caption === "string" ? data.caption : ""}
            />
          </FormField>
        </div>
      );

    case "audio":
      return (
        <div className="space-y-2">
          <FormField label="Title">
            <Input
              name={name("title")}
              placeholder="Optional title"
              defaultValue={typeof data?.title === "string" ? data.title : ""}
            />
          </FormField>
          <FormField label="Audio URL" required>
            <Input
              name={name("src")}
              required
              placeholder="https://..."
              defaultValue={typeof data?.src === "string" ? data.src : ""}
            />
          </FormField>
          <FormField label="Caption">
            <Input
              name={name("caption")}
              placeholder="Optional caption"
              defaultValue={typeof data?.caption === "string" ? data.caption : ""}
            />
          </FormField>
          <CheckboxField
            name={name("autoPlay")}
            label="Auto play"
            defaultChecked={data?.autoPlay === true}
          />
        </div>
      );

    case "vocabulary":
      return (
        <div className="space-y-2">
          <FormField label="Title" required>
            <Input
              name={name("title")}
              required
              defaultValue={typeof data?.title === "string" ? data.title : ""}
            />
          </FormField>
          <FormField label="Vocabulary items" required>
            <Textarea
              name={name("items")}
              required
              rows={6}
              defaultValue={
                Array.isArray(data?.items)
                  ? data.items
                      .map((item) => {
                        if (!item || typeof item !== "object") return "";
                        const record = item as Record<string, unknown>;
                        const russian =
                          typeof record.russian === "string" ? record.russian : "";
                        const english =
                          typeof record.english === "string" ? record.english : "";
                        return russian && english ? `${russian} | ${english}` : "";
                      })
                      .filter(Boolean)
                      .join("\n")
                  : ""
              }
              className="font-mono"
            />
          </FormField>
        </div>
      );

    case "question-set":
      return (
        <div className="space-y-2">
          <FormField label="Heading">
            <Input
              name={name("title")}
              placeholder="Optional heading"
              defaultValue={typeof data?.title === "string" ? data.title : ""}
            />
          </FormField>
          <FormField label="Question set slug" required>
            <Input
              name={name("questionSetSlug")}
              required
              defaultValue={
                typeof data?.questionSetSlug === "string" ? data.questionSetSlug : ""
              }
            />
          </FormField>
        </div>
      );

    case "vocabulary-set":
      return (
        <div className="space-y-2">
          <FormField label="Heading">
            <Input
              name={name("title")}
              placeholder="Optional heading"
              defaultValue={typeof data?.title === "string" ? data.title : ""}
            />
          </FormField>
          <FormField label="Vocabulary set slug" required>
            <Input
              name={name("vocabularySetSlug")}
              required
              defaultValue={
                typeof data?.vocabularySetSlug === "string" ? data.vocabularySetSlug : ""
              }
            />
          </FormField>
          <FormField label="Vocabulary list slug">
            <Input
              name={name("vocabularyListSlug")}
              placeholder="Optional specific list"
              defaultValue={
                typeof data?.vocabularyListSlug === "string"
                  ? data.vocabularyListSlug
                  : ""
              }
            />
          </FormField>
        </div>
      );

    case "divider":
      return (
        <EmptyState
          icon="blocks"
          title="No fields required"
          description="Divider blocks only need their block type and position."
        />
      );

    default:
      return (
        <EmptyState
          icon="warning"
          iconTone="warning"
          title="Unsupported block type"
          description="This block type does not have an editor form yet."
        />
      );
  }
}
