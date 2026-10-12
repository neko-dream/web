import type { MouseEvent } from "react";
import { cn } from "tailwind-variants";
import { AuthGoogle, AuthLine } from "~/components/icons";
import { GOOGLE_LOGIN_URL, LINE_LOGIN_URL } from "~/constants";

type Props = {
  disabled?: boolean;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export function AuthProviderLinks({ disabled = false, onClick }: Props) {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <a
        href={GOOGLE_LOGIN_URL}
        onClick={onClick}
        aria-disabled={disabled}
        className={cn([
          "flex h-10 w-full items-center justify-between rounded-full border border-[#545456]/34 px-6 py-2",
          disabled && "cursor-not-allowed opacity-60",
        ])}
      >
        <AuthGoogle />
        <span className="mx-auto font-bold text-gray-700">
          Googleでログイン
        </span>
      </a>
      <a
        href={LINE_LOGIN_URL}
        onClick={onClick}
        aria-disabled={disabled}
        className={cn([
          "flex h-10 w-full items-center justify-between rounded-full border border-none bg-[#06C755] px-6 py-2 pl-5",
          disabled && "cursor-not-allowed opacity-60",
        ])}
      >
        <AuthLine />
        <span className="mx-auto font-bold text-white">LINEでログイン</span>
      </a>
    </div>
  );
}
