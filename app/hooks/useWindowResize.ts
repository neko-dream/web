import { useEffect, useState } from "react";

/**
 * 画面サイズを取得するカスタムフック
 * FIXME: debounceを使うようにしたい
 */
export const useWindowResize = (num = 374) => {
  const [windowWidth, setWindowWidth] = useState(num);

  useEffect(() => {
    const _windowWidth = window.innerWidth;
    setWindowWidth(_windowWidth);
    const resize = () => {
      const _windowWidth = window.innerWidth;
      setWindowWidth(_windowWidth);
    };
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  return windowWidth;
};
