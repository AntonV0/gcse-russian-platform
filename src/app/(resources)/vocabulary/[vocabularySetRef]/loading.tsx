import ResourceLoadingState from "@/components/ui/resource-loading-state";

export default function VocabularySetLoading() {
  return (
    <ResourceLoadingState
      eyebrow="Vocabulary set"
      title="Loading study set"
      description="Preparing the word list, study states, and set details."
      searchFields={3}
      resultRows={4}
    />
  );
}
