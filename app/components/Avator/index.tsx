import { ComponentProps, ForwardedRef, forwardRef } from "react";
import { tv } from "tailwind-variants";

type Props = Avator & ComponentProps<"div">;

type Avator = {
  src?: string | null;
};

const avator = tv({
  base: "block h-10 w-10 rounded-full bg-slate-500",
});

function Avator(
  { className, ...props }: Props,
  ref: ForwardedRef<HTMLSourceElement>,
) {
  return (
    <picture ref={ref} {...props} className={avator({ className })}>
      <source srcSet={props.src || ""} />
      <img
        // FIXME: デフォルトの画像を設定する
        src={""}
        alt=""
        className="aspect-square w-full rounded-full object-cover"
      />
    </picture>
  );
}

export default forwardRef(Avator);
