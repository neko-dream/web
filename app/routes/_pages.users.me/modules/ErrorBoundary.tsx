import type { JSX } from "react";
import { Link, isRouteErrorResponse, useRouteError } from "react-router";
import { ErrorView } from "~/components/layouts/error";

export function ErrorBoundary(): JSX.Element {
  const error = useRouteError();

  if (
    isRouteErrorResponse(error) &&
    (error.status === 401 || error.status === 403)
  ) {
    return (
      <ErrorView>
        <p>ログイン後使用可能です！</p>
        <Link to={"/"} className="mt-2 text-blue-500 underline">
          ログイン画面へ
        </Link>
      </ErrorView>
    );
  }

  return (
    <ErrorView>
      <p>ユーザー情報を取得できませんでした。</p>
      <p>時間をおいて、もう一度お試しください。</p>
    </ErrorView>
  );
}
