import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

const checks = [];

function check(label, passed, detail = "") {
  checks.push({ label, passed, detail });
}

function includesAll(source, needles) {
  return needles.every((needle) => source.includes(needle));
}

const priorityPages = [
  {
    path: "src/app/(marketing)/gcse-russian-course/page.tsx",
    label: "course",
    required: [
      "buildCourseJsonLd",
      "buildFaqJsonLd",
      'ogImagePath: getOgImagePath("course")',
    ],
  },
  {
    path: "src/app/(marketing)/edexcel-gcse-russian/page.tsx",
    label: "edexcel",
    required: [
      "buildLearningResourceJsonLd",
      "buildFaqJsonLd",
      'ogImagePath: getOgImagePath("edexcel")',
    ],
  },
  {
    path: "src/app/(marketing)/gcse-russian-revision/page.tsx",
    label: "revision",
    required: ["faqs={[", 'ogImagePath: getOgImagePath("revision")'],
  },
  {
    path: "src/app/(marketing)/gcse-russian-past-papers/page.tsx",
    label: "past papers",
    required: ["faqs={[", 'ogImagePath: getOgImagePath("past-papers")'],
  },
  {
    path: "src/app/(marketing)/russian-gcse-private-candidate/page.tsx",
    label: "private candidates",
    required: [
      "buildLearningResourceJsonLd",
      "buildFaqJsonLd",
      'ogImagePath: getOgImagePath("private-candidates")',
    ],
  },
  {
    path: "src/app/(marketing)/pricing/page.tsx",
    label: "pricing",
    required: [
      "buildProductOfferJsonLd",
      "buildFaqJsonLd",
      'ogImagePath: getOgImagePath("pricing")',
    ],
  },
  {
    path: "src/app/(marketing)/online-gcse-russian-lessons/page.tsx",
    label: "online lessons",
    required: [
      "buildLearningResourceJsonLd",
      "buildFaqJsonLd",
      'ogImagePath: getOgImagePath("lessons")',
    ],
  },
  {
    path: "src/app/(marketing)/gcse-russian-tutor/page.tsx",
    label: "tutor",
    required: ["faqs={[", 'ogImagePath: getOgImagePath("tutor")'],
  },
];

for (const page of priorityPages) {
  const source = read(page.path);

  check(
    `${page.label}: public metadata`,
    includesAll(source, ["buildPublicMetadata", "path: "]),
    page.path
  );
  check(
    `${page.label}: breadcrumbs`,
    source.includes("MarketingBreadcrumbs") || source.includes("EvergreenGuidePage"),
    page.path
  );
  check(`${page.label}: structured data`, includesAll(source, page.required), page.path);
}

const evergreen = read("src/components/marketing/evergreen-guide-page.tsx");
check(
  "evergreen guide renders FAQ JSON-LD",
  includesAll(evergreen, ["MarketingFaqSection", "buildFaqJsonLd", "faqs = []"]),
  "src/components/marketing/evergreen-guide-page.tsx"
);

const sitemap = read("src/app/sitemap.ts");
for (const route of [
  "/marketing",
  "/pricing",
  "/gcse-russian-course",
  "/edexcel-gcse-russian",
  "/gcse-russian-revision",
  "/gcse-russian-past-papers",
  "/russian-gcse-private-candidate",
]) {
  check(
    `sitemap includes ${route}`,
    sitemap.includes(`path: "${route}"`),
    "src/app/sitemap.ts"
  );
}

const robots = read("src/app/robots.ts");
for (const disallow of ["/courses", "/grammar", "/mock-exams", "/vocabulary"]) {
  check(
    `robots disallows ${disallow}`,
    robots.includes(`"${disallow}"`),
    "src/app/robots.ts"
  );
}

const ogImages = read("src/lib/seo/og-images.ts");
for (const key of [
  "course",
  "edexcel",
  "lessons",
  "past-papers",
  "pricing",
  "private-candidates",
  "revision",
  "tutor",
]) {
  check(
    `OG registry includes ${key}`,
    ogImages.includes(`${key}:`) || ogImages.includes(`"${key}":`),
    "src/lib/seo/og-images.ts"
  );
}

const cleanUrlFiles = [
  "src/app/(marketing)/marketing/page.tsx",
  "src/components/marketing/marketing-site-header.tsx",
  "src/components/marketing/marketing-site-footer.tsx",
  "src/components/marketing/evergreen-guide-page.tsx",
  "src/app/sitemap.ts",
];

for (const file of cleanUrlFiles) {
  const source = read(file);
  const hasNestedMarketingLink = [
    'href="/marketing/',
    'href: "/marketing/',
    'path: "/marketing/',
    'secondaryHref="/marketing/',
    'ctaSecondaryHref="/marketing/',
  ].some((needle) => source.includes(needle));

  check(`${file}: no nested marketing subpage links`, !hasNestedMarketingLink, file);
}

const failures = checks.filter((item) => !item.passed);

if (failures.length > 0) {
  console.error("SEO validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure.label}${failure.detail ? ` (${failure.detail})` : ""}`);
  }
  process.exit(1);
}

console.log(`SEO validation passed (${checks.length} checks).`);
