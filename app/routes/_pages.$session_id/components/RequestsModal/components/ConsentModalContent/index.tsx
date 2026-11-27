import { useState } from "react";
import { toast } from "react-toastify";
import SimpleBar from "simplebar-react";
import { Checkbox } from "~/components/ui/checkbox";
import { api } from "~/libs/openapi-fetch";
import { CONSENT_MODAL_TEXT } from "./constants";
import "simplebar-react/dist/simplebar.min.css";

type Props = {
  sessionID: string;
  aliasName: string;
  onClose: () => void;
  onConform: () => void;
};

export const ConsentModalContent = ({
  sessionID,
  aliasName,
  onConform,
  onClose,
}: Props) => {
  const [isChecked, setChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConform = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      // openapi-fetchは成功時も失敗時もオブジェクトを返すため、response.okで判定する
      const { error, response } = await api.POST(
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
      if (error || !response.ok) {
        toast.error("同意に失敗しました。もう一度お試しください。");
        return;
      }
      onConform();
    } catch {
      toast.error("通信に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
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
        {CONSENT_MODAL_TEXT(aliasName)}
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
          disabled={!isChecked || isSubmitting}
        >
          {isSubmitting ? "送信中..." : "セッションに参加する"}
        </button>
        <button
          type="button"
          className="cursor-pointer font-bold text-cs-disabled disabled:opacity-60"
          onClick={onClose}
          disabled={isSubmitting}
        >
          キャンセル
        </button>
      </div>
    </div>
  );
};
