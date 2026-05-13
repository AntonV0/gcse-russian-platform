import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const contrastFailures = [];
const NORMAL_TEXT_CONTRAST = 4.5;
const MUTED_TEXT_CONTRAST = 4.4;
const BUTTON_FILL_TEXT_CONTRAST = 4.5;
const DARK_ACCENT_ON_SURFACE_CONTRAST = 4.5;
const DECORATIVE_BRAND_CONTRAST = 3;
const SEMANTIC_TEXT_CONTRAST = 4.5;

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function readCssWithImports(relativePath, seen = new Set()) {
  if (seen.has(relativePath)) {
    return "";
  }

  seen.add(relativePath);

  const css = read(relativePath);
  const directory = path.dirname(relativePath);

  return css.replace(/@import\s+["']([^"']+)["'];/g, (_match, importPath) => {
    const importedPath = path
      .normalize(path.join(directory, importPath))
      .replaceAll(path.sep, "/");
    return existsSync(path.join(root, importedPath))
      ? readCssWithImports(importedPath, seen)
      : "";
  });
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

function parseTokenBlocks(css) {
  const blocks = [];
  const cssWithoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const blockPattern = /([^{}]+)\{([^{}]+)\}/g;
  let match;

  while ((match = blockPattern.exec(cssWithoutComments)) !== null) {
    const selector = match[1].trim();
    const declarations = {};
    const declarationPattern = /(--[\w-]+)\s*:\s*([^;]+);/g;
    let declarationMatch;

    while ((declarationMatch = declarationPattern.exec(match[2])) !== null) {
      declarations[declarationMatch[1]] = declarationMatch[2].trim();
    }

    blocks.push({ selector, declarations });
  }

  return blocks;
}

function splitTopLevel(value, separator = ",") {
  const parts = [];
  let depth = 0;
  let current = "";

  for (const character of value) {
    if (character === "(") {
      depth += 1;
    } else if (character === ")") {
      depth -= 1;
    }

    if (character === separator && depth === 0) {
      parts.push(current.trim());
      current = "";
      continue;
    }

    current += character;
  }

  if (current.trim()) {
    parts.push(current.trim());
  }

  return parts;
}

function hexToRgb(value) {
  const hex = value.trim().toLowerCase();
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex);

  if (!match) {
    return null;
  }

  const normalized =
    match[1].length === 3
      ? match[1]
          .split("")
          .map((character) => `${character}${character}`)
          .join("")
      : match[1];

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function parseRgb(value) {
  const match = /^rgba?\(([^)]+)\)$/i.exec(value.trim());

  if (!match) {
    return null;
  }

  const channels = splitTopLevel(match[1]).map((part) => Number.parseFloat(part));

  if (channels.length < 3 || channels.some((channel) => Number.isNaN(channel))) {
    return null;
  }

  return { r: channels[0], g: channels[1], b: channels[2] };
}

function mixColors(firstColor, firstWeight, secondColor, secondWeight) {
  const totalWeight = firstWeight + secondWeight;
  const normalizedFirstWeight = totalWeight === 0 ? 0.5 : firstWeight / totalWeight;
  const normalizedSecondWeight = totalWeight === 0 ? 0.5 : secondWeight / totalWeight;

  return {
    r: firstColor.r * normalizedFirstWeight + secondColor.r * normalizedSecondWeight,
    g: firstColor.g * normalizedFirstWeight + secondColor.g * normalizedSecondWeight,
    b: firstColor.b * normalizedFirstWeight + secondColor.b * normalizedSecondWeight,
  };
}

function parseWeightedColor(part) {
  const weightMatch = /^(.*)\s+((?:[0-9.]+%|var\(--[\w-]+\)))$/.exec(part.trim());

  if (!weightMatch) {
    return { value: part.trim(), weight: null };
  }

  return {
    value: weightMatch[1].trim(),
    weight: weightMatch[2].trim(),
  };
}

function resolvePercentage(value, tokens) {
  if (typeof value === "number") {
    return value;
  }

  if (value === null) {
    return null;
  }

  const trimmed = value.trim();
  const numericMatch = /^([0-9.]+)%$/.exec(trimmed);

  if (numericMatch) {
    return Number.parseFloat(numericMatch[1]);
  }

  const varMatch = /^var\((--[\w-]+)\)$/.exec(trimmed);

  if (varMatch) {
    const resolvedValue = tokens[varMatch[1]];

    if (!resolvedValue) {
      return null;
    }

    return resolvePercentage(resolvedValue, tokens);
  }

  return null;
}

