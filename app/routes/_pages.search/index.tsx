import { useRef } from "react";
import { type MetaFunction, useNavigate } from "react-router";
import { Search } from "~/components/icons";
import { PageHeader } from "~/components/ui/page-header";
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
    <>
      <PageHeader title="検索" backTo="/home" />
      <div className="mx-auto w-full max-w-4xl px-4 pt-6">
        <form onSubmit={handleSubmit}>
          <div className="flex h-13 items-center gap-3 rounded-2xl bg-surface px-4 py-1 focus-within:ring-2 focus-within:ring-[#32ADE6]/40">
            <Search className="size-6 shrink-0 text-ink-subtle" />
            <input
              ref={inputRef}
              type="search"
              placeholder="キーワードを入力"
              className="w-full bg-transparent text-base leading-[1.55] outline-none placeholder:text-[#C1C7CE]"
              // biome-ignore lint/a11y/noAutofocus: 検索専用ページのため入力欄に即フォーカスする
              autoFocus={true}
            />
          </div>
          <p className="mt-3 px-1 text-ink-subtle text-sm">
            セッションのテーマやキーワードから探せます。
          </p>
        </form>
      </div>
    </>
  );
}
