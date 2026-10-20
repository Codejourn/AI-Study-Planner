import { expect, test } from "@playwright/test";

test("Pomodoro chime previews, respects mute, and plays once on completion", async ({ page }) => {
  test.skip(process.env.FOCUSGEEK_E2E_LOCAL !== "1", "Run against the local workspace preview.");
  await page.clock.install();
  await page.addInitScript(() => {
    if (!localStorage.getItem("focusgeek:study:v1:local-demo")) {
      localStorage.setItem("focusgeek:study:v1:local-demo", JSON.stringify({
        subjects: [{ id: "dbms", name: "Database systems", examDate: "2026-12-01", priority: 2 }],
        tasks: [], deadlines: [], sessions: [], attempts: [], notes: [], dailyHours: 2,
      }));
    }
    const original = AudioContext.prototype.createOscillator;
    (window as Window & { focusGeekTones?: number }).focusGeekTones = 0;
    AudioContext.prototype.createOscillator = function (...args) {
      const trackedWindow = window as Window & { focusGeekTones?: number };
      trackedWindow.focusGeekTones = (trackedWindow.focusGeekTones ?? 0) + 1;
      return original.apply(this, args);
    };
  });
  const toneCount = () => page.evaluate(() => (window as Window & { focusGeekTones?: number }).focusGeekTones ?? 0);
  await page.goto("/login");
  await page.getByRole("button", { name: "Try FocusGeek locally" }).click();
  await page.getByRole("link", { name: "Focus Mode" }).click();
  await page.getByRole("button", { name: "Preview" }).click();
  expect(await toneCount()).toBe(3);
  await page.getByRole("button", { name: "Sound on" }).click();
  await expect(page.getByRole("button", { name: "Preview" })).toBeDisabled();
  await page.getByLabel("Session length").selectOption("15");
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await page.clock.fastForward("15:01");
  await expect(page.getByRole("status")).toContainText("Session saved");
  expect(await toneCount()).toBe(3);
  await page.getByRole("button", { name: "Sound off" }).click();
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await page.clock.fastForward("15:01");
  await expect(page.getByRole("status")).toContainText("Session saved");
  expect(await toneCount()).toBe(6);
  await page.clock.fastForward("00:10");
  expect(await toneCount()).toBe(6);
  await page.getByRole("button", { name: "Sound on" }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: "Sound off" })).toBeVisible();
});
