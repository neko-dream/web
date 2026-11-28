import { use } from "react";
import { Card } from "~/components/features/opinion-card";
import type { Route } from "~/react-router/_standalone.$session_id.fullscreen/+types";

type Props = {
  $positions: Route.ComponentProps["loaderData"]["$positions"];
  activeTab: string;
  className?: string;
};

export const OpinionList = ({ $positions, activeTab }: Props) => {
  const { data } = use($positions);
  // 選択されているグループのみ抽出
  const selectedGroup = data?.groupOpinions.find((group) => {
    return group.groupName === activeTab;
  });

  return selectedGroup?.opinions.map(({ opinion, user }, i) => {
    return (
      <Card
        key={i}
        title={opinion.title}
        description={opinion.content}
        user={user}
        date={opinion.postedAt}
      />
    );
  });
};
