import Error from "~/components/Error";
import { JSX } from "react";

export function ErrorBoundary(): JSX.Element {
  return <Error>お探しのセッションは見つかりません...</Error>;
}
