import { ComponentProps } from "react";
import { tv } from "tailwind-variants";

const graph = tv({
  base: "h-60 w-full bg-blue-300",
});

export const Graph = ({ className, ...props }: ComponentProps<"div">) => {
  return <div {...props} className={graph({ className })} />;
};
