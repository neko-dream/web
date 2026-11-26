import type { MouseEvent } from "react";
import { cn } from "tailwind-variants";
import { AuthGoogle, AuthLine } from "~/components/icons";
import { useLoginUrls } from "~/hooks/useLoginUrls";

type Props = {
  disabled?: boolean;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
};

// Figma 48:6218 / 48:6224
const linkClassName =
  "relative flex h-12 w-full items-center justify-center rounded-2xl px-12 font-semibold text-[15px] leading-5 tracking-[-0.2px] whitespace-nowrap transition-colors aria-disabled:cursor-not-allowed aria-disabled:opacity-50 [&>svg]:absolute [&>svg]:size-6";

export const AuthProviderLinks = ({ disabled = false, onClick }: Props) => {
  const loginUrls = useLoginUrls();
  return (
    <div className="flex w-full flex-col gap-3">
      <a
        href={loginUrls.google}
        onClick={onClick}
        aria-disabled={disabled}
        className={cn([
          linkClassName,
          "border border-[#d7dade] bg-white text-[#3c4043] hover:bg-[#f8f9fa] [&>svg]:left-5",
        ])}
      >
        <AuthGoogle />
        <span>Googleでログイン</span>
      </a>
      <a
        href={loginUrls.line}
        onClick={onClick}
        aria-disabled={disabled}
        className={cn([
          linkClassName,
          "bg-[#06c755] text-white hover:bg-[#06b54c] [&>svg]:left-4",
        ])}
      >
        <AuthLine />
        <span>LINEでログイン</span>
      </a>
    </div>
  );
};
