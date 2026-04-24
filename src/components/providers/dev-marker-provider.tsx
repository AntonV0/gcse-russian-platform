"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Eye, EyeOff, ListFilter } from "lucide-react";

export type DevMarkerTier = "primitive" | "container" | "layout" | "semantic";
export type DevMarkerTierFilter = DevMarkerTier | "all";

export type DevMarkerRegistryItem = {
  id: string;
  componentName: string;
  filePath: string;
  tier: DevMarkerTier;
};

type DevMarkerContextValue = {
  canUseMarkers: boolean;
  markersEnabled: boolean;
  activeTierFilter: DevMarkerTierFilter;
  isTierVisible: (tier: DevMarkerTier) => boolean;
  registerMarker: (item: DevMarkerRegistryItem) => void;
  unregisterMarker: (id: string) => void;
};

type DevMarkerProviderProps = {
  isAdmin: boolean;
  children: React.ReactNode;
};

const DEV_MARKER_STORAGE_PREFIX = "gcse-russian-dev-markers";
const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";
const TIER_FILTERS: { value: DevMarkerTierFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "layout", label: "Layout" },
  { value: "container", label: "Containers" },
  { value: "semantic", label: "Semantic" },
  { value: "primitive", label: "Primitives" },
];

const DevMarkerContext = createContext<DevMarkerContextValue>({
  canUseMarkers: false,
  markersEnabled: false,
  activeTierFilter: "all",
  isTierVisible: () => false,
  registerMarker: () => undefined,
  unregisterMarker: () => undefined,
});

function getMarkerStorageKey(suffix: string) {
  if (typeof window === "undefined") {
    return `${DEV_MARKER_STORAGE_PREFIX}:local:${suffix}`;
  }

  return `${DEV_MARKER_STORAGE_PREFIX}:${process.env.NODE_ENV}:${window.location.host}:${suffix}`;
}

function readStoredMarkerPreference() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(getMarkerStorageKey("enabled")) === "true";
}

function readStoredTierFilter(): DevMarkerTierFilter {
  if (typeof window === "undefined") {
    return "all";
  }

  const stored = window.localStorage.getItem(getMarkerStorageKey("tier-filter"));

  return stored === "layout" ||
    stored === "container" ||
    stored === "semantic" ||
    stored === "primitive" ||
    stored === "all"
    ? stored
    : "all";
}

