import { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import { Avatar } from "~/components/Avatar";
import { Button } from "~/components/Button";
import { User } from "~/feature/user/types";

type Props = Omit<ComponentProps<"div">, "children"> & {
  description: string;
  user: User;
  date: string;
};

const card = tv({
  base: "relative mx-4 box-border flex w-[-webkit-fill-available] rounded-md bg-white p-2",
});

export const Card = ({
  user,
  description,
  className,
  date,
  ...props
}: Props) => {
  return (
    <div {...props} className={card({ className })}>
      <Avatar src={user.iconURL} className="shrink-0" />

      <div className="w-full">
        <div className="ml-2 block">
          <p className="text-xs text-gray-300">{date}</p>
          <p className="mt-1 line-clamp-3 text-sm text-[#4e4d4b]">
            {description}
          </p>
        </div>

        <>
          {/* ライン */}
          <div className="mt-2 h-[1px] w-full bg-gray-200" />

          <p className="mt-2 text-xs text-gray-300">あなたの意見</p>
          {/* 40pxはアバター分 */}
          <div className="mt-1 flex w-full justify-between">
            <OpinionButton color={"disabled"}>違うかも</OpinionButton>
            <OpinionButton color={"disabled"}>保留</OpinionButton>
            <OpinionButton color={"disabled"}>良さそう</OpinionButton>
          </div>
        </>
      </div>
    </div>
  );
};

const OpinionButton = (props: Button) => {
  return <Button {...props} className="z-10 h-7 w-16 px-0 text-xs" />;
};
