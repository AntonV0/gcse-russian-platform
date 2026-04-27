import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import type { VocabularySetFilters } from "@/lib/vocabulary/types";

type VocabularyTopicOption = {
  value: string;
  label: string;
};

type VocabularyFilterFormProps = {
  search?: string;
  filters: VocabularySetFilters;
  topicOptions: VocabularyTopicOption[];
};

export default function VocabularyFilterForm({
  search,
  filters,
  topicOptions,
}: VocabularyFilterFormProps) {
  return (
    <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_minmax(140px,160px)_minmax(150px,170px)_minmax(150px,170px)_max-content] xl:items-center">
      <div className="min-w-0">
        <Input
          name="search"
          defaultValue={search ?? ""}
          placeholder="Search vocabulary..."
        />
      </div>

      <div className="min-w-0">
        <Select name="tier" defaultValue={filters.tier ?? "all"}>
          <option value="all">All tiers</option>
          <option value="foundation">Foundation</option>
          <option value="higher">Higher</option>
          <option value="both">Both tiers</option>
        </Select>
      </div>

      <div className="min-w-0">
        <Select name="listMode" defaultValue={filters.listMode ?? "all"}>
          <option value="all">All list types</option>
          <option value="spec_only">Exam list</option>
          <option value="extended_only">Extra practice</option>
          <option value="spec_and_extended">Exam + extra</option>
          <option value="custom">Custom sets</option>
        </Select>
      </div>

      <div className="min-w-0">
        <Select name="themeKey" defaultValue={filters.themeKey ?? ""}>
          <option value="">All topics</option>
          {topicOptions.map((topic) => (
            <option key={topic.value} value={topic.value}>
              {topic.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="app-mobile-action-stack flex shrink-0 flex-wrap gap-2 md:col-span-2 xl:col-span-1 xl:flex-nowrap xl:justify-end">
        <Button type="submit" variant="primary" icon="search">
          Search
        </Button>
        <Button href="/vocabulary" variant="secondary" icon="refresh">
          Reset
        </Button>
      </div>
    </form>
  );
}
