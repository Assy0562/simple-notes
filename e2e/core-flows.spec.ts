import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
});

test("メモを作成・編集し、再読み込み後も内容が残る", async ({ page }) => {
  await page.getByRole("button", { name: "+ 新規メモ" }).click();
  await page.getByPlaceholder("無題のメモ").fill("ブラウザテストのメモ");
  await page.locator(".note-rich-editor").fill("保存を確認する本文");

  await expect(page.getByText("保存済み")).toBeVisible();
  await page.reload();
  await page.getByText("ブラウザテストのメモ").first().click();
  await expect(page.getByPlaceholder("無題のメモ")).toHaveValue("ブラウザテストのメモ");
  await expect(page.locator(".note-rich-editor")).toContainText("保存を確認する本文");
});

test("ToDoを追加・完了し、再読み込み後も状態が残る", async ({ page }) => {
  await page.getByRole("button", { name: "ToDo", exact: true }).click();
  await page.getByRole("button", { name: "+ 新規リスト" }).click();
  await page.getByRole("textbox", { name: "ToDoリスト名" }).fill("ブラウザテストのリスト");
  await page.getByPlaceholder("新しいToDoを入力").fill("保存を確認するタスク");
  await page.getByPlaceholder("新しいToDoを入力").press("Enter");
  const row = page.locator("div.group").filter({ hasText: "保存を確認するタスク" });
  await row.getByRole("button", { name: "完了状態を切り替え" }).click();
  await expect(row.getByRole("button", { name: "完了状態を切り替え" })).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem("simple-notes-todos-ja-v1") ?? "{}");
    return saved.todos?.some((todo: { title: string; completed: boolean }) =>
      todo.title === "保存を確認するタスク" && todo.completed,
    ) ?? false;
  })).toBe(true);

  await page.reload();
  await expect(page.getByRole("button", { name: "ToDo", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("textbox", { name: "ToDoリスト名" })).toHaveValue("ブラウザテストのリスト");
  const restoredRow = page.locator("div.group").filter({ hasText: "保存を確認するタスク" });
  await expect(restoredRow.getByRole("button", { name: "完了状態を切り替え" })).toHaveAttribute("aria-pressed", "true");
});
