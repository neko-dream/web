import { ComponentProps } from "react";

type Props = ComponentProps<"input"> & {
  label: React.ReactNode;
};

export const Checkbox = ({ id, label, ...props }: Props) => {
  return (
    <div className="flex w-fit cursor-pointer items-center gap-x-[4px] leading-none">
      <input
        id={id}
        type="checkbox"
        {...props}
        className="relative h-[20px] w-[20px] cursor-pointer appearance-none rounded border border-[#CED4DA] checked:bg-[#4dabf7] [&:checked::after]:absolute [&:checked::after]:top-[5px] [&:checked::after]:left-[3px] [&:checked::after]:h-[6px] [&:checked::after]:w-[12px] [&:checked::after]:-rotate-45 [&:checked::after]:transform [&:checked::after]:border-b-2 [&:checked::after]:border-l-2 [&:checked::after]:border-white [&:checked::after]:content-['']"
      />
      <label htmlFor={id} className="text-sm font-medium text-gray-900">
        {label}
      </label>
    </div>
  );
};
