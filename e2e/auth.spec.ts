import type { Page } from "@playwright/test";
import { tokenClaim } from "./support/api-mocks";
import { expect, test } from "./support/fixtures";

const consentCheckbox = "利用規約とプライバシーポリシーに同意する";

test.describe("トップページのゲストログイン", () => {
  test("同意するまでゲストログイン API を呼ばない", async ({ page, api }) => {
    await page.goto("/");

    await expect(page.getByText("ことひろに参加しよう")).toBeVisible();
    await page.getByRole("button", { name: "ゲストとしてログイン" }).click();

    await expect(page).toHaveURL(/\/$/);
    expect(api.requestsFor("POST", "/auth/guest/login")).toHaveLength(0);
  });

  test("同意後にゲストログインするとホームへ移動する", async ({
    page,
    api,
  }) => {
    let loggedIn = false;
    api.set("POST", "/auth/guest/login", () => {
      loggedIn = true;
      return { status: 200, body: {} };
    });
    api.set("GET", "/auth/token/info", () =>
      loggedIn
        ? {
            status: 200,
            body: tokenClaim({ isRegistered: false, displayName: "ゲスト" }),
          }
        : { status: 401, body: { code: "UNAUTHENTICATED" } },
    );

    await page.goto("/");
    await page.getByRole("checkbox", { name: consentCheckbox }).check();
    await page.getByRole("button", { name: "ゲストとしてログイン" }).click();

    await expect(page).toHaveURL(/\/home$/);
    await expect(
      page.getByText("セッションがまだありません。🙇"),
    ).toBeVisible();
    expect(api.requestsFor("POST", "/auth/guest/login")).toHaveLength(1);
  });

  test("ゲストログインに失敗するとトーストを表示してトップに留まる", async ({
    page,
    api,
  }) => {
    api.set("POST", "/auth/guest/login", {
      status: 500,
      body: { code: "INTERNAL", message: "failed" },
    });

    await page.goto("/");
    await page.getByRole("checkbox", { name: consentCheckbox }).check();
    await page.getByRole("button", { name: "ゲストとしてログイン" }).click();

    await expect(page.getByText("ゲストログインに失敗しました")).toBeVisible();
    await expect(page).toHaveURL(/\/$/);
  });

  test("ログインせずに使うでホームへ移動する", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "ログインせずに使う" }).click();

    await expect(page).toHaveURL(/\/home$/);
    await expect(
      page.getByText("セッションがまだありません。🙇"),
    ).toBeVisible();
  });
});

test.describe("ログイン画面", () => {
  test("利用規約に同意するまで OAuth ログインへ遷移しない", async ({
    page,
  }) => {
    await page.goto("/auth/login");

    const googleLogin = page.getByRole("link", { name: "Googleでログイン" });
    const checkbox = page.getByRole("checkbox", { name: consentCheckbox });

    // チェック状態が aria-disabled に反映されるまで待ち、React の hydration を確認する
    await checkbox.check();
    await expect(googleLogin).toHaveAttribute("aria-disabled", "false");
    await checkbox.uncheck();
    await expect(googleLogin).toHaveAttribute("aria-disabled", "true");

    await googleLogin.click({ force: true });

    await expect(page).toHaveURL(/\/auth\/login$/);
  });

  test("利用規約に同意すると OAuth ログインが有効になる", async ({ page }) => {
    await page.goto("/auth/login");

    const googleLogin = page.getByRole("link", { name: "Googleでログイン" });
    await page.getByRole("checkbox", { name: consentCheckbox }).check();

    await expect(googleLogin).toHaveAttribute("aria-disabled", "false");
  });
});

