import { MapPin } from "lucide-react";
import { use } from "react";
import Graph from "~/components/features/opinion-graph";
import { List } from "~/components/ui/accordion";
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
      className="rounded-2xl bg-[#EAEEF3] px-4"
      title={
        <div className="flex items-center gap-1 py-1">
          <MapPin className="size-6 text-[#71787E]" />
          <p className="font-bold text-[#71787E] text-sm">意見グループマップ</p>
        </div>
      }
    >
      <div className="flex w-full justify-center rounded">
        <Graph
          polygons={data?.positions}
          positions={data?.positions}
          myPosition={data?.myPosition}
          // 両方のpadding分
          windowWidth={windowWidth - 64}
          selectGroupId={(_id: number) => {}}
          background={0xf1f3f5}
        />
      </div>
    </List>
  );
};
