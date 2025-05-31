import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";

type Props = ComponentProps<"input"> & {
  error?: boolean;
  icon?: string;
};

export const input = tv({
  base: "h-12 w-full rounded-md border border-gray-300 bg-white px-2 text-sm",
  variants: {
    error: { true: "border-red-500 bg-red-50" },
    withIcon: { true: "pl-18" },
  },
});

export const Input = ({ className, error, icon, ...props }: Props) => {
  if (icon) {
    return (
      <div className="relative w-full">
        <span className="absolute flex h-12 w-8 items-center justify-center">
          <img src={icon} alt="" />
        </span>
        <input
          {...props}
          className={input({ className, error, withIcon: true })}
        />
      </div>
    );
  }

  return <input {...props} className={input({ className, error })} />;
};
