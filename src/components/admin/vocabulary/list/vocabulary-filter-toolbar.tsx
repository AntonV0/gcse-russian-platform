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
  showVolnaUsageFilter: AdminVocabularyListProps["showVolnaUsageFilter"];
};

function FilterControl({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="min-w-0 space-y-1">
      <span className="block app-text-meta">{label}</span>
      {children}
    </label>
  );
}

function getCompactSourceLabel(sourceKey: string) {
  if (sourceKey === "gcse-russian-course-map") return "Course map";
  if (sourceKey === "lesson-design-showcase" || sourceKey === "lesson_design_showcase") {
    return "Showcase";
  }
  if (sourceKey === "pearson_edexcel_gcse_russian_1ru0") return "Pearson spec";
  return getVocabularySourceLabel(sourceKey);
}

export default function VocabularyFilterToolbar({
  filters,
  params,
  themeKeys,
  sourceKeys,
  showVolnaUsageFilter,
}: VocabularyFilterToolbarProps) {
  return (
    <TableToolbar>
      <form className="flex flex-1 flex-col gap-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(280px,1fr)_auto] lg:items-end">
          <FilterControl label="Search">
            <Input
              name="search"
              defaultValue={params.search ?? ""}
              placeholder="Search title, slug, topic, source..."
            />
          </FilterControl>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            <Button type="submit" variant="secondary" size="sm" icon="filter">
              Apply filters
            </Button>
            <Button href="/admin/vocabulary" variant="quiet" size="sm" icon="refresh">
              Reset
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          <FilterControl label="Tier / path">
            <Select name="tier" defaultValue={filters.tier ?? "all"}>
              <option value="all">All paths</option>
              <option value="foundation">Foundation path</option>
              <option value="higher">Higher path</option>
              <option value="both">Both tiers only</option>
            </Select>
          </FilterControl>

          <FilterControl label="Set kind">
            <Select name="setType" defaultValue={filters.setType ?? "all"}>
              <option value="all">All set kinds</option>
              <option value="specification">Specification</option>
              <option value="lesson_custom">Lesson sets</option>
            </Select>
          </FilterControl>

          <FilterControl label="Theme">
            <Select name="themeKey" defaultValue={filters.themeKey ?? ""}>
              <option value="">All themes</option>
              {themeKeys.map((themeKey) => (
                <option key={themeKey} value={themeKey}>
                  {getVocabularyThemeLabel(themeKey)}
                </option>
              ))}
            </Select>
          </FilterControl>

          <FilterControl label="Source">
            <Select name="sourceKey" defaultValue={filters.sourceKey ?? ""}>
              <option value="">All sources</option>
              {sourceKeys.map((sourceKey) => (
                <option key={sourceKey} value={sourceKey}>
                  {getCompactSourceLabel(sourceKey)}
                </option>
              ))}
            </Select>
          </FilterControl>

          <FilterControl label="Usage">
            <Select name="usageVariant" defaultValue={filters.usageVariant ?? "all"}>
              <option value="all">All usage</option>
              <option value="foundation">Used in Foundation</option>
              <option value="higher">Used in Higher</option>
              {showVolnaUsageFilter ? (
                <option value="volna">Used in Volna</option>
              ) : null}
              <option value="unused">Unused</option>
            </Select>
          </FilterControl>

          <FilterControl label="Status">
            <Select name="published" defaultValue={filters.published ?? "all"}>
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </Select>
          </FilterControl>
        </div>
      </form>
    </TableToolbar>
  );
}
