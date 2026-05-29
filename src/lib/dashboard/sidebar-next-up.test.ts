import { describe, expect, it, vi } from "vitest";
import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";

vi.mock("@/lib/progress/progress", () => ({
  getCourseProgressSummary: vi.fn(),
}));

vi.mock("@/lib/dashboard/learning-plan", () => ({
  getDashboardNextStep: vi.fn(),
  getStudentLearningPlan: vi.fn(),
}));

describe("getPlatformSidebarNextUp", () => {
  it("gives guests a primary trial CTA without loading progress", async () => {
    const { getPlatformSidebarNextUp } = await import("@/lib/dashboard/sidebar-next-up");
    const guestDashboard: DashboardInfo = {
      role: "guest",
      variant: null,
      accessMode: null,
      accessState: "guest_preview",
    };

    await expect(getPlatformSidebarNextUp(guestDashboard)).resolves.toEqual({
      eyebrow: "Next up",
      title: "Start your free trial",
      description: "Try lessons, practice questions, save your progress, and much more!",
      href: "/signup",
      label: "Start free trial",
      icon: "create",
      progressPercent: 0,
    });
  });
});
