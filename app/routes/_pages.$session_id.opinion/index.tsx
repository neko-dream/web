import { useState } from "react";
import { useOutletContext, useRevalidator } from "react-router";
import { toast } from "react-toastify";
import { Card } from "~/components/features/opinion-card";
import type { Route } from "~/react-router/_pages.$session_id.opinion/+types";
import type { SessionRouteContext } from "~/types/ctx";
import { postVote } from "~/utils/vote";
import { ReportModal } from "./components/ReportModal";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader } from "./modules/loader";

export default function Page({
  loaderData: { opinions, reasons },
}: Route.ComponentProps) {
  const { user } = useOutletContext<SessionRouteContext>();
  const { revalidate } = useRevalidator();
  const [isOpen, setIsOpen] = useState(false);
  const [reportOpinionID, setReportOpinionID] = useState<string>("");

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

  const handleOpenModal = (opinionID: string) => {
    setIsOpen(true);
    setReportOpinionID(opinionID);
  };

  return (
    <div className="flex flex-col space-y-2">
      {opinions.map(
        ({ opinion, user: opinionUser, myVoteType, replyCount }, i) => {
          return (
            <Card
              key={i}
              href={`/opinion/${opinion.id}`}
              title={opinion.title}
              description={opinion.content}
              user={opinionUser}
              status={myVoteType}
              date={opinion.postedAt}
              className="mx-auto w-full max-w-2xl"
              isJudgeButton={user?.displayID !== opinionUser.displayID}
              isMoreButton={user?.displayID !== opinionUser.displayID}
              onClickAgree={() => handleSubmitVote(opinion.id, "agree")}
              onClickDisagree={() => handleSubmitVote(opinion.id, "disagree")}
              onClickPass={() => handleSubmitVote(opinion.id, "pass")}
              onClickReport={() => handleOpenModal(opinion.id)}
              onClickAnalytics={console.log}
              opinionCount={replyCount}
            />
          );
        },
      )}

      <ReportModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        reasons={reasons || []}
        opinionID={reportOpinionID}
      />
    </div>
  );
}
