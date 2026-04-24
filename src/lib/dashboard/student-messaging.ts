export type AccessMode = "trial" | "full" | "volna" | null;
export type StudentVariant = "foundation" | "higher" | "volna" | null;

export function getStudentMessaging(variant: StudentVariant, accessMode: AccessMode) {
  // VOLNA STUDENTS
  if (accessMode === "volna") {
    return {
      title: "Your guided learning experience",
      description:
        "Follow your assigned lessons, complete tasks, and use the platform alongside your teacher-led classes.",
      primaryCta: { label: "Go to lessons", href: "/courses" },
      secondaryCta: { label: "View dashboard", href: "/dashboard" },
    };
  }

  // TRIAL USERS
  if (accessMode === "trial") {
    return {
      title: "Try the platform",
      description:
        "Explore lessons and features with limited access. Upgrade to unlock full content and structured learning.",
      primaryCta: { label: "Upgrade access", href: "/online-classes" },
      secondaryCta: { label: "Browse lessons", href: "/courses" },
    };
  }

  // FULL SELF-STUDY USERS
  if (accessMode === "full") {
    return {
      title: "Continue your learning",
      description:
        "Work through lessons, revise vocabulary and grammar, and prepare for exams at your own pace.",
      primaryCta: { label: "Continue learning", href: "/courses" },
      secondaryCta: { label: "Explore resources", href: "/vocabulary" },
    };
  }

  // FALLBACK
  return {
    title: "Welcome",
    description:
      "Access your courses, resources, and learning tools from your dashboard.",
    primaryCta: { label: "Go to dashboard", href: "/dashboard" },
    secondaryCta: null,
  };
}
