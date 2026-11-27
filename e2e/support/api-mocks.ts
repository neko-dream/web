import type { Page, Route } from "@playwright/test";

type JsonBody = unknown;

export type MockResponse = {
  status?: number;
  body?: JsonBody;
  headers?: Record<string, string>;
};

export type MockRequest = {
  method: string;
  path: string;
  url: URL;
  postData: string | null;
};

export type Responder = (
  request: MockRequest,
) => MockResponse | Promise<MockResponse>;

type Entry = {
  method: string;
  path: string;
  responder: Responder;
};

const unauthorized: MockResponse = {
  status: 401,
  body: { code: "UNAUTHENTICATED", message: "ログインが必要です" },
};

const forbidden: MockResponse = {
  status: 403,
  body: { code: "FORBIDDEN", message: "権限がありません" },
};

const emptySessions = {
  talkSessions: [],
  pagination: { limit: 100, offset: 0, totalCount: 0 },
};

export const tokenClaim = ({
  isRegistered = true,
  displayID = "test-user",
  displayName = "テストユーザー",
}: {
  isRegistered?: boolean;
  displayID?: string;
  displayName?: string;
} = {}) => ({
  aud: "kotohiro",
  exp: "2099-01-01T00:00:00Z",
  iat: "2026-01-01T00:00:00Z",
  iss: "kotohiro",
  sub: "user-1",
  jti: "token-1",
  displayID,
  displayName,
  iconURL: null,
  isRegistered,
  isEmailVerified: true,
  orgType: null,
  requiredPasswordChange: false,
});

export const currentUser = ({
  canCreateTalkSession = false,
  displayID = "test-user",
  displayName = "テストユーザー",
}: {
  canCreateTalkSession?: boolean;
  displayID?: string;
  displayName?: string;
} = {}) => ({
  userID: "user-1",
  user: {
    displayID,
    displayName,
    iconURL: null,
  },
  permissions: { canCreateTalkSession },
});

/**
 * ブラウザから出る API 呼び出しをすべてこのクラスで処理する。
 *
 * `pnpm dev:local` は API を `https://localhost:3000/api` に向けるため、
 * ハンドラは同一オリジンの `/api` 配下だけを見ればよい。
 */
export class ApiMock {
  private readonly entries: Entry[] = [];
  readonly requests: MockRequest[] = [];

  constructor(private readonly page: Page) {}

  async install(): Promise<void> {
    await this.page.route("**/api/**", (route) => this.handle(route));
    this.set("GET", "/auth/token/info", unauthorized);
    this.set("GET", "/users/me", forbidden);
    this.set("GET", "/talksessions", { status: 200, body: emptySessions });
  }

  set(method: string, path: string, responder: MockResponse | Responder): this {
    const entry: Entry = {
      method: method.toUpperCase(),
      path,
      responder: typeof responder === "function" ? responder : () => responder,
    };
    const index = this.entries.findIndex(
      (value) => value.method === entry.method && value.path === entry.path,
    );
    if (index === -1) {
      this.entries.push(entry);
    } else {
      this.entries[index] = entry;
    }
    return this;
  }

  /** 登録済みユーザーとしてログインした状態にする */
  loginAs(
    options: Parameters<typeof currentUser>[0] & {
      isRegistered?: boolean;
    } = {},
  ): this {
    const { isRegistered = true, ...userOptions } = options;
    this.set("GET", "/auth/token/info", {
      status: 200,
      body: tokenClaim({ ...userOptions, isRegistered }),
    });
    this.set("GET", "/users/me", {
      status: 200,
      body: currentUser(userOptions),
    });
    return this;
  }

  requestsFor(method: string, path: string): MockRequest[] {
    return this.requests.filter(
      (request) =>
        request.method === method.toUpperCase() && request.path === path,
    );
  }

  private async handle(route: Route): Promise<void> {
    const request = route.request();
    const url = new URL(request.url());
    const apiIndex = url.pathname.indexOf("/api/");
    const path =
      apiIndex === -1 ? url.pathname : url.pathname.slice(apiIndex + 4);

    const mockRequest: MockRequest = {
      method: request.method().toUpperCase(),
      path,
      url,
      postData: request.postData(),
    };
    this.requests.push(mockRequest);

    const entry = [...this.entries]
      .reverse()
      .find(
        (value) => value.method === mockRequest.method && value.path === path,
      );

    const response = entry
      ? await entry.responder(mockRequest)
      : {
          status: 404,
          body: { code: "NOT_FOUND", message: `${path} is not mocked` },
        };

    await route.fulfill({
      status: response.status ?? 200,
      headers: {
        "content-type": "application/json",
        ...response.headers,
      },
      body:
        response.body === undefined ? undefined : JSON.stringify(response.body),
    });
  }
}
