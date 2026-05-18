import {
  getAccountPath,
  getActiveCoursePath,
  getAssignmentsPath,
  getBillingPath,
  getDashboardPath,
  getExamCalendarPath,
  getGrammarPath,
  getMockExamsPath,
  getOnlineClassesPath,
  getPastPapersPath,
  getProfilePath,
  getProgressPath,
  getSettingsPath,
  getTakingYourExamsPath,
  getVocabularyPath,
} from "@/lib/access/routes";
import type { AppIconKey } from "@/lib/shared/icons";

export type PlatformSidebarRole = "admin" | "teacher" | "student" | "guest";
export type PlatformSidebarAccessMode = "trial" | "full" | "volna" | null;
export type PlatformSidebarVariant = "foundation" | "higher" | "volna" | null | undefined;

export type NavItem = {
  label: string;
  href: string;
  icon: AppIconKey;
  locked?: boolean;
  lockedHref?: string;
  lockedLabel?: string;
  description?: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export type SidebarHeaderState = {
  eyebrow: string;
  title: string;
  subtitle: string;
  showStatusPill: boolean;
};

export function titleCaseSlug(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getAccessLabel(
  role: PlatformSidebarRole,
  accessMode: PlatformSidebarAccessMode
) {
  if (role === "admin") {
    return "Admin area";
  }

  if (role === "teacher") {
    return "Teacher area";
  }

  if (role === "guest") {
    return "Preview mode";
  }

  if (accessMode === "volna") {
    return "Volna School";
  }

  if (accessMode === "trial") {
    return "Trial access";
  }

  if (accessMode === "full") {
    return "Full access";
  }

  return "No active access";
}

export function getSidebarContextLabel(
  pathname: string,
  role: PlatformSidebarRole,
  accessMode: PlatformSidebarAccessMode
) {
  if (!pathname.startsWith("/courses")) {
    return getAccessLabel(role, accessMode);
  }

  const [, , variantSlug] = pathname.split("/").filter(Boolean);

  if (variantSlug) {
    if (variantSlug === "volna") {
      return "Volna School course";
    }

    return `${titleCaseSlug(variantSlug)} course`;
  }

  if (role === "admin" || role === "teacher") {
    return "Course view";
  }

  return "GCSE Russian course";
}

export function getSidebarEyebrow(role: PlatformSidebarRole) {
  return role === "admin" || role === "teacher" ? "Platform" : "GCSE Russian";
}

export function getSidebarTitle(role: PlatformSidebarRole) {
  return role === "admin" || role === "teacher" ? "Main Menu" : "Study Menu";
}

export function shouldShowHeaderStatusPill(
  pathname: string,
  role: PlatformSidebarRole,
  accessMode: PlatformSidebarAccessMode
) {
  if (pathname.startsWith("/courses")) {
    return true;
  }

  if (role === "admin" || role === "teacher" || role === "guest") {
    return true;
  }

  return accessMode !== "full";
}

export function getSidebarHeaderState(params: {
  pathname: string;
  role: PlatformSidebarRole;
  accessMode: PlatformSidebarAccessMode;
}): SidebarHeaderState {
  const { pathname, role, accessMode } = params;

  return {
    eyebrow: getSidebarEyebrow(role),
    title: getSidebarTitle(role),
    subtitle: getSidebarContextLabel(pathname, role, accessMode),
    showStatusPill: shouldShowHeaderStatusPill(pathname, role, accessMode),
  };
}

export function getCourseGroupLabel(variant: PlatformSidebarVariant) {
  if (variant === "foundation") return "GCSE Russian - Foundation";
  if (variant === "higher") return "GCSE Russian - Higher";
  if (variant === "volna") return "GCSE Russian - Volna School";
  return "Choose Your Course";
}

export function getSidebarNavigationLabels(role: PlatformSidebarRole) {
  if (role === "admin" || role === "teacher") {
    return {
      quick: "Platform quick navigation",
      full: "Full platform navigation",
      primary: "Platform navigation",
    };
  }

  return {
    quick: "Study quick navigation",
    full: "Full study navigation",
    primary: "Study navigation",
  };
}

export function buildPlatformSidebarNav(params: {
  role: PlatformSidebarRole;
  accessMode: PlatformSidebarAccessMode;
  variant: PlatformSidebarVariant;
  isGuest: boolean;
}) {
  const { role, accessMode, variant, isGuest } = params;
  const isAdmin = role === "admin";
  const isTeacher = role === "teacher";
  const isStudent = role === "student";
  const isVolnaStudent = isStudent && accessMode === "volna";
  const showAssignments = isAdmin || isTeacher || isVolnaStudent;
  const showVolnaSchool = isAdmin || isTeacher || !isVolnaStudent;
  const courseHref = getActiveCoursePath(variant);
  const dashboardHref = getDashboardPath();

  const courseGroupItems: NavItem[] = [
    { label: "Dashboard", href: dashboardHref, icon: "dashboard" },
    { label: "Course", href: courseHref, icon: "courses" },
    { label: "Progress", href: getProgressPath(), icon: "completed" },
  ];

  const studyItems: NavItem[] = [
    { label: "Vocabulary", href: getVocabularyPath(), icon: "vocabulary" },
    { label: "Grammar", href: getGrammarPath(), icon: "grammar" },
  ];

  if (showAssignments) {
    studyItems.push({
      label: "Assignments",
      href: getAssignmentsPath(),
      icon: "assignments",
    });
  }

  const examPrepItems: NavItem[] = [
    { label: "Past Papers", href: getPastPapersPath(), icon: "pastPapers" },
    { label: "Mock Exams", href: getMockExamsPath(), icon: "mockExam" },
    { label: "Taking Your Exams", href: getTakingYourExamsPath(), icon: "exam" },
    { label: "Exam Calendar", href: getExamCalendarPath(), icon: "calendar" },
  ];

  const volnaSchoolItems: NavItem[] = showVolnaSchool
    ? [
        {
          label: "Join Volna School",
          href: getOnlineClassesPath(),
          icon: "school",
          locked: isGuest,
          lockedHref: "/login",
          lockedLabel: "Login",
        },
      ]
    : [];

  const utilityItems: NavItem[] = [
    {
      label: "Overview",
      href: getAccountPath(),
      icon: "dashboard",
      locked: isGuest,
      lockedHref: "/login",
      lockedLabel: "Login",
    },
    {
      label: "Billing",
      href: getBillingPath(),
      icon: "billing",
      locked: isGuest,
      lockedHref: "/login",
      lockedLabel: "Login",
    },
    {
      label: "Profile",
      href: getProfilePath(),
      icon: "student",
      locked: isGuest,
      lockedHref: "/login",
      lockedLabel: "Login",
    },
    {
      label: "Settings",
      href: getSettingsPath(),
      icon: "settings",
      locked: isGuest,
      lockedHref: "/login",
      lockedLabel: "Login",
    },
  ];

  const contentNavGroups: NavGroup[] = [
    { label: getCourseGroupLabel(variant), items: courseGroupItems },
    { label: "Study & Practice", items: studyItems },
    { label: "Exam Prep", items: examPrepItems },
  ];

  if (volnaSchoolItems.length) {
    contentNavGroups.push({ label: "Live Classes & Tuition", items: volnaSchoolItems });
  }

  const navGroups: NavGroup[] = [
    ...contentNavGroups,
    { label: "Account", items: utilityItems },
  ];
  const mobileQuickItems = [
    ...courseGroupItems,
    ...studyItems.filter((item) =>
      isVolnaStudent
        ? item.label === "Assignments" || item.label === "Vocabulary"
        : item.label === "Vocabulary"
    ),
  ];

  return {
    courseGroupItems,
    studyItems,
    examPrepItems,
    volnaSchoolItems,
    utilityItems,
    contentNavGroups,
    navGroups,
    mobileQuickItems,
  };
}
