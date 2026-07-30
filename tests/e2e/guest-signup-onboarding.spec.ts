import { expect, test } from "@playwright/test";

test.describe("guest signup and onboarding entry", () => {
  test("preserves the resource that prompted signup", async ({ page }) => {
    await page.goto("/vocabulary");
    await page
      .getByRole("main")
      .getByRole("link", { name: "Start trial", exact: true })
      .click();

    await expect(page).toHaveURL(/\/signup\?from=app&next=%2Fvocabulary$/);
    await expect(
      page.getByRole("heading", { name: "Create your trial student account" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Back" })).toHaveAttribute(
      "href",
      "/vocabulary"
    );
  });

  test("preserves the resource through guest login", async ({ page }) => {
    await page.goto("/vocabulary");

    await expect(
      page.getByRole("banner").getByRole("link", { name: "Log in" })
    ).toHaveAttribute("href", "/login?from=app&next=%2Fvocabulary");
  });

  test("supports password visibility and matching feedback", async ({ page }) => {
    await page.goto("/signup?from=app&next=%2Fvocabulary");

    const password = page.getByLabel("Password", { exact: true });
    const confirmation = page.getByLabel("Confirm password", { exact: true });

    await password.fill("test-pass-123");
    await confirmation.fill("test-pass-123");
    await expect(page.getByText("Passwords match.")).toBeVisible();

    await page.getByRole("button", { name: "Show passwords", exact: true }).click();
    await expect(password).toHaveAttribute("type", "text");
    await expect(confirmation).toHaveAttribute("type", "text");
  });

  test("requires complete guardian contact details as a group", async ({ page }) => {
    await page.goto("/signup?from=app");
    await page.getByLabel("Student name", { exact: true }).fill("Test Student");
    await page
      .getByLabel("Email address", { exact: true })
      .fill("test-student@example.com");
    await page.getByLabel("Password", { exact: true }).fill("test-pass-123");
    await page.getByLabel("Confirm password", { exact: true }).fill("test-pass-123");

    await page.getByText("Add parent or guardian details", { exact: true }).click();
    await page.getByLabel("Parent/guardian name", { exact: true }).fill("Test Guardian");
    await page
      .getByRole("button", { name: "Create my trial account", exact: true })
      .click();

    await expect(
      page.getByText("Enter the parent or guardian's email address.")
    ).toBeVisible();
    await expect(page.getByLabel("Student name", { exact: true })).toHaveValue(
      "Test Student"
    );
    await expect(page.getByLabel("Parent/guardian phone")).toBeVisible();
  });

  test("keeps a signed-out onboarding destination through signup", async ({ page }) => {
    await page.goto("/onboarding?next=%2Fgrammar");

    await expect(page).toHaveURL(/\/signup\?from=app&next=%2Fgrammar$/);
  });

  test("shows a recoverable email confirmation state", async ({ page }) => {
    await page.goto("/signup/confirm-email?from=app&next=%2Fgrammar");

    await expect(
      page.getByRole("heading", { name: "Confirm your email to continue" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to app preview" })).toHaveAttribute(
      "href",
      "/grammar"
    );
    await expect(
      page.getByRole("link", { name: "Already confirmed? Log in" })
    ).toHaveAttribute(
      "href",
      "/login?next=%2Fonboarding%3Fnext%3D%252Fgrammar&returnTo=%2Fgrammar&from=app"
    );
  });

  test("returns from confirmation login to the originating resource", async ({
    page,
  }) => {
    await page.goto("/signup/confirm-email?from=app&next=%2Fgrammar");
    await page.getByRole("link", { name: "Already confirmed? Log in" }).click();

    await expect(page).toHaveURL(
      /\/login\?next=%2Fonboarding%3Fnext%3D%252Fgrammar&returnTo=%2Fgrammar&from=app$/
    );
    await expect(page.getByRole("link", { name: "Back to app preview" })).toHaveAttribute(
      "href",
      "/grammar"
    );
    await expect(
      page.getByRole("banner").getByRole("link", { name: "Sign up" })
    ).toHaveAttribute("href", "/signup?from=app&next=%2Fgrammar");
  });

  test("preserves the journey through forgot-password recovery", async ({ page }) => {
    await page.goto(
      "/login?from=app&next=%2Fonboarding%3Fnext%3D%252Fgrammar&returnTo=%2Fgrammar"
    );
    await page.getByRole("link", { name: "Forgot password?" }).click();

    await expect(page).toHaveURL(
      /\/forgot-password\?from=app&next=%2Fonboarding%3Fnext%3D%252Fgrammar&returnTo=%2Fgrammar$/
    );
    await expect(page.getByRole("link", { name: "Back to app preview" })).toHaveAttribute(
      "href",
      "/grammar"
    );
    await expect(page.getByRole("link", { name: "Back to login" })).toHaveAttribute(
      "href",
      "/login?from=app&next=%2Fonboarding%3Fnext%3D%252Fgrammar&returnTo=%2Fgrammar"
    );
  });
});
