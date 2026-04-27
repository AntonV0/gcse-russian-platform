import Image from "next/image";
import DevComponentMarker from "@/components/ui/dev-component-marker";

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export function HeaderBlock({ content }: { content: string }) {
  return (
    <div className="space-y-2">
      <span className="app-pill app-pill-muted">Header</span>
      <h3 className="app-heading-section">{content}</h3>
    </div>
  );
}

export function SubheaderBlock({ content }: { content: string }) {
  return (
    <div className="space-y-2">
      <span className="app-pill app-pill-muted">Subheader</span>
      <h4 className="app-heading-subsection">{content}</h4>
    </div>
  );
}

export function DividerBlock() {
  return <hr className="my-2 border-[var(--border)]" />;
}

export function CalloutBlock({ title, content }: { title?: string; content: string }) {
  return (
    <div className="dev-marker-host relative rounded-2xl border border-[color-mix(in_srgb,var(--info)_24%,transparent)] bg-[var(--info-soft)] px-5 py-4">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="CalloutBlock"
          filePath="src/components/lesson-blocks/structure-blocks.tsx"
          tier="semantic"
          componentRole="Lesson callout block for highlighting important supporting information"
          bestFor="Student lesson sections where a reminder, key idea, or teacher note needs emphasis within content."
          usageExamples={[
            "Grammar reminder callout",
            "Vocabulary usage note",
            "Lesson instruction highlight",
            "Course/module/lesson management preview",
          ]}
          notes="Use for helpful emphasis. Do not use for exam-specific advice, error messages, or long primary explanations."
        />
      ) : null}

      <div className="mb-3 flex flex-wrap gap-2">
        <span className="app-pill app-pill-info">{title ?? "Callout"}</span>
      </div>

      <p className="app-text-body whitespace-pre-wrap">{content}</p>
    </div>
  );
}

export function ExamTipBlock({ title, content }: { title?: string; content: string }) {
  return (
    <div className="dev-marker-host relative rounded-2xl border border-[color-mix(in_srgb,var(--warning)_24%,transparent)] bg-[var(--warning-soft)] px-5 py-4">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="ExamTipBlock"
          filePath="src/components/lesson-blocks/structure-blocks.tsx"
          tier="semantic"
          componentRole="Lesson exam-tip block for GCSE assessment strategy and exam-focused advice"
          bestFor="GCSE Russian lesson sections where students need explicit exam technique or paper-specific guidance."
          usageExamples={[
            "Writing paper advice",
            "Speaking assessment tip",
            "Listening strategy reminder",
            "Past paper practice area",
          ]}
          notes="Use for exam technique only. Do not use for ordinary lesson notes, generic warnings, or vocabulary lists."
        />
      ) : null}

      <div className="mb-3 flex flex-wrap gap-2">
        <span className="app-pill app-pill-warning">{title ?? "Exam tip"}</span>
      </div>

      <p className="app-text-body whitespace-pre-wrap">{content}</p>
    </div>
  );
}

export function ImageBlock({
  src,
  alt,
  caption,
}: {
  src: string;
  alt?: string;
  caption?: string;
}) {
  return (
    <figure className="dev-marker-host relative app-card app-section-padding space-y-3">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="ImageBlock"
          filePath="src/components/lesson-blocks/structure-blocks.tsx"
          tier="semantic"
          componentRole="Lesson image block with contained media and optional caption"
          bestFor="Visual lesson content such as annotated examples, vocabulary images, grammar diagrams, or past paper extracts."
          usageExamples={[
            "Vocabulary image prompt",
            "Grammar table screenshot",
            "Past paper extract",
            "Lesson content illustration",
          ]}
          notes="Use for instructional images with meaningful alt text. Do not use for decorative page backgrounds or admin thumbnails."
        />
      ) : null}

      <div className="relative aspect-[4/3] max-h-[70vh] w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] sm:aspect-[16/10] md:aspect-[16/9]">
        <Image
          src={src}
          alt={alt ?? caption ?? "Lesson image"}
          fill
          sizes="(max-width: 768px) 100vw, 900px"
          className="object-contain"
        />
      </div>

      {caption ? <figcaption className="app-text-caption">{caption}</figcaption> : null}
    </figure>
  );
}

export function AudioBlock({
  title,
  src,
  caption,
  autoPlay,
}: {
  title?: string;
  src: string;
  caption?: string;
  autoPlay?: boolean;
}) {
  return (
    <div className="dev-marker-host relative app-card app-section-padding space-y-3">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="AudioBlock"
          filePath="src/components/lesson-blocks/structure-blocks.tsx"
          tier="semantic"
          componentRole="Lesson audio block with native playback and optional caption"
          bestFor="Listening practice, pronunciation examples, and audio-supported GCSE Russian lesson content."
          usageExamples={[
            "Listening practice audio",
            "Pronunciation model",
            "Speaking prompt support",
            "Past paper listening extract",
          ]}
          notes="Use for lesson audio media. Do not use for question audio that needs play limits or tracked listening behaviour."
        />
      ) : null}

      <div className="flex flex-wrap gap-2">
        <span className="app-pill app-pill-muted">{title ?? "Audio"}</span>
      </div>

      <audio controls autoPlay={autoPlay} className="w-full">
        <source src={src} />
        Your browser does not support the audio element.
      </audio>

      {caption ? <div className="app-text-caption">{caption}</div> : null}
    </div>
  );
}
