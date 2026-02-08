/**
 * 参考元
 * Fileがstring型になってしまう問題の解決方法
 * https://qiita.com/hagoromo2000/items/a862b3880654100d53fe
 */

import { execSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
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
await writeFile("./app/types/openapi.ts", contents);

execSync("pnpm dlx biome format --write ./app/types/openapi.ts", { stdio: "inherit" });
