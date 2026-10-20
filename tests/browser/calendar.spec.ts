import { expect, test } from "@playwright/test";
import { localDate } from "../../lib/study";

test("calendar shows exams and manages deadlines in a local workspace", async ({ page }) => {
  test.skip(process.env.FOCUSGEEK_E2E_LOCAL !== "1", "Run against the local workspace preview.");
  const today = localDate();
  const exam = new Date();
  exam.setDate(exam.getDate() + 5);
  const examDate = localDate(exam);
  await page.addInitScript(({ examDate }) => {
    if (localStorage.getItem("focusgeek:study:v1:local-demo")) return;
    localStorage.setItem("focusgeek:study:v1:local-demo", JSON.stringify({
      subjects: [{ id: "dbms", name: "Database systems", examDate, priority: 2 }],
      tasks: [], sessions: [], attempts: [], notes: [], dailyHours: 2,
    }));
  }, { examDate });
  await page.goto("/login");
  await page.getByRole("button", { name: "Try FocusGeek locally" }).click();
  await page.getByRole("link", { name: "Calendar", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Calendar" })).toBeVisible();
  await expect(page.getByText("Database systems exam").first()).toBeVisible();
  await page.getByLabel("Assignment or project").fill("Lab report");
  await page.getByLabel("Due date").fill(today);
  await page.getByRole("button", { name: "Add deadline" }).click();
  await expect(page.getByText("Lab report").first()).toBeVisible();
  await page.getByRole("button", { name: "Done" }).click();
  await expect(page.getByRole("button", { name: "Reopen" })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Lab report").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Reopen" })).toBeVisible();
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.body.scrollWidth <= innerWidth)).toBe(true);
  }
});
