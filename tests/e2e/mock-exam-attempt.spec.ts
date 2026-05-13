import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

const mockExamSlug = process.env.PLAYWRIGHT_MOCK_EXAM_SLUG ?? "ai-marking-demo";
const mockExamStudentEmail =
  process.env.PLAYWRIGHT_MOCK_EXAM_EMAIL ?? "qa-dashboard-full-higher@example.com";
const formOverrideWarning =
  "Cannot specify a encType or method for a form that specifies a function as the action";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readPasswordFromLocalCredentialNote() {
  const credentialPath = path.join(
    process.cwd(),
    ".codex",
    "dashboard-qa-credentials.local.md"
  );

  if (!existsSync(credentialPath)) {
    return "";
  }

  const content = readFileSync(credentialPath, "utf8");
  const passwordBlock = /```text\s*([\s\S]*?)\s*```/.exec(content);

  return passwordBlock?.[1]?.trim() ?? "";
}

function getMockExamPassword() {
  return (
    process.env.PLAYWRIGHT_MOCK_EXAM_PASSWORD ??
    process.env.QA_DASHBOARD_PASSWORD ??
    readPasswordFromLocalCredentialNote()
  );
}

test.describe("mock exam attempt smoke", () => {
  test("starts a mock exam attempt and lands on the draft page", async ({ page }) => {
    const password = getMockExamPassword();
    test.skip(!password, "Set PLAYWRIGHT_MOCK_EXAM_PASSWORD or QA_DASHBOARD_PASSWORD.");
    const mockExamSlugPattern = escapeRegExp(mockExamSlug);

    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });

    const loginUrl = new URL("/login", "http://localhost");
    loginUrl.searchParams.set("next", `/mock-exams/${mockExamSlug}`);

    await page.goto(`${loginUrl.pathname}${loginUrl.search}`);
    await page.getByLabel("Email address").fill(mockExamStudentEmail);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Log in" }).click();

    await expect(page).toHaveURL(new RegExp(`/mock-exams/${mockExamSlugPattern}$`), {
      timeout: 30_000,
    });
    await expect(page.getByRole("heading", { name: /Mock Exam/i })).toBeVisible();

    await page
      .getByRole("button", { name: /Start (new )?attempt/ })
      .click();

    await expect(page).toHaveURL(
      new RegExp(`/mock-exams/${mockExamSlugPattern}/attempts/[0-9a-f-]+$`),
      { timeout: 30_000 }
    );
    await expect(page.getByRole("heading", { name: /Mock Exam/i })).toBeVisible();
    await expect(page.getByText("Draft", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Submit mock exam attempt for marking" })
    ).toBeVisible();

    expect(consoleErrors).not.toContainEqual(expect.stringContaining(formOverrideWarning));
  });
});
