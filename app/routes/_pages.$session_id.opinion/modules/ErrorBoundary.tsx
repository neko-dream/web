import type { JSX } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router";
import { ErrorView } from "~/components/layouts/error";

export function ErrorBoundary(): JSX.Element {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <ErrorView>
        <p>お探しの意見は</p>
        <p>見つかりませんでした...</p>
        <p className="mt-2 text-gray-700 text-xs">
          右上の 🔍 からトークセッションは探せるよ！
        </p>
      </ErrorView>
    );
  }

  return <ErrorView />;
}
