import type { LexicalCommand } from "lexical";
import { createCommand } from "lexical";

export const INSERT_LINK_PREVIEW_COMMAND: LexicalCommand<string> =
  createCommand("INSERT_LINK_PREVIEW_COMMAND");
