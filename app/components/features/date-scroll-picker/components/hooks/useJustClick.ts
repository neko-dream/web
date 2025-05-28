import { useEffect, useState, useRef } from "react";

export type UseJustClickArgs = {
  /**
   * ドラッグと判定される変化量(px)
   * @default 5
   */
  dragThreshold?: number;
  /** 機能をOFFにするか */
  disabled?: boolean;
  /**
   * クリック時
   */
  onJustClick: () => void;
};

export type UseJustClickReturn = {
  /** 監視対象のDOMのref */
  ref: (element: HTMLElement | null) => void;
};

/**
 * ドラッグ操作は無効にして、純粋なクリック操作のみを検知するhooks
 */
export const useJustClick = ({
  dragThreshold = 5,
  disabled,
  onJustClick,
}: UseJustClickArgs): UseJustClickReturn => {
  const [element, setElement] = useState<HTMLElement | null>(null);

  // depsの対象に含まれないようにrefで保持する
  const onJustClickRef = useRef(onJustClick);
  onJustClickRef.current = onJustClick;

  useEffect(() => {
    if (element == null || disabled) {
      return;
    }

    /** クリック開始座標 */
    let startPos: { x: number; y: number } | null = null;
    const handlePointerDown = (event: PointerEvent) => {
      // イベントをブロックするとmousedownイベントが発火しなくなるのでpreventDefaultはしない
      // event.preventDefault();
      startPos = {
        x: event.clientX,
        y: event.clientY,
      };
    };
    const handlePointerUp = (event: PointerEvent) => {
      // イベントをブロックするとmouseupイベントが発火しなくなるのでpreventDefaultはしない
      // event.preventDefault();
      if (startPos == null) {
        return;
      }

      // ドラッグの距離がdragThresholdを超えたらドラッグ判定にしてクリックイベントを発火しない
      const dx = startPos.x - event.clientX;
      const dy = startPos.y - event.clientY;
      startPos = null;
      if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) {
        return;
      }

      onJustClickRef.current();
    };
    const handlePointerLeave = () => {
      // ポインタが外れてしまった時はクリック開始座標をリセットする
      startPos = null;
    };

    element.addEventListener("pointerdown", handlePointerDown);
    element.addEventListener("pointerup", handlePointerUp);
    element.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      element.removeEventListener("pointerdown", handlePointerDown);
      element.removeEventListener("pointerup", handlePointerUp);
      element.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [element, disabled, dragThreshold]);

  return {
    ref: setElement,
  };
};
