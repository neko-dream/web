import { expect, test } from "./support/fixtures";

const talkSession = (overrides: Record<string, unknown> = {}) => ({
  id: "session-1",
  theme: "テストセッション",
  description: "セッションの説明",
  owner: {
    displayID: "owner-1",
    displayName: "オーナー",
    iconURL: null,
  },
  createdAt: "2026-01-01T00:00:00Z",
  scheduledEndTime: "2099-01-01T00:00:00Z",
  city: "東京都",
  prefecture: "東京都",
  restrictions: [],
  hideReport: false,
  isLocked: false,
  hideTop: false,
  ...overrides,
});

const sessionsResponse = (entries: unknown[]) => ({
  talkSessions: entries,
  pagination: { limit: 100, offset: 0, totalCount: entries.length },
});

test.describe("ホームのセッション一覧", () => {
  test("注目のセッションをカードで表示する", async ({ page, api }) => {
    api.set("GET", "/talksessions", ({ url }) =>
      url.searchParams.get("status") === "finished"
        ? { status: 200, body: sessionsResponse([]) }
        : {
            status: 200,
            body: sessionsResponse([
              { talkSession: talkSession(), opinionCount: 3 },
            ]),
          },
    );

    await page.goto("/home");

    await expect(
      page.getByRole("heading", { name: "注目のセッション" }),
    ).toBeVisible();
    await expect(
      page.getByText("テストセッション", { exact: true }),
    ).toBeVisible();
    await expect(page.getByText("オーナー", { exact: true })).toBeVisible();
    await expect(page.getByText("東京都", { exact: true })).toBeVisible();
    await expect(page.getByText("3 件", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /テストセッション/ }),
    ).toHaveAttribute("href", "/session-1");
  });

  test("セッションがない場合は空の案内を表示する", async ({ page }) => {
    await page.goto("/home");

    await expect(
      page.getByText("セッションがまだありません。🙇"),
    ).toBeVisible();
  });

  test("終了済みセッションも一覧に表示する", async ({ page, api }) => {
    api.set("GET", "/talksessions", ({ url }) =>
      url.searchParams.get("status") === "finished"
        ? {
            status: 200,
            body: sessionsResponse([
              {
                talkSession: talkSession({
                  id: "session-finished",
                  theme: "終了したセッション",
                  scheduledEndTime: "2020-01-01T00:00:00Z",
                }),
                opinionCount: 1,
              },
            ]),
          }
        : { status: 200, body: sessionsResponse([]) },
    );

    await page.goto("/home");

    await expect(
      page.getByText("終了したセッション", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "注目のセッション" }),
    ).toHaveCount(0);
  });

  test("検索キーワードをテーマとして API に渡す", async ({ page, api }) => {
    await page.goto("/home?q=テスト");

    await expect(
      page.getByText("【テスト】に一致するセッションが見つかりませんでした。"),
    ).toBeVisible();

    const [searchRequest] = api.requestsFor("GET", "/talksessions");
    expect(searchRequest.url.searchParams.get("theme")).toBe("テスト");
    expect(searchRequest.url.searchParams.get("status")).toBeNull();
  });
});

test.describe("ヘッダーのログイン状態", () => {
  test("未ログインではログイン導線を表示する", async ({ page }) => {
    await page.goto("/home");

    await expect(
      page.getByRole("link", { name: "ログインする" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "作成" })).toHaveCount(0);
  });

  test("作成権限がある場合はセッション作成導線を表示する", async ({
    page,
    api,
  }) => {
    api.loginAs({ canCreateTalkSession: true });

    await page.goto("/home");

    await expect(page.getByRole("link", { name: "作成" })).toBeVisible();
    await expect(page.getByRole("link", { name: "作成" })).toHaveAttribute(
      "href",
      "/make/new",
    );
  });

  test("作成権限がない場合はセッション作成導線を表示しない", async ({
    page,
    api,
  }) => {
    api.loginAs({ canCreateTalkSession: false });

    await page.goto("/home");

    await expect(page.getByRole("link", { name: "作成" })).toHaveCount(0);
  });
});
