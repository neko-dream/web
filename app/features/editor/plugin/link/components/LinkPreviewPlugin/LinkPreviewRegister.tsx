import { COMMAND_PRIORITY_EDITOR } from "lexical";
import { FC, useEffect } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodeToNearestRoot } from "@lexical/utils";

import { INSERT_LINK_PREVIEW_COMMAND } from "./LinkPreviewCommand";
import { $createLinkPreviewNode, LinkPreviewNode } from "./LinkPreviewNode";

const LinkPreviewRegister: FC = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([LinkPreviewNode])) {
      throw new Error("LinkPreviewNode is not registered on editor");
    }
    return editor.registerCommand<string>(
      INSERT_LINK_PREVIEW_COMMAND,
      (payload) => {
        const node = $createLinkPreviewNode(payload);
        $insertNodeToNearestRoot(node);

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
};

export default LinkPreviewRegister;
