import { animated, to } from "@react-spring/web";
import { Suspense } from "react";
import { useState } from "react";
import { Await, Link, useNavigate } from "react-router";
import { useSprings } from "react-spring";
import { toast } from "react-toastify";
import { useDrag } from "react-use-gesture";
import { Card } from "~/components/features/opinion-card/index.js";
import Graph from "~/components/features/opinion-graph";
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
import { useWindowResize } from "~/hooks/useWindowResize";
import type { Route } from "~/react-router/_pages.swipe.$session_id/+types";
import type { VoteType } from "~/types";
import type { components } from "~/types/openapi";
import { postVote } from "~/utils/vote";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader } from "./modules/loader";
export { meta } from "./modules/meta";

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

const trans = (r: number, s: number) =>
  `rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;

const animations = {
  to: () => ({
    w: "96%",
    h: "144px",
    x: 0,
    y: 0,
    zIndex: 0,
    left: "2%",
    scale: 1,
  }),
  from: () => ({
    w: "96%",
    h: "144px",
    x: 0,
    y: -1000,
    zIndex: 0,
    left: "2%",
    rot: 0,
    scale: 1.5,
    backgroundColor: "transparent",
    agreeDisplay: "none",
    disagreeDisplay: "none",
    opacity: 0,
  }),
  init: () => ({
    w: "96%",
    h: "144px",
    x: 0,
    y: 0,
    left: "2%",
    zIndex: 0,
  }),
};

export const useSwipe = ({ opinions, onSwipe }: Props) => {
  const [gone] = useState(() => new Set<number>());

  const [item, api] = useSprings(opinions.length, () => ({
    ...animations.to(),
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
  loaderData: { opinions, session, $positions },
}: Route.ComponentProps) {
  const windowWidth = useWindowResize(374);
  const navigate = useNavigate();
  const [swipeCount, setSwipeCount] = useState(0);

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
      if (current === 0) {
        navigate(`/${session.id}`);
      }
      setSwipeCount((prev) => prev + 1);
    },
  });

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

    if (current === 0) {
      navigate(`/${session.id}`);
    }

    swipe.api.start((i) => {
      if (i !== current) {
        return;
      }

      swipe.gone.add(current);
      setSwipeCount((prev) => prev + 1);

      return {
        x: v === "agree" ? 800 : v === "disagree" ? -800 : 0,
        y: v === "pass" ? 800 : 0,
        scale: 1,
        config: { friction: 50, tension: 200 },
      };
    });
  };

  // console.log(swipe.gone.size);

  return (
    <div className="relative w-full flex-1 overflow-hidden bg-[#F2F2F7] pb-16">
      <Link
        className="flex w-full cursor-pointerp-2 items-center bg-white p-2 font-bold text-[18px]"
        to={`/${session?.id}/analysis`}
      >
        <Left className="text-black" />
        <span className="-translate-x-[13.5px] mx-auto">{session?.theme}</span>
      </Link>

      <span className="mx-[2%] block">
        <List
          className="m-2 mx-auto max-w-3xl"
          title={
            <div className="flex items-center space-x-2">
              <PieChart />
              <p>参加者のグラフ</p>
            </div>
          }
        >
          <Suspense>
            <Await resolve={$positions}>
              {({ data }) => {
                return (
                  <div className="flex w-full justify-center rounded bg-white p-2">
                    <Graph
                      polygons={data?.positions}
                      positions={data?.positions}
                      myPosition={data?.myPosition}
                      // 両方のpadding分
                      windowWidth={windowWidth - 64}
                      selectGroupId={(_id: number) => {}}
                      background={0xffffff}
                    />
                  </div>
                );
              }}
            </Await>
          </Suspense>
        </List>
      </span>

      <p className="mx-2 mt-6 text-center font-semibold text-[#8E8E93] text-lg">
        <span className="mr-2">意見</span>
        {swipeCount} / {swipe.item.length}
      </p>

      <div className="relative mx-auto mt-2 h-[168px] w-full max-w-3xl">
        {swipe.item?.map(
          (
            {
              x,
              y,
              w,
              h,
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
                className="absolute block cursor-pointer touch-none rounded bg-white will-change-transform"
                key={i}
                style={{
                  x,
                  y,
                  height: h,
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
                    className="absolute z-10 h-[144px] w-full rounded"
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
                    className="absolute z-10 h-[144px] w-full rounded"
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
                    className="pointer-events-none select-none"
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
          <p className="mt-1 text-indigo-400">パス</p>
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
