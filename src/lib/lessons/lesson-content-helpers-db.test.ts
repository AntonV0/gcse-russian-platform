import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  type QueryResult = {
    data: { lesson_id: string; variant_visibility: string }[] | null;
    error: { message: string } | null;
  };

  function createQueryClient(result: QueryResult) {
    const eq = vi.fn(async () => result);
    const inFilter = vi.fn(() => ({ eq }));
    const select = vi.fn(() => ({ in: inFilter }));
    const from = vi.fn(() => ({ select }));

    return {
      from,
      select,
      inFilter,
      eq,
    };
  }

  return {
    createClient: vi.fn(),
    createServiceRoleClient: vi.fn(),
    createQueryClient,
  };
});

vi.mock("@/lib/supabase/server", () => ({
  createClient: mocks.createClient,
}));

vi.mock("@/lib/supabase/admin", () => ({
  createServiceRoleClient: mocks.createServiceRoleClient,
}));

describe("getLessonIdsWithPublishedSectionsDb", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses the request client by default and filters by variant visibility", async () => {
    const requestClient = mocks.createQueryClient({
      data: [
        { lesson_id: "lesson-shared", variant_visibility: "shared" },
        { lesson_id: "lesson-higher", variant_visibility: "higher_only" },
        { lesson_id: "lesson-foundation", variant_visibility: "foundation_only" },
      ],
      error: null,
    });
    mocks.createClient.mockResolvedValue(requestClient);

    const { getLessonIdsWithPublishedSectionsDb } = await import(
      "./lesson-content-helpers-db"
    );

    const result = await getLessonIdsWithPublishedSectionsDb(
      ["lesson-shared", "lesson-higher", "lesson-foundation"],
      "foundation"
    );

    expect(mocks.createClient).toHaveBeenCalledTimes(1);
    expect(mocks.createServiceRoleClient).not.toHaveBeenCalled();
    expect(requestClient.from).toHaveBeenCalledWith("lesson_sections");
    expect(requestClient.select).toHaveBeenCalledWith("lesson_id, variant_visibility");
    expect(requestClient.inFilter).toHaveBeenCalledWith("lesson_id", [
      "lesson-shared",
      "lesson-higher",
      "lesson-foundation",
    ]);
    expect(requestClient.eq).toHaveBeenCalledWith("is_published", true);
    expect(result).toEqual(new Set(["lesson-shared", "lesson-foundation"]));
  });

  it("can use service-role metadata for course journey readiness checks", async () => {
    const serviceClient = mocks.createQueryClient({
      data: [
        { lesson_id: "lesson-shared", variant_visibility: "shared" },
        { lesson_id: "lesson-higher", variant_visibility: "higher_only" },
        { lesson_id: "lesson-volna", variant_visibility: "volna_only" },
      ],
      error: null,
    });
    mocks.createServiceRoleClient.mockReturnValue(serviceClient);

    const { getLessonIdsWithPublishedSectionsDb } = await import(
      "./lesson-content-helpers-db"
    );

    const result = await getLessonIdsWithPublishedSectionsDb(
      ["lesson-shared", "lesson-higher", "lesson-volna"],
      "higher",
      { useServiceRole: true }
    );

    expect(mocks.createServiceRoleClient).toHaveBeenCalledTimes(1);
    expect(mocks.createClient).not.toHaveBeenCalled();
    expect(result).toEqual(new Set(["lesson-shared", "lesson-higher"]));
  });

  it("does not create a client when no lesson ids are provided", async () => {
    const { getLessonIdsWithPublishedSectionsDb } = await import(
      "./lesson-content-helpers-db"
    );

    const result = await getLessonIdsWithPublishedSectionsDb([], "foundation", {
      useServiceRole: true,
    });

    expect(result).toEqual(new Set());
    expect(mocks.createClient).not.toHaveBeenCalled();
    expect(mocks.createServiceRoleClient).not.toHaveBeenCalled();
  });
});
