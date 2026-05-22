import { beforeEach, describe, expect, it, vi } from "vitest";

import type { DbVocabularySet } from "@/lib/vocabulary/shared/types";

const mocks = vi.hoisted(() => {
  const createQueryClient = (label: string) => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        in: vi.fn(() => ({ label })),
      })),
    })),
  });

  return {
    createQueryClient,
    createServiceRoleClient: vi.fn(),
    createRequestClient: vi.fn(),
    fetchSupabasePages: vi.fn(),
  };
});

vi.mock("@/lib/supabase/admin", () => ({
  createServiceRoleClient: mocks.createServiceRoleClient,
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: mocks.createRequestClient,
}));

vi.mock("@/lib/vocabulary/shared/pagination", () => ({
  chunkValues: <T>(values: T[]) => [values],
  fetchSupabasePages: mocks.fetchSupabasePages,
}));

const vocabularySet: DbVocabularySet = {
  id: "set-1",
  slug: "daily-routine",
  title: "Daily routine",
  description: null,
  theme_key: "identity-and-culture",
  topic_key: null,
  tier: "foundation",
  list_mode: "spec_only",
  set_type: "specification",
  default_display_variant: "single_column",
  is_published: true,
  is_trial_visible: false,
  requires_paid_access: false,
  available_in_volna: false,
  sort_order: 1,
  source_key: null,
  source_version: null,
  import_key: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

describe("attachVocabularyCountsAndUsage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.createServiceRoleClient.mockReturnValue(
      mocks.createQueryClient("service-role")
    );
    mocks.createRequestClient.mockResolvedValue(mocks.createQueryClient("request"));
    mocks.fetchSupabasePages.mockImplementation(({ queryFactory }) => {
      const query = queryFactory();

      return Promise.resolve([
        {
          vocabulary_set_id: "set-1",
          item_count: query.label === "service-role" ? 12 : 0,
          list_count: 3,
          foundation_occurrences: 2,
          higher_occurrences: 0,
          volna_occurrences: 1,
          foundation_total_items: 12,
          foundation_used_items: 10,
        },
      ]);
    });
  });

  it("uses the service-role client for set summary counts by default", async () => {
    const { attachVocabularyCountsAndUsage } = await import("./set-listing");

    const [result] = await attachVocabularyCountsAndUsage([vocabularySet]);

    expect(mocks.createServiceRoleClient).toHaveBeenCalledTimes(1);
    expect(mocks.createRequestClient).not.toHaveBeenCalled();
    expect(result.item_count).toBe(12);
    expect(result.list_count).toBe(3);
    expect(result.usage_stats).toMatchObject({
      foundationOccurrences: 2,
      higherOccurrences: 0,
      volnaOccurrences: 1,
      usedInFoundation: true,
      usedInHigher: false,
      usedInVolna: true,
    });
    expect(result.coverage_summary).toMatchObject({
      totalItems: 12,
      foundationTotalItems: 12,
      foundationUsedItems: 10,
    });
  });
});
