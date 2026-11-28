import { Suspense, useState } from "react";
import { Await, useOutletContext, useRevalidator } from "react-router";
import { toast } from "react-toastify";
import { DeletedOpinionCard } from "~/components/features/deleted-opinion-card";
import { Card, OpinionCardSkeleton } from "~/components/features/opinion-card";
import Graph from "~/components/features/opinion-graph";
import { useAuthStore } from "~/hooks/useAuthStore";
import { useVote } from "~/hooks/useVote";
import type { Route } from "~/react-router/_pages.$session_id.opinions/+types";
import type { VoteType } from "~/types";
import type { SessionRouteContext } from "~/types/ctx";
import { isEnd } from "~/utils/format-date";
import { AnalyticsModal } from "./components/AnalyticsModal";
import { ReportModal } from "./components/ReportModal";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { clientLoader } from "./modules/loader";

export default function Page({
  loaderData: { $opinions, $reasons, $positions },
}: Route.ComponentProps) {
  const { revalidate } = useRevalidator();
  const { session } = useOutletContext<SessionRouteContext>();
  const user = useAuthStore((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [selectOpinionID, setSelectOpinionID] = useState("");
  const [isAnalyticsDialogOpen, setIsAnalyticsDialogOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState("all");

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
            <Await resolve={$positions}>
              {({ data: analysis }) => {
                const groups = analysis?.groupOpinions ?? [];
                const filterItems = [
                  { value: "all", label: "すべて" },
                  ...groups.map(({ groupName }) => ({
                    value: groupName,
                    label: groupName,
                  })),
                ];

                return (
                  <>
                    {groups.length > 0 && (
                      <div className="mx-auto flex w-full max-w-2xl flex-wrap gap-2">
                        {filterItems.map((item) => {
                          const active = activeGroup === item.value;
                          return (
                            <button
                              type="button"
                              key={item.value}
                              aria-pressed={active}
                              onClick={() => setActiveGroup(item.value)}
                              className={`flex min-h-11 cursor-pointer items-center justify-center rounded-full border px-4 py-2 font-bold text-[13px] transition-colors ${
                                active
                                  ? "border-transparent primary-gradient text-white shadow-sm"
                                  : "border-line bg-white text-ink-muted hover:bg-surface"
                              }`}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <Await resolve={$opinions}>
                      {({ data: { opinions } = { opinions: [] } }) => {
                        const selectedGroup = groups.find(
                          (group) => group.groupName === activeGroup,
                        );
                        const opinionIDs = selectedGroup
                          ? new Set(
                              selectedGroup.opinions.map(
                                ({ opinion }) => opinion.id,
                              ),
                            )
                          : null;
                        const filteredOpinions = opinionIDs
                          ? opinions.filter(({ opinion }) =>
                              opinionIDs.has(opinion.id),
                            )
                          : opinions;

                        if (filteredOpinions.length === 0) {
                          return (
                            <p className="mx-auto w-full max-w-2xl py-8 text-center text-ink-subtle text-sm">
                              {activeGroup === "all"
                                ? "まだ意見がありません。"
                                : "このグループの意見はありません。"}
                            </p>
                          );
                        }

                        return filteredOpinions.map((props, i) => {
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
                                href={`/${session.id}/opinions/${id}`}
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
                              href={`/${session.id}/opinions/${id}`}
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
                              isJudgeButtonDisabled={isEnd(
                                session.scheduledEndTime,
                              )}
                            />
                          );
                        });
                      }}
                    </Await>
                  </>
                );
              }}
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

      <Suspense fallback="Loading analytics...">
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
