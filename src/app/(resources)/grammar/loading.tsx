import ResourceLoadingState from "@/components/ui/resource-loading-state";

export default function GrammarLoading() {
  return (
    <ResourceLoadingState
      eyebrow="Grammar"
      title="Loading grammar"
      description="Preparing grammar topics, tiers, and the finder controls."
      searchFields={3}
    />
  );
}
