import type { DevMarkerTier } from "@/components/providers/dev-marker-provider";

export type DevComponentMarkerProps = {
  componentName: string;
  filePath: string;
  tier?: DevMarkerTier;
  componentRole?: string;
  bestFor?: string;
  usageExamples?: string[];
  notes?: string;
};

export type MarkerPanelPosition = {
  top: number;
  left: number;
  arrowLeft: number;
};
