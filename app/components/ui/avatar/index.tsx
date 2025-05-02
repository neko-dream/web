import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";

type Props = ComponentProps<"picture"> & {
  src?: string | null;
};

const avator = tv({
  base: "block h-10 w-10 rounded-full",
});

export const Avatar = ({ className, src, ...props }: Props) => {
  return (
    <picture {...props} className={avator({ className })}>
      <source srcSet={src || ""} />
      <img
        src={"/default_icon.png"}
        alt=""
        className="aspect-square w-full rounded-full object-cover"
      />
    </picture>
  );
};

export const AvatarSkeleton = () => {
  return <div className="h-8 w-8 animate-pulse rounded-full bg-gray-100" />;
};
