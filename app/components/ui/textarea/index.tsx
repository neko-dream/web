import { type ComponentProps, type ForwardedRef, forwardRef } from "react";
import { tv } from "tailwind-variants";

type Props = ComponentProps<"textarea"> & {
  error?: boolean;
};

const textarea = tv({
  base: "w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm",
  variants: {
    error: { true: "border-red-500" },
  },
});

function Textarea(
  { className, error, ...props }: Props,
  ref: ForwardedRef<HTMLTextAreaElement>,
) {
  return (
    <textarea {...props} ref={ref} className={textarea({ className, error })} />
  );
}

export default forwardRef(Textarea);
