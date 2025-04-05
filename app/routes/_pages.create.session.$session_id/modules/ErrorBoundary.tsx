import type { JSX } from "react";
import ErrorView from "~/components/Error";

export function ErrorBoundary(): JSX.Element {
  return <ErrorView>お探しのセッションは見つかりません...</ErrorView>;
}
