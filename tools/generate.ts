/**
 * openapi ファイルから api クライアントを生成するスクリプト
 */
import { $ } from "bun";

await $`npx openapi-typescript ./tools/kotohiro.openapi.yaml -o ./app/types/openapi.ts`; // 1256
