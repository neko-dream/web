import type { FC } from "react";
import { useState } from "react";
import useResizable from "../../../hooks/useResizable";

type Props = {
  alt: string;
  height: "inherit" | number;
  src: string;
  width: "inherit" | number;
  isSelected?: boolean;
};

const Image: FC<Props> = ({ src, width, height, alt, isSelected }) => {
  const [imgElement, setImgElement] = useState<HTMLImageElement>();
  const { startDrag, resizeEvent } = useResizable({ imgElement });
  const { isResizing } = resizeEvent || {};
  const [isError, setIsError] = useState(false);
  return (
    <span className={`group relative flex ${isSelected && "outline"}`}>
      <span
        onPointerDown={(e) => {
          startDrag(e, "left");
        }}
        className={`absolute top-1/2 left-4 h-20 w-2 -translate-x-1/2 -translate-y-1/2 cursor-w-resize rounded border border-gray-500 bg-gray-500 opacity-0 transition-opacity duration-300 ${!isResizing && !isError && "group-hover:opacity-100"}`}
      />
      <img
        ref={(elm) => {
          if (elm) {
            setImgElement(elm);
          }
        }}
        alt={alt}
        width={width}
        height={height}
        src={src}
        onError={() => {
          setIsError(true);
        }}
      />
      <span
        onPointerDown={(e) => {
          startDrag(e, "right");
        }}
        className={`absolute top-1/2 right-4 h-20 w-2 -translate-y-1/2 translate-x-1/2 cursor-e-resize rounded border border-gray-500 bg-gray-500 opacity-0 transition-opacity duration-300 ${!isResizing && !isError && "group-hover:opacity-100"}`}
      />
    </span>
  );
};

export default Image;
