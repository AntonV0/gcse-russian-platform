import { describe, expect, it } from "vitest";
import {
  buildPlatformSidebarNav,
  getSidebarHeaderState,
  getSidebarNavigationLabels,
} from "@/components/layout/platform-sidebar-config";
import { getMobileQuickLabel } from "@/components/layout/platform-sidebar-primitives";

describe("platform sidebar config", () => {
  it("labels admin platform pages as platform navigation", () => {
    expect(
      getSidebarHeaderState({
        pathname: "/settings",
        role: "admin",
        accessMode: "volna",
      })
    ).toEqual({
      eyebrow: "Platform",
      title: "Main Menu",
      subtitle: "Admin area",
      showStatusPill: true,
    });

    expect(getSidebarNavigationLabels("admin")).toEqual({
      quick: "Platform quick navigation",
      full: "Full platform navigation",
      primary: "Platform navigation",
    });
  });

  it("labels student platform pages as study navigation", () => {
    expect(
      getSidebarHeaderState({
        pathname: "/settings",
        role: "student",
        accessMode: "full",
      })
    ).toEqual({
      eyebrow: "GCSE Russian (Pearson 1RU0)",
      title: "Study Menu",
      subtitle: "Full access",
      showStatusPill: false,
    });

    expect(getSidebarNavigationLabels("student")).toEqual({
      quick: "Study quick navigation",
      full: "Full study navigation",
      primary: "Study navigation",
    });
  });

  it("keeps limited-access student states visible", () => {
    expect(
      getSidebarHeaderState({
        pathname: "/dashboard",
        role: "student",
        accessMode: "trial",
      }).subtitle
    ).toBe("Trial access");

    expect(
      getSidebarHeaderState({
        pathname: "/dashboard",
        role: "student",
        accessMode: null,
      })
    ).toMatchObject({
      subtitle: "No active access",
      showStatusPill: true,
    });

    expect(
      getSidebarHeaderState({
        pathname: "/dashboard",
        role: "student",
        accessMode: "volna",
      })
    ).toMatchObject({
      subtitle: "Volna School",
      showStatusPill: true,
    });
  });

  it("uses course context on lesson routes", () => {
    expect(
      getSidebarHeaderState({
        pathname: "/courses/gcse-russian/foundation/modules/basics/lessons/intro",
        role: "student",
        accessMode: "full",
      })
    ).toEqual({
      eyebrow: "GCSE Russian (Pearson 1RU0)",
      title: "Study Menu",
      subtitle: "Foundation course",
      showStatusPill: true,
    });

    expect(
      getSidebarHeaderState({
        pathname: "/courses/gcse-russian/volna",
        role: "student",
        accessMode: "volna",
      }).subtitle
    ).toBe("Volna School course");
  });

  it("builds role-aware nav groups", () => {
    const volnaStudent = buildPlatformSidebarNav({
      role: "student",
      accessMode: "volna",
      variant: "volna",
      isGuest: false,
    });
    const fullStudent = buildPlatformSidebarNav({
      role: "student",
      accessMode: "full",
      variant: "foundation",
      isGuest: false,
    });
    const admin = buildPlatformSidebarNav({
      role: "admin",
      accessMode: "volna",
      variant: "volna",
      isGuest: false,
    });

    expect(volnaStudent.studyItems.map((item) => item.label)).toContain("Assignments");
    expect(volnaStudent.mobileQuickItems.map((item) => item.label)).toContain(
      "Assignments"
    );
    expect(volnaStudent.volnaSchoolItems).toHaveLength(0);
    expect(fullStudent.studyItems.map((item) => item.label)).not.toContain("Assignments");
    expect(fullStudent.mobileQuickItems.map((item) => item.label)).not.toContain(
      "Assignments"
    );
    expect(fullStudent.volnaSchoolItems.map((item) => item.label)).toContain(
      "Join Volna School"
    );
    expect(admin.studyItems.map((item) => item.label)).toContain("Assignments");
    expect(admin.volnaSchoolItems.map((item) => item.label)).toContain(
      "Join Volna School"
    );
  });

  it("shortens mobile quick labels without changing accessible nav labels", () => {
    expect(getMobileQuickLabel("Dashboard")).toBe("Dash");
    expect(getMobileQuickLabel("Progress")).toBe("Track");
    expect(getMobileQuickLabel("Vocabulary")).toBe("Vocab");
    expect(getMobileQuickLabel("Assignments")).toBe("Tasks");
    expect(getMobileQuickLabel("Grammar")).toBe("Grammar");
  });

  it("uses compact guest header labels without a status pill", () => {
    expect(
      getSidebarHeaderState({
        pathname: "/vocabulary",
        role: "guest",
        accessMode: null,
      })
    ).toEqual({
      eyebrow: "GCSE Russian (Pearson 1RU0)",
      title: "Study Menu",
      subtitle: "Guest",
      showStatusPill: false,
    });
  });

  it("keeps public resources open while locking private guest trial targets", () => {
    const guest = buildPlatformSidebarNav({
      role: "guest",
      accessMode: null,
      variant: null,
      isGuest: true,
    });

    expect(guest.utilityItems.every((item) => item.locked)).toBe(true);
    expect(guest.utilityItems.every((item) => item.lockedHref === "/signup?from=app")).toBe(true);
    expect(guest.utilityItems.every((item) => item.lockedLabel === "Trial")).toBe(true);
    expect(guest.courseGroupItems.map((item) => item.label)).toEqual([
      "Home",
      "Dashboard",
      "My Course",
      "Progress",
    ]);
    expect(guest.courseGroupItems.find((item) => item.label === "Home")).toMatchObject({
      href: "/",
      icon: "home",
    });
    expect(guest.courseGroupItems.find((item) => item.href === "/courses")?.label).toBe(
      "My Course"
    );
    expect(
      guest.courseGroupItems.find((item) => item.label === "Progress")
    ).toMatchObject({
      locked: true,
      lockedHref: "/signup?from=app",
      lockedLabel: "Trial",
    });
    expect(guest.contentNavGroups.map((group) => group.label)).toEqual([
      "Start Here",
      "Study & Practice",
      "Exam Prep",
      "Live Classes & Tuition",
    ]);
    expect(guest.studyItems).toEqual([
      {
        label: "Vocabulary",
        href: "/vocabulary",
        icon: "vocabulary",
        locked: true,
        lockedHref: "/signup?from=app",
        lockedLabel: "Trial",
      },
      {
        label: "Grammar",
        href: "/grammar",
        icon: "grammar",
        locked: true,
        lockedHref: "/signup?from=app",
        lockedLabel: "Trial",
      },
    ]);
    for (const label of ["Past Papers", "Mock Exams"]) {
      expect(guest.examPrepItems.find((item) => item.label === label)).not.toHaveProperty(
        "locked"
      );
    }
    for (const label of ["Taking Your Exams", "Exam Calendar"]) {
      expect(guest.examPrepItems.find((item) => item.label === label)).toMatchObject({
        locked: true,
        lockedHref: "/signup?from=app",
        lockedLabel: "Trial",
      });
    }
    expect(guest.mobileQuickItems.map((item) => item.label)).toEqual([
      "Home",
      "Dashboard",
      "My Course",
      "Progress",
    ]);
    expect(guest.volnaSchoolItems).toEqual([
      {
        label: "Join Volna School",
        href: "/online-classes",
        icon: "school",
      },
    ]);
  });
});
