"use client";

import Badge from "@/components/ui/badge";
import DevComponentMarker from "@/components/ui/dev-component-marker";

type PublishStatusBadgeProps = {
  isPublished: boolean;
  publishedLabel?: string;
  draftLabel?: string;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function PublishStatusBadge({
  isPublished,
  publishedLabel = "Published",
  draftLabel = "Draft",
  className,
}: PublishStatusBadgeProps) {
  return (
    <span
      className={["dev-marker-host relative inline-flex", className]
        .filter(Boolean)
        .join(" ")}
    >
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="PublishStatusBadge"
          filePath="src/components/ui/publish-status-badge.tsx"
          tier="semantic"
          componentRole="Semantic published/draft status badge"
          bestFor="Reusable CMS publishing states across admin content, grammar, vocabulary, papers, exams, and lesson builder UI."
          usageExamples={[
            "Published course",
            "Draft vocabulary set",
            "Published mock exam",
            "Draft past paper resource",
          ]}
          notes="Use instead of hand-built Badge mappings for published/draft states. Keep labels short and specific when needed."
        />
      ) : null}

      <Badge
        tone={isPublished ? "success" : "warning"}
        icon={isPublished ? "published" : "draft"}
      >
        {isPublished ? publishedLabel : draftLabel}
      </Badge>
    </span>
  );
}
