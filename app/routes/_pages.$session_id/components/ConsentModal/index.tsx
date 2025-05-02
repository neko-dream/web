import { useState } from "react";
import { toast } from "react-toastify";
import { Checkbox } from "~/components/ui/checkbox";
import { api } from "~/libs/api";
import { CONSENT_MODAL_TEXT } from "./constants";

type Props = {
  sessionID: string;
  onClose: () => void;
  onConform: () => void;
};

export const ConsentModal = ({ sessionID, onConform, onClose }: Props) => {
  const [isChecked, setChecked] = useState(false);

  const handleConform = async () => {
    const data = await api.POST("/talksessions/{talkSessionID}/consent", {
      credentials: "include",
      params: {
        path: {
          talkSessionID: sessionID,
        },
      },
    });
    if (data) {
      onConform();
    } else {
      toast.error("同意に失敗しました");
    }
  };

  const handleCheckboxChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <div className="w-[327px] p-2">
      <p className="text-center font-bold text-[18px]">参加される方へ</p>
      <p className="scrollbar-visible mt-4 h-60 overflow-y-scroll whitespace-pre-line">
        {CONSENT_MODAL_TEXT}
      </p>
      <div className="mt-4">
        <Checkbox
          label="上記に同意してセッションに参加する"
          onChange={handleCheckboxChange}
        />
      </div>
      <div className="mt-4 flex flex-col space-y-4">
        <button
          type="button"
          className="cursor-pointer text-center font-bold text-mt-blue-600 disabled:opacity-60"
          onClick={handleConform}
          disabled={!isChecked}
        >
          セッションに参加する
        </button>
        <button
          type="button"
          className="cursor-pointer font-bold text-mt-disabled"
          onClick={onClose}
        >
          キャンセル
        </button>
      </div>
    </div>
  );
};
