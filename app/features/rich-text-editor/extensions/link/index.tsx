import type { Editor } from "@tiptap/core";
import { Link } from "@tiptap/extension-link";
import { useRef, useState } from "react";
import { tv } from "tailwind-variants";
import { Button } from "~/components/Button";
import { Link as LinkIcon } from "~/components/Icons";
import { CenterDialog } from "~/features/modal";
import { isURL } from "~/libs/isURL";

export const CustomaizedLink = Link.configure({
  openOnClick: true,
  autolink: true,
  defaultProtocol: "https",
  protocols: ["http", "https"],
});

const linkIcon = tv({
  base: "h-5 w-5 fill-mt-gray-600",
  variants: {
    active: { true: "fill-blue-400" },
  },
});

export const CustomaizedLinkToolbarItem = ({ editor }: { editor: Editor }) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (!inputRef.current) {
      return;
    }
    const value = inputRef.current.value;
    const formatedURL = isURL(value) ? value : `https://${value}`;

    try {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: formatedURL })
        .run();
    } catch (e) {
      alert(e);
    }
  };

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        <LinkIcon className={linkIcon({ active: editor.isActive("link") })} />
      </button>
      <CenterDialog isOpen={isOpen} onOpenChange={setIsOpen}>
        <div className="flex w-[300px] max-w-[300px] flex-col gap-1">
          <label htmlFor="url" className="text-mt-gray-600 text-xs">
            リンクの挿入 https://...
          </label>
          <textarea
            id="url"
            ref={inputRef}
            defaultValue={editor?.getAttributes("link").href}
            className="rounded border border-gray-300 px-2 py-1 outline-none focus:outline-none"
          />
          <Button
            color="agree"
            onClick={() => {
              handleSubmit();
              setIsOpen(false);
            }}
            className="mt-4 ml-auto inline-block h-8"
          >
            挿入
          </Button>
        </div>
      </CenterDialog>
    </>
  );
};
