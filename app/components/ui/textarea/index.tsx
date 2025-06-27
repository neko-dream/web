import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";

type Props = ComponentProps<"textarea"> & {
  error?: boolean;
};

const textarea = tv({
  base: "w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm",
  variants: {
    error: { true: "border-red-500 bg-red-50" },
  },
});

export const Textarea = ({ className, error, ...props }: Props) => {
  return <textarea {...props} className={textarea({ className, error })} />;
};
