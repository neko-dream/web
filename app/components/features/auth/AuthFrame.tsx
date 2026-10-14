import type { ReactNode } from "react";
import { cn } from "tailwind-variants";
import "./auth.css";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * 一般向けログインの丸いカード
 */
export const AuthFrame = ({ children, className }: Props) => {
  return (
    <section
      className={cn([
        "auth-card mx-auto flex w-[350px] max-w-[calc(100%_-_32px)] flex-col content-center rounded-3xl bg-white px-6 pt-4 pb-8",
        className,
      ])}
    >
      {children}
    </section>
  );
};
