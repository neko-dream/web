import { useOutletContext, useRevalidator } from "react-router";
import { toast } from "react-toastify";
import { Card } from "~/components/Card";
import { loader } from "./modules/loader";
import { postVote } from "~/feature/opinion/libs/postVote";
import type { Route } from "~/app/routes/$session_id.opinion/+types";
import { SessionRouteContext } from "../$session_id/types";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader };

export default function Page({
  loaderData: { opinions },
}: Route.ComponentProps) {
  const { session } = useOutletContext<SessionRouteContext>();
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
    <div className="flex flex-col space-y-2">
      {opinions.map(({ opinion, user: opinionUser, myVoteType }, i) => {
        return (
          <Card
            key={i}
            href={`/opinion/${opinion.id}`}
            title={opinion.title}
            description={opinion.content}
            user={{
              displayID: "",
              displayName: opinionUser.displayName,
              iconURL: opinionUser.iconURL,
            }}
            status={myVoteType}
            date={"2025/12/31 10:00"}
            onClickAgree={() => handleSubmitVote(opinion.id, "agree")}
            onClickDisagree={() => handleSubmitVote(opinion.id, "disagree")}
            onClickPass={() => handleSubmitVote(opinion.id, "pass")}
            onClickMore={() => {}}
            isJudgeButton
          />
        );
      })}
    </div>
  );
}
