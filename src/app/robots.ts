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
          "/auth",
          "/auth/",
          "/dashboard",
          "/dashboard/",
          "/forgot-password",
          "/login",
          "/online-classes",
          "/online-classes/",
          "/profile",
          "/profile/",
          "/question-sets",
          "/question-sets/",
          "/settings",
          "/settings/",
          "/signup",
          "/teacher",
          "/teacher/",
        ],
      },
    ],
    sitemap: getPublicSiteUrl("/sitemap.xml").toString(),
    host: getPublicSiteUrl().origin,
  };
}
