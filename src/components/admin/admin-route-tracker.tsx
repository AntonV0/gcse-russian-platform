"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type RecentAdminRoute = {
  href: string;
  title: string;
  description: string;
  timestamp: number;
};

const STORAGE_KEY = "gcse-russian-admin-last-route";

function getRouteMeta(pathname: string): Pick<RecentAdminRoute, "title" | "description"> {
  if (pathname === "/admin") {
    return {
      title: "Admin dashboard",
      description: "Overview of content, teaching, users, and platform management.",
    };
  }

  if (pathname === "/admin/content") {
    return {
      title: "Content management",
      description: "Courses, variants, modules, and lessons.",
    };
  }

  if (/^\/admin\/content\/courses\/[^/]+\/edit$/.test(pathname)) {
    return {
      title: "Edit course",
      description: "Update course title, slug, description, and visibility settings.",
    };
  }

  if (/^\/admin\/content\/courses\/[^/]+$/.test(pathname)) {
    return {
      title: "Course details",
      description: "Manage the selected course and move deeper into its structure.",
    };
  }

  if (/\/variants\/[^/]+\/edit$/.test(pathname)) {
    return {
      title: "Edit variant",
      description: "Update variant settings and visibility.",
    };
  }

  if (/\/variants\/[^/]+$/.test(pathname)) {
    return {
      title: "Variant details",
      description: "Manage the selected course variant.",
    };
  }

  if (/\/modules\/[^/]+\/edit$/.test(pathname)) {
    return {
      title: "Edit module",
      description: "Update module title, slug, and structure settings.",
    };
  }

  if (/\/modules\/[^/]+$/.test(pathname)) {
    return {
      title: "Module details",
      description: "Manage the selected module and its lessons.",
    };
  }

  if (/\/lessons\/[^/]+\/edit$/.test(pathname)) {
    return {
      title: "Edit lesson",
      description: "Update lesson content, status, and structure.",
    };
  }

  if (/\/lessons\/[^/]+$/.test(pathname)) {
    return {
      title: "Lesson details",
      description: "Manage the selected lesson.",
    };
  }

  if (pathname === "/admin/question-sets") {
    return {
      title: "Question sets",
      description: "Build and manage reusable question sets.",
    };
  }

  if (pathname === "/admin/question-sets/templates") {
    return {
      title: "Question set templates",
      description: "Manage reusable templates for question sets.",
    };
  }

  if (pathname === "/admin/lesson-templates") {
    return {
      title: "Lesson templates",
      description: "Manage reusable lesson templates.",
    };
  }

  if (pathname === "/admin/vocabulary") {
    return {
      title: "Vocabulary",
      description: "Manage vocabulary content and supporting language data.",
    };
  }

  if (pathname === "/admin/teaching-groups") {
    return {
      title: "Teaching groups",
      description: "View and manage teaching groups and membership.",
    };
  }

  if (pathname === "/admin/students") {
    return {
      title: "Students",
      description: "View student accounts and access groupings.",
    };
  }

  if (pathname === "/admin/teachers") {
    return {
      title: "Teachers",
      description: "View teacher and admin accounts.",
    };
  }

  if (pathname.startsWith("/admin/ui")) {
    return {
      title: "UI Lab",
      description: "Internal design system and reusable UI patterns.",
    };
  }

  return {
    title: "Admin page",
    description: "Previously visited admin route.",
  };
}

export default function AdminRouteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname?.startsWith("/admin")) {
      return;
    }

    const route: RecentAdminRoute = {
      href: pathname,
      ...getRouteMeta(pathname),
      timestamp: Date.now(),
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(route));
  }, [pathname]);

  return null;
}
