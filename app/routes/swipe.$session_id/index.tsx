import { Link, useNavigate, useParams, useRevalidator } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, button } from "~/components/Button";
import { OpinionType } from "~/feature/opinion/types";
import CardSwiper from "./components/CardSwiper";
import { useSwipe } from "./hooks/useSwipe";
import { animations } from "./libs/animations";
import { loader } from "./modules/loader";
import { postVote } from "~/feature/opinion/libs/postVote";
import type { Route } from "~/app/routes/swipe.$session_id/+types";
import { Graph } from "~/feature/graph/components";
import { List } from "~/feature/acordion";
import {
  Left,
  PointUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  PieChart,
  InfoCircle,
} from "~/components/Icons";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader };

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
        if (current === 0) setIsOpinionEnd(true);
      }, 300);
    },
  });

  const revalidate = useRevalidator();

  useEffect(() => {
    if (!opinions.length) {
      setIsOpinionEnd(true);
    }
  }, [opinions]);

  if (!opinions.length) {
    return (
      <div className="relative flex w-full flex-1 flex-col items-center justify-center">
        <p>全ての意見に意思表明しました🎉</p>
        <Link
          to={`/${params.id}`}
          className={button({ color: "primary", className: "mt-4" })}
        >
          みんなの意見を見る
        </Link>
      </div>
    );
  }

  const handleSubmitVote = async (v: OpinionType) => {
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
      if (current === 0) setIsOpinionEnd(true);
    }, 300);

    swipe.api.start((i) => {
      if (i !== current) return;

      swipe.gone.add(current);

      return {
        x: v === "agree" ? 800 : v == "disagree" ? -800 : 0,
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
        className="cursor-pointerp-2 flex w-full bg-white p-2 text-[18px] font-bold"
        onClick={() => navigate(-1)}
      >
        <Left className="text-black" />
        <span className="mx-auto -translate-x-[13.5px]">{session.theme}</span>
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

      <div className="relative mt-4 h-[168px]">
        <CardSwiper {...swipe} />
      </div>

      <div className="relative mt-4 h-[160px]">
        <PointUp className="absolute left-1/2 mt-1 -translate-x-3/5" />

        <div className="absolute top-6 right-3/5 flex flex-col items-center">
          <button
            onClick={() => handleSubmitVote("disagree")}
            className="rounded-full border border-pink-400 p-1"
          >
            <ArrowLeft />
          </button>
          <p className="mt-1 text-pink-400">違うかも</p>
        </div>

        <div className="absolute top-24 left-1/2 flex -translate-x-1/2 flex-col items-center">
          <button
            onClick={() => handleSubmitVote("pass")}
            className="rounded-full border border-indigo-400 p-1"
          >
            <ArrowDown />
          </button>
          <p className="mt-1 text-indigo-400">保留</p>
        </div>

        <div className="absolute top-6 left-3/5 flex flex-col items-center">
          <button
            onClick={() => handleSubmitVote("agree")}
            className="rounded-full border border-cyan-400 p-1"
          >
            <ArrowRight />
          </button>
          <p className="mt-1 text-cyan-400">良さそう</p>
        </div>
      </div>

      <Link
        to="#"
        className="mt-4 flex items-center justify-center text-sm text-blue-500"
      >
        <InfoCircle />
        <span>この画面の操作ヒント</span>
      </Link>
    </div>
  );
}
