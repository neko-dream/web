import { Suspense, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Await, Link, useOutletContext } from "react-router";
import { Card } from "~/components/features/opinion-card";
import Graph from "~/components/features/opinion-graph";
import { Arrow } from "~/components/icons";
import { useWindowResize } from "~/hooks/useWindowResize";
import type { Route } from "~/react-router/_pages.$session_id.analysis/+types";
import type { SessionRouteContext } from "~/types/ctx";
import { GroupTabs } from "../_pages.$session_id.opinion/components/GroupTabs";
import { loader } from "./modules/loader";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader };

const GROUP_NAME_MAP: { readonly [key: number]: string } = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
  4: "E",
  5: "F",
  6: "G",
  7: "H",
  8: "I",
  9: "J",
};

export default function Page({
  loaderData: { $opinions, $reports, $positions },
}: Route.ComponentProps) {
  const { session } = useOutletContext<SessionRouteContext>();
  const windowWidth = useWindowResize(374);
  const [activeTab, setActiveTab] = useState("A");

  return (
    <div className="mx-auto flex max-w-4xl items-start">
      <div className="w-full">
        <div className="mx-auto w-full max-w-2xl rounded-md bg-white p-2">
          <div className="flex items-center space-x-2">
            <img src="/icon.png" alt="" className="m-1 h-7" />
            <p className="text-gray-500 text-xs">ことひろAIレポート</p>
          </div>
          <article className="mt-1 line-clamp-4 text-gray-800 text-sm">
            <Suspense>
              <Await resolve={$reports}>
                {({ data }) => {
                  return <ReactMarkdown>{data?.report}</ReactMarkdown>;
                }}
              </Await>
            </Suspense>
          </article>
          <Link
            to={`/report/${session.id}`}
            className="m-2 flex items-center justify-end text-blue-400 text-xs"
          >
            <span className="mr-1">詳しくみる</span>
            <Arrow className="rotate-270 text-blue-400" />
          </Link>
        </div>

        {/* モバイルで表示するようのグラフ */}
        <Suspense>
          <Await resolve={$positions}>
            {({ data }) => {
              if (data?.positions.length === 0) {
                return null;
              }

              const uniqueGroupIDsSet = new Set(
                data?.positions?.map((p) => p.groupID) || [],
              );

              const groups = new Array(uniqueGroupIDsSet.size)
                .fill(0)
                .map((_, i) => {
                  return GROUP_NAME_MAP[i];
                });

              return (
                <>
                  <div className="mx-auto mt-2 block w-full max-w-2xl rounded bg-white p-2 md:hidden">
                    <Graph
                      polygons={data?.positions}
                      positions={data?.positions}
                      myPosition={data?.myPosition}
                      windowWidth={windowWidth - 48}
                      selectGroupId={(v: number) => {
                        setActiveTab(GROUP_NAME_MAP[v]);
                      }}
                      background={0xffffff}
                    />
                  </div>

                  <div className="mt-2">
                    <GroupTabs
                      tabs={groups.map((group) => {
                        return {
                          label: `${group}`,
                          value: group,
                        };
                      })}
                      activeTab={activeTab}
                      onChange={setActiveTab}
                    />
                  </div>
                </>
              );
            }}
          </Await>
        </Suspense>

        <div className="mt-2 flex flex-col space-y-2">
          <Suspense>
            <Await resolve={$opinions}>
              {({ data }) => {
                return data?.opinions
                  .filter(() => {
                    // FIXME: ここでフィルタリングしているが、サーバーから返ってこない
                    return true;
                  })
                  .map(({ opinion, user: opinionUser, myVoteType }, i) => {
                    return (
                      <Card
                        href={`/opinion/${opinion.id}`}
                        key={i}
                        title={opinion.title}
                        description={opinion.content}
                        user={opinionUser}
                        status={myVoteType}
                        date={opinion.postedAt}
                        className="mx-auto w-full max-w-2xl"
                      />
                    );
                  });
              }}
            </Await>
          </Suspense>
        </div>
      </div>

      {/* PCで表示するようのグラフ */}
      <Suspense>
        <Await resolve={$positions}>
          {({ data }) => {
            return (
              <div className="ml-4 hidden min-w-[346px] rounded bg-white p-2 md:block">
                <Graph
                  polygons={data?.positions}
                  positions={data?.positions}
                  myPosition={data?.myPosition}
                  windowWidth={330}
                  selectGroupId={(v: number) => {
                    setActiveTab(GROUP_NAME_MAP[v]);
                  }}
                  background={0xffffff}
                />
              </div>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
