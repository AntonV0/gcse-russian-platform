"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type DevMarkerTier = "primitive" | "container" | "layout" | "semantic";

type DevComponentMarkerProps = {
  componentName: string;
  filePath: string;
  tier?: DevMarkerTier;
  componentRole?: string;
  bestFor?: string;
  usageExamples?: string[];
  notes?: string;
};

type MarkerPanelPosition = {
  top: number;
  left: number;
  arrowLeft: number;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";
const PANEL_WIDTH = 352;
const PANEL_GAP = 10;
const VIEWPORT_MARGIN = 12;
const ARROW_OFFSET = 18;

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
    return [base, stateClass, "dev-marker-trigger-container"].filter(Boolean).join(" ");
  }

  if (tier === "layout") {
    return [base, stateClass, "dev-marker-trigger-layout"].filter(Boolean).join(" ");
  }

  if (tier === "semantic") {
    return [base, stateClass, "dev-marker-trigger-semantic"].filter(Boolean).join(" ");
  }

  return [base, stateClass].filter(Boolean).join(" ");
}

function getPanelClass(tier: DevMarkerTier) {
  if (tier === "container") {
    return ["dev-marker-panel", "dev-marker-panel-container"].join(" ");
  }

  if (tier === "layout") {
    return ["dev-marker-panel", "dev-marker-panel-layout"].join(" ");
  }

  if (tier === "semantic") {
    return ["dev-marker-panel", "dev-marker-panel-semantic"].join(" ");
  }

  return "dev-marker-panel";
}

function getDefaultRole(componentName: string) {
  const lower = componentName.toLowerCase();

  if (lower.includes("button")) return "Primitive action control";
  if (lower.includes("badge")) return "Primitive status and metadata label";
  if (lower.includes("icon")) return "Primitive icon wrapper";
  if (lower.includes("card")) return "Shared content container";
  if (lower.includes("panel")) return "Section or inspector container";
  if (lower.includes("header")) return "Page or section heading pattern";
  if (lower.includes("empty")) return "Empty-state pattern";
  if (lower.includes("table")) return "Structured data display pattern";
  if (lower.includes("input") || lower.includes("select") || lower.includes("textarea")) {
    return "Form field control";
  }

  return "Shared UI component";
}

function getTierLabel(tier: DevMarkerTier) {
  switch (tier) {
    case "container":
      return "Shared container";
    case "layout":
      return "Layout pattern";
    case "semantic":
      return "Semantic wrapper";
    case "primitive":
    default:
      return "Shared component";
  }
}

function getPositionForTrigger(triggerRect: DOMRect): MarkerPanelPosition {
  const panelWidth = Math.min(PANEL_WIDTH, window.innerWidth - VIEWPORT_MARGIN * 2);
  const preferredLeft = triggerRect.right - panelWidth;
  const minLeft = VIEWPORT_MARGIN;
  const maxLeft = Math.max(
    VIEWPORT_MARGIN,
    window.innerWidth - panelWidth - VIEWPORT_MARGIN
  );
  const left = Math.min(Math.max(preferredLeft, minLeft), maxLeft);
  const top = Math.min(
    triggerRect.bottom + PANEL_GAP,
    window.innerHeight - VIEWPORT_MARGIN - 120
  );
  const arrowLeft = Math.min(
    Math.max(triggerRect.right - left - ARROW_OFFSET, 18),
    panelWidth - 30
  );

  return { top, left, arrowLeft };
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
  const [isMounted, setIsMounted] = useState(false);
  const [panelPosition, setPanelPosition] = useState<MarkerPanelPosition | null>(null);
  const markerRef = useRef<HTMLSpanElement | null>(null);
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const panelId = useId();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!SHOW_UI_DEBUG || !isOpen || !triggerRef.current) {
      return;
    }

    function updatePosition() {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      setPanelPosition(getPositionForTrigger(rect));
    }

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!SHOW_UI_DEBUG || !isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (triggerRef.current?.contains(target)) {
        return;
      }

      if (panelRef.current?.contains(target)) {
        return;
      }

      setIsOpen(false);
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

  const panel =
    isMounted && isOpen && panelPosition
      ? createPortal(
          <div
            ref={panelRef}
            id={panelId}
            className={getPanelClass(tier)}
            role="dialog"
            aria-label={`${componentName} component info`}
            style={
              {
                top: `${panelPosition.top}px`,
                left: `${panelPosition.left}px`,
                "--dev-marker-arrow-left": `${panelPosition.arrowLeft}px`,
              } as React.CSSProperties
            }
          >
            <div className="dev-marker-panel-label">{getTierLabel(tier)}</div>

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
          </div>,
          document.body
        )
      : null;

  return (
    <span
      ref={markerRef}
      className="dev-marker-anchor"
      data-dev-marker-tier={tier}
      data-dev-marker-open={isOpen ? "true" : "false"}
    >
      <span
        ref={triggerRef}
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

      {panel}
    </span>
  );
}
