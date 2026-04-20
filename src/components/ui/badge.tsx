"use client";

import { useEffect, useId, useRef, useState } from "react";
import AppIcon from "@/components/ui/app-icon";
import type { AppIconKey } from "@/lib/shared/icons";

type BadgeTone = "default" | "muted" | "info" | "success" | "warning" | "danger";

type BadgeProps = {
  children: React.ReactNode;
  tone?: BadgeTone;
  icon?: AppIconKey;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

function getToneClass(tone: BadgeTone) {
  switch (tone) {
    case "default":
      return "app-pill border-[var(--brand-blue)]/15 bg-[var(--brand-blue-soft)] text-[var(--brand-blue)]";
    case "info":
      return "app-pill app-pill-info";
    case "success":
      return "app-pill app-pill-success";
    case "warning":
      return "app-pill app-pill-warning";
    case "danger":
      return "app-pill app-pill-danger";
    case "muted":
    default:
      return "app-pill app-pill-muted";
  }
}

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

function DevComponentMarker({
  componentName,
  filePath,
}: {
  componentName: string;
  filePath: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const markerRef = useRef<HTMLSpanElement | null>(null);
  const panelId = useId();

  useEffect(() => {
    if (!isOpen) {
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
    }

    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setIsOpen(false);
    }
  }

  return (
    <span ref={markerRef} className="dev-marker-anchor">
      <span
        role="button"
        tabIndex={0}
        className="dev-marker-trigger"
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
          className="dev-marker-panel"
          role="dialog"
          aria-label={`${componentName} component info`}
        >
          <div className="dev-marker-panel-label">Shared component</div>
          <div className="dev-marker-panel-name">{componentName}</div>
          <div className="dev-marker-panel-path">{filePath}</div>
        </div>
      ) : null}
    </span>
  );
}

export default function Badge({ children, tone = "muted", icon, className }: BadgeProps) {
  return (
    <span
      className={[
        "dev-marker-host",
        getToneClass(tone),
        "inline-flex items-center gap-1.5 whitespace-nowrap",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="Badge"
          filePath="src/components/ui/badge.tsx"
        />
      ) : null}

      {icon ? <AppIcon icon={icon} size={14} /> : null}
      <span>{children}</span>
    </span>
  );
}
