import { ComponentProps, ReactNode } from "react";
import { tv } from "tailwind-variants";

type variants = "primary" | "agree" | "disagree" | "pass" | "disabled";

export type Button = ComponentProps<"button"> & {
  children: ReactNode;
  color?: variants;
  mini?: boolean;
};

export const button = tv({
  base: "h-13 cursor-pointer rounded-2xl px-6 text-center font-bold text-white disabled:opacity-30",
  variants: {
    color: {
      primary: "primary-gradient",
      agree: "border-[#32ADE6] bg-[#32ADE6]",
      disagree: "border-[#FF2D55] bg-[#FF2D55]",
      pass: "border-[#AF52DE] bg-[#AF52DE]",
      disabled: "border-2 border-gray-200 bg-white text-gray-300",
    } satisfies { [x in variants]: string },
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
