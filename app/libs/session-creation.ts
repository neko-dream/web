import type { components } from "../types/openapi.ts";

type Permissions = components["schemas"]["UserPermissions"];

export function canCreateTalkSession(
  permissions?: Permissions | null,
): boolean {
  return permissions?.canCreateTalkSession === true;
}

export function requireSessionCreationPermission(result: {
  data?: { permissions: Permissions };
  response: Response;
}): void {
  if (result.response.ok && canCreateTalkSession(result.data?.permissions)) {
    return;
  }
  const unavailable = result.response.status >= 500;
  throw new Response(
    unavailable
      ? "作成権限を確認できませんでした"
      : "セッション作成は許可されていません",
    { status: unavailable ? 503 : 403 },
  );
}
