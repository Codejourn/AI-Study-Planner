import { expect, test } from "@playwright/test";

test("student can plan, learn, test, focus, and save progress", async ({
  page,
}) => {
  const email = process.env.FOCUSGEEK_E2E_EMAIL;
  const password = process.env.FOCUSGEEK_E2E_PASSWORD;
  test.skip(
    !email || !password,
    "Set credentials for a dedicated cloud test account.",
  );

  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill(email!);
  await page.getByLabel("Password", { exact: true }).fill(password!);
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Dashboard", exact: true }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Planner", exact: true }).click();
  const name = `Browser test ${Date.now()}`;
  const date = new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10);
  await page.getByLabel("Subject name", { exact: true }).fill(name);
  await page.getByLabel("Exam date", { exact: true }).fill(date);
  await page.getByRole("button", { name: "Save subject", exact: true }).click();
  await expect(page.getByText(name, { exact: true }).first()).toBeVisible();
  await page
    .getByRole("button", { name: "Save to cloud", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Saved to cloud", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByText(name, { exact: true }).first()).toBeVisible();

  await page.getByLabel("Task", { exact: true }).fill("Revise normalization");
  await page.getByRole("button", { name: "Add task", exact: true }).click();
  await page
    .getByRole("checkbox", { name: "Complete Revise normalization" })
    .check();
  await page
    .getByRole("button", { name: "Save to cloud", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Saved to cloud", exact: true }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Notes AI", exact: true }).click();
  await page
    .locator('input[type="file"]')
    .setInputFiles({
      name: "browser-dbms.txt",
      mimeType: "text/plain",
      buffer: Buffer.from(
        "Second normal form removes partial dependencies on composite keys.",
      ),
    });
  await expect(
    page.getByRole("heading", { name: "browser-dbms.txt", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Find a word or phrase").fill("partial");
  await expect(
    page.getByText(
      "Second normal form removes partial dependencies on composite keys.",
      { exact: true },
    ),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Save to cloud", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Saved to cloud", exact: true }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Quiz", exact: true }).click();
  await page
    .getByLabel("Record against subject")
    .selectOption({ label: "DBMS" });
  await page.getByLabel("Questions", { exact: true }).fill("2");
  await page
    .getByRole("button", { name: "Generate quiz", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Submit answers", exact: true }),
  ).toBeVisible();
  await page.locator('input[name="question-0"]').first().check();
  await page.locator('input[name="question-1"]').first().check();
  await page
    .getByRole("button", { name: "Submit answers", exact: true })
    .click();
  await expect(page.getByText(/Score: \d\/2/)).toBeVisible();
  await page
    .getByRole("button", { name: "Save to cloud", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Saved to cloud", exact: true }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Focus Mode", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Pomodoro timer" }),
  ).toBeVisible();
  await page.clock.install();
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await page.clock.fastForward(25 * 60 * 1000);
  await expect(page.getByText(/Session saved/)).toBeVisible();
  await page
    .getByRole("button", { name: "Save to cloud", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Saved to cloud", exact: true }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Analytics", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Quiz history", exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/DBMS: \d\/2/).first()).toBeVisible();
});