function resolveColor(value, tokens, seen = new Set()) {
  const trimmed = value.trim();

  if (trimmed === "black") {
    return { r: 0, g: 0, b: 0 };
  }

  if (trimmed === "white") {
    return { r: 255, g: 255, b: 255 };
  }

  if (trimmed === "transparent") {
    return { r: 255, g: 255, b: 255 };
  }

  const hex = hexToRgb(trimmed);

  if (hex) {
    return hex;
  }

  const rgb = parseRgb(trimmed);

  if (rgb) {
    return rgb;
  }

  const varMatch = /^var\((--[\w-]+)\)$/.exec(trimmed);

  if (varMatch) {
    const tokenName = varMatch[1];

    if (seen.has(tokenName) || !tokens[tokenName]) {
      return null;
    }

    seen.add(tokenName);
    const color = resolveColor(tokens[tokenName], tokens, seen);
    seen.delete(tokenName);
    return color;
  }

  const colorMixMatch = /^color-mix\(\s*in\s+srgb\s*,\s*(.+)\)$/is.exec(trimmed);

  if (colorMixMatch) {
    const parts = splitTopLevel(colorMixMatch[1]);

    if (parts.length !== 2) {
      return null;
    }

    const first = parseWeightedColor(parts[0]);
    const second = parseWeightedColor(parts[1]);
    const resolvedFirstWeight = resolvePercentage(first.weight, tokens);
    const resolvedSecondWeight = resolvePercentage(second.weight, tokens);
    const firstWeight =
      resolvedFirstWeight ??
      (resolvedSecondWeight === null ? 50 : 100 - resolvedSecondWeight);
    const secondWeight = resolvedSecondWeight ?? 100 - firstWeight;
    const firstColor = resolveColor(first.value, tokens, seen);
    const secondColor = resolveColor(second.value, tokens, seen);

    if (!firstColor || !secondColor) {
      return null;
    }

    return mixColors(firstColor, firstWeight, secondWeight);
  }

  return null;
}

