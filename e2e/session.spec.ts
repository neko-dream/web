import { expect, test } from "./support/fixtures";

const session = {
  id: "session-1",
  theme: "テストセッション",
  description: "セッションの説明文です。",
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
};

test.describe("セッション詳細", () => {
  test("テーマ・投稿者・内容を表示する", async ({ page, api }) => {
    api.set("GET", "/talksessions/session-1", {
      status: 200,
      body: session,
    });
    api.set("GET", "/talksessions/session-1/swipe_opinions", {
      status: 200,
      body: { opinions: [], remainingCount: 0 },
    });
    api.set("GET", "/talksessions/session-1/analysis", {
      status: 200,
      body: { positions: [], groupOpinions: [] },
    });

    await page.goto("/session-1");

    await expect(
      page.getByText("テストセッション", { exact: true }),
    ).toBeVisible();
    await expect(page.getByText("オーナー", { exact: true })).toBeVisible();
    await expect(page.getByText("セッションの説明文です。")).toBeVisible();
    await expect(page.getByText("誰でも参加OK")).toBeVisible();
    await expect(page.getByRole("link", { name: "内容" })).toBeVisible();
    await expect(page.getByRole("link", { name: "意見" })).toBeVisible();
    await expect(page.getByRole("link", { name: "分析" })).toBeVisible();
  });

  test("存在しないセッションは404の案内を表示する", async ({ page, api }) => {
    api.set("GET", "/talksessions/session-missing", {
      status: 404,
      body: { code: "NOT_FOUND", message: "session not found" },
    });

    await page.goto("/session-missing");

    await expect(page.getByText("お探しのトークセッションは")).toBeVisible();
    await expect(page.getByText("見つかりませんでした...")).toBeVisible();
  });
});
