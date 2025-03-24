import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_IMAGE_COMMAND } from "../../utils/InsertImageCommand";
import { Picture } from "~/components/Icons";

type Props = {
  onImageLoad: (file: File) => Promise<string>;
};

const ImageToolBarItem = ({ onImageLoad }: Props) => {
  const [editor] = useLexicalComposerContext();
  return (
    <label
      className="flex cursor-pointer pr-1"
      htmlFor="file-upload"
      aria-label="image upload"
    >
      <Picture className="h-5 w-5" />
      <input
        id="file-upload"
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
          const path = await onImageLoad(file);
          editor.update(() => {
            editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
              altText: file.name,
              src: path,
            });
          });
        }}
      />
    </label>
  );
};

export default ImageToolBarItem;
