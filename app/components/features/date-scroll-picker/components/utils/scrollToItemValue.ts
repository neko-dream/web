import { ScrollItem } from "../types/ScrollItemType";
import { SCROLL_ITEM_HEIGHT } from "../constants/ScrollItemHeight";

/**
 * 対処の値にスクロールする
 * @param elMenuList - ul要素
 * @param items - 項目リスト
 * @param targetValue - スクロール先の値
 * @param options - オプション
 */
export const scrollToItemValue = function <V>(
  elMenuList: HTMLElement,
  items: ScrollItem<V>[],
  targetValue: V,
  {
    disableAnimation,
  }: {
    /** アニメーションせず即時移動させるか */
    disableAnimation?: boolean;
  } = {}
) {
  const targetIndex = items.findIndex((item) => item.value === targetValue);
  if (targetIndex < 0) {
    return;
  }

  const scrollTop = targetIndex * SCROLL_ITEM_HEIGHT;
  if (disableAnimation) {
    elMenuList.scrollTop = scrollTop;
    return;
  }
  elMenuList.scrollTo({
    top: scrollTop,
    behavior: "smooth",
  });
};
