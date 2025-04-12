import type { ComponentProps, ReactNode } from "react";
import { Link, type LinkProps } from "react-router";
import { tv } from "tailwind-variants";
import { Left } from "~/components/icons";

// 共通のプロパティを定義 (isLinkをオプショナルに)
type BaseProps = {
  title: ReactNode;
  className?: string;
  isLink?: boolean; // オプショナルにして、デフォルトでfalseになるように
};

// 条件付きプロパティを定義
type Props = BaseProps &
  (
    | ({ isLink: true } & Omit<LinkProps, "className">)
    | ({ isLink?: false } & Omit<ComponentProps<"div">, "className">)
  );

const heading = tv({
  base: "flex w-full items-center bg-gradient-to-r from-0% from-[#FF3B30] via-50% via-[#5856D6] to-100% to-[#32ADE6] p-2 font-bold text-[18px] text-white",
});

const text = tv({
  base: "-translate-x-[13.5px] mx-auto",
  variants: {
    isLeftIcon: {
      false: "translate-x-0",
    },
  },
});

export const Heading = ({ className, title, isLink, ...props }: Props) => {
  if (isLink) {
    return (
      <Link {...(props as LinkProps)} className={heading({ className })}>
        <Left className="fill-white" />
        <span className={text({ isLeftIcon: true })}>{title}</span>
      </Link>
    );
  }

  return (
    <div
      {...(props as ComponentProps<"div">)}
      className={heading({ className })}
    >
      <span className={text({ isLeftIcon: false })}>{title}</span>
    </div>
  );
};
