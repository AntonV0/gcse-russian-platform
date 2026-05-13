import { describe, expect, it } from "vitest";
import {
  buildPlatformSidebarNav,
  getSidebarHeaderState,
  getSidebarNavigationLabels,
} from "@/components/layout/platform-sidebar-config";

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
      eyebrow: "GCSE Russian",
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
      eyebrow: "GCSE Russian",
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
    expect(volnaStudent.volnaSchoolItems).toHaveLength(0);
    expect(fullStudent.studyItems.map((item) => item.label)).not.toContain("Assignments");
    expect(fullStudent.volnaSchoolItems.map((item) => item.label)).toContain(
      "Join Volna School"
    );
    expect(admin.studyItems.map((item) => item.label)).toContain("Assignments");
    expect(admin.volnaSchoolItems.map((item) => item.label)).toContain(
      "Join Volna School"
    );
  });

  it("locks guest account and Volna navigation targets", () => {
    const guest = buildPlatformSidebarNav({
      role: "guest",
      accessMode: null,
      variant: null,
      isGuest: true,
    });

    expect(guest.utilityItems.every((item) => item.locked)).toBe(true);
    expect(guest.volnaSchoolItems).toEqual([
      {
        label: "Join Volna School",
        href: "/online-classes",
        icon: "school",
        locked: true,
        lockedHref: "/login",
        lockedLabel: "Login",
      },
    ]);
  });
});
