import { Suspense, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Await, Link, useOutletContext } from "react-router";
import Graph from "~/components/features/opinion-graph";
import { Arrow } from "~/components/icons";
import { GroupTabs } from "~/components/ui/group-tabs";
import { useWindowResize } from "~/hooks/useWindowResize";
import type { Route } from "~/react-router/_pages.$session_id.analysis/+types";
import type { SessionRouteContext } from "~/types/ctx";
import { OpinionList } from "./components/OpinionList";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader } from "./modules/loader";

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
  10: "K",
  11: "L",
  12: "M",
  13: "N",
  14: "O",
  15: "P",
  16: "Q",
  17: "R",
  18: "S",
  19: "T",
  20: "U",
  21: "V",
  22: "W",
  23: "X",
  24: "Y",
  25: "Z",
};

export default function Page({
  loaderData: { $reports, $positions },
}: Route.ComponentProps) {
  const { session } = useOutletContext<SessionRouteContext>();
  const [activeTab, setActiveTab] = useState("A");
  const windowWidth = useWindowResize(374);

  // グループ名を取得する関数
  const handleSelectGroup = (id: number) => {
    setActiveTab(GROUP_NAME_MAP[id]);
  };

  // グループIDを抽出する関数
  const extractGroups = (groupIDs: { groupID: number }[]) => {
    const uniqueGroupIDsSet = new Set(groupIDs.map((p) => p.groupID));
    return new Array(uniqueGroupIDsSet.size).fill(0).map((_, i) => {
      return GROUP_NAME_MAP[i];
    });
  };

  return (
    <div className="mx-auto flex max-w-4xl items-start">
      <div className="w-full">
        <Suspense>
          <Await resolve={$reports}>
            {({ data }) => {
              return (
                <div className="mx-auto w-full max-w-2xl rounded-md bg-white p-2">
                  <div className="flex items-center space-x-2">
                    <img src="/icon.png" alt="" className="m-1 h-7" />
                    <p className="text-gray-500 text-xs">ことひろAIレポート</p>
                  </div>
                  <article className="mt-1 line-clamp-4 text-gray-800 text-sm">
                    <ReactMarkdown>{data?.report}</ReactMarkdown>
                    {!data?.report && (
                      <p className="py-4 text-center">
                        まだレポートがありません。意見を投稿してみよう🎵
                      </p>
                    )}
                  </article>
                  {data?.report && (
                    <Link
                      to={`/${session.id}/analysis/details`}
                      className="m-2 flex items-center justify-end text-blue-400 text-xs"
                    >
                      <span className="mr-1 text-base">詳しくみる</span>
                      <Arrow className="rotate-270 text-blue-400" />
                    </Link>
                  )}
                </div>
              );
            }}
          </Await>
        </Suspense>

        {/* モバイルで表示するようのグラフ */}
        <Suspense>
          <Await resolve={$positions}>
            {({ data }) => {
              if (data?.positions.length === 0) {
                return null;
              }

              // グループIDの抽出
              const groups = extractGroups(data?.positions || []).map(
                (group) => {
                  return {
                    label: `${group}`,
                    value: group,
                  };
                },
              );

              return (
                <>
                  <div className="mx-auto mt-2 block w-full max-w-2xl rounded p-2 md:hidden">
                    <Graph
                      polygons={data?.positions}
                      positions={data?.positions}
                      myPosition={data?.myPosition}
                      windowWidth={windowWidth - 48}
                      selectGroupId={handleSelectGroup}
                    />
                  </div>

                  <div className="mt-2">
                    <GroupTabs
                      tabs={groups}
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
            <OpinionList
              $positions={$positions}
              sessionID={session.id}
              activeTab={activeTab}
            />
          </Suspense>
        </div>
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
                  selectGroupId={handleSelectGroup}
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
