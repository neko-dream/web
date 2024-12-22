import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import Error from "~/components/Error";

export function ErrorBoundary(): JSX.Element {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Error>
        <p>ログイン後使用可能です！</p>
        <Link to={"/"} className="mt-2 text-blue-500 underline">
          ログイン画面へ
        </Link>
      </Error>
    );
  }

  return <Error />;
}
