import type { ComponentProps, ReactNode } from "react";
import { tv } from "tailwind-variants";
import { Left } from "../Icons";

type Props = ComponentProps<"button"> & {
  title: ReactNode;
  isLeftIcon?: boolean;
};

const heading = tv({
  base: "flex w-full cursor-pointer items-center bg-gradient-to-r from-0% from-[#FF3B30] via-50% via-[#5856D6] to-100% to-[#32ADE6] p-2 font-bold text-[18px] text-white",
});

const text = tv({
  base: "-translate-x-[13.5px] mx-auto",
  variants: {
    isLeftIcon: {
      false: "translate-x-0",
    },
  },
});

/**
 * MEMO: 一個前に戻る方法が思いつかなかったのでbuttonにしてnavigate(-1)で対応できるように
 */
export const Heading = ({
  className,
  title,
  isLeftIcon = true,
  ...props
}: Props) => {
  return (
    <button {...props} className={heading({ class: className })}>
      {isLeftIcon && <Left className="fill-white" />}
      <span className={text({ isLeftIcon })}>{title}</span>
    </button>
  );
};
