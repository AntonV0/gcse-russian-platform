import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
const baseUrl = process.env.QA_COURSE_JOURNEY_BASE_URL ?? "http://localhost:3010";
const password =
  process.env.QA_DASHBOARD_PASSWORD ?? readPasswordFromLocalCredentialNote();

const modulePathByVariant = {
  foundation:
    "/courses/gcse-russian/foundation/modules/m01-intro-explanation-and-tutorial",
  higher: "/courses/gcse-russian/higher/modules/m01-intro-explanation-and-tutorial",
};

const lessonTitles = [
  "Welcome to GCSE Russian",
  "How lessons, sections, vocab and grammar links work",
  "Foundation and Higher: choosing a path",
];

const accounts = [
  {
    label: "Full Foundation",
    email: "qa-dashboard-full-foundation@example.com",
    variant: "foundation",
    expectedAccess: "full",
  },
  {
    label: "Full Higher",
    email: "qa-dashboard-full-higher@example.com",
    variant: "higher",
    expectedAccess: "full",
  },
  {
    label: "Trial Foundation",
    email: "qa-dashboard-trial-foundation@example.com",
    variant: "foundation",
    expectedAccess: "trial",
    expectedAccessibleLessons: 1,
  },
  {
    label: "Trial Higher",
    email: "qa-dashboard-trial-higher@example.com",
    variant: "higher",
    expectedAccess: "trial",
    expectedAccessibleLessons: 0,
  },
];

function readPasswordFromLocalCredentialNote() {
  const credentialPath = path.join(root, ".codex", "dashboard-qa-credentials.local.md");

  if (!existsSync(credentialPath)) {
    throw new Error(
      "Missing QA password. Set QA_DASHBOARD_PASSWORD or create .codex/dashboard-qa-credentials.local.md."
    );
  }

  const content = readFileSync(credentialPath, "utf8");
  const passwordBlock = /```text\s*([\s\S]*?)\s*```/.exec(content);

  if (!passwordBlock?.[1]?.trim()) {
    throw new Error(
      "Could not read QA password from .codex/dashboard-qa-credentials.local.md."
    );
  }

  return passwordBlock[1].trim();
}

function assert(condition, message, failures) {
  if (!condition) {
    failures.push(message);
  }
}

function normalizeText(value) {
  return value.trim().replace(/\s+/g, " ");
}

async function collectLessonLinks(page) {
  return page.locator('a[href*="/lessons/"]').evaluateAll((anchors) =>
    anchors.map((anchor) => ({
      href: anchor.getAttribute("href") ?? "",
      text: anchor.textContent?.trim().replace(/\s+/g, " ") ?? "",
    }))
  );
}

async function collectLockedCards(page) {
  return page.locator('[aria-disabled="true"]').evaluateAll((nodes) =>
    nodes.map((node) => ({
      label: node.getAttribute("aria-label") ?? "",
      text: node.textContent?.trim().replace(/\s+/g, " ") ?? "",
    }))
  );
}

async function signInOnce(page, account) {
  const nextPath = modulePathByVariant[account.variant];
  const loginUrl = new URL("/login", baseUrl);
  loginUrl.searchParams.set("next", nextPath);

  await page.goto(loginUrl.toString(), {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });
  await page.getByLabel("Email address").fill(account.email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForURL(`**${nextPath}`, { timeout: 30_000 });

  await page.goto(new URL(nextPath, baseUrl).toString(), {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
}

async function verifyAccount(browser, account) {
  const context = await browser.newContext({
    viewport: { width: 1366, height: 900 },
  });
  const page = await context.newPage();
  const failures = [];
  const browserErrors = [];
  const serverErrors = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      browserErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    browserErrors.push(error.message);
  });
  page.on("response", (response) => {
    if (response.status() >= 500) {
      serverErrors.push(`${response.status()} ${response.url()}`);
    }
  });

  try {
    await signInOnce(page, account);

    const bodyText = await page.locator("body").innerText({ timeout: 10_000 });
    const normalizedBodyText = normalizeText(bodyText);
    const lessonLinks = await collectLessonLinks(page);
    const uniqueLessonHrefs = new Set(lessonLinks.map((link) => link.href));
    const lockedCards = await collectLockedCards(page);

    assert(
      normalizedBodyText.includes("Intro, explanation and tutorial"),
      "Module title is missing.",
      failures
    );

    for (const title of lessonTitles) {
      assert(
        normalizedBodyText.includes(title),
        `Lesson title is missing: ${title}`,
        failures
      );
    }

    if (account.expectedAccess === "full") {
      assert(
        normalizedBodyText.includes("Current lesson"),
        "Full-access journey should show the current lesson state.",
        failures
      );
      assert(
        normalizedBodyText.includes("Unlocked"),
        "Full-access journey should show unlocked lesson states.",
        failures
      );
      assert(
        uniqueLessonHrefs.size >= lessonTitles.length,
        `Full-access journey should expose lesson links; found ${uniqueLessonHrefs.size}.`,
        failures
      );
      assert(
        lockedCards.length === 0,
        `Full-access journey should not render locked lesson cards; found ${lockedCards.length}.`,
        failures
      );
    } else {
      const expectedAccessibleLessons = account.expectedAccessibleLessons ?? 0;
      const expectedLockedLessons = lessonTitles.length - expectedAccessibleLessons;

      assert(
        normalizedBodyText.includes("Trial sample limit"),
        "Trial journey should explain the locked sample limit.",
        failures
      );
      assert(
        lockedCards.length >= expectedLockedLessons,
        `Trial journey should render at least ${expectedLockedLessons} locked cards; found ${lockedCards.length}.`,
        failures
      );
      assert(
        uniqueLessonHrefs.size === expectedAccessibleLessons,
        `Trial journey should expose ${expectedAccessibleLessons} accessible lesson link${expectedAccessibleLessons === 1 ? "" : "s"}; found ${uniqueLessonHrefs.size}.`,
        failures
      );
    }

    assert(serverErrors.length === 0, serverErrors.join("; "), failures);

    return {
      label: account.label,
      ok: failures.length === 0,
      url: page.url(),
      lessonLinkCount: uniqueLessonHrefs.size,
      lockedCardCount: lockedCards.length,
      browserErrorCount: browserErrors.length,
      failures,
    };
  } catch (error) {
    return {
      label: account.label,
      ok: false,
      url: page.url(),
      lessonLinkCount: 0,
      lockedCardCount: 0,
      browserErrorCount: browserErrors.length,
      failures: [error instanceof Error ? error.message : String(error)],
    };
  } finally {
    await context.close();
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    for (const account of accounts) {
      results.push(await verifyAccount(browser, account));
    }
  } finally {
    await browser.close();
  }

  for (const result of results) {
    const status = result.ok ? "PASS" : "FAIL";
    console.log(
      `${status} ${result.label}: ${result.lessonLinkCount} lesson links, ${result.lockedCardCount} locked cards`
    );

    for (const failure of result.failures) {
      console.log(`  - ${failure}`);
    }
  }

  const failedResults = results.filter((result) => !result.ok);

  if (failedResults.length > 0) {
    console.error(
      `Course journey QA failed for ${failedResults.length} account${failedResults.length === 1 ? "" : "s"}.`
    );
    process.exit(1);
  }

  console.log("Course journey QA passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
