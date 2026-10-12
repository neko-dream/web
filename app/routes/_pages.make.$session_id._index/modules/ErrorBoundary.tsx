import type { JSX } from "react";
import {
  Link,
  isRouteErrorResponse,
  useParams,
  useRouteError,
} from "react-router";
import { ErrorView } from "~/components/layouts/error";
import { button } from "~/components/ui/button";

export function ErrorBoundary(): JSX.Element {
  const error = useRouteError();
  const { session_id } = useParams();
  if (session_id === "new" && isRouteErrorResponse(error)) {
    if (error.status === 401) {
      return (
        <ErrorView>
          <p>ログインしてください</p>
          <Link
            className={button({
              color: "primary",
              className: "mt-4 flex items-center",
            })}
            to="/"
          >
            ログイン画面へ
          </Link>
        </ErrorView>
      );
    }
    if (error.status === 403) {
      return (
        <ErrorView>
          <p>セッション作成は許可されていません</p>
          <Link
            className={button({
              color: "primary",
              className: "mt-4 flex items-center",
            })}
            to="/home"
          >
            ホームへ戻る
          </Link>
        </ErrorView>
      );
    }
    if (error.status >= 500) {
      return (
        <ErrorView>
          <p>
            作成権限を確認できませんでした。時間をおいて再度お試しください。
          </p>
          <Link
            className={button({
              color: "primary",
              className: "mt-4 flex items-center",
            })}
            to="/home"
          >
            ホームへ戻る
          </Link>
        </ErrorView>
      );
    }
  }
  return <ErrorView>お探しのセッションは見つかりません...</ErrorView>;
}
