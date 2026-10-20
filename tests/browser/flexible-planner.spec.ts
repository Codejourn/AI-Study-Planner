import { expect, test } from "@playwright/test";

test("general tasks and subjects without exam dates work in a local workspace", async ({
  page,
}) => {
  test.skip(
    process.env.FOCUSGEEK_E2E_LOCAL !== "1",
    "Run against the local workspace preview.",
  );

  await page.goto("/login");
  await page.getByRole("button", { name: "Try FocusGeek locally" }).click();
  await page.getByRole("link", { name: "Planner", exact: true }).click();

  await page.getByLabel("Task", { exact: true }).fill("Pick up library book");
  await expect(page.getByLabel("Subject (optional)")).toHaveValue("");
  await page.getByRole("button", { name: "Add task", exact: true }).click();
  await expect(
    page.getByText("Pick up library book", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("Pick up library book", { exact: true }),
  ).toBeVisible();

  await page.getByLabel("Subject name").fill("Reading");
  await expect(page.getByLabel("Exam date (optional)")).toHaveValue("");
  await page.getByRole("button", { name: "Save subject" }).click();
  await expect(page.getByText("No exam date")).toBeVisible();
  await page.getByRole("button", { name: "Generate local schedule" }).click();
  await expect(
    page.getByText("Study Reading", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByText("Pick up library book", { exact: true }),
  ).toBeVisible();

  await page
    .getByRole("button", { name: "Delete", exact: true })
    .first()
    .click();
  await expect(
    page.getByText("Pick up library book", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Study Reading", { exact: true }).first(),
  ).toBeVisible();

  await page.getByRole("link", { name: "Calendar", exact: true }).click();
  await expect(page.getByText("Reading exam")).toHaveCount(0);
});
