import type { ReactNode } from "react";
import { Link } from "react-router";
import { Left } from "~/components/icons";

type Props = {
  title: ReactNode;
  backTo?: string;
  right?: ReactNode;
};

export const PageHeader = ({ title, backTo, right }: Props) => {
  return (
    <header className="sticky top-0 z-20 border-line border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-4xl items-center gap-2 px-4">
        {backTo && (
          <Link
            to={backTo}
            aria-label="戻る"
            className="-ml-2 flex size-10 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface"
          >
            <Left className="fill-current" />
          </Link>
        )}
        <h1 className="line-clamp-1 font-bold text-[17px] tracking-tight">
          {title}
        </h1>
        {right && (
          <div className="ml-auto flex items-center gap-2">{right}</div>
        )}
      </div>
    </header>
  );
};
