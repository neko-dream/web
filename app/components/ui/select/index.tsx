import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import { Arrow } from "~/components/icons";

type Props = ComponentProps<"select"> & {
  options: { value: string; title: string }[];
  placeholder?: string;
  error?: boolean;
};

const select = tv({
  base: "h-12 w-full appearance-none rounded-md border border-gray-300 bg-white px-4",
  variants: {
    error: {
      true: "border-red-500 bg-red-50",
    },
    init: {
      true: "text-gray-500",
      false: "text-black",
    },
  },
});

const div = tv({
  base: "relative",
});

export const Select = ({
  error,
  className,
  options,
  placeholder,
  defaultValue,
  value,
  ...props
}: Props) => {
  return (
    <span className={div({ className })}>
      <select
        {...props}
        className={select({
          init: !value || value === "",
          error,
        })}
        defaultValue={value}
      >
        <option value="" hidden={true}>
          {placeholder || "選択する"}
        </option>
        {options.map(({ value, title }, i) => {
          return (
            <option key={i} value={value}>
              {title}
            </option>
          );
        })}
      </select>
      <Arrow className="-translate-y-1/2 absolute top-1/2 right-4" />
    </span>
  );
};
