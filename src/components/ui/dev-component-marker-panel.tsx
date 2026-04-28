"use client";

import { Check, Copy } from "lucide-react";
import type { CSSProperties, RefObject } from "react";
import type { DevMarkerTier } from "@/components/providers/dev-marker-provider";
import type { MarkerPanelPosition } from "@/components/ui/dev-component-marker-types";
import { getPanelClass, getTierLabel } from "@/components/ui/dev-component-marker-utils";

type DevComponentMarkerPanelProps = {
  panelRef: RefObject<HTMLDivElement | null>;
  panelId: string;
  tier: DevMarkerTier;
  componentName: string;
  filePath: string;
  position: MarkerPanelPosition;
  copiedPath: boolean;
  resolvedRole: string;
  bestFor?: string;
  usageExamples?: string[];
  notes?: string;
  onCopyFilePath: () => void;
};

export default function DevComponentMarkerPanel({
  panelRef,
  panelId,
  tier,
  componentName,
  filePath,
  position,
  copiedPath,
  resolvedRole,
  bestFor,
  usageExamples,
  notes,
  onCopyFilePath,
}: DevComponentMarkerPanelProps) {
  return (
    <div
      ref={panelRef}
      id={panelId}
      className={getPanelClass(tier)}
      role="dialog"
      aria-label={`${componentName} component info`}
      style={
        {
          top: `${position.top}px`,
          left: `${position.left}px`,
          "--dev-marker-arrow-left": `${position.arrowLeft}px`,
        } as CSSProperties
      }
    >
      <div className="dev-marker-panel-label">{getTierLabel(tier)}</div>

      <div className="dev-marker-panel-name">{componentName}</div>
      <div className="dev-marker-panel-path-row">
        <div className="dev-marker-panel-path">{filePath}</div>
        <button
          type="button"
          className="dev-marker-copy-button"
          onClick={onCopyFilePath}
          aria-label={`Copy file path for ${componentName}`}
          title="Copy file path"
        >
          {copiedPath ? <Check size={13} /> : <Copy size={13} />}
          <span>{copiedPath ? "Copied" : "Copy"}</span>
        </button>
      </div>

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
  );
}
