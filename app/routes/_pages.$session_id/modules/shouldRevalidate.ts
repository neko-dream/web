import type { ShouldRevalidateFunction } from "react-router";

/**
 * タブ移動などURLが変わるナビゲーションでは、session_idが同じなら再検証しない。
 * 同じURLでの明示的な再検証（useRevalidatorやaction後）は既定の判定に従う。
 * React Routerはparamsを毎回新しいオブジェクトで渡すため、参照比較は使えない。
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentParams,
  nextParams,
  currentUrl,
  nextUrl,
  defaultShouldRevalidate,
}) => {
  const currentSessionID = currentParams.session_id;
  const nextSessionID = nextParams.session_id;

  if (!(currentSessionID && nextSessionID)) {
    return true;
  }

  if (currentSessionID !== nextSessionID) {
    return true;
  }

  // 明示的なrevalidate（useRevalidatorやaction後）は同じURLで呼ばれる。
  // URLが変わらない再検証は既定どおり実行し、タブ移動だけをスキップする。
  const isSameUrl =
    currentUrl.pathname === nextUrl.pathname &&
    currentUrl.search === nextUrl.search;
  return isSameUrl ? defaultShouldRevalidate : false;
};
