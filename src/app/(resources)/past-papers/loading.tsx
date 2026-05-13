import ResourceLoadingState from "@/components/ui/resource-loading-state";

export default function PastPapersLoading() {
  return (
    <ResourceLoadingState
      eyebrow="Past papers"
      title="Loading past papers"
      description="Preparing official links, filters, and paper pathways so you can choose the next useful practice task."
      searchFields={4}
    />
  );
}
