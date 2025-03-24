import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { FC } from "react";
import { urlRegex } from "../utils/url";

const LexicalAutoLinkPlugin: FC = () => (
  <AutoLinkPlugin
    matchers={[
      (text: string) => {
        const match = urlRegex.exec(text);
        if (match === null) {
          return null;
        }
        const fullMatch = match[0];
        return {
          index: match.index,
          length: fullMatch.length,
          text: fullMatch,
          url: fullMatch.startsWith("http")
            ? fullMatch
            : `https://${fullMatch}`,
        };
      },
    ]}
  />
);

export default LexicalAutoLinkPlugin;
