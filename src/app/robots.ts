import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/marketing", "/marketing/"],
        disallow: [
          "/account/",
          "/admin/",
          "/api/",
          "/assignments/",
          "/courses/",
          "/dashboard",
          "/grammar/",
          "/login",
          "/mock-exams/",
          "/online-classes",
          "/past-papers",
          "/profile",
          "/question-sets/",
          "/settings",
          "/signup",
          "/teacher/",
          "/vocabulary/",
        ],
      },
    ],
    sitemap: getPublicSiteUrl("/sitemap.xml").toString(),
    host: getPublicSiteUrl().origin,
  };
}
