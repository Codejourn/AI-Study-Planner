import { expect, test } from "@playwright/test";
import { localDate } from "../../lib/study";

test("local dashboard supports search, calendar navigation, and mobile layouts", async ({
  page,
}) => {
  test.skip(
    process.env.FOCUSGEEK_E2E_LOCAL !== "1",
    "Run against a local preview with AWS configuration disabled.",
  );
  const today = localDate();
  const exam = new Date();
  exam.setDate(exam.getDate() + 10);
  await page.addInitScript(
    ({ today, examDate }) => {
      localStorage.setItem(
        "focusgeek:study:v1:local-demo",
        JSON.stringify({
          subjects: [
            { id: "dbms", name: "Database systems", examDate, priority: 3 },
          ],
          tasks: [
            {
              id: "revise",
              subjectId: "dbms",
              title: "Revise normalization",
              date: today,
              minutes: 25,
              completed: false,
            },
          ],
          sessions: [],
          attempts: [],
          notes: [],
          dailyHours: 2,
        }),
      );
    },
    { today, examDate: localDate(exam) },
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/login");
  await page.getByRole("button", { name: "Try FocusGeek locally" }).click();
  await expect(
    page.getByRole("heading", { name: "Dashboard", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Search subjects and notes").fill("database");
  await expect(
    page
      .locator(".search-results")
      .getByText("Database systems", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("Search subjects and notes").press("Escape");
  await expect(page.locator(".search-results")).toHaveCount(0);
  const calendar = await page.locator(".mini-calendar").textContent();
  await page.getByRole("button", { name: "Next month" }).click();
  await expect(page.locator(".mini-calendar")).not.toHaveText(calendar!);
  await page.getByRole("button", { name: "Previous month" }).click();
  await page
    .getByRole("checkbox", { name: "Complete Revise normalization" })
    .check();
  await expect(page.locator(".progress-card").first()).toContainText("100%");
  for (const width of [1440, 950, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(() => document.body.scrollWidth <= innerWidth),
    ).toBe(true);
  }
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /A little structure/ }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.body.scrollWidth <= innerWidth),
  ).toBe(true);
});
