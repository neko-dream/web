import { useOutletContext, useRevalidator } from "react-router";
import { toast } from "react-toastify";
import { Card } from "~/components/Card";
import { loader } from "./modules/loader";
import { postVote } from "~/features/opinion/libs/postVote";
import type { Route } from "~/app/routes/_pages.$session_id.opinion/+types";
import { SessionRouteContext } from "../_pages.$session_id/types";
import { OpinionType } from "~/features/opinion/types";
import { useState } from "react";
import { ReportModal } from "~/features/report/ReportModal";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader };

export default function Page({
  loaderData: { opinions, reasons },
}: Route.ComponentProps) {
  const { user } = useOutletContext<SessionRouteContext>();
  const { revalidate } = useRevalidator();
  const [isOpen, setIsOpen] = useState(false);

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

  const handleOpenModal = () => {
    setIsOpen(true);
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
            // FIXME: サーバー対応待ち
            status={myVoteType as OpinionType | undefined}
            date={"2025/12/31 10:00"}
            className="mx-auto w-full max-w-2xl"
            isJudgeButton={user?.displayId !== opinionUser.displayID}
            isMoreButton={user?.displayId !== opinionUser.displayID}
            onClickAgree={() => handleSubmitVote(opinion.id, "agree")}
            onClickDisagree={() => handleSubmitVote(opinion.id, "disagree")}
            onClickPass={() => handleSubmitVote(opinion.id, "pass")}
            onClickReport={handleOpenModal}
            onClickAnalytics={handleOpenModal}
          />
        );
      })}

      <ReportModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        reasons={reasons || []}
      />
    </div>
  );
}
