import { ComponentProps, ReactNode } from "react";
import { tv } from "tailwind-variants";
import { Left } from "../Icons";

type Props = ComponentProps<"button"> & {
  title: ReactNode;
  isLeftIcon?: boolean;
};

const heading = tv({
  base: "flex w-full cursor-pointer items-center bg-gradient-to-r from-[#FF3B30] from-0% via-[#5856D6] via-50% to-[#32ADE6] to-100% p-2 text-[18px] font-bold text-white",
});

const text = tv({
  base: "mx-auto -translate-x-[13.5px]",
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
