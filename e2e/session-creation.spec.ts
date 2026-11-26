import { expect, test } from "./support/fixtures";

const createdSession = {
  id: "created-session",
  theme: "テストセッションを作成",
  description: "",
  owner: {
    displayID: "test-user",
    displayName: "テストユーザー",
    iconURL: null,
  },
  createdAt: "2026-01-01T00:00:00Z",
  scheduledEndTime: "2099-01-01T00:00:00Z",
  restrictions: [],
  hideReport: false,
  isLocked: false,
};

test.describe("セッション作成の権限", () => {
  test("未ログインではログインを促す", async ({ page, api }) => {
    api.set("GET", "/users/me", { status: 401, body: {} });

    await page.goto("/make/new");

    await expect(page.getByText("ログインしてください")).toBeVisible();
  });

  test("作成権限がない場合は権限エラーを表示する", async ({ page, api }) => {
    api.loginAs({ canCreateTalkSession: false });

    await page.goto("/make/new");

    await expect(
      page.getByText("セッション作成は許可されていません"),
    ).toBeVisible();
  });

  test("権限を確認できない場合はサーバーエラーを表示する", async ({
    page,
    api,
  }) => {
    api.set("GET", "/users/me", {
      status: 500,
      body: { code: "INTERNAL", message: "failed" },
    });

    await page.goto("/make/new");

    await expect(
      page.getByText(
        "作成権限を確認できませんでした。時間をおいて再度お試しください。",
      ),
    ).toBeVisible();
  });
});

test.describe("セッション作成フォーム", () => {
  test.beforeEach(async ({ api }) => {
    api.loginAs({ canCreateTalkSession: true });
  });

  test("権限がある場合は作成フォームを表示する", async ({ page }) => {
    await page.goto("/make/new");

    await expect(
      page.getByRole("link", { name: "セッションを作成する" }),
    ).toBeVisible();
    await expect(page.locator('input[name="theme"]')).toBeVisible();
    await expect(
      page.getByRole("button", { name: "セッションを作成する" }),
    ).toBeVisible();
  });

  test("タイトルが短い場合は送信しない", async ({ page, api }) => {
    await page.goto("/make/new");

    await page.locator('input[name="theme"]').fill("短い");
    await page.getByRole("button", { name: "セッションを作成する" }).click();

    await expect(
      page.getByText("テーマは5文字以上で入力してください"),
    ).toBeVisible();
    expect(api.requestsFor("POST", "/talksessions")).toHaveLength(0);
  });

  test("作成に成功するとホームへ移動する", async ({ page, api }) => {
    api.set("POST", "/talksessions", {
      status: 200,
      body: createdSession,
    });

    await page.goto("/make/new");

    await page.locator('input[name="theme"]').fill("テストセッションを作成");
    await page.getByRole("button", { name: "セッションを作成する" }).click();

    await expect(page).toHaveURL(/\/home$/);
    await expect(page.getByText("登録が完了しました")).toBeVisible();

    const [request] = api.requestsFor("POST", "/talksessions");
    expect(request.postData).toContain("テストセッションを作成");
  });
});
