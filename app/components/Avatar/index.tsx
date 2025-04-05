import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";

type Props = ComponentProps<"picture"> & {
  src?: string | null;
};

const avator = tv({
  base: "block h-10 w-10 rounded-full bg-slate-500",
});

export const Avatar = ({ className, ...props }: Props) => {
  return (
    <picture {...props} className={avator({ className })}>
      <source srcSet={props.src || ""} />
      <img
        src={"https://placehold.jp/150x150.png"}
        alt=""
        className="aspect-square w-full rounded-full object-cover"
      />
    </picture>
  );
};

export const AvatarSkeleton = () => {
  return <div className="h-8 w-8 animate-pulse rounded-full bg-gray-100" />;
};
