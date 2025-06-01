import { use } from "react";
import { Card } from "~/components/features/opinion-card";
import type { Route } from "../../+types";

type Props = {
  $opinions: Route.ComponentProps["loaderData"]["$opinions"];
  sessionID: string;
};

export const SeedOpinions = ({ $opinions, sessionID }: Props) => {
  const { data } = use($opinions);

  return data?.opinions.map(({ opinion, user, replyCount }, i) => {
    return (
      <Card
        key={i}
        href={`/${sessionID}/opinions/${opinion.id}`}
        title={opinion.title}
        description={opinion.content}
        user={user}
        date={opinion.postedAt}
        className="mx-auto w-full max-w-2xl"
        opinionCount={replyCount}
      />
    );
  });
};
