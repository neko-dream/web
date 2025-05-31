import type { ComponentProps, JSX, ReactNode } from "react";
import { tv } from "tailwind-variants";

type Props = ComponentProps<"div"> & {
  title: string;
  children: ReactNode;
  tip?: ReactNode;
  required?: boolean;
  optional?: boolean;
  errors?: string[];
  notes?: string[];
};

const label = tv({
  base: "w-full space-y-1",
});

export const Label = ({
  children,
  tip,
  title,
  required,
  optional,
  errors,
  notes,
  className,
  ...props
}: Props): JSX.Element => {
  return (
    <div {...props} className={label({ className })}>
      <div className="mb-1 flex items-center space-x-1">
        <p className="font-bold">{title}</p>
        {tip && tip}
      </div>
      {notes?.map((v, i) => (
        <p key={i} className="text-cs-gray-600 text-sm">
          {v}
        </p>
      ))}
      {children}
      {errors?.map((v, i) => {
        return (
          <div key={i} className="flex items-center space-x-1">
            <p className="pt-0.5 text-red-500 text-xs">{v}</p>
          </div>
        );
      })}
    </div>
  );
};
