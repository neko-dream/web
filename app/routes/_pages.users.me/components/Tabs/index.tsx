import type { ComponentProps } from "react";
import { NavLink } from "react-router";
import { tv } from "tailwind-variants";

type Props = ComponentProps<"div"> & {
  items: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
};

const tabs = tv({
  base: "flex w-full border-line border-b bg-white px-4",
});

const link = tv({
  base: "relative flex h-11 flex-1 items-center justify-center font-bold text-ink-subtle text-sm",
  variants: {
    isActive: {
      true: "text-ink before:-translate-x-1/2 before:absolute before:bottom-0 before:left-1/2 before:h-[3px] before:w-full before:transform before:rounded-full before:bg-[linear-gradient(90deg,#FF3B30,#5856D6,#32ADE6)]",
    },
  },
});

/**
 * 汎用的なタブ要素
 */
export const Tabs = ({ className, items, ...props }: Props) => {
  return (
    <div {...props} className={tabs({ className })}>
      {items.map(({ href, label, external }, i) => {
        return (
          <NavLink
            key={i}
            to={href}
            end={true}
            className={({ isActive }) => link({ isActive: isActive })}
            prefetch="viewport"
            replace={true}
            viewTransition={true}
            preventScrollReset={true}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
          >
            {label}
          </NavLink>
        );
      })}
    </div>
  );
};
