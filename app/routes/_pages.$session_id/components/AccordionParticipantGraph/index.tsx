import { use } from "react";
import Graph from "~/components/features/opinion-graph";
import { PieChart } from "~/components/icons";
import { List } from "~/components/ui/acordion";
import { useWindowResize } from "~/hooks/useWindowResize";
import type { Route } from "~/react-router/_pages.$session_id/+types/route";

type Props = {
  $positions: Route.ComponentProps["loaderData"]["$positions"];
};

export const AccordionParticipantGraph = ({ $positions }: Props) => {
  const windowWidth = useWindowResize(374);
  const { data } = use($positions);

  if (data?.positions.length === 0) {
    return null;
  }

  return (
    <List
      className="block bg-gray-100 md:hidden"
      title={
        <div className="flex items-center space-x-2">
          <PieChart />
          <p>参加者のグラフ</p>
        </div>
      }
    >
      <div className="flex w-full justify-center rounded bg-white p-2 md:block">
        <Graph
          polygons={data?.positions}
          positions={data?.positions}
          myPosition={data?.myPosition}
          // 両方のpadding分
          windowWidth={windowWidth - 64}
          selectGroupId={(_id: number) => {}}
          background={0xffffff}
        />
      </div>
    </List>
  );
};
