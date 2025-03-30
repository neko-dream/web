import { ComponentProps, JSX, ReactNode } from "react";
import { RiAlertFill } from "react-icons/ri";
import { tv } from "tailwind-variants";
import Tip from "../Tip";

type Props = ComponentProps<"div"> & {
  title: string;
  children: ReactNode;
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
        {(required || optional) && (
          <Tip required={required} optional={optional} />
        )}
      </div>
      {notes &&
        notes.map((v, i) => (
          <p key={i} className="text-mt-gray-600 text-sm">
            {v}
          </p>
        ))}
      {children}
      {errors?.map((v, i) => {
        return (
          <div key={i} className="flex items-center space-x-1">
            <RiAlertFill color="red" />
            <p className="pt-0.5 text-xs text-red-500">{v}</p>
          </div>
        );
      })}
    </div>
  );
};
