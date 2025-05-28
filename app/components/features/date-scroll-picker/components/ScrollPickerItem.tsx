import type { FC, ReactNode, CSSProperties } from "react";
// Removed MUI imports: ListItemText, MenuItem

import { SCROLL_ITEM_HEIGHT } from "./constants/ScrollItemHeight";
import { useJustClick } from "./hooks/useJustClick";

export type ScrollPickerItemProps = {
  /** 選択されているか */
  selected?: boolean;
  /** 非活性か */
  disabled?: boolean;
  /** 子要素 */
  children: ReactNode;
  /**
   * ドラッグ操作は無効にして純粋なクリック操作のみを検知した時
   */
  onJustClick: () => void;
};

export const ScrollPickerItem: FC<ScrollPickerItemProps> = ({
  selected,
  disabled,
  children,
  onJustClick,
}) => {
  const { ref } = useJustClick({
    disabled,
    onJustClick: () => {
      // ScrollPickerのスクロールの判定後にclickイベントを発火させたいのでワンサイクル遅らせる
      setTimeout(() => {
        onJustClick();
      });
    },
  });

  const itemStyle: CSSProperties = {
    height: SCROLL_ITEM_HEIGHT,
    minHeight: "auto",
    textAlign: "center",
    display: "flex", // For centering content like ListItemText
    alignItems: "center", // For centering content like ListItemText
    justifyContent: "center", // For centering content like ListItemText
    paddingLeft: "16px", // Default MenuItem padding
    paddingRight: "16px", // Default MenuItem padding
    boxSizing: "border-box",
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.5 : 1,
    backgroundColor: selected ? "rgba(25, 118, 210, 0.08)" : "transparent",
  };

  const textStyle: CSSProperties = {
    fontWeight: selected ? "bold" : undefined,
  };

  return (
    <div
      ref={ref}
      style={itemStyle}
      role="option"
      aria-selected={selected}
      aria-disabled={disabled}
    >
      <span style={textStyle}>{children}</span>
    </div>
  );
};
