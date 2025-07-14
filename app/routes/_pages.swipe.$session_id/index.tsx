import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { Suspense, useEffect, useRef, useState } from "react";
import { Await, Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { HintSwipeModal } from "~/components/features/hint-swipe-modal";
import { Card } from "~/components/features/opinion-card/index.js";
import Graph from "~/components/features/opinion-graph";
import {
  ArrowLeft,
  ArrowRight,
  InfoCircle,
  Left,
  Meh,
  PieChart,
  Reload,
} from "~/components/icons";
import { List } from "~/components/ui/accordion";
import { useWindowResize } from "~/hooks/useWindowResize";
import type { Route } from "~/react-router/_pages.swipe.$session_id/+types";
import type { VoteType } from "~/types";
import { postVote } from "./libs";

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
    })),
  );
  const [loading, setLoading] = useState(false);
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [swipeHistory, setSwipeHistory] = useState<
    Array<{ index: number; status: VoteType }>
  >([]);
  const [cardZIndexes, setCardZIndexes] = useState<Record<number, number>>({});

  // 初期z-indexの設定
  useEffect(() => {
    const initialZIndexes: Record<number, number> = {};
    opinions.forEach((_, index) => {
      initialZIndexes[index] = opinions.length - index;
    });
    setCardZIndexes(initialZIndexes);
  }, [opinions]);

  useEffect(() => {
    if (opinions.length === swipeCount) {
      navigate(`/${session.id}/opinions`);
    }
  }, [swipeCount]);

  // カードのスワイプ後の処理
  const handleSwipe = async ({
    opinionStatus,
  }: {
    opinionStatus: VoteType;
  }) => {
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
      // スワイプ履歴に追加
      setSwipeHistory((prev) => [
        ...prev,
        { index: swipeCount, status: opinionStatus },
      ]);
      setSwipeCount((prev) => prev + 1);
      setLoading(false);
    }
  };

  // 戻るボタンの処理
  const handleUndo = () => {
    if (swipeHistory.length === 0 || swipeCount === 0) {
      return;
    }

    // 最後のスワイプ履歴を取得
    const lastSwipe = swipeHistory[swipeHistory.length - 1];

    // スワイプカウントを戻す
    setSwipeCount(lastSwipe.index);

    // スワイプ履歴から最後の要素を削除
    setSwipeHistory((prev) => prev.slice(0, -1));

    // 対象のカードを取得
    const cardIndex = lastSwipe.index;
    const card = cardsRef.current[cardIndex];

    if (card) {
      // カードを元の位置とスタイルに戻すアニメーション
      gsap.to(card, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.5,
        ease: "power2.out",
      });

      // カードの状態を初期状態に戻す
      setCardsState((prev) =>
        prev.map((state, i) => {
          if (i === cardIndex) {
            return {
              ...state,
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              opacity: 1,
              backgroundColor: "transparent",
            };
          }
          return state;
        }),
      );

      // 戻したカードを一番上に表示するためにz-indexを更新
      setCardZIndexes((prev) => {
        const maxZIndex = Math.max(...Object.values(prev));
        return {
          ...prev,
          [cardIndex]: maxZIndex + 1,
        };
      });
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
        zIndexBoost: false,
        onDrag: function () {
          // ドラッグ中の回転と背景色の更新
          const rotation = this.x / 20;
          let backgroundColor = "transparent";
          let opacity = 0;

          if (this.x > 10) {
            backgroundColor = "blue";
            opacity = this.x / 400;
          } else if (this.x < -10) {
            backgroundColor = "red";
            opacity = -this.x / 400;
          }

          if (this.y < -100) {
            backgroundColor = "transparent";
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
    let opacity = 0;

    // 各ケースで単一のステートメントだけを使用
    switch (opinionStatus) {
      case "agree": {
        x = window.innerWidth + 200;
        rotation = 15;
        backgroundColor = "blue";
        opacity = 0.7;
        break;
      }
      case "disagree": {
        x = -window.innerWidth - 200;
        rotation = -15;
        backgroundColor = "red";
        opacity = 0.7;
        break;
      }
      case "pass": {
        y = window.innerHeight + 200;
        break;
      }
      default:
        break;
    }

    // カードの状態を即座に更新して重なりを表示
    setCardsState((prev) =>
      prev.map((state, i) => {
        if (i === swipeCount) {
          return {
            ...state,
            backgroundColor,
            opacity,
          };
        }
        return state;
      }),
    );

    gsap.to(card, {
      x,
      y,
      rotation,
      duration: 0.7,
      ease: "power2.out",
      onComplete: () => {
        // アニメーション完了後に最終状態を更新
        setCardsState((prev) =>
          prev.map((state, i) => {
            if (i === swipeCount) {
              return {
                ...state,
                x,
                y,
                rotation,
                backgroundColor,
                opacity,
              };
            }
            return state;
          }),
        );
      },
    });

    // ユーザーコールバックを呼び出し
    handleSwipe({ opinionStatus });
  };

  return (
    <div className="bg-[#F2F2F7]">
      <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#F2F2F7]">
        <div className="flex items-center bg-white p-2">
          <Link to={`/${session.id}`}>
            <Left className="fill-gray-600" />
          </Link>
          <span className="mx-auto pr-6 font-bold">{session.theme}</span>
        </div>

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

        <p className="mx-2 mt-2 text-center font-semibold text-[#8E8E93] text-lg">
          <span className="mr-2">意見</span>
          {swipeCount} / {opinions.length}
        </p>

        {/* カードエリア */}
        <div className="relative mx-auto mt-2 mb-[200px] h-full min-h-[250px] w-full max-w-3xl">
          {opinions.map((opinion, i) => {
            const zIndex = cardZIndexes[i] || opinions.length - i;

            const state = cardsState[i] || {
              backgroundColor: "transparent",
              opacity: 0,
            };

            return (
              <div
                key={i}
                className="absolute block cursor-pointer touch-none rounded bg-white will-change-transform"
                style={{
                  minHeight: "250px",
                  height: "100%",
                  width: "96%",
                  left: "2%",
                  zIndex,
                  pointerEvents: loading ? "none" : "auto",
                }}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
              >
                {/* 重なり - 反対 */}

                <div
                  style={{
                    backgroundColor: state.backgroundColor,
                    display:
                      state.backgroundColor === "transparent"
                        ? "none"
                        : "block",
                    opacity: state.opacity,
                  }}
                  className="absolute z-1 h-full w-full rounded"
                />
                <p
                  style={{
                    display: state.backgroundColor === "red" ? "block" : "none",
                  }}
                  className="absolute z-1 w-full select-none p-4 text-end font-bold text-2xl text-white"
                >
                  違うかも
                </p>
                <p
                  style={{
                    display:
                      state.backgroundColor === "blue" ? "block" : "none",
                  }}
                  className="absolute z-1 w-full select-none p-4 font-bold text-2xl text-white"
                >
                  いいかも
                </p>

                <Card
                  title={opinion.opinion.title || ""}
                  description={opinion.opinion.content || ""}
                  user={opinion.user}
                  date={opinion.opinion.postedAt}
                  className="pointer-events-none select-none"
                  isAllText={true}
                />
              </div>
            );
          })}
        </div>

        <HintSwipeModal
          isOpen={isHintModalOpen}
          onOpenChange={setIsHintModalOpen}
        />
      </div>

      <div className="sticky z-50 bottom-0 w-full p-4 rounded-md">
        <div className="flex justify-around bg-white/80 pt-3">
          <div className="flex flex-col items-center">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmitVote("disagree")}
              className="cursor-pointer rounded-full bg-cs-disagree p-2 disabled:opacity-70"
            >
              <ArrowLeft className="fill-white" />
            </button>
            <p className="mt-1 text-cs-disagree">違うかも</p>
          </div>

          <div className="flex flex-col items-center">
            <button
              type="button"
              disabled={loading || swipeCount === 0}
              className="cursor-pointer rounded-full bg-black p-2 disabled:opacity-70"
              onClick={handleUndo}
            >
              <Reload className="fill-white" />
            </button>
            <p className="mt-1 ">戻る</p>
          </div>

          <div className="flex flex-col items-center">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmitVote("pass")}
              className="cursor-pointer rounded-full bg-cs-pass p-2 disabled:opacity-70"
            >
              <Meh className="fill-white" />
            </button>
            <p className="mt-1 text-cs-pass">パス</p>
          </div>

          <div className="flex flex-col items-center">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmitVote("agree")}
              className="cursor-pointer rounded-full bg-cs-agree p-2 disabled:opacity-70"
            >
              <ArrowRight className="fill-white" />
            </button>
            <p className="mt-1 text-cs-agree">良さそう</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsHintModalOpen(true)}
          className="w-full flex items-center justify-center bg-white/80 py-2"
        >
          <InfoCircle />
          <span className="text-blue-500 text-sm">この画面の操作ヒント</span>
        </button>
      </div>
    </div>
  );
}
