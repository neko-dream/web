import type { ComponentProps, ReactNode } from "react";
import { cn } from "tailwind-variants";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

/**
 * ログイン画面共通の部品（Figma 48:6133 / 48:6211 の寸法）
 */

export const AuthHeading = ({ children }: { children: ReactNode }) => {
  return (
    <h1 className="primary-gradient mb-4 w-fit text-clip font-bold text-[28px] leading-[34px] tracking-[0.38px]">
      {children}
    </h1>
  );
};

export const AuthInput = ({
  className,
  ...props
}: ComponentProps<typeof Input>) => {
  return (
    <Input
      {...props}
      className={cn([
        "rounded-lg border-[#545456]/34 px-2 font-['Open_Sans',sans-serif] text-[#303238] text-base leading-[1.55] placeholder:text-[#bdc6d3] read-only:bg-[#fafafa] read-only:text-[#697381]",
        className,
      ])}
    />
  );
};

export const AuthSubmitButton = ({
  className,
  ...props
}: ComponentProps<typeof Button>) => {
  return (
    <Button
      color="primary"
      {...props}
      className={cn([
        "mt-6 h-auto min-h-[54px] w-full px-4 py-2.5 font-normal text-[17px] leading-[22px] tracking-[-0.43px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      ])}
    />
  );
};

export const AuthError = ({ children }: { children: ReactNode }) => {
  return (
    <p className="my-3 text-[#b42318] text-[13px] leading-normal" role="alert">
      {children}
    </p>
  );
};

export const AuthHelp = ({ children }: { children: ReactNode }) => {
  return (
    <p className="mt-4 text-[#7b8590] text-xs leading-relaxed">{children}</p>
  );
};
