import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import { DefaultAvatar } from "~/components/icons";

type Props = ComponentProps<"button"> & {
  className?: string;
  preview?: string;
};

const button = tv({});

export default function Uploadarea({ className, preview, ...props }: Props) {
  return (
    <button {...props} className={button({ className })} type="button">
      {preview ? (
        <img
          src={preview}
          alt=""
          className="h-[72px] w-[72px] rounded-full border border-gray-300 object-cover"
        />
      ) : (
        <DefaultAvatar />
      )}
    </button>
  );
}
