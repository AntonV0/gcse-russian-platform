"use client";

import { useLayoutEffect } from "react";
import type { AccentPreference } from "@/components/providers/theme-provider";

export default function PublicAccentOverride({
  accent = "blue",
}: {
  accent?: AccentPreference;
}) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previousAccent = root.getAttribute("data-accent");

    function applyPublicAccent() {
      if (root.getAttribute("data-accent") !== accent) {
        root.setAttribute("data-accent", accent);
      }
    }

    applyPublicAccent();

    const observer = new MutationObserver((mutations) => {
      if (
        mutations.some(
          (mutation) =>
            mutation.type === "attributes" && mutation.attributeName === "data-accent"
        )
      ) {
        applyPublicAccent();
      }
    });

    observer.observe(root, { attributes: true, attributeFilter: ["data-accent"] });

    return () => {
      observer.disconnect();

      if (previousAccent) {
        root.setAttribute("data-accent", previousAccent);
      } else {
        root.removeAttribute("data-accent");
      }
    };
  }, [accent]);

  return null;
}
