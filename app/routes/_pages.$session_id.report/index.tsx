import { Link, useOutletContext, useRevalidator } from "react-router";
import { toast } from "react-toastify";
import { Card } from "~/components/Card";
import { loader } from "./modules/loader";
import { SessionRouteContext } from "../_pages.$session_id/types";
import { postVote } from "~/feature/opinion/libs/postVote";
import type { Route } from "~/app/routes/_pages.$session_id.report/+types";
import { Graph } from "~/feature/graph/components";
import { Arrow } from "~/components/Icons";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader };

export default function Page({
  loaderData: { opinions },
}: Route.ComponentProps) {
  const { session, user } = useOutletContext<SessionRouteContext>();
  const { revalidate } = useRevalidator();

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

  return (
    <div>
      <div className="rounded-md bg-white p-2">
        <div className="flex items-center space-x-2">
          <img src="/icon.png" alt="" className="m-1 h-7" />
          <p className="text-xs text-gray-500">ことひろAIレポート</p>
        </div>
        <p className="mt-1 text-sm text-gray-800">
          西山公園でのライブ開催を巡る議論では、Aグループが地域活性化や若いアーティストへの支援を強調。Bグループは騒音や管理の負担を懸念。Cグループは、住民の意見を聞き、規制を設けた上で試験的に開催することを提案。
        </p>
        <Link
          to={`/report/${session.id}`}
          className="m-2 flex items-center justify-end text-xs text-blue-400"
        >
          <span className="mr-1">詳しくみる</span>
          <Arrow className="rotate-270 text-blue-400" />
        </Link>
      </div>

      <Graph className="mt-2" />

      {opinions.map(({ opinion, user: opinionUser, myVoteType }, i) => {
        return (
          <Card
            href={`/opinion/${opinion.id}`}
            key={i}
            title={opinion.title}
            description={opinion.content}
            user={{
              displayID: "",
              displayName: opinionUser.displayName,
              iconURL: opinionUser.iconURL,
            }}
            status={myVoteType as never}
            className="mt-2 h-full w-full bg-white select-none"
            date={"2025/12/31 10:00"}
            onClickAgree={() => handleSubmitVote("", "agree")}
            onClickDisagree={() => handleSubmitVote("", "disagree")}
            onClickPass={() => handleSubmitVote("", "pass")}
            onClickMore={() => {}}
            isJudgeButton={user?.displayId !== opinionUser.displayID}
          />
        );
      })}
    </div>
  );
}
