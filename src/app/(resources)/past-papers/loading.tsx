import ResourceLoadingState from "@/components/ui/resource-loading-state";

export default function PastPapersLoading() {
  return (
    <ResourceLoadingState
      eyebrow="Past papers"
      title="Loading past papers"
      description="Preparing official resource links, exam series, papers, and tiers."
      searchFields={4}
    />
  );
}
