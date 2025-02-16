import {
  ComponentProps,
  ForwardedRef,
  forwardRef,
  ReactNode,
  useState,
} from "react";
import { RiChat1Line, RiMore2Fill } from "react-icons/ri";
import { tv } from "tailwind-variants";
import { OpinionType } from "~/feature/opinion/types";
import { User } from "~/feature/user/types";
import Avator from "../Avator";
import Badge from "../Badge";
import Button from "../Button";
import { toast } from "react-toastify";
import { OpinionJpMap } from "~/feature/opinion/constants";

type Props = Card & ComponentProps<"div">;

type Card = {
  percentage?: {
    key: string;
    value: number;
  };
  description: string;
  children?: ReactNode;
  opinionStatus?: OpinionType;
  user: User;
  isOpnionLink?: string;
  isJegde?: boolean;
  onClickVoteButton?: (v: string) => void;
  myVoteType?: OpinionType;
  referenceURL?: string;
  img?: string;
};

const card = tv({
  base: "relative rounded-md border border-solid border-black p-4",
  variants: {
    isView: {
      true: "pt-10",
    },
  },
});

const percentageUI = tv({
  base: "absolute left-1/2 top-3 -translate-x-1/2 whitespace-nowrap text-xs underline",
  variants: {
    agree: { true: "text-blue-500" },
    disagree: { true: "text-red-500" },
    pass: { true: "text-gray-500" },
  },
});

const kebab = tv({
  base: "absolute right-4 top-6 z-10",
  variants: {
    isView: {
      true: "top-12",
    },
  },
});

function Card(
  {
    percentage,
    user,
    description,
    opinionStatus,
    children,
    className,
    isOpnionLink,
    isJegde,
    onClickVoteButton,
    myVoteType,
    referenceURL,
    img,
    ...props
  }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setIsTooltipOpen(!isTooltipOpen);
  };

  const handleCloseButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    toast.success("通報しました");
    setIsTooltipOpen(false);
  };

  const handleClickVoteButton = (
    event: React.MouseEvent<HTMLButtonElement>,
    target: string,
  ) => {
    event.stopPropagation();
    event.preventDefault();
    onClickVoteButton?.(target);
  };

  const isView = !isNaN(percentage?.value || NaN);

  const handleClick = () => {
    const result = window.confirm(`${referenceURL}に飛びます。`);
    if (result) {
      window.location.replace(referenceURL || "");
    }
  };

  return (
    <div {...props} ref={ref} className={card({ class: className, isView })}>
      {isView && (
        <p
          className={percentageUI({
            agree: percentage?.key === "agree",
            disagree: percentage?.key === "disagree",
            pass: percentage?.key === "pass",
          })}
        >
          {percentage?.value}%の人がこの意見に「
          {OpinionJpMap[percentage?.key as never]}」しました
        </p>
      )}
      <div className="flex items-center">
        <Avator src={user.iconURL} className="" />
        <p className="ml-2 mr-auto text-xs text-[#6d6c6a]">
          {user.displayName}
        </p>
        <Badge status={opinionStatus} className="ml-2 mr-8" />
      </div>

      <p className="mt-2 line-clamp-4 text-[#4e4d4b]">{description}</p>

      <button className={kebab({ isView })} onClick={handleButtonClick}>
        <RiMore2Fill size={24} />
      </button>

      {isTooltipOpen && (
        <div className="absolute right-12 top-3 rounded-sm border border-gray-500 bg-white p-2">
          <button onClick={handleCloseButton}>通報する</button>
        </div>
      )}

      {img && <img src={img} alt="" className="mx-auto my-2" />}

      {children}

      {referenceURL && (
        <p className="mt-4 flex space-x-1 text-xs">
          <span className="shrink-0">参考文献:</span>
          <button
            onClick={handleClick}
            className="line-clamp-1 w-full text-start text-blue-400"
          >
            {referenceURL}
          </button>
        </p>
      )}

      <RpleyLink to={isOpnionLink} />

      {isJegde && (
        <div className="mt-4 flex justify-between">
          <Button
            className="h-8 w-24 p-1"
            variation={myVoteType === "disagree" ? "disagree" : "disabled"}
            onClick={(e) => handleClickVoteButton(e, "disagree")}
            outline={myVoteType !== "disagree"}
          >
            違うかも
          </Button>
          <Button
            className="h-8 w-24 p-1"
            variation={myVoteType === "pass" ? "pass" : "disabled"}
            onClick={(e) => handleClickVoteButton(e, "pass")}
            outline={myVoteType !== "pass"}
          >
            保留
          </Button>
          <Button
            className="h-8 w-24 p-1"
            variation={myVoteType === "agree" ? "agree" : "disabled"}
            onClick={(e) => handleClickVoteButton(e, "agree")}
            outline={myVoteType !== "agree"}
          >
            良さそう
          </Button>
        </div>
      )}
    </div>
  );
}

type RpleyLinkProps = {
  to?: string;
};

function RpleyLink({ to }: RpleyLinkProps) {
  if (!to) {
    return null;
  }

  return (
    <div className="mt-2 flex items-center justify-end text-blue-500">
      <RiChat1Line />
      <p className="ml-1 text-sm">返信画面にいく</p>
    </div>
  );
}

export default forwardRef(Card);
