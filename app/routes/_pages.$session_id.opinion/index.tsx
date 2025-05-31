import { Suspense, useState } from "react";
import { Await, useOutletContext, useRevalidator } from "react-router";
import { toast } from "react-toastify";
import { DeletedOpinionCard } from "~/components/features/deleted-opinion-card";
import { Card, OpinionCardSkeleton } from "~/components/features/opinion-card";
import Graph from "~/components/features/opinion-graph";
import { useVote } from "~/hooks/useVote";
import type { Route } from "~/react-router/_pages.$session_id.opinion/+types";
import type { VoteType } from "~/types";
import type { SessionRouteContext } from "~/types/ctx";
import { AnalyticsModal } from "./components/AnalyticsModal";
import { ReportModal } from "./components/ReportModal";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader } from "./modules/loader";

export default function Page({
  loaderData: { $opinions, $reasons, $user, $positions },
}: Route.ComponentProps) {
  const { revalidate } = useRevalidator();
  const { session } = useOutletContext<SessionRouteContext>();
  const [isOpen, setIsOpen] = useState(false);
  const [selectOpinionID, setSelectOpinionID] = useState("");
  const [isAnalyticsDialogOpen, setIsAnalyticsDialogOpen] = useState(false);

  const { vote } = useVote({ sessionID: session.id });

  const handleVote = async (opinionID: string, status: VoteType) => {
    const result = await vote({ opinionID, status });
    if (result === "success") {
      toast.success("意思表明を行いました");
      revalidate();
    } else if (result === "error") {
      toast.error("意思表明に失敗しました");
    }
  };

  const handleOpenModal = (opinionID: string) => {
    setIsOpen(true);
    setSelectOpinionID(opinionID);
  };

  const handleAnalyticsModal = (opinionID: string) => {
    setIsAnalyticsDialogOpen(true);
    setSelectOpinionID(opinionID);
  };

  return (
    <>
      <div className="mx-auto flex max-w-4xl items-start justify-center">
        <div className="w-full space-y-2">
          <Suspense fallback={<OpinionCardSkeleton />}>
            <Await resolve={$opinions}>
              {({ data: { opinions } = { opinions: [] } }) => (
                <Await resolve={$user}>
                  {({ data: user }) => {
                    const opinionCardList = opinions.map((props, i) => {
                      const {
                        opinion: { id, ...opinion },
                        user: { displayID, displayName, iconURL },
                        myVoteType,
                        replyCount,
                      } = props;

                      if (opinion.isDeleted) {
                        return (
                          <DeletedOpinionCard
                            key={i}
                            href={`/opinion/${id}`}
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
                          href={`/opinion/${id}/${session.id}`}
                          title={opinion.title}
                          description={opinion.content}
                          user={{ displayID, displayName, iconURL }}
                          status={myVoteType}
                          date={opinion.postedAt}
                          className="mx-auto w-full max-w-2xl"
                          isJudgeButton={user?.displayID !== displayID}
                          isMoreButton={user?.displayID !== displayID}
                          onClickAgree={() => handleVote(id, "agree")}
                          onClickDisagree={() => handleVote(id, "disagree")}
                          onClickPass={() => handleVote(id, "pass")}
                          onClickReport={() => handleOpenModal(id)}
                          onClickAnalytics={() => handleAnalyticsModal(id)}
                          opinionCount={replyCount}
                          isJudgeButtonDisabled={!!myVoteType}
                        />
                      );
                    });

                    return opinionCardList;
                  }}
                </Await>
              )}
            </Await>
          </Suspense>
        </div>

        {/* PCで表示するようのグラフ */}
        <Suspense>
          <Await resolve={$positions}>
            {({ data }) => {
              if (data?.positions.length === 0) {
                return null;
              }

              return (
                <div className="ml-4 hidden min-w-[346px] rounded bg-white p-2 md:block">
                  <Graph
                    polygons={data?.positions}
                    positions={data?.positions}
                    myPosition={data?.myPosition}
                    windowWidth={330}
                    selectGroupId={(_id: number) => {}}
                    background={0xffffff}
                  />
                </div>
              );
            }}
          </Await>
        </Suspense>
      </div>

      <Suspense>
        <AnalyticsModal
          isOpen={isAnalyticsDialogOpen}
          onOpenChange={setIsAnalyticsDialogOpen}
          opinionID={selectOpinionID}
        />
      </Suspense>

      <Suspense>
        <Await resolve={$reasons}>
          {({ data: reasons }) => {
            return (
              <ReportModal
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                reasons={reasons || []}
                opinionID={selectOpinionID}
              />
            );
          }}
        </Await>
      </Suspense>
    </>
  );
}
