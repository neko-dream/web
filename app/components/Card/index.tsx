import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { type ComponentProps, createElement } from "react";
import { RiMore2Fill } from "react-icons/ri";
import { tv } from "tailwind-variants";
import type { OpinionType } from "~/features/opinion/types";
import type { User } from "~/features/user/types";
import { JST } from "~/libs/date";
import { Avatar } from "../Avatar";
import { Button } from "../Button";
import { LineChart, Notification } from "../Icons";
import { OpinionCount } from "../OpinionCount";

type Props = Omit<ComponentProps<"div">, "children"> & {
  description: string;
  status?: OpinionType | null;
  href?: string;
  user: User;
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
            <p className="mt-2 line-clamp-3 text-[#4e4d4b]">{description}</p>

            {opinionCount > 0 && (
              <div className="mt-2">
                <OpinionCount count={opinionCount} />
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
                保留
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
        <Popover>
          <PopoverButton className="absolute top-4 right-4 cursor-pointer">
            <RiMore2Fill size={24} className="text-gray-600" />
          </PopoverButton>
          <PopoverPanel
            transition={true}
            anchor="bottom"
            className="data-[closed]:-translate-y-1 z-10 rounded-xl bg-white shadow-lg transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:opacity-0"
          >
            {({ close }) => (
              <div className="flex flex-col px-3 py-1">
                <button
                  onClick={() => {
                    onClickAnalytics?.();
                    close();
                  }}
                  type="button"
                  className="flex cursor-pointer space-x-2 border-gray-200 border-b py-2 text-[#8E8E93]"
                >
                  <LineChart />
                  <span>分析</span>
                </button>
                <button
                  onClick={() => {
                    onClickReport?.();
                    close();
                  }}
                  type="button"
                  className="flex cursor-pointer space-x-2 py-2 text-[#FF3B30]"
                >
                  <Notification />
                  <span>通報</span>
                </button>
              </div>
            )}
          </PopoverPanel>
        </Popover>
      )}
    </div>
  );
};

const OpinionButton = (props: Button) => {
  return <Button {...props} className="z-10 h-7 w-16 px-0 text-xs" />;
};
