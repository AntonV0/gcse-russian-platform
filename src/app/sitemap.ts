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
    path: "/marketing/gcse-russian-course",
    changeFrequency: "weekly",
    priority: 0.95,
  },
  {
    path: "/marketing/edexcel-gcse-russian",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/marketing/gcse-russian-exam-guide",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/marketing/russian-gcse-private-candidate",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/marketing/online-gcse-russian-lessons",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/marketing/resources",
    changeFrequency: "weekly",
    priority: 0.85,
  },
  {
    path: "/marketing/gcse-russian-listening-exam",
    changeFrequency: "monthly",
    priority: 0.75,
  },
  {
    path: "/marketing/gcse-russian-speaking-exam",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/marketing/gcse-russian-reading-exam",
    changeFrequency: "monthly",
    priority: 0.75,
  },
  {
    path: "/marketing/gcse-russian-writing-exam",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/marketing/gcse-russian-grammar",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/marketing/gcse-russian-vocabulary",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/marketing/gcse-russian-past-papers",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/marketing/gcse-russian-revision",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/marketing/gcse-russian-foundation-tier",
    changeFrequency: "monthly",
    priority: 0.75,
  },
  {
    path: "/marketing/gcse-russian-higher-tier",
    changeFrequency: "monthly",
    priority: 0.75,
  },
  {
    path: "/marketing/gcse-russian-tutor",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/marketing/gcse-russian-for-parents",
    changeFrequency: "monthly",
    priority: 0.75,
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
