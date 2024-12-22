import { Link } from "react-router";
import { ComponentProps, ForwardedRef, forwardRef } from "react";
import { tv } from "tailwind-variants";

type Props = ComponentProps<"div"> & {
  items: Array<{
    label: string;
    href: string;
  }>;
  active?: string;
};

const tabs = tv({
  base: "flex h-10 justify-around",
});

const link = tv({
  base: "flex h-full w-full items-center justify-center border-b-2 border-white text-xs",
  variants: {
    active: { true: "border-b-2 border-blue-500" },
  },
});

function Tabs(
  { className, items, active, ...props }: Props,
  ref: ForwardedRef<HTMLParagraphElement>,
) {
  return (
    <div {...props} ref={ref} className={tabs({ className })}>
      {items.map(({ href, label }, i) => {
        return (
          <Link
            to={href}
            className={link({ active: active === label })}
            key={i}
            prefetch="viewport"
            replace={true}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}

export default forwardRef(Tabs);
