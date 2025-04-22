import { type ComponentProps, type ForwardedRef, forwardRef } from "react";
import { tv } from "tailwind-variants";

type variants = "optional" | "required";

type Props = ComponentProps<"p"> & {
  required?: boolean;
  optional?: boolean;
};

const tip = tv({
  base: "w-8 rounded p-0.5 text-center text-[10px] text-white",
  variants: {
    optional: { true: "bg-gray-300" },
    required: { true: "bg-red-500" },
  } satisfies { [x in variants]: object },
});

function Tip(
  { required = false, optional = false, className, ...props }: Props,
  ref: ForwardedRef<HTMLParagraphElement>,
) {
  return (
    <p {...props} ref={ref} className={tip({ className, optional, required })}>
      {optional ? "任意" : "必須"}
    </p>
  );
}

export default forwardRef(Tip);
