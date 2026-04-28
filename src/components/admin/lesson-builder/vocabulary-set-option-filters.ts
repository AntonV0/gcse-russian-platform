"use client";

import { useMemo, useState } from "react";
import type { LessonBuilderVocabularySetOption } from "@/components/admin/lesson-builder/lesson-builder-types";

function getVocabularySetOptionSearchText(option: LessonBuilderVocabularySetOption) {
  return [
    option.title,
    option.slug,
    option.tier,
    option.listMode,
    option.isPublished ? "published" : "draft",
    ...option.lists.flatMap((list) => [list.title, list.slug, list.tier, list.listMode]),
  ]
    .join(" ")
    .toLowerCase();
}

export function useVocabularySetOptionFilters({
  options,
  selectedOption,
}: {
  options: LessonBuilderVocabularySetOption[];
  selectedOption: LessonBuilderVocabularySetOption | null;
}) {
  const [setSearch, setSetSearch] = useState("");
  const [setTierFilter, setSetTierFilter] = useState("all");
  const [setModeFilter, setSetModeFilter] = useState("all");
  const [setStatusFilter, setSetStatusFilter] = useState("all");

  const filteredVocabularySetOptions = useMemo(() => {
    const search = setSearch.trim().toLowerCase();

    const filteredOptions = options.filter((option) => {
      if (search && !getVocabularySetOptionSearchText(option).includes(search)) {
        return false;
      }

      if (
        setTierFilter !== "all" &&
        option.tier !== setTierFilter &&
        option.tier !== "both"
      ) {
        return false;
      }

      if (setModeFilter !== "all" && option.listMode !== setModeFilter) {
        return false;
      }

      if (setStatusFilter === "published" && !option.isPublished) {
        return false;
      }

      if (setStatusFilter === "draft" && option.isPublished) {
        return false;
      }

      return true;
    });

    if (
      selectedOption &&
      !filteredOptions.some((option) => option.id === selectedOption.id)
    ) {
      return [selectedOption, ...filteredOptions];
    }

    return filteredOptions;
  }, [options, selectedOption, setModeFilter, setSearch, setStatusFilter, setTierFilter]);

  return {
    filteredVocabularySetOptions,
    setModeFilter,
    setSearch,
    setSetModeFilter,
    setSetSearch,
    setSetStatusFilter,
    setSetTierFilter,
    setStatusFilter,
    setTierFilter,
  };
}
