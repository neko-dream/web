import { use } from "react";
import { Card } from "~/components/features/opinion-card";
import type { Route } from "~/react-router/_pages.$session_id.analysis/+types";

type Props = {
  $positions: Route.ComponentProps["loaderData"]["$positions"];
  sessionID: string;
  activeTab: string;
  className?: string;
};

export const OpinionList = ({ $positions, activeTab, sessionID }: Props) => {
  const { data } = use($positions);
  // 選択されているグループのみ抽出
  const selectedGroup = data?.groupOpinions.find((group) => {
    return group.groupName === activeTab;
  });

  return selectedGroup?.opinions.map(({ opinion, user }, i) => {
    return (
      <Card
        href={`/opinion/${opinion.id}/${sessionID}`}
        key={i}
        title={opinion.title}
        description={opinion.content}
        user={user}
        date={opinion.postedAt}
      />
    );
  });
};
