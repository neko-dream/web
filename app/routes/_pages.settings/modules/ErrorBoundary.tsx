import type { JSX } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router";
import { ErrorView } from "~/components/layouts/error";
import { LogoHeader } from "~/components/ui/logo-header";

export function ErrorBoundary(): JSX.Element {
  const error = useRouteError();
  const loginRequired =
    isRouteErrorResponse(error) &&
    (error.status === 401 || error.status === 403);

  return (
    <>
      <LogoHeader />
      <ErrorView>
        {loginRequired ? (
          <p>ログイン後使用可能です！</p>
        ) : (
          <>
            <p>ユーザー情報を取得できませんでした。</p>
            <p>時間をおいて、もう一度お試しください。</p>
          </>
        )}
      </ErrorView>
    </>
  );
}
