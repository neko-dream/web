/* eslint-disable jsx-a11y/iframe-has-title */
import { NodeKey } from "lexical";

import { BlockWithAlignableContents } from "@lexical/react/LexicalBlockWithAlignableContents";

import type { FC } from "react";

type Props = {
  url: string;
  nodeKey: NodeKey;
};

const LinkPreview: FC<Props> = ({ url, nodeKey }) => {
  return (
    <BlockWithAlignableContents
      format={""}
      nodeKey={nodeKey}
      className={{
        base: "relative",
        focus: "relative outline outline-indigo-300",
      }}
    >
      <iframe
        className="hatenablogcard"
        style={{
          width: "100%",
          height: "155px",
          maxWidth: "680px",
        }}
        src={`https://hatenablog-parts.com/embed?url=${url}`}
        width="300"
        height="150"
      ></iframe>
    </BlockWithAlignableContents>
  );
};

export default LinkPreview;
