import { useEffect } from "react";
import { create } from "zustand";
import { api } from "~/libs/openapi-fetch";

export type RequestModalState = Array<"demography" | "consent" | "signup">;

export const useSatisfiedStore = create<{
  nextPath?: string;
  isRequestModal: RequestModalState;
  setIsRequestModal: (isRequestModal: RequestModalState) => void;
  setNextPath: (nextPath?: string) => void;
}>((set) => ({
  isRequestModal: [],
  setIsRequestModal: (isRequestModal: RequestModalState) => {
    set({ isRequestModal });
  },
  setNextPath: (nextPath?: string) => set({ nextPath }),
}));

type Props = {
  sessionID: string;
};

export const useVote = ({ sessionID }: Props) => {
  const { setIsRequestModal, setNextPath } = useSatisfiedStore();

  useEffect(() => {
    return () => setIsRequestModal([]);
  }, [sessionID]);

  const check = async (nextPath?: string) => {
    setNextPath(nextPath);
    //　同意済みなら何もしない
    // 動作確認取れてないので一旦コメントアウト
    // if (window.localStorage.getItem(`satisfied-${sessionID}`)) {
    //   return "satisfied";
    // }

    // セッションに同意しているかどうか
    const { data, error } = await api.GET(
      "/talksessions/{talkSessionID}/consent",
      {
        credentials: "include",
        params: {
          path: {
            talkSessionID: sessionID,
          },
        },
      },
    );
    if (error?.code === "AUTH-0000") {
      setIsRequestModal(["signup"]);
      return "non-satisfied";
    }

    // デモぐらが足りていなければデモグラのフラグを立てる
    const { data: restrictionsRequired } = await api.GET(
      "/talksessions/{talkSessionID}/restrictions",
      {
        credentials: "include",
        params: {
          path: {
            talkSessionID: sessionID,
          },
        },
      },
    );

    // 同意モーダルだけ出してデモグラモーダルは出さない
    const onlyConsent = !data?.hasConsent;

    //
    const onlyDemograpy =
      restrictionsRequired && restrictionsRequired?.length > 0;

    if (onlyConsent && onlyDemograpy) {
      setIsRequestModal(["consent", "demography"]);
      return "non-satisfied";
    }
    if (onlyConsent) {
      setIsRequestModal(["consent"]);
      return "non-satisfied";
    }
    if (onlyDemograpy) {
      setIsRequestModal(["demography"]);
      return "non-satisfied";
    }

    window.localStorage.setItem(`satisfied-${sessionID}`, "true");
    return "satisfied";
  };

  const vote = async ({
    opinionID,
    status,
  }: {
    opinionID: string;
    status: "agree" | "disagree" | "pass" | null;
  }) => {
    const result = await check();
    if (result === "non-satisfied") {
      return "pending";
    }

    const { data, error } = await api.POST("/opinions/{opinionID}/votes", {
      credentials: "include",
      params: {
        path: {
          opinionID,
        },
      },
      body: {
        voteStatus: status,
      },
    });

    if (error?.code === "restriction_not_satisfied") {
      setIsRequestModal(["demography"]);
      return "pending";
    }

    if (data) {
      return "success";
    }

    return "error";
  };

  return { vote, check };
};
