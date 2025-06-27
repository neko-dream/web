import { useState } from "react";
import { toast } from "react-toastify";
import SimpleBar from "simplebar-react";
import { Checkbox } from "~/components/ui/checkbox";
import { api } from "~/libs/openapi-fetch";
import { CONSENT_MODAL_TEXT } from "./constants";
import "simplebar-react/dist/simplebar.min.css";

type Props = {
  sessionID: string;
  onClose: () => void;
  onConform: () => void;
};

export const ConsentModalContent = ({
  sessionID,
  onConform,
  onClose,
}: Props) => {
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
      <SimpleBar
        style={{ maxHeight: 300 }}
        className="mt-4 whitespace-pre-line rounded-md bg-gray-50 p-2 text-xs"
        autoHide={false}
      >
        {CONSENT_MODAL_TEXT}
      </SimpleBar>
      <div className="mt-4">
        <Checkbox
          label="上記に同意してセッションに参加する"
          onChange={handleCheckboxChange}
        />
      </div>
      <div className="mt-4 flex flex-col space-y-4">
        <button
          type="button"
          className="cursor-pointer text-center font-bold text-cs-blue-600 disabled:opacity-60"
          onClick={handleConform}
          disabled={!isChecked}
        >
          セッションに参加する
        </button>
        <button
          type="button"
          className="cursor-pointer font-bold text-cs-disabled"
          onClick={onClose}
        >
          キャンセル
        </button>
      </div>
    </div>
  );
};
