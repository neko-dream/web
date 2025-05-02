import type { ComponentProps, ReactNode } from "react";

type Props = ComponentProps<"input"> & {
  label: ReactNode;
};

export const Checkbox = ({ id, label, ...props }: Props) => {
  return (
    <div className="w-fit cursor-pointer leading-none">
      <label
        htmlFor={id}
        className="flex items-center gap-x-1 font-medium text-gray-900 text-sm"
      >
        <input
          {...props}
          id={id}
          type="checkbox"
          className="[&:checked::after]:-rotate-45 relative h-[20px] w-[20px] cursor-pointer appearance-none rounded border border-[#CED4DA] bg-white checked:bg-[#4dabf7] disabled:bg-[#C1C2C5] [&:checked::after]:absolute [&:checked::after]:top-[5px] [&:checked::after]:left-[3px] [&:checked::after]:h-[6px] [&:checked::after]:w-[12px] [&:checked::after]:transform [&:checked::after]:border-white [&:checked::after]:border-b-2 [&:checked::after]:border-l-2 [&:checked::after]:content-['']"
        />
        {label}
      </label>
    </div>
  );
};
