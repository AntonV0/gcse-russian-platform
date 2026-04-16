"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AppIcon from "@/components/ui/app-icon";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { appIcons, curatedLucideIconNames } from "@/lib/shared/icons";

const ICONS_PER_PAGE = 100;

function getAllLucideIconEntries(): Array<[string, LucideIcon]> {
  return Object.entries(LucideIcons)
    .filter(([name, value]) => {
      if (
        name === "createLucideIcon" ||
        name === "Icon" ||
        name === "icons" ||
        name === "default"
      ) {
        return false;
      }

      return typeof value === "object" || typeof value === "function";
    })
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => [name, value as LucideIcon]);
}

function toRegistryKey(name: string) {
  return name.charAt(0).toLowerCase() + name.slice(1);
}

async function copyText(value: string) {
  await navigator.clipboard.writeText(value);
}

export default function AllIconsBrowser() {
  const [query, setQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [pageInput, setPageInput] = React.useState("");
  const [copied, setCopied] = React.useState<string | null>(null);

  const allIcons = React.useMemo(() => getAllLucideIconEntries(), []);

  const filteredIcons = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return allIcons;

    return allIcons.filter(([name]) => name.toLowerCase().includes(normalized));
  }, [allIcons, query]);

  const totalPages = Math.max(1, Math.ceil(filteredIcons.length / ICONS_PER_PAGE));

  React.useEffect(() => {
    setPage(1);
    setPageInput("");
  }, [query]);

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  React.useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(null), 1500);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const startIndex = (page - 1) * ICONS_PER_PAGE;
  const pagedIcons = filteredIcons.slice(startIndex, startIndex + ICONS_PER_PAGE);

  function goToPage() {
    const parsed = Number(pageInput);

    if (!parsed || parsed < 1) {
      setPage(1);
      return;
    }

    if (parsed > totalPages) {
      setPage(totalPages);
      return;
    }

    setPage(parsed);
  }

  async function handleCopyName(iconName: string) {
    await copyText(iconName);
    setCopied(`name:${iconName}`);
  }

  async function handleCopyRegistryLine(iconName: string) {
    const registryLine = `${toRegistryKey(iconName)}: ${iconName},`;
    await copyText(registryLine);
    setCopied(`registry:${iconName}`);
  }

  const curatedCount = allIcons.filter(([name]) =>
    curatedLucideIconNames.has(name)
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-gray-600">
          {allIcons.length} total icons available · {curatedCount} already in curated set
        </div>

        <Button
          type="button"
          variant="secondary"
          icon={isOpen ? appIcons.up : appIcons.down}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? "Hide icon browser" : "Show icon browser"}
        </Button>
      </div>

      {!isOpen ? (
        <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-gray-500">
          The full Lucide browser is collapsed by default to keep the page lighter.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search all Lucide icons..."
            />

            <div className="flex items-center rounded-xl border bg-gray-50 px-4 text-sm text-gray-600">
              Showing {pagedIcons.length} of {filteredIcons.length}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-600">
            <div>
              Page {page} of {totalPages}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                icon={appIcons.back}
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Previous
              </Button>

              <Button
                type="button"
                size="sm"
                variant="secondary"
                icon={appIcons.next}
                disabled={page === totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              >
                Next
              </Button>

              <div className="flex items-center gap-2">
                <Input
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  placeholder="Page"
                  className="w-20"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      goToPage();
                    }
                  }}
                />

                <Button type="button" size="sm" variant="quiet" onClick={goToPage}>
                  Go
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {pagedIcons.map(([name, Icon]) => {
              const isCurated = curatedLucideIconNames.has(name);

              return (
                <div
                  key={name}
                  className={`rounded-2xl border p-3 text-center shadow-sm transition hover:-translate-y-0.5 ${
                    isCurated ? "border-green-200 bg-green-50" : "bg-white"
                  }`}
                >
                  <div className="mb-2 flex justify-center">
                    <AppIcon icon={Icon} size={20} />
                  </div>

                  <div className="mb-2 break-words text-xs text-gray-700">{name}</div>

                  <div className="mb-3 flex justify-center">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] ${
                        isCurated
                          ? "border-green-200 bg-white text-green-700"
                          : "border-gray-200 bg-gray-50 text-gray-500"
                      }`}
                    >
                      {isCurated ? "In curated set" : "Not curated"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => handleCopyName(name)}
                      className="flex-1 rounded-md border px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                    >
                      {copied === `name:${name}` ? "✓" : "Name"}
                    </Button>

                    <Button
                      type="button"
                      onClick={() => handleCopyRegistryLine(name)}
                      className="flex-1 rounded-md border px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                    >
                      {copied === `registry:${name}` ? "✓" : "Import"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredIcons.length === 0 ? (
            <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-gray-500">
              No icons match your search.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
