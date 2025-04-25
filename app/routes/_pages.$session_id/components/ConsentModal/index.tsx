import { toast } from "react-toastify";
import { Checkbox } from "~/components/ui/checkbox";
import { api } from "~/libs/api";

type Props = {
  restrictions: {
    key: string;
    description: string;
  }[];
  sessionID: string;
  onClose: () => void;
  onConform: () => void;
};

export const ConsentModal = ({
  restrictions,
  sessionID,
  onConform,
  onClose,
}: Props) => {
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

  return (
    <div className="w-[327px] p-2">
      <p className="text-center font-bold text-[18px]">参加される方へ</p>
      <p className="mt-4 text-center text-sm">
        このセッションは、より良い意思決定のため
        以下の情報をセッション作成者に提供します
      </p>
      <div className="mt-4 space-y-2">
        {restrictions?.map(({ description }, i) => {
          return (
            <p className="font-semibold" key={i}>
              ・ {description}
            </p>
          );
        })}
      </div>
      <div className="mt-4">
        <Checkbox label="情報提供に同意してセッションに参加する" />
      </div>
      <div className="mt-4 flex flex-col space-y-4">
        <button
          type="button"
          className="cursor-pointer text-center font-bold text-mt-blue-600"
          onClick={handleConform}
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
