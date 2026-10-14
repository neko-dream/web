import type { components, operations } from "~/types/openapi";

type Permissions = components["schemas"]["UserPermissions"];

export function canCreateTalkSession(
  permissions?: Permissions | null,
): boolean {
  return permissions?.canCreateTalkSession === true;
}

type CurrentUser =
  operations["getCurrentUser"]["responses"][200]["content"]["application/json"];

export function requireSessionCreationPermission(result: {
  data?: CurrentUser;
  response: Response;
}): void {
  if (result.response.ok && canCreateTalkSession(result.data?.permissions)) {
    return;
  }
  const status = result.response.status;
  const unavailable = status >= 500;
  const unauthenticated = status === 401 || (status === 403 && !result.data);
  throw new Response(
    unavailable
      ? "作成権限を確認できませんでした"
      : "セッション作成は許可されていません",
    { status: unavailable ? 503 : unauthenticated ? 401 : 403 },
  );
}
