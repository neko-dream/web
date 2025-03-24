import { useCallback, useRef, useState } from "react";

type Props = {
  imgElement?: HTMLElement | null;
  maxWidth?: number;
  minWidth?: number;
};

export type Direction = "left" | "right";

type PositionType = {
  currentHeight: number;
  currentWidth: number;
  direction: Direction;
  isResizing: boolean;
  startHeight: number;
  startWidth: number;
  ratio: number;
  startX: number;
  startY: number;
};

type ResizeEvent = {
  dir: Direction;
  isResizing: boolean;
};

const useResizable = ({
  imgElement,
  maxWidth = 4096,
  minWidth = 100,
}: Props) => {
  const [resizeEvent, setResizeEvent] = useState<ResizeEvent>();
  const positionRef = useRef<PositionType>({
    currentHeight: 0,
    currentWidth: 0,
    direction: "left",
    isResizing: false,
    startHeight: 0,
    startWidth: 0,
    ratio: 1,
    startX: 0,
    startY: 0,
  });

  const clamp = useCallback(
    (width: number) => Math.max(Math.min(maxWidth, width), minWidth),
    [minWidth, maxWidth],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!imgElement) {
        return;
      }
      const position = positionRef.current;
      const diff = event.clientX - position.startX;
      const nextWidth =
        position.direction === "left"
          ? clamp(position.startWidth - diff)
          : clamp(position.startWidth + diff);
      const height = Math.round((nextWidth * 1.0) / position.ratio);
      imgElement.style.width = `${nextWidth}px`;
      imgElement.style.height = `${height}px`;
      position.currentHeight = height;
      position.currentWidth = nextWidth;
    },
    [imgElement, clamp],
  );

  const handlePointerUp = useCallback(() => {
    if (!imgElement) {
      return;
    }
    const position = positionRef.current;
    position.startWidth = 0;
    position.startHeight = 0;
    position.ratio = 0;
    position.startX = 0;
    position.startY = 0;
    position.currentWidth = 0;
    position.currentHeight = 0;
    position.isResizing = false;

    if (document.body !== null) {
      document.body.style.setProperty("cursor", "default");
    }

    setResizeEvent({ dir: "left", isResizing: false });

    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
  }, [imgElement, handlePointerMove]);

  const startDrag = useCallback(
    (event: React.PointerEvent, dir: Direction) => {
      if (!imgElement) {
        return;
      }
      const { width, height } = imgElement.getBoundingClientRect();
      const position = positionRef.current;
      position.startWidth = width;
      position.startHeight = height;
      position.currentWidth = width;
      position.currentHeight = height;
      position.ratio = width / height;
      position.startX = event.clientX;
      position.startY = event.clientY;
      position.isResizing = true;
      position.direction = dir;

      if (document.body !== null) {
        document.body.style.setProperty(
          "cursor",
          `${dir === "left" ? "w" : "e"}-resize`,
          "important",
        );
      }

      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);

      setResizeEvent({ dir, isResizing: true });
    },
    [imgElement, handlePointerUp, handlePointerMove],
  );

  return {
    resizeEvent,
    startDrag,
  };
};

export default useResizable;
