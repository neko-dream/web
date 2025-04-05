/* eslint-disable import/no-named-as-default */
import { Link, useOutletContext, useRevalidator } from "react-router";
import { toast } from "react-toastify";
import { Card } from "~/components/Card";
import { loader } from "./modules/loader";
import { SessionRouteContext } from "../_pages.$session_id/types";
import { postVote } from "~/features/opinion/libs/postVote";
import type { Route } from "~/app/routes/_pages.$session_id.report/+types";
import Graph from "~/features/graph/components";
import { Arrow } from "~/components/Icons";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader };

export default function Page({
  loaderData: { opinions, report, position },
}: Route.ComponentProps) {
  const { session } = useOutletContext<SessionRouteContext>();
  const { revalidate } = useRevalidator();
  const [windowWidth, setWindowWidth] = useState(374);

  const handleSubmitVote = async (opinionID: string, voteStatus: string) => {
    const { data, error } = await postVote({
      opinionID,
      voteStatus: voteStatus as never,
    });

    if (data) {
      toast.success("意思表明を行いました");
      revalidate();
    }

    if (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const _windowWidth = window.innerWidth;
    setWindowWidth(_windowWidth);
    const resize = () => {
      const _windowWidth = window.innerWidth;
      setWindowWidth(_windowWidth);
    };
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  // グループ３が一番意見多そうなので、グループ３の意見を取得
  // ついでにインデックス順にする
  const positions = position?.positions
    // .filter((opinion) => {
    //   return (
    //     opinion.groupId === 3 &&
    //     (opinion.perimeterIndex || opinion.perimeterIndex === 0)
    //   );
    // })
    .sort((a, b) => (a.perimeterIndex || 0) - (b.perimeterIndex || 0));

  return (
    <div>
      <div className="mx-auto w-full max-w-2xl rounded-md bg-white p-2">
        <div className="flex items-center space-x-2">
          <img src="/icon.png" alt="" className="m-1 h-7" />
          <p className="text-xs text-gray-500">ことひろAIレポート</p>
        </div>
        <article className="mt-1 line-clamp-4 text-sm text-gray-800">
          <ReactMarkdown>{report}</ReactMarkdown>
        </article>
        <Link
          to={`/report/${session.id}`}
          className="m-2 flex items-center justify-end text-xs text-blue-400"
        >
          <span className="mr-1">詳しくみる</span>
          <Arrow className="rotate-270 text-blue-400" />
        </Link>
      </div>

      <div className="mx-auto mt-2 flex w-full max-w-2xl justify-center">
        <Graph
          polygons={positions}
          positions={position?.positions}
          myPosition={position?.myPosition}
          windowWidth={windowWidth}
          selectGroupId={(id: number) => {
            console.log(id);
          }}
        />
      </div>

      <div className="mt-2 flex flex-col space-y-4">
        {opinions.map(({ opinion, user: opinionUser, myVoteType }, i) => {
          return (
            <Card
              href={`/opinion/${opinion.id}`}
              key={i}
              title={opinion.title}
              description={opinion.content}
              user={opinionUser}
              status={myVoteType}
              date={opinion.postedAt}
              onClickAgree={() => handleSubmitVote("", "agree")}
              onClickDisagree={() => handleSubmitVote("", "disagree")}
              onClickPass={() => handleSubmitVote("", "pass")}
              className="mx-auto w-full max-w-2xl"
            />
          );
        })}
      </div>
    </div>
  );
}
