import type { Editor } from "@tiptap/core";
import { useRef } from "react";
import { Picture } from "~/components/icons";

type Props = {
  onImageLoad: (file: File) => Promise<string>;
  editor: Editor;
};

export const CustomaizedImageToolbarItem = ({ editor, onImageLoad }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => inputRef.current?.click();

  return (
    <>
      <button onClick={handleClick} type="button" className="cursor-pointer">
        <Picture className="h-5 w-5 fill-mt-gray-600" />
      </button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={async (e) => {
          if (
            !e.target.files ||
            e.target.files.length === 0 ||
            !e.target.files[0]
          ) {
            return;
          }
          const file = e.target.files[0];
          const src = await onImageLoad(file);
          editor.chain().focus().setImage({ src }).run();
        }}
      />
    </>
  );
};
