import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/marketing", "/marketing/"],
        disallow: [
          "/account",
          "/account/",
          "/admin",
          "/admin/",
          "/api",
          "/api/",
          "/assignments",
          "/assignments/",
          "/courses",
          "/courses/",
          "/dashboard",
          "/dashboard/",
          "/grammar",
          "/grammar/",
          "/login",
          "/mock-exams",
          "/mock-exams/",
          "/online-classes",
          "/online-classes/",
          "/past-papers",
          "/past-papers/",
          "/profile",
          "/profile/",
          "/question-sets",
          "/question-sets/",
          "/settings",
          "/settings/",
          "/signup",
          "/teacher",
          "/teacher/",
          "/vocabulary",
          "/vocabulary/",
        ],
      },
    ],
    sitemap: getPublicSiteUrl("/sitemap.xml").toString(),
    host: getPublicSiteUrl().origin,
  };
}
