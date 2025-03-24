import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

/**
 * 動いていない
 */
export function FocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // エディタのルート要素を取得するための関数
    const getRootElement = () => {
      return editor.getRootElement();
    };

    // クリックハンドラー
    const handleClick = () => {
      editor.focus();
    };

    // エディタのルート要素にクリックイベントリスナーを追加
    const rootElement = getRootElement();
    if (rootElement) {
      rootElement.addEventListener("click", handleClick);
    }

    // クリーンアップ関数
    return () => {
      const rootElement = getRootElement();
      if (rootElement) {
        rootElement.removeEventListener("click", handleClick);
      }
    };
  }, [editor]);

  return null;
}
