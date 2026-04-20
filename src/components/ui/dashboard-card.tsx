"use client";

import { useEffect, useId, useRef, useState } from "react";
import Card, { CardBody } from "@/components/ui/card";

type DashboardCardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
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

export default function DashboardCard({
  title,
  children,
  className,
}: DashboardCardProps) {
  return (
    <Card className={["dev-marker-host", className].filter(Boolean).join(" ")}>
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="DashboardCard"
          filePath="src/components/ui/dashboard-card.tsx"
        />
      ) : null}

      <CardBody>
        {title ? <h2 className="app-card-title">{title}</h2> : null}
        <div className={[title ? "mt-2" : "", "text-sm app-text-muted"].join(" ")}>
          {children}
        </div>
      </CardBody>
    </Card>
  );
}
