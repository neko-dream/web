import { Code } from "@tiptap/extension-code";
import { Document } from "@tiptap/extension-document";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Text } from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect } from "react";
import { ImageResize } from "tiptap-extension-resize-image";
import { CustomaizedDropcursor } from "./extensions/dropcursor";
import { CustomaizedImageToolbarItem } from "./extensions/images";
import { CustomaizedLink, CustomaizedLinkToolbarItem } from "./extensions/link";
import "./index.css";

type Props = {
  defaultValue?: string | null | undefined;
  onImageLoad: (file: File) => Promise<string>;
  onUpdate: (html: string) => void;
};

export const RichTextEditor = ({
  onImageLoad,
  onUpdate,
  defaultValue,
}: Props) => {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Code,
      ImageResize,
      CustomaizedLink,
      // CustomaizedPlaceholder,
      CustomaizedDropcursor,
    ],
    content: defaultValue,
  });

  useEffect(() => {
    editor?.on("update", () => {
      onUpdate(editor?.getHTML() || "");
    });
  }, [editor, onUpdate]);

  if (!editor) {
    return null;
  }

  return (
    <div className="rounded border border-gray-300 bg-white">
      <div className="flex justify-end space-x-2 px-2 pt-2">
        <CustomaizedLinkToolbarItem editor={editor} />
        <CustomaizedImageToolbarItem
          editor={editor}
          onImageLoad={onImageLoad}
        />
      </div>
      <EditorContent editor={editor} className="px-2 outline-none" />
    </div>
  );
};
