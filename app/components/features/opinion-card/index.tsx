import { type ComponentProps, createElement } from "react";
import { tv } from "tailwind-variants";
import { JST } from "~/libs/date";
import type { UserType, VoteType } from "~/types";
import { Message, More, Notification } from "../../icons";
import { Avatar, AvatarSkeleton } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { Popover } from "../../ui/popover";

type Props = Omit<ComponentProps<"div">, "children"> & {
  description: string;
  status?: VoteType | null;
  href?: string;
  user: UserType;
  date: string;
  isJudgeButton?: boolean;
  isMoreButton?: boolean;
  opinionCount?: number;
  onClickAgree?: () => void;
  onClickDisagree?: () => void;
  onClickPass?: () => void;
  onClickReport?: () => void;
  onClickAnalytics?: () => void;
};

const card = tv({
  base: "relative flex rounded-md bg-white p-2 pb-4",
});

export const OpinionCardSkeleton = () => {
  return (
    <div className="flex animate-pulse items-center space-x-2 rounded-md bg-gray-100 p-2 pb-4">
      <AvatarSkeleton />
      <div className="w-full">
        <div className="h-4 w-[80%] rounded bg-gray-100" />
        <div className="mt-1 h-4 w-[60%] rounded bg-gray-100" />
        <div className="mt-2 h-4 w-[90%] rounded bg-gray-100" />
      </div>
    </div>
  );
};

export const Card = ({
  user,
  description,
  className,
  status,
  date,
  href,
  isJudgeButton,
  isMoreButton,
  opinionCount = 0,
  onClickAgree,
  onClickDisagree,
  onClickPass,
  onClickReport,
  onClickAnalytics,
  ...props
}: Props) => {
  return (
    <div {...props} className={card({ className })}>
      <Avatar src={user.iconURL} className="shrink-0" />

      <div className="w-full">
        {createElement(
          href ? "a" : "div",
          { className: "ml-2 block", href: href },
          <>
            <p className="mt-1 text-gray-400 text-xs">{user.displayName}</p>
            <p className="mt-1 text-gray-300 text-xs">
              {JST(date).format("YYYY/MM/DD HH:mm")}
            </p>
            <p className="mt-2 line-clamp-3 whitespace-break-spaces text-[#4e4d4b]">
              {description}
            </p>

            {opinionCount > 0 && (
              <div className="mt-1 flex items-center space-x-1">
                <Message className="text-blue-500" />
                <p className="font-bold text-blue-500 text-xs ">
                  コメント{opinionCount < 99 ? opinionCount : "99+"}件
                </p>
              </div>
            )}
          </>,
        )}

        {isJudgeButton && (
          <>
            {/* ライン */}
            <div className="mt-2 h-[1px] w-full bg-gray-200" />

            <p className="mt-2 text-gray-300 text-xs">あなたの意見</p>
            {/* 40pxはアバター分 */}
            <div className="mt-1 flex w-[calc(100%-40px)] justify-between">
              <OpinionButton
                onClick={onClickDisagree}
                color={status === "disagree" ? "disagree" : "disabled"}
              >
                違うかも
              </OpinionButton>
              <OpinionButton
                onClick={onClickPass}
                color={status === "pass" ? "pass" : "disabled"}
              >
                パス
              </OpinionButton>
              <OpinionButton
                onClick={onClickAgree}
                color={status === "agree" ? "agree" : "disabled"}
              >
                良さそう
              </OpinionButton>
            </div>
          </>
        )}
      </div>

      {isMoreButton && (
        <Popover buttonLabel={<More className="w-6 text-gray-600" />}>
          <div className="flex flex-col px-3 py-1">
            {/* FIXME: 一旦コメントアウト */}
            {/* <button
              onClick={() => onClickAnalytics?.()}
              type="button"
              className="flex cursor-pointer space-x-2 border-gray-200 border-b py-2 text-[#8E8E93]"
            >
              <LineChart />
              <span>分析</span>
            </button> */}
            <button
              onClick={() => onClickReport?.()}
              type="button"
              className="flex cursor-pointer space-x-2 py-2 text-[#FF3B30]"
            >
              <Notification className="fill-[#FF3B30]" />
              <span>通報</span>
            </button>
          </div>
        </Popover>
      )}
    </div>
  );
};

const OpinionButton = (props: Button) => {
  return <Button {...props} className="z-10 h-7 w-16 px-0 text-xs" />;
};
