/**
 * openapi ファイルから api クライアントを生成するスクリプト
 */
import { $ } from "bun";

await $`bunx openapi-typescript ./tools/kotohiro.openapi.yaml -o ./app/types/openapi.ts`;
await $`bunx biome format --write ./app/types/openapi.ts`;
