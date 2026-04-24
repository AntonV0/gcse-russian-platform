"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Eye, EyeOff } from "lucide-react";

type DevMarkerContextValue = {
  markersEnabled: boolean;
};

type DevMarkerProviderProps = {
  isAdmin: boolean;
  children: React.ReactNode;
};

const DEV_MARKER_STORAGE_KEY = "gcse-russian-dev-markers-enabled";
const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

const DevMarkerContext = createContext<DevMarkerContextValue>({
  markersEnabled: false,
});

function readStoredMarkerPreference() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(DEV_MARKER_STORAGE_KEY) === "true";
}

export function DevMarkerProvider({ isAdmin, children }: DevMarkerProviderProps) {
  const canUseMarkers = SHOW_UI_DEBUG && isAdmin;
  const [markersEnabled, setMarkersEnabled] = useState(() =>
    canUseMarkers ? readStoredMarkerPreference() : false
  );

  const toggleMarkers = useCallback(() => {
    setMarkersEnabled((current) => {
      const nextValue = !current;
      window.localStorage.setItem(DEV_MARKER_STORAGE_KEY, String(nextValue));
      return nextValue;
    });
  }, []);

  const value = useMemo<DevMarkerContextValue>(
    () => ({
      markersEnabled: canUseMarkers && markersEnabled,
    }),
    [canUseMarkers, markersEnabled]
  );

  return (
    <DevMarkerContext.Provider value={value}>
      {children}

      {canUseMarkers ? (
        <button
          type="button"
          className="dev-marker-toggle"
          data-state={markersEnabled ? "enabled" : "disabled"}
          onClick={toggleMarkers}
          aria-pressed={markersEnabled}
          aria-label={
            markersEnabled ? "Hide dev component markers" : "Show dev component markers"
          }
          title={
            markersEnabled ? "Hide dev component markers" : "Show dev component markers"
          }
        >
          {markersEnabled ? <EyeOff size={18} /> : <Eye size={18} />}
          <span>{markersEnabled ? "Hide markers" : "Show markers"}</span>
        </button>
      ) : null}
    </DevMarkerContext.Provider>
  );
}

export function useDevMarkers() {
  return useContext(DevMarkerContext);
}
