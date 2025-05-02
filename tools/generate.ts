/**
 * 参考元
 * Fileがstring型になってしまう問題の解決方法
 * https://qiita.com/hagoromo2000/items/a862b3880654100d53fe
 */

import { $ } from "bun";
import openapiTS, { astToString } from "openapi-typescript";
import { factory } from "typescript";

const BLOB = factory.createTypeReferenceNode(factory.createIdentifier("Blob"));

const ast = await openapiTS(
  // OpenAPI スキーマファイルのパスを指定
  new URL("./kotohiro.openapi.yaml", import.meta.url),
  {
    transform(schemaObject) {
      // binary format の場合、Blob型に変換
      if (schemaObject.format === "binary") {
        return BLOB;
      }
    },
  },
);

const contents = astToString(ast);

// 生成したい場所にファイルを出力
await Bun.write("./app/types/openapi.ts", contents);

await $`bunx biome format --write ./app/types/openapi.ts`;
