"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SHOW_UI_DEBUG, useDevMarkers } from "@/components/providers/dev-marker-provider";
import DevComponentMarkerPanel from "@/components/ui/dev-component-marker-panel";
import type {
  DevComponentMarkerProps,
  MarkerPanelPosition,
} from "@/components/ui/dev-component-marker-types";
import {
  DevMarkerIcon,
  getDefaultRole,
  getPositionForTrigger,
  getTriggerClass,
} from "@/components/ui/dev-component-marker-utils";

const warnedMarkerIds = new Set<string>();

export default function DevComponentMarker({
  componentName,
  filePath,
  tier = "primitive",
  componentRole,
  bestFor,
  usageExamples,
  notes,
}: DevComponentMarkerProps) {
  const {
    canUseMarkers,
    isTierVisible,
    markersEnabled,
    registerMarker,
    unregisterMarker,
  } = useDevMarkers();
  const [isOpen, setIsOpen] = useState(false);
  const [copiedPath, setCopiedPath] = useState(false);
  const [panelPosition, setPanelPosition] = useState<MarkerPanelPosition | null>(null);
  const markerRef = useRef<HTMLSpanElement | null>(null);
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const panelId = useId();
  const markerId = useId();
  const markerDomId = markerId.replaceAll(":", "");
  const isMarkerVisible = markersEnabled && isTierVisible(tier);
  const isMarkerOpen = isMarkerVisible && isOpen;

  useEffect(() => {
    if (!SHOW_UI_DEBUG || !canUseMarkers) {
      return;
    }

    registerMarker({
      id: markerDomId,
      componentName,
      filePath,
      tier,
    });

    return () => {
      unregisterMarker(markerDomId);
    };
  }, [
    canUseMarkers,
    componentName,
    filePath,
    markerDomId,
    registerMarker,
    tier,
    unregisterMarker,
  ]);

  useEffect(() => {
    if (!SHOW_UI_DEBUG || !canUseMarkers) {
      return;
    }

    const missingFields = [
      componentRole ? null : "componentRole",
      bestFor ? null : "bestFor",
      usageExamples?.length ? null : "usageExamples",
      notes ? null : "notes",
    ].filter(Boolean);

    if (missingFields.length === 0 || warnedMarkerIds.has(componentName)) {
      return;
    }

    warnedMarkerIds.add(componentName);
    console.warn(
      `[DevComponentMarker] ${componentName} is missing metadata: ${missingFields.join(
        ", "
      )}`
    );
  }, [bestFor, canUseMarkers, componentName, componentRole, notes, usageExamples]);

  useLayoutEffect(() => {
    if (!SHOW_UI_DEBUG || !isMarkerOpen || !triggerRef.current) {
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
  }, [isMarkerOpen]);

  useEffect(() => {
    if (!SHOW_UI_DEBUG || !isMarkerOpen) {
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
  }, [isMarkerOpen]);

  if (!SHOW_UI_DEBUG || !isMarkerVisible) {
    return null;
  }

  async function handleCopyFilePath() {
    try {
      await navigator.clipboard.writeText(filePath);
      setCopiedPath(true);
      window.setTimeout(() => setCopiedPath(false), 1400);
    } catch {
      setCopiedPath(false);
    }
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
    typeof document !== "undefined" && isMarkerOpen && panelPosition
      ? createPortal(
          <DevComponentMarkerPanel
            panelRef={panelRef}
            panelId={panelId}
            tier={tier}
            componentName={componentName}
            filePath={filePath}
            position={panelPosition}
            copiedPath={copiedPath}
            resolvedRole={resolvedRole}
            bestFor={bestFor}
            usageExamples={usageExamples}
            notes={notes}
            onCopyFilePath={handleCopyFilePath}
          />,
          document.body
        )
      : null;

  return (
    <span
      ref={markerRef}
      className="dev-marker-anchor"
      data-dev-marker-id={markerDomId}
      data-dev-marker-tier={tier}
      data-dev-marker-open={isMarkerOpen ? "true" : "false"}
    >
      <span
        ref={triggerRef}
        role="button"
        tabIndex={0}
        className={getTriggerClass(tier, isMarkerOpen)}
        data-state={isMarkerOpen ? "open" : "closed"}
        aria-label={`Show component info for ${componentName}`}
        aria-expanded={isMarkerOpen}
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

export { SHOW_UI_DEBUG };

export function DevOnlyComponentMarker(props: DevComponentMarkerProps) {
  if (!SHOW_UI_DEBUG) {
    return null;
  }

  return <DevComponentMarker {...props} />;
}
