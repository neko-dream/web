import { useState } from "react";
import { useOutletContext, useRevalidator } from "react-router";
import { toast } from "react-toastify";
import { DeletedOpinionCard } from "~/components/features/deleted-opinion-card";
import { Card } from "~/components/features/opinion-card";
import type { Route } from "~/react-router/_pages.$session_id.opinion/+types";
import type { SessionRouteContext } from "~/types/ctx";
import { postVote } from "~/utils/vote";
import { AnalyticsModal } from "./components/AnalyticsModal";
import { ReportModal } from "./components/ReportModal";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader } from "./modules/loader";

export default function Page({
  loaderData: { opinions, reasons },
}: Route.ComponentProps) {
  const { user } = useOutletContext<SessionRouteContext>();
  const { revalidate } = useRevalidator();
  const [isOpen, setIsOpen] = useState(false);
  const [selectOpinionID, setSelectOpinionID] = useState<string>("");
  const [isAnalayticsDialogOpen, setIsAnalayticsDialogOpen] = useState(false);

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
    setSelectOpinionID(opinionID);
  };

  const handleAnalyticsModal = (opinionID: string) => {
    setIsAnalayticsDialogOpen(true);
    setSelectOpinionID(opinionID);
  };

  return (
    <div className="flex flex-col space-y-2">
      {opinions.map(
        ({ opinion, user: opinionUser, myVoteType, replyCount }, i) => {
          if (opinion.isDeleted) {
            return (
              <DeletedOpinionCard
                key={i}
                href={`/opinion/${opinion.id}`}
                description={opinion.content}
                date={opinion.postedAt}
                opinionCount={replyCount}
                className="mx-auto w-full max-w-2xl"
              />
            );
          }

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
              onClickAnalytics={() => handleAnalyticsModal(opinion.id)}
              opinionCount={replyCount}
            />
          );
        },
      )}

      <AnalyticsModal
        isOpen={isAnalayticsDialogOpen}
        onOpenChange={setIsAnalayticsDialogOpen}
        opinionID={selectOpinionID}
      />

      <ReportModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        reasons={reasons || []}
        opinionID={selectOpinionID}
      />
    </div>
  );
}
