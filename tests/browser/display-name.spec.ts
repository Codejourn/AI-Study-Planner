import { expect, test } from "@playwright/test";

test("students can change the displayed name and keep it after reload", async ({ page }) => {
  test.skip(process.env.FOCUSGEEK_E2E_LOCAL !== "1", "Run against the local workspace preview.");
  await page.goto("/signup");
  await expect(page.getByLabel("Display name")).toBeVisible();
  await page.goto("/login");
  await page.getByRole("button", { name: "Try FocusGeek locally" }).click();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toContainText("STUDENT");
  await page.getByRole("button", { name: "Account menu" }).click();
  await page.getByRole("button", { name: "Edit display name" }).click();
  await page.getByLabel("Display name").fill("Alex Rivera");
  await page.getByRole("button", { name: "Save name" }).click();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toContainText("ALEX RIVERA");
  await expect(page.locator(".sidebar-profile")).toContainText("Alex Rivera");
  await page.reload();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toContainText("ALEX RIVERA");
  await expect(page.locator(".sidebar-profile")).toContainText("Alex Rivera");
  await page.getByRole("button", { name: "Account menu" }).click();
  await page.getByRole("button", { name: "Edit display name" }).click();
  await page.getByLabel("Display name").fill("A".repeat(60));
  await page.getByRole("button", { name: "Save name" }).click();
  await page.setViewportSize({ width: 320, height: 900 });
  expect(await page.evaluate(() => document.body.scrollWidth <= innerWidth)).toBe(true);
});
