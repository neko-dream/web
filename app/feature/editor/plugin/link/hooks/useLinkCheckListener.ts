import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  ElementNode,
  RangeSelection,
  TextNode,
} from "lexical";
import { useEffect, useState } from "react";
import { $isAtNodeEnd } from "@lexical/selection";
import { $isLinkNode } from "@lexical/link";

export function getSelectedNode(
  selection: RangeSelection,
): TextNode | ElementNode {
  const anchor = selection.anchor; // starting point (cursor point)
  const focus = selection.focus; // selection(dragging) point
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? anchorNode : focusNode;
  }
}

export const useLinkListener = () => {
  const [link, setLink] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          setIsEmpty(true);
          setLink("");
          return;
        }
        const node = getSelectedNode(selection);
        const parent = node.getParent();
        const isEmpty = !parent?.getTextContent();
        setIsEmpty(isEmpty);
        if ($isLinkNode(parent)) {
          setLink(parent.getURL());
        } else if ($isLinkNode(node) && parent) {
          setLink(node.getURL());
        } else {
          setLink("");
        }
      });
    });
  }, [editor]);

  return {
    link,
    isEmpty,
  };
};
