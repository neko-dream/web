import { api } from "~/libs/openapi-fetch";

type Props = {
  opinionID: string;
  voteStatus: "agree" | "disagree" | "pass";
};

export const postVote = ({ opinionID, voteStatus }: Props) => {
  return api.POST("/opinions/{opinionID}/votes", {
    credentials: "include",
    params: {
      path: {
        opinionID,
      },
    },
    body: {
      voteStatus,
    },
  });
};
