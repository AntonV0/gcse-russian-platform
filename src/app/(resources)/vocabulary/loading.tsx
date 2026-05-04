import ResourceLoadingState from "@/components/ui/resource-loading-state";

export default function VocabularyLoading() {
  return (
    <ResourceLoadingState
      eyebrow="Vocabulary"
      title="Loading vocabulary"
      description="Preparing topic lists, tiers, and the vocabulary finder."
      searchFields={4}
    />
  );
}
