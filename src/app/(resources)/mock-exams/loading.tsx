import ResourceLoadingState from "@/components/ui/resource-loading-state";

export default function MockExamsLoading() {
  return (
    <ResourceLoadingState
      eyebrow="Mock exams"
      title="Loading mock exams"
      description="Preparing available papers, tiers, and exam practice."
      searchFields={2}
      resultRows={2}
    />
  );
}
