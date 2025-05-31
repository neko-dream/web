import { useMemo } from "react";

/**
 * 慣性スクロールする
 */
const inertiaScroll = ({
  element,
  initialSpeed,
  onFinishScroll,
}: {
  /** スクロール対象の要素 */
  element: HTMLElement;
  /** 初速 */
  initialSpeed: number;
  /** スクロールが完了した時 */
  onFinishScroll: () => void;
}): (() => void) => {
  let speed = initialSpeed;
  let frameId: number | undefined;
  const frame = () => {
    element.scrollTop += speed;
    speed *= 0.85;
    if (Math.abs(speed) < 0.5) {
      onFinishScroll();
      return;
    }
    frameId = requestAnimationFrame(frame);
  };
  frame();

  const cancelInertiaScroll = () => {
    if (frameId != null) {
      cancelAnimationFrame(frameId);
    }
  };
  return cancelInertiaScroll;
};

/**
 * スクロールをJS側で制御するカスタムフック
 */
export const useHandleScroll = ({
  onFinishScroll,
}: {
  /** スクロールが終了した時 */
  onFinishScroll: () => void;
}) => {
  const ref = useMemo(() => {
    let cachedElement: HTMLElement | null = null;
    let timerId: number | undefined;
    const handleWheel = (event: WheelEvent) => {
      event.stopPropagation();
      if (cachedElement == null) {
        return;
      }
      cachedElement.scrollTop += event.deltaY;

      clearTimeout(timerId);
      timerId = window.setTimeout(() => {
        onFinishScroll();
      }, 100);
    };

    /** タッチ開始座標 */
    let startPosY: number | null = null;
    /** タッチ開始時のスクロール位置 */
    let startScrollTop: number | null = null;
    /** タッチ開始時刻 */
    let touchStartTime: number | null = null;
    /** タッチ操作の最終時刻 */
    let touchLastMoveTime: number | null = null;
    /** 慣性スクロールをキャンセルするメソッド */
    let cancelInertiaScroll: (() => void) | undefined;
    const handleTouchStart = (event: TouchEvent | MouseEvent) => {
      event.preventDefault();
      if (cancelInertiaScroll != null) {
        cancelInertiaScroll();
        cancelInertiaScroll = undefined;
      }
      startPosY =
        "touches" in event
          ? (event.touches[0]?.clientY ?? null)
          : event.clientY;
      startScrollTop = cachedElement?.scrollTop ?? null;
      touchStartTime = performance.now();
    };
    const handleTouchMove = (event: TouchEvent | MouseEvent) => {
      if (
        startPosY == null ||
        startScrollTop == null ||
        cachedElement == null
      ) {
        return;
      }
      const posY =
        "touches" in event ? event.touches[0]?.clientY : event.clientY;
      if (posY == null) {
        return;
      }
      const diff = startPosY - posY;
      cachedElement.scrollTop = startScrollTop + diff;
      touchLastMoveTime = performance.now();
    };
    const handleTouchEnd = (event: TouchEvent | MouseEvent) => {
      const reset = () => {
        startPosY = null;
        startScrollTop = null;
        touchStartTime = null;
        touchLastMoveTime = null;
        cancelInertiaScroll = undefined;
      };
      event.preventDefault();
      const endTime = performance.now();
      if (
        cachedElement == null ||
        startPosY == null ||
        startScrollTop == null ||
        touchStartTime == null ||
        touchLastMoveTime == null ||
        // touchmoveからの経過時間が50ms以上だった場合も慣性スクロールは行わず、その場でスクロールを終了する
        endTime - touchLastMoveTime > 50
      ) {
        reset();
        onFinishScroll();
        return;
      }

      const elapsedTime = endTime - touchStartTime;
      const distance = cachedElement.scrollTop - startScrollTop;
      reset();
      cancelInertiaScroll = inertiaScroll({
        element: cachedElement,
        initialSpeed: (20 * distance) / elapsedTime,
        onFinishScroll,
      });
    };
    return (element: HTMLElement | null) => {
      if (element == null) {
        if (cachedElement != null) {
          cachedElement.removeEventListener("wheel", handleWheel);
          cachedElement.removeEventListener("touchstart", handleTouchStart);
          cachedElement.removeEventListener("touchmove", handleTouchMove);
          cachedElement.removeEventListener("touchend", handleTouchEnd);
          cachedElement.removeEventListener("mousedown", handleTouchStart);
          cachedElement.removeEventListener("mousemove", handleTouchMove);
          cachedElement.removeEventListener("mouseup", handleTouchEnd);
          cachedElement.removeEventListener("mouseleave", handleTouchEnd);
        }
        clearTimeout(timerId);
        cachedElement = null;
        return;
      }

      cachedElement = element;
      cachedElement.addEventListener("wheel", handleWheel);
      cachedElement.addEventListener("touchstart", handleTouchStart);
      cachedElement.addEventListener("touchmove", handleTouchMove);
      cachedElement.addEventListener("touchend", handleTouchEnd);
      cachedElement.addEventListener("mousedown", handleTouchStart);
      cachedElement.addEventListener("mousemove", handleTouchMove);
      cachedElement.addEventListener("mouseup", handleTouchEnd);
      cachedElement.addEventListener("mouseleave", handleTouchEnd);
    };
  }, [onFinishScroll]);

  return {
    ref,
  };
};
