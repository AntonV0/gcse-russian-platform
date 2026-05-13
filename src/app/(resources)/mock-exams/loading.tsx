import ResourceLoadingState from "@/components/ui/resource-loading-state";

export default function MockExamsLoading() {
  return (
    <ResourceLoadingState
      eyebrow="Mock exams"
      title="Loading mock exams"
      description="Preparing papers, tiers, attempt states, and practice pathways."
      searchFields={2}
      resultRows={2}
    />
  );
}
