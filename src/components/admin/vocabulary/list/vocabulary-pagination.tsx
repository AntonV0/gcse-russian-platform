import Button from "@/components/ui/button";
import type {
  AdminVocabularyPagination,
  AdminVocabularySearchParams,
} from "@/components/admin/vocabulary/list/types";

type VocabularyPaginationProps = {
  pagination: AdminVocabularyPagination;
  params: AdminVocabularySearchParams;
};

function buildPageHref(params: AdminVocabularySearchParams, page: number) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (!value || key === "page") continue;
    searchParams.set(key, value);
  }

  if (page > 1) {
    searchParams.set("page", String(page));
  }

  const queryString = searchParams.toString();
  return `/admin/vocabulary${queryString ? `?${queryString}` : ""}`;
}

function getVisiblePageNumbers(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);

  if (currentPage > 1) pages.add(currentPage - 1);
  if (currentPage < totalPages) pages.add(currentPage + 1);

  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
}

export default function VocabularyPagination({
  pagination,
  params,
}: VocabularyPaginationProps) {
  const { currentPage, totalPages, totalItems, startItem, endItem } = pagination;
  const pageNumbers = getVisiblePageNumbers(currentPage, totalPages);

  return (
    <nav
      className="flex flex-col gap-3 border-t border-[var(--border-subtle)] px-4 py-3 sm:px-5 lg:flex-row lg:items-center lg:justify-between"
      aria-label="Vocabulary set pagination"
    >
      <div className="app-text-caption">
        Showing {startItem}-{endItem} of {totalItems} set
        {totalItems === 1 ? "" : "s"}.
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {currentPage > 1 ? (
          <Button
            href={buildPageHref(params, currentPage - 1)}
            variant="secondary"
            size="sm"
            icon="back"
          >
            Previous
          </Button>
        ) : (
          <Button type="button" variant="secondary" size="sm" icon="back" disabled>
            Previous
          </Button>
        )}

        <div className="flex flex-wrap items-center gap-1.5">
          {pageNumbers.map((page, index) => {
            const previousPage = pageNumbers[index - 1];
            const hasGap = previousPage !== undefined && page - previousPage > 1;

            return (
              <span key={page} className="inline-flex items-center gap-1.5">
                {hasGap ? (
                  <span className="px-1 app-text-caption" aria-hidden="true">
                    ...
                  </span>
                ) : null}

                {page === currentPage ? (
                  <Button type="button" variant="primary" size="sm" aria-current="page">
                    {page}
                  </Button>
                ) : (
                  <Button
                    href={buildPageHref(params, page)}
                    variant="secondary"
                    size="sm"
                  >
                    {page}
                  </Button>
                )}
              </span>
            );
          })}
        </div>

        {currentPage < totalPages ? (
          <Button
            href={buildPageHref(params, currentPage + 1)}
            variant="secondary"
            size="sm"
            icon="next"
            iconPosition="right"
          >
            Next
          </Button>
        ) : (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            icon="next"
            iconPosition="right"
            disabled
          >
            Next
          </Button>
        )}
      </div>
    </nav>
  );
}
