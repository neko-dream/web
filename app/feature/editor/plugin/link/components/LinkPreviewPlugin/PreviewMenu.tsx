import { AutoEmbedOption } from "@lexical/react/LexicalAutoEmbedPlugin";
import { FC } from "react";

type Props = {
  selectedIndex: number | null;
  options: AutoEmbedOption[];
  selectOptionAndCleanUp: (option: AutoEmbedOption) => void;
  setHighlightedIndex: (idx: number) => void;
};

const PreviewMenu: FC<Props> = ({
  selectedIndex,
  options,
  selectOptionAndCleanUp,
  setHighlightedIndex,
}) => {
  return (
    <ul className="flex max-w-[312px] flex-col gap-1 overflow-hidden rounded bg-white p-1 text-sm shadow-md">
      {options.map((option, idx) => (
        <li
          role="option"
          aria-selected={selectedIndex === idx}
          className={`cursor-pointer px-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 ${selectedIndex === idx && "bg-gray-100 text-gray-500"}`}
          key={option.key}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              setHighlightedIndex(idx);
              selectOptionAndCleanUp(option);
            }
          }}
          onMouseEnter={() => {
            setHighlightedIndex(idx);
          }}
          onClick={() => {
            setHighlightedIndex(idx);
            selectOptionAndCleanUp(option);
          }}
        >
          {option.title}
        </li>
      ))}
    </ul>
  );
};

export default PreviewMenu;
