import type { MouseEvent } from "react";
import { cn } from "tailwind-variants";
import { AuthGoogle, AuthLine } from "~/components/icons";
import { GOOGLE_LOGIN_URL, LINE_LOGIN_URL } from "~/constants";

type Props = {
  disabled?: boolean;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
};

// Figma 48:6218 / 48:6224
const linkClassName =
  "relative flex min-h-14 w-full items-center justify-center rounded-2xl px-14 py-2 font-semibold text-[17px] leading-[22px] tracking-[-0.43px] aria-disabled:cursor-not-allowed aria-disabled:opacity-60 [&>svg]:absolute";

export const AuthProviderLinks = ({ disabled = false, onClick }: Props) => {
  return (
    <div className="flex w-full flex-col gap-4">
      <a
        href={GOOGLE_LOGIN_URL}
        onClick={onClick}
        aria-disabled={disabled}
        className={cn([
          linkClassName,
          "border border-[#545456]/34 bg-white text-[#4b5768] [&>svg]:left-6",
        ])}
      >
        <AuthGoogle />
        <span>Googleでログイン</span>
      </a>
      <a
        href={LINE_LOGIN_URL}
        onClick={onClick}
        aria-disabled={disabled}
        className={cn([
          linkClassName,
          "bg-[#06c755] text-white [&>svg]:left-4",
        ])}
      >
        <AuthLine />
        <span>LINEでログイン</span>
      </a>
    </div>
  );
};
