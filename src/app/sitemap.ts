import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/lib/seo/site";

const publicRoutes = [
  {
    path: "/marketing",
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    path: "/marketing/pricing",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    path: "/marketing/about",
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    path: "/marketing/faq",
    changeFrequency: "monthly",
    priority: 0.6,
  },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    url: getPublicSiteUrl(route.path).toString(),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
