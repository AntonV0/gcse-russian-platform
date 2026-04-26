const SUPABASE_PAGE_SIZE = 1000;
const SUPABASE_IN_BATCH_SIZE = 100;

type SupabasePagedQuery<T> = {
  range: (
    from: number,
    to: number
  ) => PromiseLike<{
    data: T[] | null;
    error: unknown;
  }>;
};

export async function fetchSupabasePages<T>({
  queryFactory,
  errorMessage,
  errorContext,
}: {
  queryFactory: () => SupabasePagedQuery<T>;
  errorMessage: string;
  errorContext: Record<string, unknown>;
}) {
  const rows: T[] = [];

  for (let from = 0; ; from += SUPABASE_PAGE_SIZE) {
    const to = from + SUPABASE_PAGE_SIZE - 1;
    const { data, error } = await queryFactory().range(from, to);

    if (error) {
      console.error(errorMessage, {
        ...errorContext,
        error,
      });
      return [] as T[];
    }

    const pageRows = data ?? [];
    rows.push(...pageRows);

    if (pageRows.length < SUPABASE_PAGE_SIZE) {
      return rows;
    }
  }
}

export function chunkValues<T>(values: T[], batchSize = SUPABASE_IN_BATCH_SIZE) {
  const chunks: T[][] = [];

  for (let start = 0; start < values.length; start += batchSize) {
    chunks.push(values.slice(start, start + batchSize));
  }

  return chunks;
}
