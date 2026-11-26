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
        "auth-card mx-auto flex w-full max-w-[min(400px,calc(100vw_-_32px))] flex-col content-center rounded-[28px] border border-black/[0.06] bg-white px-6 pt-5 pb-7 shadow-[0_24px_60px_-32px_rgba(25,28,30,0.35)]",
        className,
      ])}
    >
      {children}
    </section>
  );
};