export function DevMarkerProvider({ isAdmin, children }: DevMarkerProviderProps) {
  const canUseMarkers = SHOW_UI_DEBUG && isAdmin;
  const [markersEnabled, setMarkersEnabled] = useState(readStoredMarkerPreference);
  const [activeTierFilter, setActiveTierFilterState] =
    useState<DevMarkerTierFilter>(readStoredTierFilter);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [registeredMarkers, setRegisteredMarkers] = useState<
    Record<string, DevMarkerRegistryItem>
  >({});
  const resolvedMarkersEnabled = canUseMarkers && markersEnabled;
  const resolvedPanelOpen = resolvedMarkersEnabled && isPanelOpen;

  const toggleMarkers = useCallback(() => {
    setMarkersEnabled((current) => {
      const nextValue = !current;
      window.localStorage.setItem(getMarkerStorageKey("enabled"), String(nextValue));
      return nextValue;
    });
  }, []);

  const setActiveTierFilter = useCallback((nextFilter: DevMarkerTierFilter) => {
    window.localStorage.setItem(getMarkerStorageKey("tier-filter"), nextFilter);
    setActiveTierFilterState(nextFilter);
  }, []);

  const isTierVisible = useCallback(
    (tier: DevMarkerTier) => {
      return activeTierFilter === "all" || activeTierFilter === tier;
    },
    [activeTierFilter]
  );

  const registerMarker = useCallback((item: DevMarkerRegistryItem) => {
    setRegisteredMarkers((current) => {
      const existing = current[item.id];

      if (
        existing &&
        existing.componentName === item.componentName &&
        existing.filePath === item.filePath &&
        existing.tier === item.tier
      ) {
        return current;
      }

      return {
        ...current,
        [item.id]: item,
      };
    });
  }, []);

  const unregisterMarker = useCallback((id: string) => {
    setRegisteredMarkers((current) => {
      if (!current[id]) {
        return current;
      }

      const next = { ...current };
      delete next[id];
      return next;
    });
  }, []);

  useEffect(() => {
    if (!canUseMarkers) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (!(event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "m")) {
        return;
      }

      event.preventDefault();
      toggleMarkers();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canUseMarkers, toggleMarkers]);

  const markerList = useMemo(() => {
    return Object.values(registeredMarkers).sort((a, b) => {
      const byName = a.componentName.localeCompare(b.componentName);
      return byName !== 0 ? byName : a.filePath.localeCompare(b.filePath);
    });
  }, [registeredMarkers]);

  const visibleMarkerList = useMemo(() => {
    return markerList.filter((marker) => isTierVisible(marker.tier));
  }, [isTierVisible, markerList]);

  function scrollToMarker(id: string) {
    document
      .querySelector(`[data-dev-marker-id="${CSS.escape(id)}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const value = useMemo<DevMarkerContextValue>(
    () => ({
      canUseMarkers,
      markersEnabled: resolvedMarkersEnabled,
      activeTierFilter,
      isTierVisible,
      registerMarker,
      unregisterMarker,
    }),
    [
      activeTierFilter,
      canUseMarkers,
      isTierVisible,
      resolvedMarkersEnabled,
      registerMarker,
      unregisterMarker,
    ]
  );

  return (
    <DevMarkerContext.Provider value={value}>
      {children}

      {canUseMarkers ? (
        <button
          type="button"
          className="dev-marker-toggle"
          data-state={resolvedMarkersEnabled ? "enabled" : "disabled"}
          onClick={toggleMarkers}
          aria-pressed={resolvedMarkersEnabled}
          aria-label={
            resolvedMarkersEnabled
              ? "Hide dev component markers"
              : "Show dev component markers"
          }
          title={
            resolvedMarkersEnabled
              ? "Hide dev component markers"
              : "Show dev component markers"
          }
        >
          {resolvedMarkersEnabled ? <EyeOff size={18} /> : <Eye size={18} />}
          <span>{resolvedMarkersEnabled ? "Hide markers" : "Show markers"}</span>
          {resolvedMarkersEnabled ? (
            <span className="dev-marker-toggle-count">{visibleMarkerList.length}</span>
          ) : null}
        </button>
      ) : null}

      {resolvedMarkersEnabled ? (
        <div className="dev-marker-control-panel">
          <div className="dev-marker-control-panel-header">
            <div>
              <div className="dev-marker-control-panel-title">Component markers</div>
              <div className="dev-marker-control-panel-meta">
                {visibleMarkerList.length} visible / {markerList.length} total
              </div>
            </div>

            <button
              type="button"
              className="dev-marker-control-icon-button"
              onClick={() => setIsPanelOpen((current) => !current)}
              aria-expanded={resolvedPanelOpen}
              aria-label={resolvedPanelOpen ? "Hide marker index" : "Show marker index"}
              title={resolvedPanelOpen ? "Hide marker index" : "Show marker index"}
            >
              <ListFilter size={16} />
            </button>
          </div>

          <div className="dev-marker-tier-filter" aria-label="Marker tier filter">
            {TIER_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className="dev-marker-tier-filter-button"
                data-state={activeTierFilter === filter.value ? "active" : "inactive"}
                onClick={() => setActiveTierFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {resolvedPanelOpen ? (
            <div className="dev-marker-index" aria-label="Visible component markers">
              {visibleMarkerList.length === 0 ? (
                <div className="dev-marker-index-empty">
                  No markers match this tier filter.
                </div>
              ) : (
                visibleMarkerList.map((marker) => (
                  <button
                    key={marker.id}
                    type="button"
                    className="dev-marker-index-item"
                    onClick={() => scrollToMarker(marker.id)}
                  >
                    <span className="dev-marker-index-name">{marker.componentName}</span>
                    <span className="dev-marker-index-meta">
                      {marker.tier} · {marker.filePath}
                    </span>
                  </button>
                ))
              )}
            </div>
          ) : null}
        </div>
      ) : null}
    </DevMarkerContext.Provider>
  );
}

export function useDevMarkers() {
  return useContext(DevMarkerContext);
}
