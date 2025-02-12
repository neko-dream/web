import { ComponentProps, ForwardedRef, forwardRef, ReactNode } from "react";
import { tv } from "tailwind-variants";

type variants = "primary" | "agree" | "disagree" | "pass" | "disabled";

type Props = ComponentProps<"button"> & {
  variation?: variants;
  children: ReactNode;
  outline?: boolean;
};

export const button = tv({
  base: "rounded-full p-2 text-center disabled:opacity-30",
  variants: {
    color: {
      primary: "border-green-500 bg-green-500 text-white",
      agree: "border-[#32ADE6] bg-[#32ADE6] text-white",
      disagree: "border-[#FF2D55] bg-[#FF2D55] text-white",
      pass: "border-[#AF52DE] bg-[#AF52DE] text-white",
      disabled: "border-gray-200 bg-gray-200 text-white",
    } satisfies { [x in variants]: string },
    outline: {
      true: "border border-solid bg-white text-gray-800",
    },
  },
});

function Button(
  { children, variation, className, outline = false, ...props }: Props,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <button
      {...props}
      className={button({ color: variation, class: className, outline })}
      ref={ref}
    >
      {children}
    </button>
  );
}

export default forwardRef(Button);
