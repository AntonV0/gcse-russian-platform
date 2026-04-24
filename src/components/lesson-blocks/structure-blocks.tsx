import Image from "next/image";

export function HeaderBlock({ content }: { content: string }) {
  return (
    <div className="space-y-2">
      <span className="app-pill app-pill-muted">Header</span>
      <h3 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
        {content}
      </h3>
    </div>
  );
}

export function SubheaderBlock({ content }: { content: string }) {
  return (
    <div className="space-y-2">
      <span className="app-pill app-pill-muted">Subheader</span>
      <h4 className="text-xl font-semibold text-[var(--text-primary)]">{content}</h4>
    </div>
  );
}

export function DividerBlock() {
  return <hr className="my-2 border-[var(--border)]" />;
}

export function CalloutBlock({ title, content }: { title?: string; content: string }) {
  return (
    <div className="rounded-2xl border border-blue-200 bg-[var(--info-soft)] px-5 py-4">
      <div className="mb-3 flex flex-wrap gap-2">
        <span className="app-pill app-pill-info">{title ?? "Callout"}</span>
      </div>

      <p className="whitespace-pre-wrap leading-7 text-[var(--text-primary)]">
        {content}
      </p>
    </div>
  );
}

export function ExamTipBlock({ title, content }: { title?: string; content: string }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-[var(--warning-soft)] px-5 py-4">
      <div className="mb-3 flex flex-wrap gap-2">
        <span className="app-pill app-pill-warning">{title ?? "Exam tip"}</span>
      </div>

      <p className="whitespace-pre-wrap leading-7 text-[var(--text-primary)]">
        {content}
      </p>
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
    <figure className="app-card app-section-padding space-y-3">
      <div className="relative h-[320px] w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] sm:h-[420px] md:h-[500px]">
        <Image
          src={src}
          alt={alt ?? caption ?? "Lesson image"}
          fill
          sizes="(max-width: 768px) 100vw, 900px"
          className="object-contain"
        />
      </div>

      {caption ? (
        <figcaption className="text-sm app-text-muted">{caption}</figcaption>
      ) : null}
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
    <div className="app-card app-section-padding space-y-3">
      <div className="flex flex-wrap gap-2">
        <span className="app-pill app-pill-muted">{title ?? "Audio"}</span>
      </div>

      <audio controls autoPlay={autoPlay} className="w-full">
        <source src={src} />
        Your browser does not support the audio element.
      </audio>

      {caption ? <div className="text-sm app-text-muted">{caption}</div> : null}
    </div>
  );
}
