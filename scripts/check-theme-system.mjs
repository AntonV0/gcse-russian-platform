import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function walk(dir, extensions, files = []) {
  for (const entry of readdirSync(path.join(root, dir))) {
    const absolutePath = path.join(root, dir, entry);
    const relativePath = path.relative(root, absolutePath);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      walk(relativePath, extensions, files);
      continue;
    }

    if (extensions.has(path.extname(entry))) {
      files.push(relativePath);
    }
  }

  return files;
}

function assert(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

const sourceFiles = walk("src", new Set([".css", ".tsx", ".ts"]));
const gradientBgMisuse = [];

for (const file of sourceFiles) {
  const content = read(file);

  if (/bg-\[var\(--[^)\]]*gradient[^)\]]*\)\]/.test(content)) {
    gradientBgMisuse.push(file);
  }
}

assert(
  gradientBgMisuse.length === 0,
  `Gradient CSS variables must use [background:...] instead of bg-[...]: ${gradientBgMisuse.join(", ")}`
);

const baseTokens = read("src/styles/tokens/base.css");
const darkTokens = read("src/styles/tokens/dark.css");
const accentTokens = read("src/styles/tokens/accents.css");
const progressCss = read("src/styles/surfaces/cards-panels.css");
const logoCss = read("src/styles/surfaces/brand-logo.css");
const lessonWarmthCss = read("src/styles/lesson-warmth.css");

assert(
  /--brand-blue:\s*#[0-9a-f]{6};/i.test(baseTokens),
  "Light brand blue should stay fixed and not alias to the active accent."
);
assert(
  /--brand-blue:\s*#[0-9a-f]{6};/i.test(darkTokens),
  "Dark brand blue should stay fixed and not alias to the active accent."
);
assert(
  !/--brand-blue:\s*var\(--accent/.test(`${baseTokens}\n${darkTokens}`),
  "Brand blue must not be defined as an accent alias."
);
assert(
  baseTokens.includes("--accent-decorative-fill") &&
    baseTokens.includes("--accent-decorative-border") &&
    baseTokens.includes("--success-progress-gradient"),
  "Theme role tokens for decorative accent and success progress are missing."
);
assert(
  logoCss.includes("--app-logo-blue: var(--accent-decorative-fill);") &&
    logoCss.includes("--app-logo-blue-strong: var(--accent-decorative-fill-bright);"),
  "Theme-tinted logo should use decorative accent tokens."
);
assert(
  progressCss.includes(".app-progress-bar-success") &&
    progressCss.includes("var(--success-progress-gradient)"),
  "Success progress needs a dedicated class backed by the success gradient token."
);
assert(
  baseTokens.includes("--warning-progress-gradient") &&
    darkTokens.includes("--warning-progress-gradient") &&
    lessonWarmthCss.includes("var(--warning-progress-gradient)"),
  "Warning/exam progress needs a dedicated warning gradient token."
);
assert(
  /\.app-study-block-exam::before\s*\{\s*background:\s*var\(--warning-progress-gradient\);\s*\}/.test(
    lessonWarmthCss
  ),
  "Exam block stripe should not mix warning with accent fill."
);
assert(
  /\[data-accent="yellow"\][\s\S]*--warning-display:\s*#d97706;/.test(accentTokens),
  "Yellow light theme should separate warning display colour from the yellow accent."
);
assert(
  /\[data-theme="dark"\]\[data-accent="yellow"\][\s\S]*--warning-display:\s*#fb923c;/.test(
    accentTokens
  ),
  "Yellow dark theme should separate warning display colour from the yellow accent."
);
assert(
  /\[data-accent="brown"\][\s\S]*--accent-fill:\s*#b45309;/.test(accentTokens),
  "Brown accent should use the updated bronze fill."
);
assert(
  /\[data-accent="slate"\][\s\S]*--accent-fill:\s*#475569;/.test(accentTokens),
  "Slate accent should use the updated cooler light fill."
);
assert(
  existsSync(path.join(root, "src/components/admin/ui-lab/theme/ui-lab-theme-qa-grid.tsx")),
  "Theme QA grid component is missing."
);

if (failures.length > 0) {
  console.error("Theme system check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Theme system check passed.");
console.log("Screenshot target: /admin/ui/theme");
console.log("Recommended manual captures: desktop and mobile widths after toggling Light/Dark.");
