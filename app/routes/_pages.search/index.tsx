import { useRef } from "react";
import { type MetaFunction, useNavigate } from "react-router";
import { Search } from "~/components/icons";
import { generateMetaTag } from "~/utils/metatag";

export const meta: MetaFunction = () => {
  return generateMetaTag({
    title: "検索",
  });
};

export default function Page() {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputRef.current?.value.trim();
    if (!query) {
      return;
    }
    navigate(`/home?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex h-12 items-center gap-2 rounded-full border border-[rgba(84,84,86,0.34)] bg-white px-4 py-1 focus-within:border-[#40B6EF]">
          <Search className="size-6 shrink-0 text-[#8E8E93]" />
          <input
            ref={inputRef}
            type="search"
            placeholder="キーワードを入力"
            className="w-full bg-transparent text-base leading-[1.55] outline-none placeholder:text-[#C1C7CE]"
            // biome-ignore lint/a11y/noAutofocus: 検索専用ページのため入力欄に即フォーカスする
            autoFocus={true}
          />
        </div>
      </form>
    </div>
  );
}
