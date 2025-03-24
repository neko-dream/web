import { FC, ReactNode, useRef } from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

import type { EditorState, Klass, LexicalNode } from "lexical";

type Props = {
  children: ReactNode;
  toolbarItems?: ReactNode[];
  customNodes?: Klass<LexicalNode>[];
};

const Editor: FC<Props> = ({
  children,
  toolbarItems = [],
  customNodes = [],
}) => {
  const editorStateRef = useRef<EditorState>();
  return (
    <LexicalComposer
      initialConfig={{
        namespace: "example",
        onError: () => console.error,
        nodes: [...customNodes],
      }}
    >
      <div className="flex min-h-[400px] flex-col gap-2 rounded-md border border-gray-300 bg-white p-2">
        <div className="flex items-center justify-end gap-1 pb-2">
          {/* ツールバー */}
          {toolbarItems}
        </div>
        <div className="relative">
          <RichTextPlugin
            ErrorBoundary={LexicalErrorBoundary}
            contentEditable={
              <div>
                <ContentEditable className="outline-none" />
              </div>
            }
            placeholder={
              <div className="pointer-events-none absolute top-0 left-0 text-gray-400 select-none">
                文字を入力してください
              </div>
            }
          />
        </div>
      </div>
      <HistoryPlugin />
      <OnChangePlugin
        onChange={(editorState) => {
          editorStateRef.current = editorState;
        }}
      />
      <>
        {/* 以下にカスタムプラグイン */}
        {children}
      </>
    </LexicalComposer>
  );
};

export default Editor;
