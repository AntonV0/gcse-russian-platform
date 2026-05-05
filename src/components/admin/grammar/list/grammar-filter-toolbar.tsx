import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import TableToolbar from "@/components/ui/table-toolbar";
import type {
  AdminGrammarListProps,
  AdminGrammarSearchParams,
} from "@/components/admin/grammar/list/types";
import { getGrammarSourceFilterLabel } from "@/components/admin/grammar/list/grammar-list-labels";
import {
  getGrammarTopicLabel,
  type GrammarSetFilters,
} from "@/lib/grammar/grammar-helpers-db";

type GrammarFilterToolbarProps = {
  filters: GrammarSetFilters;
  params: AdminGrammarSearchParams;
  topicKeys: AdminGrammarListProps["topicKeys"];
  sourceKeys: AdminGrammarListProps["sourceKeys"];
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

export default function GrammarFilterToolbar({
  filters,
  params,
  topicKeys,
  sourceKeys,
}: GrammarFilterToolbarProps) {
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
            <Button href="/admin/grammar" variant="quiet" size="sm" icon="refresh">
              Reset
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
          <FilterControl label="Tier / path">
            <Select name="tier" defaultValue={filters.tier ?? "all"}>
              <option value="all">All paths</option>
              <option value="foundation">Foundation path</option>
              <option value="higher">Higher path</option>
              <option value="both">Both tiers only</option>
              <option value="unknown">Unknown</option>
            </Select>
          </FilterControl>

          <FilterControl label="Topic">
            <Select name="topicKey" defaultValue={filters.topicKey ?? ""}>
              <option value="">All topics</option>
              {topicKeys.map((topicKey) => (
                <option key={topicKey} value={topicKey}>
                  {getGrammarTopicLabel(topicKey)}
                </option>
              ))}
            </Select>
          </FilterControl>

          <FilterControl label="Source">
            <Select name="sourceKey" defaultValue={filters.sourceKey ?? ""}>
              <option value="">All sources</option>
              {sourceKeys.map((sourceKey) => (
                <option key={sourceKey} value={sourceKey}>
                  {getGrammarSourceFilterLabel(sourceKey)}
                </option>
              ))}
            </Select>
          </FilterControl>

          <FilterControl label="Usage">
            <Select name="usageVariant" defaultValue={filters.usageVariant ?? "all"}>
              <option value="all">All usage</option>
              <option value="foundation">Used in Foundation</option>
              <option value="higher">Used in Higher</option>
              <option value="volna">Used in Volna</option>
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
