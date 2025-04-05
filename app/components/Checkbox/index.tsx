import type { ComponentProps, ReactNode } from "react";

type Props = ComponentProps<"input"> & {
  label: ReactNode;
};

export const Checkbox = ({ id, label, ...props }: Props) => {
  return (
    <div className="flex w-fit cursor-pointer items-center gap-x-[4px] leading-none">
      <input
        id={id}
        type="checkbox"
        {...props}
        className="[&:checked::after]:-rotate-45 relative h-[20px] w-[20px] cursor-pointer appearance-none rounded border border-[#CED4DA] bg-white checked:bg-[#4dabf7] [&:checked::after]:absolute [&:checked::after]:top-[5px] [&:checked::after]:left-[3px] [&:checked::after]:h-[6px] [&:checked::after]:w-[12px] [&:checked::after]:transform [&:checked::after]:border-white [&:checked::after]:border-b-2 [&:checked::after]:border-l-2 [&:checked::after]:content-['']"
      />
      <label htmlFor={id} className="font-medium text-gray-900 text-sm">
        {label}
      </label>
    </div>
  );
};
