import { ComponentProps, ForwardedRef, forwardRef } from "react";
import { tv } from "tailwind-variants";
import { Arrow } from "../Icons";

type Props = ComponentProps<"select"> & {
  options: { value: string; title: string }[];
  placeholader?: string;
  error?: boolean;
};

const select = tv({
  slots: {
    base: "h-12 w-full appearance-none rounded-md border border-gray-300 bg-white px-4 text-gray-400",
    placeholder: "hidden text-gray-400",
  },
  variants: {
    error: {
      true: "border-red-500",
    },
  },
});

function Select(
  { error, className, options, placeholader, defaultValue, ...props }: Props,
  ref: ForwardedRef<HTMLSelectElement>,
) {
  const { placeholder, base } = select({ error, class: className });

  return (
    <span className="relative">
      <select
        {...props}
        ref={ref}
        className={base()}
        onChange={(e) => {
          props.onChange && props.onChange(e);
          e.currentTarget.style.color = "black";
        }}
        defaultValue={defaultValue || "0"}
      >
        <option value="0" disabled className={placeholder()}>
          {placeholader || "選択する"}
        </option>
        <option value={"---"}>---</option>
        {options.map(({ value, title }, i) => {
          return (
            <option key={i} value={value}>
              {title}
            </option>
          );
        })}
      </select>
      <Arrow className="absolute top-1/2 right-4 -translate-y-1/2" />
    </span>
  );
}

export default forwardRef(Select);
