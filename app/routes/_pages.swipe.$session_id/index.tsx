import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { Suspense, useEffect, useRef, useState } from "react";
import { Await, Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
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
import { postVote } from "~/utils/vote";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader } from "./modules/loader";
export { meta } from "./modules/meta";

// GSAPのDraggableを登録
if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable);
}

export default function Page({
  loaderData: { opinions, session, $positions },
}: Route.ComponentProps) {
  const windowWidth = useWindowResize(374);
  const navigate = useNavigate();
  const [swipeCount, setSwipeCount] = useState(0);
  // カード状態の管理
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [cardsState, setCardsState] = useState(
    opinions.map(() => ({
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      opacity: 1,
      backgroundColor: "transparent",
      agreeDisplay: "none",
      disagreeDisplay: "none",
    })),
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (opinions.length === swipeCount) {
      navigate(`/${session.id}/opinion`);
    }
  }, [swipeCount]);

  // カードのスワイプ後の処理
  const handleSwipe = async ({
    opinionStatus,
  }: { opinionStatus: VoteType }) => {
    const opinionID = opinions[swipeCount].opinion.id;

    setLoading(true);
    const { error } = await postVote({
      opinionID,
      voteStatus: opinionStatus as never,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      setSwipeCount((prev) => prev + 1);
      setLoading(false);
    }
  };

  // GSAP Draggableの設定
  useEffect(() => {
    // 各カードにDraggableを適用
    cardsRef.current.map((card, index) => {
      if (!card) {
        return null;
      }

      return Draggable.create(card, {
        type: "x,y",
        onDrag: function () {
          // ドラッグ中の回転と背景色の更新
          const rotation = this.x / 20;
          let backgroundColor = "transparent";
          let opacity = 0;
          let agreeDisplay = "none";
          let disagreeDisplay = "none";

          if (this.x > 10) {
            backgroundColor = "blue";
            opacity = this.x / 400;
            agreeDisplay = "block";
          } else if (this.x < -10) {
            backgroundColor = "red";
            opacity = -this.x / 400;
            disagreeDisplay = "block";
          }

          if (this.y < -100) {
            backgroundColor = "transparent";
            agreeDisplay = "none";
            disagreeDisplay = "none";
          }

          gsap.to(card, {
            rotation,
            duration: 0,
          });

          setCardsState((prev) => {
            return prev.map((state, i) => {
              // インデックスが一致する場合、状態を更新
              if (i === index) {
                return {
                  ...state,
                  x: this.x,
                  y: this.y,
                  rotation,
                  backgroundColor,
                  opacity,
                  agreeDisplay,
                  disagreeDisplay,
                };
              }

              // そうでない場合は状態を変更せずに返す
              return state;
            });
          });
        },
        // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
        onDragEnd() {
          const threshold = windowWidth * 0.3; // 画面幅の30%
          const xdir = this.x > threshold ? 1 : this.x < -threshold ? -1 : 0;
          const ydir = this.y > 100 ? 1 : this.y < -100 ? -1 : 0;

          let status: VoteType = "pass";

          if (xdir >= 1) {
            status = "agree";
            // カードを右に飛ばすアニメーション
            gsap.to(card, {
              x: window.innerWidth + 200,
              y: this.y,
              duration: 0.5,
              ease: "power2.out",
            });
          } else if (xdir <= -1) {
            status = "disagree";
            // カードを左に飛ばすアニメーション
            gsap.to(card, {
              x: -window.innerWidth - 200,
              y: this.y,
              duration: 0.5,
              ease: "power2.out",
            });
          } else if (ydir >= 1) {
            status = "pass";
            // カードを下に飛ばすアニメーション
            gsap.to(card, {
              x: this.x,
              y: window.innerHeight + 200,
              duration: 0.5,
              ease: "power2.out",
            });
          } else {
            // どの方向にもスワイプされなかった場合は元の位置に戻す
            gsap.to(card, {
              x: 0,
              y: 0,
              rotation: 0,
              duration: 0.5,
              ease: "elastic.out(1, 0.5)",
            });

            setCardsState((prev) => {
              return prev.map((state, i) => {
                // インデックスが一致する場合、状態を更新
                if (i === index) {
                  return {
                    ...state,
                    x: this.x,
                    y: this.y,
                    backgroundColor: "transparent",
                    agreeDisplay: "none",
                    disagreeDisplay: "none",
                  };
                }

                // そうでない場合は状態を変更せずに返す
                return state;
              });
            });
            return;
          }

          // ユーザーコールバックを呼び出し
          handleSwipe({ opinionStatus: status });
        },
      });
    });
  }, [swipeCount]);

  const handleSubmitVote = async (opinionStatus: VoteType) => {
    // カードをアニメーションで移動
    const card = cardsRef.current[swipeCount];

    if (!card) {
      return;
    }

    let x = 0;
    let y = 0;
    let rotation = 0;
    let backgroundColor = "transparent";
    let agreeDisplay = "none";
    let disagreeDisplay = "none";
    let opacity = 0;

    // ヘルパー関数
    const setAgreeStyle = () => {
      x = window.innerWidth + 200;
      rotation = 15;
      backgroundColor = "blue";
      agreeDisplay = "block";
      opacity = 0.7;
    };

    const setDisagreeStyle = () => {
      x = -window.innerWidth - 200;
      rotation = -15;
      backgroundColor = "red";
      disagreeDisplay = "block";
      opacity = 0.7;
    };

    const setPassStyle = () => {
      y = window.innerHeight + 200;
    };

    // 各ケースで単一のステートメントだけを使用
    switch (opinionStatus) {
      case "agree":
        setAgreeStyle();
        break;
      case "disagree":
        setDisagreeStyle();
        break;
      case "pass":
        setPassStyle();
        break;
      default:
        break;
    }

    gsap.to(card, {
      x,
      y,
      rotation,
      duration: 0.7,
      ease: "power2.out",
    });

    // カードの状態を更新
    setCardsState((prev) =>
      prev.map((state, i) => {
        // インデックスが一致する場合は状態を更新
        if (i === swipeCount) {
          return {
            ...state,
            x,
            y,
            rotation,
            backgroundColor,
            agreeDisplay,
            disagreeDisplay,
            opacity,
          };
        }

        // 一致しない場合は元の状態を維持
        return state;
      }),
    );

    // ユーザーコールバックを呼び出し
    handleSwipe({ opinionStatus });
  };

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
        {swipeCount} / {opinions.length}
      </p>

      <div className="relative mx-auto mt-2 h-[168px] w-full max-w-3xl">
        {opinions.map((opinion, i) => {
          const zIndex = opinions.length - i;

          const state = cardsState[i] || {
            backgroundColor: "transparent",
            agreeDisplay: "none",
            disagreeDisplay: "none",
            opacity: 0,
          };

          return (
            <div
              key={i}
              className="absolute block cursor-pointer touch-none rounded will-change-transform"
              style={{
                height: "144px",
                width: "96%",
                left: "2%",
                zIndex,
                pointerEvents: loading ? "none" : "auto",
              }}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
            >
              <div className="h-full w-full bg-white">
                {/* 重なり - 反対 */}
                <div
                  style={{
                    backgroundColor: state.backgroundColor,
                    display: state.disagreeDisplay,
                    opacity: state.opacity,
                  }}
                  className="absolute z-10 h-[144px] w-full rounded"
                />
                <p
                  style={{ display: state.disagreeDisplay }}
                  className="absolute z-10 w-full select-none p-4 text-end font-bold text-2xl text-white"
                >
                  違うかも
                </p>

                {/* 重なり - 賛成 */}
                <div
                  style={{
                    backgroundColor: state.backgroundColor,
                    display: state.agreeDisplay,
                    opacity: state.opacity,
                  }}
                  className="absolute z-10 h-[144px] w-full rounded"
                />
                <p
                  style={{ display: state.agreeDisplay }}
                  className="absolute z-10 w-full select-none p-4 font-bold text-2xl text-white"
                >
                  いいかも
                </p>

                <Card
                  title={opinion.opinion.title || ""}
                  description={opinion.opinion.content || ""}
                  user={opinion.user}
                  date={"2025/12/31 10:00"}
                  className="pointer-events-none select-none"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative mt-4 h-[160px]">
        <PointUp className="-translate-x-3/5 absolute left-1/2 mt-1" />

        <div className="absolute top-6 right-3/5 flex flex-col items-center">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmitVote("disagree")}
            className="cursor-pointer rounded-full bg-[#FF2D55] p-2 shadow-cs-normal disabled:opacity-70"
          >
            <ArrowLeft className="fill-white" />
          </button>
          <p className="mt-1 text-pink-400">違うかも</p>
        </div>

        <div className="-translate-x-1/2 absolute top-24 left-1/2 flex flex-col items-center">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmitVote("pass")}
            className="cursor-pointer rounded-full bg-[#5856D6] p-2 shadow-cs-normal disabled:opacity-70"
          >
            <ArrowDown className="fill-white" />
          </button>
          <p className="mt-1 text-indigo-400">パス</p>
        </div>

        <div className="absolute top-6 left-3/5 flex flex-col items-center">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmitVote("agree")}
            className="cursor-pointer rounded-full bg-[#32ADE6] p-2 shadow-cs-normal disabled:opacity-70"
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
