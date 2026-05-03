import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";

const accentOptions = [
  { value: "blue", label: "Blue" },
  { value: "purple", label: "Purple" },
  { value: "pink", label: "Pink" },
  { value: "red", label: "Red" },
  { value: "orange", label: "Orange" },
  { value: "yellow", label: "Yellow" },
  { value: "green", label: "Green" },
  { value: "teal", label: "Teal" },
  { value: "brown", label: "Bronze" },
  { value: "slate", label: "Slate" },
] as const;

const themeModes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
] as const;

function ProgressPreview({
  label,
  value,
  success = false,
}: {
  label: string;
  value: number;
  success?: boolean;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-[var(--text-secondary)]">{label}</span>
        <span className="font-bold text-[var(--text-primary)]">{value}%</span>
      </div>
      <div className="app-progress-track">
        <div
          className={[
            "app-progress-bar",
            success ? "app-progress-bar-success" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ThemeQaCard({
  accent,
  mode,
}: {
  accent: (typeof accentOptions)[number];
  mode: (typeof themeModes)[number];
}) {
  return (
    <div
      data-theme={mode.value}
      data-accent={accent.value}
      className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] p-3 shadow-[var(--shadow-sm)]"
    >
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-3 shadow-[var(--shadow-xs)]">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl [background:var(--accent-gradient-fill)] text-[var(--accent-on-fill)] shadow-[0_8px_18px_var(--accent-decorative-glow)]">
              <AppIcon icon="palette" size={17} />
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-[var(--text-primary)]">
                {accent.label}
              </div>
              <div className="text-xs app-text-muted">{mode.label}</div>
            </div>
          </div>
          <Badge tone="info">Theme</Badge>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-[var(--accent-decorative-border)] [background:var(--accent-gradient-soft)] p-3">
            <div className="text-sm font-bold text-[var(--text-primary)]">
              Practice card
            </div>
            <p className="mt-1 line-clamp-2 text-xs leading-5 app-text-muted">
              Accent surfaces should feel themed without reducing readability.
            </p>
          </div>

          <div className="space-y-2">
            <ProgressPreview label="Neutral progress" value={68} />
            <ProgressPreview label="Complete progress" value={100} success />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Badge tone="success" icon="completed">
              Done
            </Badge>
            <Badge tone="warning" icon="warning">
              Review
            </Badge>
            <Badge tone="danger" icon="error">
              Error
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="app-btn-base app-btn-primary min-h-9 px-3 py-2 text-xs">
              Primary
            </span>
            <span className="app-btn-base app-btn-secondary min-h-9 px-3 py-2 text-xs">
              Secondary
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UiLabThemeQaGrid() {
  return (
    <div className="space-y-5">
      {themeModes.map((mode) => (
        <div key={mode.value} className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              {mode.label} theme
            </h3>
            <Badge tone="muted">{accentOptions.length} accents</Badge>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
            {accentOptions.map((accent) => (
              <ThemeQaCard key={`${mode.value}-${accent.value}`} accent={accent} mode={mode} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
