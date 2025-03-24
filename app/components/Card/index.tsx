import { ComponentProps, createElement } from "react";
import { RiMore2Fill } from "react-icons/ri";
import { tv } from "tailwind-variants";
import { OpinionType } from "~/features/opinion/types";
import { User } from "~/features/user/types";
import { Avatar } from "../Avatar";
import { Button } from "../Button";
import { OpinionCount } from "../OpinionCount";

type Props = Omit<ComponentProps<"div">, "children"> & {
  description: string;
  status?: OpinionType;
  href?: string;
  user: User;
  date: string;
  isJudgeButton?: boolean;
  isMoreButton?: boolean;
  opinionCount?: number;
  onClickAgree?: () => void;
  onClickDisagree?: () => void;
  onClickPass?: () => void;
  onClickMore?: () => void;
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
  opinionCount,
  onClickAgree,
  onClickDisagree,
  onClickPass,
  onClickMore,
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
            <p className="mt-1 text-xs text-gray-400">{user.displayName}</p>
            <p className="mt-1 text-xs text-gray-300">{date}</p>
            <p className="mt-2 line-clamp-3 text-[#4e4d4b]">{description}</p>

            {opinionCount && (
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

            <p className="mt-2 text-xs text-gray-300">あなたの意見</p>
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
        <button className="absolute top-4 right-4" onClick={onClickMore}>
          <RiMore2Fill size={24} className="text-gray-600" />
        </button>
      )}
    </div>
  );
};

const OpinionButton = (props: Button) => {
  return <Button {...props} className="z-10 h-7 w-16 px-0 text-xs" />;
};