function relativeLuminance(color) {
  const channels = [color.r, color.g, color.b].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(firstColor, secondColor) {
  const firstLuminance = relativeLuminance(firstColor);
  const secondLuminance = relativeLuminance(secondColor);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

function formatRatio(ratio) {
  return ratio.toFixed(2);
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
const badgesCss = read("src/styles/badges.css");
const feedbackCss = read("src/styles/feedback.css");
const lessonWarmthCss = readCssWithImports("src/styles/lesson-warmth.css");
const baseTokenDeclarations = parseTokenBlocks(baseTokens).find(
  (block) => block.selector === ":root"
)?.declarations;
const darkTokenDeclarations = parseTokenBlocks(darkTokens).find(
  (block) => block.selector === '[data-theme="dark"]'
)?.declarations;
const accentTokenBlocks = parseTokenBlocks(accentTokens);

assert(Boolean(baseTokenDeclarations), "Base theme token block is missing.");
assert(Boolean(darkTokenDeclarations), "Dark theme token block is missing.");

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
  !/--danger:\s*var\(--accent/.test(`${baseTokens}\n${darkTokens}\n${accentTokens}`),
  "Danger must remain a semantic role and not alias to the active accent."
);
assert(
  baseTokens.includes("--accent-decorative-fill") &&
    baseTokens.includes("--accent-decorative-border") &&
    baseTokens.includes("--accent-border-ink") &&
    baseTokens.includes("--accent-brand-ink") &&
    baseTokens.includes("--success-progress-gradient") &&
    baseTokens.includes("--surface-selected-bg") &&
    baseTokens.includes("--surface-selected-text") &&
    baseTokens.includes("--loading-skeleton-bg") &&
    baseTokens.includes("--radius-empty-state"),
  "Theme role tokens for decorative accent, brand accent, selected surfaces, loading skeletons, empty states, and success progress are missing."
);
assert(
  darkTokens.includes("--surface-selected-bg") &&
    darkTokens.includes("--surface-selected-shadow") &&
    darkTokens.includes("--loading-skeleton-bg"),
  "Dark theme should define selected-surface and loading-skeleton recipe tokens."
);
assert(
  badgesCss.includes("background: var(--surface-selected-bg)") &&
    badgesCss.includes("color: var(--surface-selected-text)") &&
    badgesCss.includes("border-radius: var(--radius-status-pill)"),
  "Badge/selected state recipes should consume shared state and radius tokens."
);
assert(
  feedbackCss.includes(".app-loading-skeleton") &&
    feedbackCss.includes("var(--loading-skeleton-bg)") &&
    feedbackCss.includes("border-radius: var(--radius-empty-icon)"),
  "Empty and loading state recipes should consume shared feedback tokens."
);
assert(
  logoCss.includes("--app-logo-blue: var(--accent-brand-ink);") &&
    logoCss.includes("--app-logo-blue-strong: var(--accent-brand-line);"),
  "Theme-tinted logo should use brand accent tokens."
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
  existsSync(
    path.join(root, "src/components/admin/ui-lab/theme/ui-lab-theme-qa-grid.tsx")
  ),
  "Theme QA grid component is missing."
);

const accentNames = [
  ...new Set(
    accentTokenBlocks
      .map((block) => /^\[data-accent="([^"]+)"\]$/.exec(block.selector)?.[1])
      .filter(Boolean)
  ),
];

assert(accentNames.length > 0, "Accent token blocks are missing.");

function getAccentDeclarations(accentName, theme) {
  const selector =
    theme === "dark"
      ? `[data-theme="dark"][data-accent="${accentName}"]`
      : `[data-accent="${accentName}"]`;

  return (
    accentTokenBlocks.find((block) => block.selector === selector)?.declarations ?? {}
  );
}

function buildThemeTokens(accentName, theme) {
  return {
    ...baseTokenDeclarations,
    ...(theme === "dark" ? darkTokenDeclarations : {}),
    ...getAccentDeclarations(accentName, theme),
  };
}

function assertContrast(tokens, label, foregroundToken, backgroundToken, minimumRatio) {
  const foreground = resolveColor(`var(${foregroundToken})`, tokens);
  const background = resolveColor(`var(${backgroundToken})`, tokens);

  if (!foreground || !background) {
    contrastFailures.push(
      `${label}: could not resolve ${foregroundToken} on ${backgroundToken}`
    );
    return;
  }

  const ratio = contrastRatio(foreground, background);

  if (ratio < minimumRatio) {
    contrastFailures.push(
      `${label}: ${foregroundToken} on ${backgroundToken} is ${formatRatio(
        ratio
      )}:1, expected at least ${minimumRatio}:1`
    );
  }
}

if (baseTokenDeclarations && darkTokenDeclarations && accentNames.length > 0) {
  for (const accentName of accentNames) {
    for (const theme of ["light", "dark"]) {
      const tokens = buildThemeTokens(accentName, theme);
      const label = `${theme}/${accentName}`;

      assertContrast(
        tokens,
        `${label} normal text`,
        "--text-primary",
        "--background",
        NORMAL_TEXT_CONTRAST
      );
      assertContrast(
        tokens,
        `${label} normal text on elevated surface`,
        "--text-primary",
        "--background-elevated",
        NORMAL_TEXT_CONTRAST
      );
      assertContrast(
        tokens,
        `${label} muted text`,
        "--text-muted",
        "--background",
        MUTED_TEXT_CONTRAST
      );
      assertContrast(
        tokens,
        `${label} muted text on elevated surface`,
        "--text-muted",
        "--background-elevated",
        MUTED_TEXT_CONTRAST
      );
      assertContrast(
        tokens,
        `${label} primary/accent button fill`,
        "--accent-on-fill",
        "--accent-fill",
        BUTTON_FILL_TEXT_CONTRAST
      );
      assertContrast(
        tokens,
        `${label} brand primary button fill`,
        "--text-inverse",
        "--brand-blue",
        BUTTON_FILL_TEXT_CONTRAST
      );
      assertContrast(
        tokens,
        `${label} success semantic text`,
        "--success-text",
        "--success-surface",
        SEMANTIC_TEXT_CONTRAST
      );
      assertContrast(
        tokens,
        `${label} warning semantic text`,
        "--warning-text",
        "--warning-surface",
        SEMANTIC_TEXT_CONTRAST
      );
      assertContrast(
        tokens,
        `${label} danger semantic text`,
        "--danger-text",
        "--danger-surface",
        SEMANTIC_TEXT_CONTRAST
      );
      assertContrast(
        tokens,
        `${label} info semantic text`,
        "--info-text",
        "--info-surface",
        SEMANTIC_TEXT_CONTRAST
      );
      assertContrast(
        tokens,
        `${label} selected surface text`,
        "--surface-selected-text",
        "--surface-selected-bg",
        SEMANTIC_TEXT_CONTRAST
      );
      assertContrast(
        tokens,
        `${label} decorative logo accent`,
        "--accent-brand-ink",
        "--background-elevated",
        DECORATIVE_BRAND_CONTRAST
      );
    }

    const darkTokensForAccent = buildThemeTokens(accentName, "dark");

    assertContrast(
      darkTokensForAccent,
      `dark/${accentName} accent-on-surface`,
      "--accent-on-soft",
      "--accent-soft",
      DARK_ACCENT_ON_SURFACE_CONTRAST
    );
    assertContrast(
      darkTokensForAccent,
      `dark/${accentName} accent-on-muted surface`,
      "--accent-on-soft",
      "--background-muted",
      DARK_ACCENT_ON_SURFACE_CONTRAST
    );
    assertContrast(
      darkTokensForAccent,
      `dark/${accentName} stronger decorative border`,
      "--accent-border-ink",
      "--background-elevated",
      DECORATIVE_BRAND_CONTRAST
    );
  }
}

assert(
  contrastFailures.length === 0,
  `Theme token contrast checks failed:\n- ${contrastFailures.join("\n- ")}`
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
console.log(
  "Recommended manual captures: desktop and mobile widths after toggling Light/Dark and cycling every accent."
);
