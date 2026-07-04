import { useEffect } from "react";
import { create } from "zustand";
import { api } from "~/libs/openapi-fetch";

export type RequestModalState = Array<
  "demography" | "consent" | "signup" | "survey"
>;

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
    // //　同意済みなら何もしない
    // ログアウトしたときに消さないといけない。。。。
    // if (window.localStorage.getItem(`satisfied-${sessionID}`)) {
    //   return "satisfied";
    // }

    const props = {
      credentials: "include",
      params: {
        path: {
          talkSessionID: sessionID,
        },
      },
    } as const;

    const [{ data: consentRequired, error }, { data: restrictionsRequired }] =
      await Promise.all([
        api.GET("/talksessions/{talkSessionID}/consent", props),
        api.GET("/talksessions/{talkSessionID}/restrictions", props),
      ]);

    if (error?.code === "AUTH-0000") {
      setIsRequestModal(["signup"]);
      return "non-satisfied";
    }

    const isRequestModal: RequestModalState = [];
    // 同意モーダルを出す
    if (!consentRequired?.hasConsent) {
      isRequestModal.push("consent");
    }
    // デモグラモーダルを出す
    if (restrictionsRequired && restrictionsRequired?.length > 0) {
      isRequestModal.push("demography");
    }
    if (isRequestModal.length > 0) {
      setIsRequestModal(isRequestModal);
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
    status: "agree" | "disagree" | "pass";
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
