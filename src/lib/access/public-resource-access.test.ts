import { describe, expect, it, vi } from "vitest";
import { canDashboardAccessGrammarSet } from "@/lib/grammar/access";
import { canDashboardAccessMockExam } from "@/lib/mock-exams/access";
import { canDashboardAccessPastPaperResource } from "@/lib/past-papers/past-paper-helpers-db";
import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";

vi.mock("@/lib/supabase/env", () => ({
  supabaseAnonKey: "test-anon-key",
  supabaseUrl: "http://localhost",
}));

const guestDashboard: DashboardInfo = {
  role: "guest",
  variant: null,
  accessMode: null,
  accessState: "guest_preview",
};

describe("public resource guest access", () => {
  it("allows guests to read free published resource records", () => {
    expect(
      canDashboardAccessGrammarSet(
        {
          requires_paid_access: false,
        } as Parameters<typeof canDashboardAccessGrammarSet>[0],
        guestDashboard
      )
    ).toBe(true);

    expect(
      canDashboardAccessPastPaperResource(
        {
          requires_paid_access: false,
        } as Parameters<typeof canDashboardAccessPastPaperResource>[0],
        guestDashboard
      )
    ).toBe(true);

    expect(
      canDashboardAccessMockExam(
        {
          requires_paid_access: false,
        } as Parameters<typeof canDashboardAccessMockExam>[0],
        guestDashboard
      )
    ).toBe(true);
  });

  it("keeps paid grammar and mock records out of guest access while opening past papers", () => {
    expect(
      canDashboardAccessGrammarSet(
        {
          requires_paid_access: true,
        } as Parameters<typeof canDashboardAccessGrammarSet>[0],
        guestDashboard
      )
    ).toBe(false);

    expect(
      canDashboardAccessPastPaperResource(
        {
          requires_paid_access: true,
        } as Parameters<typeof canDashboardAccessPastPaperResource>[0],
        guestDashboard
      )
    ).toBe(true);

    expect(
      canDashboardAccessMockExam(
        {
          requires_paid_access: true,
        } as Parameters<typeof canDashboardAccessMockExam>[0],
        guestDashboard
      )
    ).toBe(false);
  });
});
