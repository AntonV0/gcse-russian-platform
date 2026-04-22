"use client";

import { useEffect, useId, useRef, useState } from "react";

type DevMarkerTier = "primitive" | "container";

type DevComponentMarkerProps = {
  componentName: string;
  filePath: string;
  tier?: DevMarkerTier;
  componentRole?: string;
  bestFor?: string;
  usageExamples?: string[];
  notes?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

function DevMarkerIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="dev-marker-trigger-icon"
      fill="none"
    >
      <circle cx="8" cy="8" r="2.25" fill="currentColor" />
      <path
        d="M8 1.75V3.1M8 12.9v1.35M14.25 8H12.9M3.1 8H1.75M12.42 3.58l-.95.96M4.53 11.47l-.95.95M12.42 12.42l-.95-.95M4.53 4.53l-.95-.95"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function getTriggerClass(tier: DevMarkerTier, isOpen: boolean) {
  const base = "dev-marker-trigger";
  const stateClass = isOpen ? "dev-marker-trigger-open" : "";

  if (tier === "container") {
    return [
      base,
      stateClass,
      "h-[1.5rem] w-[1.5rem] border-[rgba(37,99,235,0.32)] bg-[rgba(255,255,255,0.98)] text-[var(--brand-blue)] shadow-[0_2px_8px_rgba(16,32,51,0.10),0_0_0_2px_rgba(246,248,251,0.96)]",
      "hover:scale-[1.08] hover:border-[rgba(37,99,235,0.52)] hover:shadow-[0_2px_8px_rgba(16,32,51,0.12),0_0_0_2px_rgba(246,248,251,0.98),0_14px_28px_rgba(16,32,51,0.16)]",
      "focus-visible:scale-[1.08]",
      "[data-theme='dark']:border-[rgba(118,167,255,0.42)] [data-theme='dark']:bg-[rgba(9,23,47,0.98)] [data-theme='dark']:text-[var(--brand-blue)]",
    ]
      .filter(Boolean)
      .join(" ");
  }

  return [base, stateClass].filter(Boolean).join(" ");
}

function getPanelClass(tier: DevMarkerTier) {
  if (tier === "container") {
    return [
      "dev-marker-panel",
      "w-[min(22rem,calc(100vw-2rem))]",
      "border-[rgba(37,99,235,0.20)]",
      "shadow-[0_4px_12px_rgba(16,32,51,0.10),0_18px_40px_rgba(16,32,51,0.16)]",
    ].join(" ");
  }

  return "dev-marker-panel";
}

function getDefaultRole(componentName: string) {
  if (componentName.toLowerCase().includes("button")) return "Primitive action control";
  if (componentName.toLowerCase().includes("badge")) return "Primitive status label";
  if (componentName.toLowerCase().includes("icon")) return "Primitive icon wrapper";
  if (componentName.toLowerCase().includes("card")) return "Shared content container";
  if (componentName.toLowerCase().includes("panel"))
    return "Section or inspector container";
  if (componentName.toLowerCase().includes("header"))
    return "Page or section heading pattern";
  if (componentName.toLowerCase().includes("empty")) return "Empty-state pattern";
  return "Shared UI component";
}

export default function DevComponentMarker({
  componentName,
  filePath,
  tier = "primitive",
  componentRole,
  bestFor,
  usageExamples,
  notes,
}: DevComponentMarkerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const markerRef = useRef<HTMLSpanElement | null>(null);
  const panelId = useId();

  useEffect(() => {
    if (!SHOW_UI_DEBUG || !isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!markerRef.current) {
        return;
      }

      if (event.target instanceof Node && !markerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  if (!SHOW_UI_DEBUG) {
    return null;
  }

  function toggleOpen(event: React.MouseEvent<HTMLSpanElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen((current) => !current);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLSpanElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
      setIsOpen((current) => !current);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setIsOpen(false);
    }
  }

  const resolvedRole = componentRole ?? getDefaultRole(componentName);

  return (
    <span ref={markerRef} className="dev-marker-anchor">
      <span
        role="button"
        tabIndex={0}
        className={getTriggerClass(tier, isOpen)}
        data-state={isOpen ? "open" : "closed"}
        aria-label={`Show component info for ${componentName}`}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
      >
        <DevMarkerIcon />
      </span>

      {isOpen ? (
        <div
          id={panelId}
          className={getPanelClass(tier)}
          role="dialog"
          aria-label={`${componentName} component info`}
        >
          <div className="dev-marker-panel-label">
            {tier === "container" ? "Shared container" : "Shared component"}
          </div>

          <div className="dev-marker-panel-name">{componentName}</div>
          <div className="dev-marker-panel-path">{filePath}</div>

          <div className="mt-3 space-y-3">
            <div>
              <div className="dev-marker-panel-label">Role</div>
              <div className="text-[0.8rem] leading-5 text-[var(--text-primary)]">
                {resolvedRole}
              </div>
            </div>

            {bestFor ? (
              <div>
                <div className="dev-marker-panel-label">Best for</div>
                <div className="text-[0.78rem] leading-5 text-[var(--text-secondary)]">
                  {bestFor}
                </div>
              </div>
            ) : null}

            {usageExamples?.length ? (
              <div>
                <div className="dev-marker-panel-label">Used in</div>
                <ul className="space-y-1 pl-4 text-[0.78rem] leading-5 text-[var(--text-secondary)]">
                  {usageExamples.map((item) => (
                    <li key={item} className="list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {notes ? (
              <div>
                <div className="dev-marker-panel-label">Notes</div>
                <div className="text-[0.78rem] leading-5 text-[var(--text-secondary)]">
                  {notes}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </span>
  );
}
