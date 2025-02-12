import {
  Link,
  useLoaderData,
  useOutletContext,
  useParams,
  useRevalidator,
} from "react-router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button, { button } from "~/components/Button";
import { OpinionType } from "~/feature/opinion/types";
import CardSwiper from "./components/CardSwiper";
import { useSwipe } from "./hooks/useSwipe";
import { animations } from "./libs/animations";
import { loader } from "./modules/loader";
import { OpinionModal } from "~/feature/opinion/components/OpinionModal";
import { SessionRouteContext } from "../_pages.$id/types";
import { postVote } from "~/feature/opinion/libs/postVote";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader };

export default function Page() {
  const { session } = useOutletContext<SessionRouteContext>();
  const { data: opinions } = useLoaderData<typeof loader>();
  const [isOpinionEnd, setIsOpinionEnd] = useState<boolean>(false);
  const params = useParams();
  const swipe = useSwipe({
    opinions,
    onSwipe: async ({ opinionID, opinionStatus }) => {
      const { error } = await postVote({
        talkSessionID: session.id,
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

  const handleClose = () => {
    swipe.api.resume();
    swipe.state.setIsOpnionModalOpen(false);
    // MEMO: 元の位置に戻す
    swipe.api.start((i) => {
      const current = opinions.length - swipe.gone.size - 1;
      if (i !== current) return;

      return {
        ...animations.init(),
        y: i * 6,
      };
    });
  };

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
      talkSessionID: session.id,
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
        <Button variation="primary" onClick={handleRevalidate}>
          さらに意思表明する
        </Button>
        <Link to={`/${params.id}`} className={button({ color: "primary" })}>
          みんなの意見を見る
        </Link>
      </div>
    );
  }

  return (
    <div className="relative w-full flex-1 pt-4">
      <CardSwiper {...swipe} />

      <div className="absolute bottom-8 flex w-full justify-between space-x-2 px-4">
        <Button
          variation="disagree"
          onClick={() => handleSubmitVote("disagree")}
        >
          違うかも
        </Button>
        <Button variation="pass" onClick={() => handleSubmitVote("pass")}>
          保留
        </Button>
        <Button variation="agree" onClick={() => handleSubmitVote("agree")}>
          良さそう
        </Button>
      </div>

      <OpinionModal
        talkSessionID={session.id}
        // FIXME: useStateでアクティブな意見のIDを管理する
        parentOpinionID={
          opinions[opinions.length - swipe.gone.size - 1].opinion.id
        }
        open={swipe.state.isOpinionModalOpen}
        onClose={handleClose}
      />
    </div>
  );
}
