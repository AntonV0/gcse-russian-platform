import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { expect, test, type Page, type TestInfo } from "@playwright/test";

const studentEmail = normalizeSecret(
  process.env.PLAYWRIGHT_MOBILE_STUDENT_EMAIL ||
    "qa-dashboard-full-foundation@example.com"
);
const courseSlug = "gcse-russian";
const variantSlug = "foundation";
const moduleSlug = "m01-intro-explanation-and-tutorial";
const firstLessonSlug = "m01-l01-welcome-to-gcse-russian";
const coursePath = `/courses/${courseSlug}/${variantSlug}`;
const modulePath = `${coursePath}/modules/${moduleSlug}`;
const firstLessonPath = `${modulePath}/lessons/${firstLessonSlug}`;

function readLocalEnvValue(name: string) {
  const envPath = path.join(process.cwd(), ".env.local");

  if (!existsSync(envPath)) return "";

  const content = readFileSync(envPath, "utf8");
  const line = content
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith(`${name}=`));

  if (!line) return "";

  return normalizeSecret(line.slice(line.indexOf("=") + 1));
}

function normalizeSecret(value: string) {
  const trimmed = value
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/^`|`$/g, "")
    .trim();
  const fencedBlock = /```(?:text)?\s*([\s\S]*?)\s*```/.exec(trimmed);

  return (fencedBlock?.[1] ?? trimmed)
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/^`|`$/g, "")
    .trim();
}

function readPasswordFromLocalCredentialNote() {
  const credentialPath = path.join(
    process.cwd(),
    ".codex",
    "dashboard-qa-credentials.local.md"
  );

  if (!existsSync(credentialPath)) return "";

  const content = readFileSync(credentialPath, "utf8");
  const passwordBlock = /```text\s*([\s\S]*?)\s*```/.exec(content);

  return passwordBlock?.[1]?.trim() ?? "";
}

function getStudentPassword() {
  return normalizeSecret(
    process.env.PLAYWRIGHT_MOBILE_STUDENT_PASSWORD ??
      process.env.QA_DASHBOARD_PASSWORD ??
      readPasswordFromLocalCredentialNote()
  );
}

function getSupabaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? readLocalEnvValue("NEXT_PUBLIC_SUPABASE_URL")
  );
}

function getSupabaseServiceRoleKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    readLocalEnvValue("SUPABASE_SERVICE_ROLE_KEY")
  );
}

async function resetStudentProgress() {
  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  test.skip(!supabaseUrl, "Set NEXT_PUBLIC_SUPABASE_URL.");
  test.skip(!serviceRoleKey, "Set SUPABASE_SERVICE_ROLE_KEY.");

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", studentEmail)
    .maybeSingle();

  expect(profileError, "resettable QA profile lookup should succeed").toBeNull();
  expect(
    profile,
    `resettable QA profile should exist for ${studentEmail}`
  ).not.toBeNull();

  const userId = profile!.id as string;

  const { data: modules, error: modulesError } = await supabase
    .from("modules")
    .select("id")
    .eq("slug", moduleSlug);

  expect(modulesError, "resettable module lookup should succeed").toBeNull();

  const moduleIds = modules?.map((module) => module.id as string) ?? [];
  expect(
    moduleIds.length,
    `resettable module should exist for ${moduleSlug}`
  ).toBeGreaterThan(0);

  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("id")
    .in("module_id", moduleIds);

  expect(lessonsError, "resettable lesson lookup should succeed").toBeNull();

  const lessonIds = lessons?.map((lesson) => lesson.id as string) ?? [];

  if (lessonIds.length > 0) {
    const { error: sectionProgressError } = await supabase
      .from("lesson_section_progress")
      .delete()
      .eq("user_id", userId)
      .in("lesson_id", lessonIds);

    expect(
      sectionProgressError,
      "lesson section progress reset should succeed"
    ).toBeNull();
  }

  const { error: lessonProgressError } = await supabase
    .from("lesson_progress")
    .delete()
    .eq("user_id", userId)
    .eq("course_slug", courseSlug)
    .eq("variant_slug", variantSlug)
    .eq("module_slug", moduleSlug);

  expect(
    lessonProgressError,
    "lesson completion progress reset should succeed"
  ).toBeNull();
}

async function signIn(page: Page, password: string) {
  const loginUrl = new URL("/login", "http://localhost");
  loginUrl.searchParams.set("next", "/dashboard");

  await page.goto(`${loginUrl.pathname}${loginUrl.search}`);
  await page.getByLabel("Email address").fill(studentEmail);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Log in" }).click();

  try {
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 30_000 });
  } catch (error) {
    const loginPageText = await page
      .locator("body")
      .innerText({ timeout: 5_000 })
      .catch(() => "");
    const loginHint = loginPageText
      .split(/\r?\n/)
      .filter((line) => /invalid|error|password|email|log in/i.test(line))
      .slice(0, 6)
      .join(" ");

    throw new Error(
      `QA student login did not reach /dashboard for ${studentEmail}. Check QA_DASHBOARD_PASSWORD and QA_MOBILE_STUDENT_EMAIL in qa-e2e.${loginHint ? ` Login page text: ${loginHint}` : ""}`,
      { cause: error }
    );
  }
}

