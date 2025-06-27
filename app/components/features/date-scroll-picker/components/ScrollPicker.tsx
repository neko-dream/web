import { CSSProperties, useCallback, useEffect, useRef } from "react";
// Removed MUI imports: Box, MenuList, MenuItem, useForkRef

import { ScrollPickerItem } from "./ScrollPickerItem"; // Assuming this is MUI-free
import { SCROLL_ITEM_HEIGHT } from "./constants/ScrollItemHeight";
import { useHandleScroll } from "./hooks/useHandleScroll";
import { ScrollItem } from "./types/ScrollItemType";
import { findSelectableScrollItemValue } from "./utils/findSelectableScrollItemValue";
import { scrollToItemValue } from "./utils/scrollToItemValue";

// Note: Styling for pseudo-elements (::before, ::after) for shadows
// needs to be handled with CSS classes as it cannot be done with inline styles.
// Example CSS would be provided in the comments within the component.

export type ScrollPickerProps<V> = {
  /** 選択中の値 */
  value: V;
  /** 選択リスト */
  items: ScrollItem<V>[];
  /** スクローラーの高さ */
  height?: number;
  /**
   * 値が変更された時
   * @param newValue - 新しい値
   */
  onChangeValue: (newValue: V) => void;
};

export const ScrollPicker = function <V>({
  value,
  items,
  height = 5 * SCROLL_ITEM_HEIGHT,
  onChangeValue,
}: ScrollPickerProps<V>) {
  const isFirstScrollRef = useRef<boolean>(true);
  const elMenuListRef = useRef<HTMLDivElement | null>(null); // Changed to HTMLDivElement
  const paddingHeight = (height - SCROLL_ITEM_HEIGHT) / 2;

  useEffect(() => {
    const elMenuList = elMenuListRef.current;
    if (elMenuList == null) {
      return;
    }

    const isFirstScroll = isFirstScrollRef.current;
    isFirstScrollRef.current = false;

    scrollToItemValue(elMenuList, items, value, {
      disableAnimation: isFirstScroll,
    });
  }, [items, value]);

  const { ref: refScrollerHook } = useHandleScroll({
    onFinishScroll: () => {
      const elMenuList = elMenuListRef.current;
      if (elMenuList == null) {
        return;
      }
      const itemValue = findSelectableScrollItemValue(elMenuList, value, items);
      if (itemValue === undefined) {
        return;
      }
      if (itemValue === value) {
        scrollToItemValue(elMenuList, items, itemValue);
        return;
      }
      onChangeValue(itemValue);
    },
  });

  const handleRef = useCallback(
    (node: HTMLDivElement | null) => {
      elMenuListRef.current = node;
      if (typeof refScrollerHook === "function") {
        refScrollerHook(node);
      } else if (refScrollerHook) {
        (
          refScrollerHook as React.MutableRefObject<HTMLElement | null>
        ).current = node;
      }
    },
    [refScrollerHook],
  );

  const containerStyle: CSSProperties = {
    position: "relative",
    height,
  };

  const menuListStyle: CSSProperties = {
    height: "100%",
    overflowY: "scroll",
    padding: 0,
    scrollbarWidth: "none", // Firefox
    msOverflowStyle: "none", // IE and Edge
  };

  const paddingItemStyle: CSSProperties = {
    height: paddingHeight,
    minHeight: "auto",
  };

  return (
    <div style={containerStyle} className="scroll-picker-container">
      <div
        ref={handleRef}
        style={menuListStyle}
        className="scroll-picker-menu-list"
      >
        <div style={paddingItemStyle} />
        {items.map((item) => (
          <ScrollPickerItem
            key={String(item.value)}
            selected={item.value === value}
            disabled={item.disabled}
            onJustClick={() => {
              if (!item.disabled) {
                onChangeValue(item.value);
              }
            }}
          >
            {item.label}
          </ScrollPickerItem>
        ))}
        <div style={paddingItemStyle} />
      </div>
    </div>
  );
};
