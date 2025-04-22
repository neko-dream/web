import type { ShouldRevalidateFunction } from "react-router";

/**
 * session_idが同じなら再検証しない
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentParams,
  nextParams,
}) => {
  if (!(currentParams || nextParams)) {
    return true;
  }
  if (currentParams === nextParams) {
    return false;
  }

  return true;
};
