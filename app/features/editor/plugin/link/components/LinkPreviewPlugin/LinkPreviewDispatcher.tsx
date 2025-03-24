import type { FC } from "react";
import type { EmbedConfig } from "@lexical/react/LexicalAutoEmbedPlugin";
import {
  AutoEmbedOption,
  LexicalAutoEmbedPlugin,
} from "@lexical/react/LexicalAutoEmbedPlugin";
import { LinkPreviewConfig } from "./LinkPreveiwConfig";
import { createPortal } from "react-dom";
import PreviewMenu from "./PreviewMenu";

const LinkPreviewDispatcher: FC = () => {
  const getMenuOptions = (
    activeEmbedConfig: EmbedConfig,
    embedFn: () => void,
    dismissFn: () => void,
  ) => {
    return [
      new AutoEmbedOption("プレビューを表示する", {
        onSelect: embedFn,
      }),
      new AutoEmbedOption("閉じる", {
        onSelect: dismissFn,
      }),
    ];
  };
  return (
    <LexicalAutoEmbedPlugin<EmbedConfig>
      embedConfigs={[LinkPreviewConfig]}
      onOpenEmbedModalForConfig={() => {}} // 今回は使用しないが省略不可能なので、空メソッドを指定
      getMenuOptions={getMenuOptions}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, options, selectOptionAndCleanUp, setHighlightedIndex },
      ) =>
        anchorElementRef.current &&
        createPortal(
          <div style={{ marginTop: anchorElementRef.current.clientHeight }}>
            <PreviewMenu
              selectedIndex={selectedIndex}
              options={options}
              selectOptionAndCleanUp={selectOptionAndCleanUp}
              setHighlightedIndex={setHighlightedIndex}
            />
          </div>,
          anchorElementRef.current,
        )
      }
    />
  );
};

export default LinkPreviewDispatcher;
