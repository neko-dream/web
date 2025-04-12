import type { JSX } from "react";
import { useRouteError } from "react-router";
import { ErrorView } from "~/components/layouts/error";

export function ErrorBoundary(): JSX.Element {
  const error = useRouteError();

  if (error instanceof Response && error.status === 404) {
    return (
      <ErrorView>
        <p>お探しのトークセッションは </p>
        <p>見つかりませんでした...</p>
        <p className="mt-2 text-gray-700 text-xs">右上の 🔍 から探せるよ！</p>
      </ErrorView>
    );
  }

  return <ErrorView />;
}