test.describe("メールの確認リンク", () => {
  const validToken = "A".repeat(43);

  test("不正なトークンでは確認ボタンを無効にする", async ({ page }) => {
    await page.goto("/auth/email/verify#invalid-token");

    await expect(page.getByRole("alert")).toHaveText(
      /メールに届いた確認リンクから開いてください/,
    );
    await expect(page.getByRole("button", { name: "確認する" })).toBeDisabled();
  });

  test("確認に成功するとログイン後の移動先へ遷移する", async ({
    page,
    api,
  }) => {
    await page.goto(`/auth/email/verify#${validToken}`);
    const redirectURL = new URL("/home", page.url()).href;
    api.set("POST", "/auth/password/verify", {
      status: 200,
      body: { redirectURL },
    });

    await page.getByRole("button", { name: "確認する" }).click();

    await expect(page).toHaveURL(/\/home$/);
    expect(api.requestsFor("POST", "/auth/password/verify")).toHaveLength(1);
  });

  test("確認 API のエラーを表示してやり直せる", async ({ page, api }) => {
    api.set("POST", "/auth/password/verify", {
      status: 401,
      body: { message: "確認リンクの有効期限が切れています。" },
    });

    await page.goto(`/auth/email/verify#${validToken}`);
    await page.getByRole("button", { name: "確認する" }).click();

    await expect(page.getByRole("alert")).toHaveText(
      "確認リンクの有効期限が切れています。",
    );
    await expect(page.getByRole("button", { name: "確認する" })).toBeEnabled();
  });
});

test.describe("パスワードの設定", () => {
  const validToken = `${"A".repeat(43)}=`;
  const policy = {
    minLength: 8,
    maxBytes: 72,
    forbidControlCharacters: true,
    forbidSurroundingWhitespace: true,
  };

  const openSetupPage = (page: Page) =>
    page.goto(`/auth/password/setup#${validToken}`);

  const fillPasswords = async (
    page: Page,
    password: string,
    confirmation = password,
  ) => {
    await page.getByLabel("新しいパスワード").fill(password);
    await page.getByLabel("パスワード確認用").fill(confirmation);
  };

  test("不正なトークンでは設定フォームを使えない", async ({ page }) => {
    await page.goto("/auth/password/setup#invalid-token");

    await expect(page.getByRole("alert")).toHaveText(
      /メールに届いた設定リンクから開いてください/,
    );
    await expect(page.getByLabel("新しいパスワード")).toBeDisabled();
    await expect(page.getByRole("button", { name: "完了" })).toBeDisabled();
  });

  test("パスワードポリシーを取得できない場合はエラーを表示する", async ({
    page,
    api,
  }) => {
    api.set("GET", "/auth/password/policy", {
      status: 500,
      body: { code: "INTERNAL" },
    });

    await openSetupPage(page);

    await expect(page.getByRole("alert")).toHaveText(
      "パスワードの入力条件を取得できませんでした。メールの設定リンクからもう一度開いてください。",
    );
    await expect(page.getByLabel("新しいパスワード")).toBeDisabled();
  });

  test("短すぎるパスワードは送信しない", async ({ page, api }) => {
    api.set("GET", "/auth/password/policy", { status: 200, body: policy });

    await openSetupPage(page);
    await expect(page.getByText(/8文字以上/)).toBeVisible();
    await fillPasswords(page, "short");
    await page.getByRole("button", { name: "完了" }).click();

    await expect(page.getByRole("alert")).toHaveText(
      "パスワードは8文字以上で入力してください。",
    );
    expect(api.requestsFor("POST", "/auth/password/setup")).toHaveLength(0);
  });

  test("確認用パスワードが一致しない場合は送信しない", async ({
    page,
    api,
  }) => {
    api.set("GET", "/auth/password/policy", { status: 200, body: policy });

    await openSetupPage(page);
    await fillPasswords(page, "password123", "password456");
    await page.getByRole("button", { name: "完了" }).click();

    await expect(page.getByRole("alert")).toHaveText(
      "確認用のパスワードが一致していません。",
    );
    expect(api.requestsFor("POST", "/auth/password/setup")).toHaveLength(0);
  });

  test("設定に成功すると完了画面を表示する", async ({ page, api }) => {
    api.set("GET", "/auth/password/policy", { status: 200, body: policy });
    api.set("POST", "/auth/password/setup", { status: 204 });

    await openSetupPage(page);
    await fillPasswords(page, "password123");
    await page.getByRole("button", { name: "完了" }).click();

    await expect(
      page.getByRole("heading", { name: "設定が完了しました" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "ログイン画面へ" }),
    ).toBeVisible();

    const [request] = api.requestsFor("POST", "/auth/password/setup");
    expect(JSON.parse(request.postData ?? "{}")).toEqual({
      token: validToken,
      password: "password123",
    });
  });
});
