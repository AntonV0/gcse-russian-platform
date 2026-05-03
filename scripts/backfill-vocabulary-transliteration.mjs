import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
const ENV_PATH = path.join(ROOT, ".env.local");
const DEFAULT_REPORT_PATH = path.join(ROOT, "tmp", "vocabulary-transliteration-backfill.json");

const CYRILLIC_TO_LATIN = new Map(
  Object.entries({
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "yo",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "kh",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "shch",
    ъ: "",
    ы: "y",
    ь: "'",
    э: "e",
    ю: "yu",
    я: "ya",
  })
);

function parseArgs(argv) {
  const args = {
    write: false,
    outPath: DEFAULT_REPORT_PATH,
    sampleSize: 30,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--write") {
      args.write = true;
    } else if (arg === "--out") {
      args.outPath = path.resolve(ROOT, requireValue(argv, index, arg));
      index += 1;
    } else if (arg === "--sample-size") {
      args.sampleSize = Number.parseInt(requireValue(argv, index, arg), 10);
      index += 1;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function requireValue(argv, index, arg) {
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`Missing value for ${arg}`);
  }

  return value;
}

function printHelp() {
  console.log(`Usage: node scripts/backfill-vocabulary-transliteration.mjs [options]

Default mode is read-only. It reports what would be updated.

Options:
  --write              Update empty transliteration fields for spec vocab items
  --out <path>         Write JSON report. Defaults to tmp/vocabulary-transliteration-backfill.json
  --sample-size <n>    Number of examples in the report. Defaults to 30
`);
}

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing environment file: ${filePath}`);
  }

  const env = {};

  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    env[trimmed.slice(0, separatorIndex)] = trimmed.slice(separatorIndex + 1);
  }

  return env;
}

function requireEnv(env, key) {
  const value = env[key] ?? process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

async function fetchPages(supabase, table, select, buildQuery) {
  const rows = [];

  for (let from = 0; ; from += 1000) {
    const query = buildQuery(supabase.from(table).select(select)).range(from, from + 999);
    const { data, error } = await query;

    if (error) {
      throw new Error(`Lookup failed for ${table}: ${error.message}`);
    }

    rows.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }

  return rows;
}

function preserveCase(source, transliterated) {
  if (source.toLocaleUpperCase("ru-RU") === source) {
    return transliterated.toUpperCase();
  }

  const first = source[0];
  if (first && first.toLocaleUpperCase("ru-RU") === first && first.toLocaleLowerCase("ru-RU") !== first) {
    return `${transliterated[0]?.toUpperCase() ?? ""}${transliterated.slice(1)}`;
  }

  return transliterated;
}

function transliterateWord(word) {
  let output = "";

  for (const char of word) {
    const lower = char.toLocaleLowerCase("ru-RU");
    const replacement = CYRILLIC_TO_LATIN.get(lower);
    output += replacement === undefined ? char : preserveCase(char, replacement);
  }

  return output;
}

function tidyTransliteration(value) {
  return value
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .trim();
}

function transliterateRussian(value) {
  return tidyTransliteration(
    value
      .split(/([\s/(),.;:!?-]+)/)
      .map((part) => (/[\u0400-\u04FF]/.test(part) ? transliterateWord(part) : part))
      .join("")
  );
}

function needsTransliteration(item) {
  return item.source_type === "spec_required" && !item.transliteration?.trim();
}

async function updateInBatches(supabase, updates) {
  const errors = [];

  for (const update of updates) {
    const { error } = await supabase
      .from("vocabulary_items")
      .update({ transliteration: update.transliteration })
      .eq("id", update.id);

    if (error) {
      errors.push({
        id: update.id,
        russian: update.russian,
        error: error.message,
      });
    }
  }

  return errors;
}

function writeJson(outPath, data) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const env = readEnvFile(ENV_PATH);
  const supabase = createClient(
    requireEnv(env, "NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv(env, "SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: { persistSession: false },
    }
  );
  const items = await fetchPages(
    supabase,
    "vocabulary_items",
    "id, russian, english, transliteration, source_type, source_key, vocabulary_set_id, canonical_key",
    (query) => query.eq("source_type", "spec_required").order("position", { ascending: true })
  );
  const updates = items.filter(needsTransliteration).map((item) => ({
    id: item.id,
    russian: item.russian,
    english: item.english,
    canonicalKey: item.canonical_key,
    transliteration: transliterateRussian(item.russian ?? ""),
  }));
  const unsafeUpdates = updates.filter((update) => !update.transliteration);

  if (unsafeUpdates.length > 0) {
    throw new Error(`Refusing to continue: ${unsafeUpdates.length} updates produced empty transliteration`);
  }

  const writeErrors = args.write ? await updateInBatches(supabase, updates) : [];
  const report = {
    mode: args.write ? "write" : "dry-run",
    checkedSpecItems: items.length,
    missingBefore: updates.length,
    updated: args.write ? updates.length - writeErrors.length : 0,
    writeErrors,
    samples: updates.slice(0, args.sampleSize).map((update) => ({
      russian: update.russian,
      english: update.english,
      transliteration: update.transliteration,
      canonicalKey: update.canonicalKey,
    })),
  };

  writeJson(args.outPath, report);

  console.log("Vocabulary transliteration backfill");
  console.log("===================================");
  console.log(`Mode: ${report.mode}`);
  console.log(`Checked spec items: ${report.checkedSpecItems}`);
  console.log(`Missing before: ${report.missingBefore}`);
  console.log(`Updated: ${report.updated}`);
  console.log(`Write errors: ${report.writeErrors.length}`);
  console.log(`Report: ${path.relative(ROOT, args.outPath)}`);
  console.log("");
  console.log("Sample:");
  for (const sample of report.samples.slice(0, 10)) {
    console.log(`- ${sample.russian} -> ${sample.transliteration} (${sample.english})`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
