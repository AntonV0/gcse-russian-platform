import { getVocabularyListAppliesToStudyVariant } from "@/lib/vocabulary/shared/study-variants";
import type { DbVocabularyItem, DbVocabularyList } from "@/lib/vocabulary/shared/types";
import type { VocabularyItemAdminSection } from "./types";

function getAdminListSectionTitle(list: DbVocabularyList) {
  if (list.tier === "foundation") {
    return "Foundation tier";
  }

  if (list.tier === "higher") {
    return "Higher tier extension";
  }

  return list.title;
}

export function groupAdminItemsByList(
  lists: DbVocabularyList[],
  items: DbVocabularyItem[]
): VocabularyItemAdminSection[] {
  const itemListIds = new Set(
    items.map((item) => item.vocabulary_list_id).filter(Boolean)
  );
  const visibleLists = lists.filter((list) => itemListIds.has(list.id));

  if (visibleLists.length === 0) {
    return [
      {
        key: "all-items",
        title: "All items",
        description: `${items.length} item${items.length === 1 ? "" : "s"}`,
        items,
      },
    ];
  }

  return visibleLists.map((list) => {
    const listItems = items.filter((item) => item.vocabulary_list_id === list.id);
    const higherCumulativeNote =
      list.tier === "higher" &&
      lists.some((candidate) =>
        getVocabularyListAppliesToStudyVariant(candidate.tier, "higher")
      )
        ? "Higher and Volna students also need the Foundation section above."
        : null;

    return {
      key: list.id,
      title: getAdminListSectionTitle(list),
      description: [
        `${listItems.length} item${listItems.length === 1 ? "" : "s"}`,
        higherCumulativeNote,
      ]
        .filter(Boolean)
        .join(" "),
      items: listItems,
    };
  });
}
