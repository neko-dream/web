import LexicalEditor from "./editor";
import {
  ImageNode,
  ImageRegister,
  ImageToolbarItem,
  ClipboardImageHandler,
} from "./plugin/image";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import LinkPlugins, { LinkToolbarItem } from "./plugin/link";
import { validateUrl } from "./plugin/link/utils/url";
import { LinkPlugin as LexicalLinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { OutputPlugin } from "./plugin/output";
import { FocusPlugin } from "./plugin/focus";

type Props = {
  onUpdate: (html: string) => void;
  onImageLoad: (file: File) => Promise<string>;
};

export const Editor = ({ onUpdate, onImageLoad }: Props) => {
  return (
    <LexicalEditor
      customNodes={[
        ImageNode,
        LinkNode, // エディタ上にリンクノードを生成するために必要
        AutoLinkNode, // エディタ上のURLをリンクノードに変換するために必要
        // LinkPreviewNode, // プレビュー表示のために必要
      ]}
      toolbarItems={[
        <ImageToolbarItem key="image" onImageLoad={onImageLoad} />,
        <LinkToolbarItem key="link" />,
      ]}
    >
      <FocusPlugin />
      <ImageRegister />
      <ClipboardImageHandler onImageLoad={onImageLoad} />
      <LexicalLinkPlugin validateUrl={validateUrl} />
      <LinkPlugins />
      <OutputPlugin onUpdate={onUpdate} />
    </LexicalEditor>
  );
};