async function attachScreenshot(page: Page, testInfo: TestInfo, name: string) {
  const screenshot = await page.screenshot();

  await testInfo.attach(name, {
    body: screenshot,
    contentType: "image/png",
  });
}

async function openCourseFromDashboard(page: Page) {
  await page
    .getByRole("link", { name: /^Course$/i })
    .first()
    .click();

  await page.waitForURL(/\/courses/, { timeout: 5_000 }).catch(async () => {
    await page.goto(coursePath);
  });

  await expect(page).toHaveURL(/\/courses/);
}

async function openCourseVariant(page: Page) {
  if (new URL(page.url()).pathname === coursePath) {
    return;
  }

  const variantLink = page
    .locator(`a[href="${coursePath}"], a[href^="${coursePath}?"]`)
    .first();

  if ((await variantLink.count()) > 0) {
    await variantLink.click();
  } else {
    await page.goto(coursePath);
  }

  await expect(page).toHaveURL(new RegExp(`${coursePath}$`));
}

async function openModule(page: Page) {
  const moduleLink = page
    .locator(`a[href="${modulePath}"], a[href^="${modulePath}?"]`)
    .first();

  if ((await moduleLink.count()) > 0) {
    await moduleLink.click();
  } else {
    await page.goto(modulePath);
  }

  await expect(page).toHaveURL(new RegExp(`${modulePath}$`));
}

async function openFirstLesson(page: Page) {
  const lessonLink = page
    .getByRole("link", {
      name: /Continue lesson: Welcome to GCSE Russian|Start lesson: Welcome to GCSE Russian|Review lesson: Welcome to GCSE Russian/,
    })
    .first();

  await expect(lessonLink).toBeVisible();
  await lessonLink.click();

  await expect(page).toHaveURL(new RegExp(`${firstLessonPath}$`), {
    timeout: 30_000,
  });
  await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});
}

async function advanceToCompletionPanel(page: Page) {
  for (let step = 0; step < 12; step += 1) {
    const nextLink = page.getByRole("link", { name: /^Next$/ });

    if ((await nextLink.count()) === 0) break;

    await nextLink.first().click();
    await expect(page.locator("h1")).toBeVisible();
  }

  await expect(page.locator("#lesson-completion-title")).toBeVisible();
}

test.describe("mobile authenticated student journey", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  test("completes dashboard to progress on a resettable Foundation account @protected", async ({
    page,
  }, testInfo) => {
    test.setTimeout(90_000);

    const password = getStudentPassword();
    test.skip(
      !password,
      "Set PLAYWRIGHT_MOBILE_STUDENT_PASSWORD or QA_DASHBOARD_PASSWORD."
    );

    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const serverErrors: string[] = [];

    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });
    page.on("pageerror", (error) => {
      pageErrors.push(error.message);
    });
    page.on("response", (response) => {
      if (response.status() >= 500) {
        serverErrors.push(`${response.status()} ${response.url()}`);
      }
    });

    await resetStudentProgress();

    await signIn(page, password);
    await expect(page.getByRole("heading", { name: /Today's focus/i })).toBeVisible();
    await attachScreenshot(page, testInfo, "01-dashboard-mobile");

    await openCourseFromDashboard(page);
    await expect(
      page.getByRole("heading", { name: /Foundation|GCSE Russian/i }).first()
    ).toBeVisible();
    await attachScreenshot(page, testInfo, "02-courses-mobile");

    await openCourseVariant(page);
    await expect(page.getByRole("heading", { name: "Foundation" })).toBeVisible();
    await attachScreenshot(page, testInfo, "03-course-mobile");

    await openModule(page);
    await expect(
      page.getByRole("heading", { name: "Intro, explanation and tutorial" })
    ).toBeVisible();
    await attachScreenshot(page, testInfo, "04-module-mobile");

    await openFirstLesson(page);
    await expect(
      page.getByRole("heading", { name: "Welcome to GCSE Russian" })
    ).toBeVisible();
    await attachScreenshot(page, testInfo, "05-lesson-mobile");

    await advanceToCompletionPanel(page);
    await expect(page.getByRole("button", { name: "Mark complete" })).toBeVisible();
    await attachScreenshot(page, testInfo, "06-lesson-ready-mobile");

    await page.getByRole("button", { name: "Mark complete" }).click();
    await expect(page.getByRole("button", { name: "Mark incomplete" })).toBeVisible({
      timeout: 30_000,
    });

    await page.goto("/progress");
    await expect(
      page.getByRole("heading", { name: /Your GCSE Russian progress/i })
    ).toBeVisible();
    await expect(page.locator("body")).toContainText(/1 of 3 lessons|1\/3|33%/i);
    await attachScreenshot(page, testInfo, "07-progress-mobile");

    expect(serverErrors, "mobile journey should not hit server errors").toEqual([]);
    expect(pageErrors, "mobile journey should not throw page errors").toEqual([]);
    expect(consoleErrors, "mobile journey should not log console errors").toEqual([]);
  });
});
