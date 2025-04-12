import { animated, to } from "@react-spring/web";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams, useRevalidator } from "react-router";
import { useSprings } from "react-spring";
import { toast } from "react-toastify";
import { useDrag } from "react-use-gesture";
import { Card } from "~/components/features/opinion-card/index.js";
import { Graph } from "~/components/features/opinion-graph";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  InfoCircle,
  Left,
  PieChart,
  PointUp,
} from "~/components/icons";
import { List } from "~/components/ui/acordion";
import { Button, button } from "~/components/ui/button";
import type { Route } from "~/react-router/_pages.swipe.$session_id/+types";
import type { VoteType } from "~/types";
import type { components } from "~/types/openapi";
import { postVote } from "~/utils/vote";
import { loader } from "./modules/loader";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader };

type OnSwipeParam = {
  opinionID: string;
  opinionStatus: VoteType;
};

type Props = {
  opinions: {
    opinion: components["schemas"]["opinion"];
    user: components["schemas"]["user"];
    replyCount: number;
  }[];
  onSwipe: ({ opinionID, opinionStatus }: OnSwipeParam) => void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _height = "calc(100% - 136px - 24px)";

const trans = (r: number, s: number) =>
  `rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;

export const animations = {
  to: () => ({
    w: "80%",
    x: 0,
    zIndex: 0,
    left: "10%",
    scale: 1,
  }),
  from: () => ({
    w: "100%",
    x: 0,
    y: -1000,
    zIndex: 0,
    left: "10%",
    rot: 0,
    scale: 1.5,
    backgroundColor: "transparent",
    agreeDisplay: "none",
    disagreeDisplay: "none",
    opacity: 0,
  }),
  init: () => ({
    w: "80%",
    x: 0,
    left: "10%",
    zIndex: 0,
    delay: undefined,
  }),
};

export const useSwipe = ({ opinions, onSwipe }: Props) => {
  const [gone] = useState(() => new Set<number>());

  const [item, api] = useSprings(opinions.length, (i) => ({
    ...animations.to(),
    y: i,
    delay: i,
    from: animations.from(),
  }));

  const bind = useDrag(
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
    ({ args: [index], down, movement: [mx, my], velocity }) => {
      const trigger = velocity > 0.1;
      // MEMO: 閾値を超えたらスワイプしたとみなす
      const xdir = mx > 100 ? 1 : mx < -100 ? -1 : 0;
      const ydir = my > 100 ? 1 : my < -100 ? -1 : 0;

      // MEMO: スワイプしたカードをコールバックに渡す
      if (!down && trigger) {
        const opinionID = opinions[opinions.length - gone.size - 1].opinion.id;
        if (xdir >= 1) {
          onSwipe({ opinionID, opinionStatus: "agree" });
        } else if (xdir <= -1) {
          onSwipe({ opinionID, opinionStatus: "disagree" });
        }
        if (ydir >= 1) {
          onSwipe({ opinionID, opinionStatus: "pass" });
        }
      }

      // MEMO: ydir || xidr が 0 でない場合はどこかにスワイプしている
      if (!down && trigger && (ydir !== 0 || xdir !== 0)) {
        if (ydir !== -1) {
          gone.add(index);
        }
      }

      // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
      api.start((i) => {
        if (i !== index) {
          return;
        }

        const isGone = gone.has(index);
        // MEMO: スワイプしたカードの位置を計算
        const x = isGone ? (200 + window.innerWidth) * xdir : down ? mx : 0;
        const y = isGone ? (200 + window.innerHeight) * ydir : down ? my : 0;
        const rot = down ? mx / 100 + (isGone ? xdir * 10 * velocity : 0) : 0;

        const config = {
          friction: 50,
          tension: down ? 800 : isGone ? 200 : 500,
        };

        // 透かし
        let backgroundColor = x > 10 ? "blue" : x < -10 ? "red" : "transparent";
        backgroundColor = y < -100 ? "transparent" : backgroundColor;
        const opacity = x > 10 ? mx / 400 : x < -10 ? -mx / 400 : 0;

        return {
          ...animations.init(),
          y,
          x,
          rot,
          backgroundColor,
          opacity,
          agreeDisplay: x > 10 && y > -100 ? "block" : "none",
          disagreeDisplay: x < -10 ? "block" : "none",
          zIndex: down ? 100 : 0,
          config,
        };
      });
    },
  );

  return {
    gone,
    item,
    api,
    bind,
    opinions,
  };
};

export default function Page({
  loaderData: { opinions, session },
}: Route.ComponentProps) {
  const [isOpinionEnd, setIsOpinionEnd] = useState<boolean>(false);
  const params = useParams();
  const navigate = useNavigate();

  const swipe = useSwipe({
    opinions,
    onSwipe: async ({ opinionID, opinionStatus }) => {
      const { error } = await postVote({
        opinionID,
        voteStatus: opinionStatus as never,
      });

      if (error) {
        return toast.error(error.message);
      }

      const current = opinions.length - swipe.gone.size;
      setTimeout(() => {
        if (current === 0) {
          setIsOpinionEnd(true);
        }
      }, 300);
    },
  });

  const revalidate = useRevalidator();

  useEffect(() => {
    if (opinions.length === 0) {
      setIsOpinionEnd(true);
    }
  }, [opinions]);

  if (opinions.length === 0) {
    return (
      <div className="relative flex w-full flex-1 flex-col items-center justify-center">
        <p>全ての意見に意思表明しました🎉</p>
        <Link
          to={`/${params.id}`}
          className={button({ color: "primary", className: "mt-4 block" })}
        >
          みんなの意見を見る
        </Link>
      </div>
    );
  }

  const handleSubmitVote = async (v: VoteType) => {
    const current = opinions.length - swipe.gone.size - 1;
    // MEMO: すべてのカードをスワイプした場合は何もしない
    if (current < 0) {
      return;
    }

    // MEMO: いますワイプしているカードのIDを取得
    const opinionID =
      opinions[opinions.length - swipe.gone.size - 1].opinion.id;

    const { error } = await postVote({
      opinionID,
      voteStatus: v as never,
    });

    if (error) {
      return toast.error(error.message);
    }

    setTimeout(() => {
      if (current === 0) {
        setIsOpinionEnd(true);
      }
    }, 300);

    swipe.api.start((i) => {
      if (i !== current) {
        return;
      }

      swipe.gone.add(current);

      return {
        x: v === "agree" ? 800 : v === "disagree" ? -800 : 0,
        y: v === "pass" ? 800 : 0,
        scale: 1,
        config: { friction: 50, tension: 200 },
      };
    });
  };

  const handleRevalidate = () => {
    setIsOpinionEnd(false);
    revalidate.revalidate();
    swipe.gone.clear();
    swipe.api.start((i) => ({
      ...animations.to(),
      y: i * 6,
      delay: i * 50,
      from: animations.from(),
    }));
  };

  if (isOpinionEnd) {
    return (
      <div className="relative flex w-full flex-1 flex-col items-center justify-center space-y-4">
        <p>{opinions.length}件の意見に意思表明しました🎉</p>
        <Button color="primary" onClick={handleRevalidate}>
          さらに意思表明する
        </Button>
        <Link to={`/${params.id}`} className={button({ color: "primary" })}>
          みんなの意見を見る
        </Link>
      </div>
    );
  }

  return (
    <div className="relative w-full flex-1 overflow-hidden bg-[#F2F2F7] pb-16">
      <button
        type="button"
        className="flex w-full cursor-pointerp-2 bg-white p-2 font-bold text-[18px]"
        onClick={() => navigate(-1)}
      >
        <Left className="text-black" />
        <span className="-translate-x-[13.5px] mx-auto">{session.theme}</span>
      </button>
      <List
        className="m-2"
        title={
          <div className="flex items-center space-x-2">
            <PieChart />
            <p>参加者のグラフ</p>
          </div>
        }
      >
        <Graph className="mt-2" />
      </List>

      <p className="mx-2 mt-2 mt-6 text-center font-semibold text-[#8E8E93] text-lg">
        <span className="mr-2">意見</span>
        {swipe.gone.size} / {swipe.item.length}
      </p>

      <div className="relative mt-2 h-[168px]">
        {swipe.item?.map(
          (
            {
              x,
              y,
              w,
              left,
              rot,
              scale,
              zIndex,
              backgroundColor,
              disagreeDisplay,
              agreeDisplay,
              opacity,
            },
            i,
          ) => {
            return (
              <animated.div
                className="absolute block cursor-pointer touch-none will-change-transform"
                key={i}
                style={{
                  x,
                  y,
                  width: w,
                  left,
                  zIndex,
                }}
              >
                <animated.div
                  {...swipe.bind(i)}
                  style={{ transform: to([rot, scale], trans) }}
                  className="w-full"
                >
                  {/* 重なり */}
                  <animated.div
                    style={{
                      backgroundColor,
                      display: disagreeDisplay,
                      opacity,
                    }}
                    className="absolute z-10 h-full w-full rounded"
                  />
                  <animated.p
                    style={{ display: disagreeDisplay }}
                    className="absolute z-10 w-full select-none p-4 text-end font-bold text-2xl text-white"
                  >
                    違うかも
                  </animated.p>

                  <animated.div
                    style={{
                      backgroundColor,
                      display: agreeDisplay,
                      opacity,
                    }}
                    className="absolute z-10 h-full w-full rounded"
                  />
                  <animated.p
                    style={{ display: agreeDisplay }}
                    className="absolute z-10 w-full select-none p-4 font-bold text-2xl text-white"
                  >
                    いいかも
                  </animated.p>

                  <Card
                    title={swipe.opinions[i].opinion.title || ""}
                    description={swipe.opinions[i].opinion.content || ""}
                    user={swipe.opinions[i].user}
                    date={"2025/12/31 10:00"}
                    className="pointer-events-none select-none bg-white"
                  />
                </animated.div>
              </animated.div>
            );
          },
        )}
      </div>
      <div className="relative mt-4 h-[160px]">
        <PointUp className="-translate-x-3/5 absolute left-1/2 mt-1" />

        <div className="absolute top-6 right-3/5 flex flex-col items-center">
          <button
            type="button"
            onClick={() => handleSubmitVote("disagree")}
            className="cursor-pointer rounded-full bg-[#FF2D55] p-2 shadow-cs-normal"
          >
            <ArrowLeft className="fill-white" />
          </button>
          <p className="mt-1 text-pink-400">違うかも</p>
        </div>

        <div className="-translate-x-1/2 absolute top-24 left-1/2 flex flex-col items-center">
          <button
            type="button"
            onClick={() => handleSubmitVote("pass")}
            className="cursor-pointer rounded-full bg-[#5856D6] p-2 shadow-cs-normal"
          >
            <ArrowDown className="fill-white" />
          </button>
          <p className="mt-1 text-indigo-400">保留</p>
        </div>

        <div className="absolute top-6 left-3/5 flex flex-col items-center">
          <button
            type="button"
            onClick={() => handleSubmitVote("agree")}
            className="cursor-pointer rounded-full bg-[#32ADE6] p-2 shadow-cs-normal"
          >
            <ArrowRight className="fill-white" />
          </button>
          <p className="mt-1 text-cyan-400">良さそう</p>
        </div>
      </div>
      <Link
        to="#"
        className="mt-4 flex items-center justify-center text-blue-500 text-sm"
      >
        <InfoCircle />
        <span>この画面の操作ヒント</span>
      </Link>
    </div>
  );
}
