import type { JSX } from "react";
import { ErrorView } from "~/components/layouts/error";

export function ErrorBoundary(): JSX.Element {
  return <ErrorView />;
}
