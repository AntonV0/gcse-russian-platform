import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/lib/seo/site";

const publicRoutes = [
  {
    path: "/marketing",
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    path: "/pricing",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    path: "/gcse-russian-course",
    changeFrequency: "weekly",
    priority: 0.95,
  },
  {
    path: "/edexcel-gcse-russian",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/gcse-russian-exam-guide",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/russian-gcse-private-candidate",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/online-gcse-russian-lessons",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/resources",
    changeFrequency: "weekly",
    priority: 0.85,
  },
  {
    path: "/gcse-russian-listening-exam",
    changeFrequency: "monthly",
    priority: 0.75,
  },
  {
    path: "/gcse-russian-speaking-exam",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/gcse-russian-reading-exam",
    changeFrequency: "monthly",
    priority: 0.75,
  },
  {
    path: "/gcse-russian-writing-exam",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/gcse-russian-grammar",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/gcse-russian-vocabulary",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/gcse-russian-past-papers",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/gcse-russian-revision",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/gcse-russian-foundation-tier",
    changeFrequency: "monthly",
    priority: 0.75,
  },
  {
    path: "/gcse-russian-higher-tier",
    changeFrequency: "monthly",
    priority: 0.75,
  },
  {
    path: "/gcse-russian-tutor",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/gcse-russian-for-parents",
    changeFrequency: "monthly",
    priority: 0.75,
  },
  {
    path: "/about",
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    path: "/faq",
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
