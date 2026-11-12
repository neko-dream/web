import type { JSX } from "react";
import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { ErrorView } from "~/components/layouts/error";
import { button } from "~/components/ui/button";
import { forbidden } from "~/utils/response";

export function ErrorBoundary(): JSX.Element {
  const error = useRouteError();

  if (!isRouteErrorResponse(error)) {
    return <ErrorView />;
  }

  if (error.status === forbidden.code) {
    return (
      <ErrorView>
        <p className="text-gray-700">
          このページはログインすることで見れます🙇‍♀️
        </p>
        <div className="mt-4" />
      </ErrorView>
    );
  }

  return (
    <ErrorView>
      <p className="text-gray-700">正常にデータを取得できませんでした🙇‍♀️</p>
      <Link
        to={"../opinions"}
        className={button({
          color: "primary",
          className: "mx-auto mt-6 block whitespace-nowrap",
        })}
      >
        みんなの意見を見る
      </Link>
    </ErrorView>
  );
}
