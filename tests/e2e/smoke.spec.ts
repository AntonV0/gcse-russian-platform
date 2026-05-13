import { expect, test } from "@playwright/test";

test.describe("public smoke checks", () => {
  test("loads the app home page", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: /Start from the right GCSE Russian workspace|Welcome back to GCSE Russian/,
      })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /browse courses/i })).toBeVisible();
  });

  test("loads the public course marketing page", async ({ page }) => {
    await page.goto("/gcse-russian-course");

    await expect(
      page.getByRole("heading", { name: /GCSE Russian/i }).first()
    ).toBeVisible();
    await expect(page.locator("body")).toContainText(/Foundation|Higher/);
  });

  test("loads the resources hub", async ({ page }) => {
    await page.goto("/resources");

    await expect(
      page.getByRole("heading", {
        name: /Find the right guide before opening another tab/i,
      })
    ).toBeVisible();
    await expect(page.locator("body")).toContainText(/vocabulary|grammar|past papers/i);
  });

  test("loads the exam calendar", async ({ page }) => {
    await page.goto("/exam-calendar");

    await expect(
      page.getByRole("heading", { name: "GCSE Russian dates and deadlines" })
    ).toBeVisible();
    await expect(page.locator("body")).toContainText(/Pearson Edexcel 1RU0/i);
  });

  test("loads the exam-taking guide", async ({ page }) => {
    await page.goto("/taking-your-exams");

    await expect(
      page.getByRole("heading", { name: "Taking your GCSE Russian exams" })
    ).toBeVisible();
    await expect(page.locator("body")).toContainText(/Private candidates/i);
  });

  test("loads the login entry point", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: /log in|login/i })).toBeVisible();
  });
});

test.describe("protected route smoke checks", () => {
  test("redirects signed-out users away from account pages", async ({ page }) => {
    await page.goto("/account");

    await expect(page).toHaveURL(/\/login/);
  });

  test("redirects signed-out users away from progress pages", async ({ page }) => {
    await page.goto("/progress");

    await expect(page).toHaveURL(/\/login/);
  });

  test("redirects signed-out users away from admin pages", async ({ page }) => {
    await page.goto("/admin");

    await expect(page).toHaveURL(/\/login/);
  });
});
