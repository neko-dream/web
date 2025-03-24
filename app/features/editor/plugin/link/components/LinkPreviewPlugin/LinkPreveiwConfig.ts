import type {
  EmbedConfig,
  EmbedMatchResult,
} from "@lexical/react/LexicalAutoEmbedPlugin";
import type { LexicalEditor } from "lexical";
import { INSERT_LINK_PREVIEW_COMMAND } from "./LinkPreviewCommand";

export const LinkPreviewConfig: EmbedConfig = {
  insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
    editor.dispatchCommand(INSERT_LINK_PREVIEW_COMMAND, result.url);
  },

  // 今回、URLから情報を抽出するわけではないのでそのままurlを返す
  parseUrl: async (url: string) => {
    return {
      url,
      id: "",
    };
  },

  type: "link-preview",
};
