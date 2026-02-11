import { Suspense, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Await, useRevalidator } from "react-router";
import {} from "~/components/features/opinion-card";
import Graph from "~/components/features/opinion-graph";
import { GroupTabs } from "~/components/ui/group-tabs";
import type { Route } from "./+types";
import { OpinionList } from "./components/OpinionList";
import { ReportStopButton } from "./components/ReportStopButton";
import { Tabs } from "./components/Tabs";

const MAIN_TABS = [
  { label: "意見", value: "opinions" },
  { label: "レポート", value: "report" },
];

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
  loaderData: { session, $positions, $reports },
}: Route.ComponentProps) {
  const [currentTab, setCurrentTab] = useState("opinions");
  const [activeTab, setActiveTab] = useState("A");
  const { revalidate } = useRevalidator();

  useEffect(() => {
    $positions.then(console.log);
    const interval = setInterval(() => {
      revalidate();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
    <div className=" min-h-screen bg-[#F2F2F7] p-4">
      <div className="flex items-center justify-between">
        <p className="primary-gradient inline-block text-clip text-center font-bold text-2xl">
          {session.theme}
        </p>
        <ReportStopButton defaultDisableAnalysis={session.disableAnalysis} />
      </div>

      <Tabs tabs={MAIN_TABS} activeTab={currentTab} onChange={setCurrentTab} />

      <div className="mt-4 flex items-start justify-center gap-4">
        <Suspense>
          <Await resolve={$positions}>
            {({ data }) => (
              <Graph
                polygons={data?.positions}
                positions={data?.positions}
                myPosition={data?.myPosition}
                windowWidth={800}
                background={0xffffff}
                selectGroupId={handleSelectGroup}
              />
            )}
          </Await>
        </Suspense>

        <div className="flex w-full max-w-2xl flex-col gap-1">
          {currentTab === "opinions" ? (
            <>
              <Suspense>
                <Await resolve={$positions}>
                  {({ data }) => {
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
                      <GroupTabs
                        tabs={groups}
                        activeTab={activeTab}
                        onChange={setActiveTab}
                      />
                    );
                  }}
                </Await>
              </Suspense>

              <Suspense>
                <OpinionList $positions={$positions} activeTab={activeTab} />
              </Suspense>
            </>
          ) : (
            <Suspense>
              {/* ここにレポートを表示させたい */}
              <Await resolve={$reports}>
                {({ data }) => {
                  return (
                    <div className="rounded-md bg-white p-4">
                      <ReactMarkdown>{data?.report}</ReactMarkdown>
                    </div>
                  );
                }}
              </Await>
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}
