import { test as base } from "@playwright/test";
import { ApiMock } from "./api-mocks";

type Fixtures = {
  api: ApiMock;
};

export const test = base.extend<Fixtures>({
  api: [
    async ({ page }, use) => {
      const api = new ApiMock(page);
      await api.install();
      await use(api);
    },
    // API への実リクエストが混ざらないよう、全テストでモックを有効にする
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
