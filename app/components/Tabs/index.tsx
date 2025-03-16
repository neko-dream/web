import { NavLink } from "react-router";
import { ComponentProps } from "react";
import { tv } from "tailwind-variants";

type Props = ComponentProps<"div"> & {
  items: Array<{
    label: string;
    href: string;
  }>;
};

const tabs = tv({
  base: "flex h-10 bg-white px-4",
});

const link = tv({
  base: "relative flex h-full w-20 items-center justify-center text-sm font-bold text-gray-400",
  variants: {
    isActive: {
      true: "text-black before:absolute before:bottom-0 before:left-1/2 before:h-1 before:w-3/4 before:-translate-x-1/2 before:transform before:rounded-full before:bg-cyan-500",
    },
  },
});

/**
 * 汎用的なタブ要素
 */
export const Tabs = ({ className, items, ...props }: Props) => {
  return (
    <div {...props} className={tabs({ className })}>
      {items.map(({ href, label }, i) => {
        return (
          <NavLink
            key={i}
            to={href}
            end={true}
            className={({ isActive }) => link({ isActive: isActive })}
            prefetch="viewport"
            replace={true}
            viewTransition
          >
            {label}
          </NavLink>
        );
      })}
    </div>
  );
};
