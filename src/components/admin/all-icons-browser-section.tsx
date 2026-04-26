"use client";

import dynamic from "next/dynamic";

const AllIconsBrowser = dynamic(() => import("@/components/admin/all-icons-browser"), {
  loading: () => (
    <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--background-muted)] px-4 py-6 text-sm app-text-muted">
      Loading icon browser...
    </div>
  ),
});

export default function AllIconsBrowserSection() {
  return <AllIconsBrowser />;
}
