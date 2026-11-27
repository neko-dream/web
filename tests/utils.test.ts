import assert from "node:assert/strict";
import { test } from "node:test";
import { JST } from "../app/libs/dayjs/index.ts";
import { cache } from "../app/utils/cache/index.ts";
import { isURL } from "../app/utils/checker/index.ts";
import { isCity, isFieldsError } from "../app/utils/form/index.ts";
import {
  formatDate,
  isEnd,
  removeHyphens,
} from "../app/utils/format-date/index.ts";
import { generateMetaTag } from "../app/utils/metatag/index.ts";

test("JST converts UTC instants to Asia/Tokyo", () => {
  assert.equal(
    JST("2026-01-01T00:00:00Z").format("YYYY-MM-DD HH:mm"),
    "2026-01-01 09:00",
  );
  assert.equal(
    JST("2026-01-01T15:00:00Z").format("YYYY-MM-DD HH:mm"),
    "2026-01-02 00:00",
  );
});

test("formatDate converts API dates to input=date values", () => {
  assert.equal(formatDate("20260102"), "2026-01-02");
  assert.equal(formatDate(undefined), undefined);
  assert.equal(formatDate("2026-01-02"), "2026-01-02");
  assert.equal(formatDate("202601"), "202601");
});

test("removeHyphens converts dates to the API's numeric format and rejects invalid input", () => {
  assert.equal(removeHyphens("2026-01-02"), 20260102);
  assert.equal(removeHyphens("invalid"), null);
});

test("isEnd compares the scheduled end against the current time in JST", () => {
  assert.equal(isEnd("2000-01-01T00:00:00Z"), true);
  assert.equal(isEnd("2999-01-01T00:00:00Z"), false);
});

test("isCity recognizes prefectures from the address dataset", () => {
  assert.equal(isCity("東京都"), true);
  assert.equal(isCity("北海道"), true);
  assert.equal(isCity("東京"), false);
  assert.equal(isCity(""), false);
  assert.equal(isCity(undefined), false);
});

test("isFieldsError only accepts arrays of strings", () => {
  assert.equal(isFieldsError([]), true);
  assert.equal(isFieldsError(["必須です"]), true);
  assert.equal(isFieldsError(["必須です", 1]), false);
  assert.equal(isFieldsError("必須です"), false);
  assert.equal(isFieldsError(undefined), false);
});

test("isURL accepts absolute URLs only", () => {
  assert.equal(isURL("https://example.com/path?q=1"), true);
  assert.equal(isURL("http://localhost:3000"), true);
  assert.equal(isURL("example.com"), false);
  assert.equal(isURL(""), false);
  assert.equal(isURL(undefined), false);
});

test("generateMetaTag fills defaults and replaces each overridable tag", () => {
  const defaults = generateMetaTag({});
  assert.deepEqual(defaults, [
    { title: "ことひろ" },
    {
      name: "description",
      content: "ことひろは、言葉を重ねてより良い意思決定を目指すサービスです",
    },
    { property: "og:title", content: "ことひろ" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://www.kotohiro.com" },
    {
      property: "og:image",
      content: "https://www.kotohiro.com/ogp.webp",
    },
    { property: "og:site_name", content: "ことひろ" },
    {
      property: "og:description",
      content: "多種多様な意見や言葉を重ねてよりよい意思決定を目指すサービス",
    },
  ]);

  const custom = generateMetaTag({
    title: "カスタム",
    description: "説明",
    ogp: "/custom.png",
  });
  assert.deepEqual(custom[0], { title: "カスタム" });
  assert.deepEqual(custom[1], { name: "description", content: "説明" });
  assert.deepEqual(custom[5], {
    property: "og:image",
    content: "https://www.kotohiro.com/custom.png",
  });
  assert.deepEqual(custom[7], {
    property: "og:description",
    content: "説明",
  });
});

test("cache shares one in-flight promise per key", async () => {
  let calls = 0;
  const key = `utils-test-${Math.random()}`;
  const load = () => {
    calls++;
    return Promise.resolve(calls);
  };

  const first = cache(key, load);
  const second = cache(key, load);

  assert.equal(first, second);
  assert.equal(await first, 1);
  assert.equal(await cache(key, load), 1);
  assert.equal(calls, 1);
});
