import { api } from "~/libs/api";

type Props = {
  opinionID: string;
  voteStatus: "agree" | "disagree" | "pass" | null;
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
