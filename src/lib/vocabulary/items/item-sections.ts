import { groupVocabularyItemsBySource } from "@/lib/vocabulary/shared/labels";
import { getVocabularyListAppliesToStudyVariant } from "@/lib/vocabulary/shared/study-variants";
import type {
  DbVocabularyItem,
  DbVocabularyList,
  DbVocabularyStudyVariant,
} from "@/lib/vocabulary/shared/types";

export type VocabularyItemSectionGroup = {
  key: string;
  title: string;
  description: string;
  items: DbVocabularyItem[];
};

export function getVocabularyStudyVariant(
  dashboardVariant: DbVocabularyStudyVariant | null,
  canSeeDrafts: boolean
): DbVocabularyStudyVariant | "all" {
  if (canSeeDrafts) {
    return "all";
  }

  return dashboardVariant ?? "foundation";
}

function getVisibleVocabularyLists(
  lists: DbVocabularyList[],
  studyVariant: DbVocabularyStudyVariant | "all"
) {
  if (studyVariant === "all") {
    return lists;
  }

  return lists.filter((list) =>
    getVocabularyListAppliesToStudyVariant(list.tier, studyVariant)
  );
}

function getVocabularyListSectionTitle(
  list: DbVocabularyList,
  studyVariant: DbVocabularyStudyVariant | "all"
) {
  if (studyVariant === "higher" || studyVariant === "volna") {
    if (list.tier === "foundation") {
      return "Foundation tier";
    }

    if (list.tier === "higher") {
      return "Higher tier extension";
    }
  }

  return list.title;
}

function formatItemCount(count: number, label = "item") {
  return `${count} ${label}${count === 1 ? "" : "s"}`;
}

function getVocabularyListSectionDescription(
  list: DbVocabularyList,
  itemCount: number,
  studyVariant: DbVocabularyStudyVariant | "all"
) {
  if (
    (studyVariant === "higher" || studyVariant === "volna") &&
    list.tier === "foundation"
  ) {
    return `${formatItemCount(itemCount, "Foundation item")} included for Higher and Volna study`;
  }

  if (list.tier === "higher") {
    return formatItemCount(itemCount, "Higher-extension item");
  }

  return formatItemCount(itemCount);
}

function getFallbackTierSections(
  items: DbVocabularyItem[]
): VocabularyItemSectionGroup[] {
  const foundationItems = items.filter((item) => item.tier === "foundation");
  const higherItems = items.filter((item) => item.tier === "higher");
  const bothTierItems = items.filter(
    (item) => item.tier === "both" || item.tier === "unknown"
  );

  return [
    {
      key: "foundation",
      title: "Foundation tier",
      description: formatItemCount(foundationItems.length, "Foundation item"),
      items: foundationItems,
    },
    {
      key: "higher",
      title: "Higher tier extension",
      description: formatItemCount(higherItems.length, "Higher-extension item"),
      items: higherItems,
    },
    {
      key: "both",
      title: "Both tiers",
      description: formatItemCount(bothTierItems.length),
      items: bothTierItems,
    },
  ].filter((section) => section.items.length > 0);
}

function getFallbackSourceSections(
  items: DbVocabularyItem[]
): VocabularyItemSectionGroup[] {
  const groupedItems = groupVocabularyItemsBySource(items);

  return [
    {
      key: "spec-required",
      title: "Specification vocabulary",
      description: formatItemCount(groupedItems.specRequired.length),
      items: groupedItems.specRequired,
    },
    {
      key: "extended",
      title: "Extended vocabulary",
      description: formatItemCount(groupedItems.extended.length),
      items: groupedItems.extended,
    },
    {
      key: "custom",
      title: "Custom vocabulary",
      description: formatItemCount(groupedItems.custom.length),
      items: groupedItems.custom,
    },
  ].filter((section) => section.items.length > 0);
}

export function groupVocabularyItemsByList(
  lists: DbVocabularyList[],
  items: DbVocabularyItem[],
  studyVariant: DbVocabularyStudyVariant | "all"
): VocabularyItemSectionGroup[] {
  const itemListIds = new Set(
    items.map((item) => item.vocabulary_list_id).filter(Boolean)
  );
  const visibleLists = getVisibleVocabularyLists(lists, studyVariant).filter((list) =>
    itemListIds.has(list.id)
  );

  if (visibleLists.length === 0) {
    return lists.length > 0
      ? getFallbackTierSections(items)
      : getFallbackSourceSections(items);
  }

  return visibleLists.map((list) => {
    const listItems = items.filter((item) => item.vocabulary_list_id === list.id);

    return {
      key: list.id,
      title: getVocabularyListSectionTitle(list, studyVariant),
      description: getVocabularyListSectionDescription(
        list,
        listItems.length,
        studyVariant
      ),
      items: listItems,
    };
  });
}
