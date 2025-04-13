import { Suspense, useState } from "react";
import { Await, useRevalidator } from "react-router";
import { toast } from "react-toastify";
import { DeletedOpinionCard } from "~/components/features/deleted-opinion-card";
import { Card, OpinionCardSkeleton } from "~/components/features/opinion-card";
import Graph from "~/components/features/opinion-graph";
import type { Route } from "~/react-router/_pages.$session_id.opinion/+types";
import { postVote } from "~/utils/vote";
import { AnalyticsModal } from "./components/AnalyticsModal";
import { GroupTabs } from "./components/GroupTabs";
import { ReportModal } from "./components/ReportModal";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader } from "./modules/loader";

export default function Page({
  loaderData: { $opinions, $reasons, $user, $position },
}: Route.ComponentProps) {
  const { revalidate } = useRevalidator();
  const [isOpen, setIsOpen] = useState(false);
  const [selectOpinionID, setSelectOpinionID] = useState<string>("");
  const [isAnalayticsDialogOpen, setIsAnalayticsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("a");

  const handleVote = async (opinionID: string, voteStatus: string) => {
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
                          href={`/opinion/${id}`}
                          title={opinion.title}
                          description={opinion.content}
                          user={{ displayID, displayName, iconURL }}
                          status={myVoteType}
                          date={opinion.postedAt}
                          className="mx-auto w-full"
                          isJudgeButton={user?.displayID !== displayID}
                          isMoreButton={user?.displayID !== displayID}
                          onClickAgree={() => handleVote(id, "agree")}
                          onClickDisagree={() => handleVote(id, "disagree")}
                          onClickPass={() => handleVote(id, "pass")}
                          onClickReport={() => handleOpenModal(id)}
                          onClickAnalytics={() => handleAnalyticsModal(id)}
                          opinionCount={replyCount}
                        />
                      );
                    });

                    return (
                      <>
                        {/* FIXME: サーバーと繋げてぽよ */}
                        <GroupTabs
                          tabs={[
                            { label: "Aグループ", value: "a" },
                            { label: "Bグループ", value: "b" },
                            { label: "Cグループ", value: "c" },
                          ]}
                          activeTab={activeTab}
                          onChange={setActiveTab}
                        />
                        {opinionCardList}
                      </>
                    );
                  }}
                </Await>
              )}
            </Await>
          </Suspense>
        </div>

        <Suspense>
          <Await resolve={$position}>
            {({ data }) => {
              const positions = data?.positions.sort(
                (a, b) => (a.perimeterIndex || 0) - (b.perimeterIndex || 0),
              );

              return (
                <div className="ml-4 hidden min-w-[391px] rounded bg-white p-2 md:block">
                  <Graph
                    polygons={positions}
                    positions={data?.positions}
                    myPosition={data?.myPosition}
                    windowWidth={350}
                    selectGroupId={(_id: number) => {}}
                    background={0xffffff}
                  />
                </div>
              );
            }}
          </Await>
        </Suspense>
      </div>

      <AnalyticsModal
        isOpen={isAnalayticsDialogOpen}
        onOpenChange={setIsAnalayticsDialogOpen}
        opinionID={selectOpinionID}
      />

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
