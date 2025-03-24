import { NodeKey } from "lexical";

import { BlockWithAlignableContents } from "@lexical/react/LexicalBlockWithAlignableContents";

import Image from "./Image";

import type { FC } from "react";

type Props = {
  alt: string;
  height: "inherit" | number;
  src: string;
  width: "inherit" | number;
  nodeKey: NodeKey;
};

const ImagePreview: FC<Props> = ({ nodeKey, alt, ...others }) => {
  return (
    <BlockWithAlignableContents
      format={""}
      nodeKey={nodeKey}
      className={{
        base: "relative",
        focus: "relative outline outline-indigo-300",
      }}
    >
      <Image alt={alt} {...others} />
    </BlockWithAlignableContents>
  );
};

export default ImagePreview;
