import type { ComponentProps, ReactNode } from "react";
import { tv } from "tailwind-variants";

type Variants = "primary" | "agree" | "disagree" | "pass" | "disabled";

export type Button = ComponentProps<"button"> & {
  children: ReactNode;
  color?: Variants;
};

export const button = tv({
  base: "h-13 cursor-pointer rounded-2xl px-6 text-center font-bold text-white disabled:opacity-40",
  variants: {
    color: {
      primary: "primary-gradient",
      agree: "border-cs-agree bg-cs-agree",
      disagree: "border-cs-disagree bg-cs-disagree",
      pass: "border-cs-pass bg-cs-pass",
      disabled: "border-2 border-gray-200 bg-white text-gray-300",
    } satisfies { [X in Variants]: string },
    outline: {
      true: "border border-solid bg-white text-gray-800",
    },
  },
});

export const Button = ({ children, color, className, ...props }: Button) => {
  return (
    <button {...props} className={button({ class: className, color })}>
      {children}
    </button>
  );
};
