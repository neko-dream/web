import { type ComponentProps, createElement } from "react";
import { tv } from "tailwind-variants";
import { JST } from "~/libs/dayjs";
import type { VoteType } from "~/types";
import { Message } from "../../icons";

type Props = Omit<ComponentProps<"div">, "children"> & {
  description: string;
  status?: VoteType | null;
  href?: string;
  date: string;
  opinionCount?: number;
};

const card = tv({
  base: "relative flex rounded-md bg-white p-2 pb-4",
});

export const DeletedOpinionCard = ({
  description,
  className,
  status,
  date,
  href,
  opinionCount = 0,
  ...props
}: Props) => {
  return (
    <div {...props} className={card({ className })}>
      {createElement(
        href ? "a" : "div",
        { className: "ml-2 block w-full", href: href },
        <>
          <p className="mt-1 text-gray-300 text-xs">
            {JST(date).format("YYYY/MM/DD HH:mm")}
          </p>
          <p className="mt-2 line-clamp-3 text-[#4e4d4b]">{description}</p>

          {opinionCount > 0 && (
            <div className="mt-1 flex items-center space-x-1">
              <Message className="text-blue-500" />
              <p className="font-bold text-blue-500 text-xs">
                コメント{opinionCount < 99 ? opinionCount : "99+"}件
              </p>
            </div>
          )}
        </>,
      )}
    </div>
  );
};
