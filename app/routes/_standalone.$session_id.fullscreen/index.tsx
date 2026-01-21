import { Suspense, useEffect, useState } from "react";
import { Await, useRevalidator } from "react-router";
import {} from "~/components/features/opinion-card";
import Graph from "~/components/features/opinion-graph";
import { GroupTabs } from "~/components/ui/group-tabs";
import type { Route } from "./+types";
import { OpinionList } from "./components/OpinionList";

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
};

export default function Page({
  loaderData: { session, $positions },
}: Route.ComponentProps) {
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
      <p className="primary-gradient mx-auto inline-block text-clip text-center font-bold text-2xl">
        {session.theme}
      </p>

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
        </div>
      </div>
    </div>
  );
}
