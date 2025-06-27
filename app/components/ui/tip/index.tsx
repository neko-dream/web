import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";

type variants = "optional" | "required";

type Props = ComponentProps<"p"> & {
  label: string;
  required?: boolean;
  optional?: boolean;
};

const tip = tv({
  base: "text-nowrap rounded px-1 py-0.5 text-center text-[10px] text-white",
  variants: {
    optional: { true: "bg-[#8E8E93]" },
    required: { true: "bg-[#FF2D55]" },
  } satisfies { [x in variants]: object },
});

export const Tip = ({
  required,
  optional,
  label,
  className,
  ...props
}: Props) => {
  return (
    <p {...props} className={tip({ className, optional, required })}>
      {label}
    </p>
  );
};
