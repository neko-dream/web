import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { $generateHtmlFromNodes } from "@lexical/html";

type Props = {
  onUpdate: (html: string) => void;
};

export function OutputPlugin({ onUpdate }: Props) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.registerUpdateListener(() => {
      editor.read(() => {
        const contentAsHTML = $generateHtmlFromNodes(editor);
        onUpdate(contentAsHTML);
      });
    });
  }, [editor, onUpdate]);

  return null;
}
