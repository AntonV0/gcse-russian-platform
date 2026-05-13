type JourneyProgressBarProps = {
  value: number | null | undefined;
  label: string;
  isComplete?: boolean;
  className?: string;
};

function clampProgressValue(value: number | null | undefined) {
  if (!Number.isFinite(value)) return 0;

  return Math.min(100, Math.max(0, Math.round(value ?? 0)));
}

export default function JourneyProgressBar({
  value,
  label,
  isComplete = false,
  className,
}: JourneyProgressBarProps) {
  const progressValue = clampProgressValue(value);

  return (
    <div
      className={["app-progress-track", className].filter(Boolean).join(" ")}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progressValue}
      aria-valuetext={isComplete ? "Complete" : `${progressValue}% complete`}
    >
      <div
        className={["app-progress-bar", isComplete ? "app-progress-bar-success" : null]
          .filter(Boolean)
          .join(" ")}
        style={{ width: `${progressValue}%` }}
      />
    </div>
  );
}
