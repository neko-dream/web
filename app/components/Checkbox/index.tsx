import { ComponentProps } from "react";

type Props = ComponentProps<"input"> & {
  label: string;
};

export const Checkbox = ({ id, label, ...props }: Props) => {
  return (
    <div className="flex items-center">
      <input
        {...props}
        type="checkbox"
        className="h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-blue-600"
      />
      <label htmlFor={id} className="ms-2 text-sm font-medium text-gray-900">
        {label}
      </label>
    </div>
  );
};
