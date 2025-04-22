import type { JSX } from "react";
import { Link, isRouteErrorResponse, useRouteError } from "react-router";
import { ErrorView } from "~/components/layouts/error";

export function ErrorBoundary(): JSX.Element {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <ErrorView>
        <p>ログイン後使用可能です！</p>
        <Link to={"/"} className="mt-2 text-blue-500 underline">
          ログイン画面へ
        </Link>
      </ErrorView>
    );
  }

  return <ErrorView />;
}
