import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import TableToolbar from "@/components/ui/table-toolbar";
import type {
  AdminVocabularySearchParams,
  AdminVocabularyListProps,
} from "@/components/admin/vocabulary/list/types";
import {
  getVocabularySourceLabel,
  getVocabularyThemeLabel,
} from "@/lib/vocabulary/shared/labels";
import type { VocabularySetFilters } from "@/lib/vocabulary/shared/types";

type VocabularyFilterToolbarProps = {
  filters: VocabularySetFilters;
  params: AdminVocabularySearchParams;
  themeKeys: AdminVocabularyListProps["themeKeys"];
  sourceKeys: AdminVocabularyListProps["sourceKeys"];
};

export default function VocabularyFilterToolbar({
  filters,
  params,
  themeKeys,
  sourceKeys,
}: VocabularyFilterToolbarProps) {
  return (
    <TableToolbar>
      <form className="grid flex-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1.2fr)_repeat(7,minmax(140px,1fr))_max-content] xl:items-center">
        <div className="min-w-0">
          <Input
            name="search"
            defaultValue={params.search ?? ""}
            placeholder="Search title, slug, topic, source..."
          />
        </div>

        <div className="min-w-0">
          <Select name="tier" defaultValue={filters.tier ?? "all"}>
            <option value="all">All tiers</option>
            <option value="foundation">Foundation</option>
            <option value="higher">Higher</option>
            <option value="both">Both tiers</option>
            <option value="unknown">Unknown</option>
          </Select>
        </div>

        <div className="min-w-0">
          <Select name="listMode" defaultValue={filters.listMode ?? "all"}>
            <option value="all">All modes</option>
            <option value="custom">Custom</option>
            <option value="spec_only">Spec only</option>
            <option value="extended_only">Extended only</option>
            <option value="spec_and_extended">Spec + extended</option>
          </Select>
        </div>

        <div className="min-w-0">
          <Select name="setType" defaultValue={filters.setType ?? "all"}>
            <option value="all">All types</option>
            <option value="specification">Specification</option>
            <option value="core">Core</option>
            <option value="theme">Theme</option>
            <option value="phrase_bank">Phrase bank</option>
            <option value="exam_prep">Exam prep</option>
            <option value="lesson_custom">Lesson custom</option>
          </Select>
        </div>

        <div className="min-w-0">
          <Select name="themeKey" defaultValue={filters.themeKey ?? ""}>
            <option value="">All themes</option>
            {themeKeys.map((themeKey) => (
              <option key={themeKey} value={themeKey}>
                {getVocabularyThemeLabel(themeKey)}
              </option>
            ))}
          </Select>
        </div>

        <div className="min-w-0">
          <Select name="sourceKey" defaultValue={filters.sourceKey ?? ""}>
            <option value="">All sources</option>
            {sourceKeys.map((sourceKey) => (
              <option key={sourceKey} value={sourceKey}>
                {getVocabularySourceLabel(sourceKey)}
              </option>
            ))}
          </Select>
        </div>

        <div className="min-w-0">
          <Select name="usageVariant" defaultValue={filters.usageVariant ?? "all"}>
            <option value="all">All usage</option>
            <option value="foundation">Used in Foundation</option>
            <option value="higher">Used in Higher</option>
            <option value="volna">Used in Volna</option>
            <option value="unused">Unused</option>
          </Select>
        </div>

        <div className="min-w-0">
          <Select name="published" defaultValue={filters.published ?? "all"}>
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2 md:col-span-2 xl:col-span-1 xl:justify-end">
          <Button type="submit" variant="secondary" size="sm" icon="filter">
            Apply
          </Button>
          <Button href="/admin/vocabulary" variant="quiet" size="sm" icon="refresh">
            Reset
          </Button>
        </div>
      </form>
    </TableToolbar>
  );
}
