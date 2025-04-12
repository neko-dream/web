import { useRevalidator } from "react-router";
import { toast } from "react-toastify";
import { Alert } from "~/components/icons";
import { Avatar } from "~/components/ui/avatar";
import { api } from "~/libs/api";
import { JST } from "~/libs/date";
import type { components } from "~/types/openapi";

type Props = components["schemas"]["reportDetail"];

export const ReportCard = ({
  opinion,
  reasons,
  reportCount,
  user,
  status,
}: Props) => {
  const { revalidate } = useRevalidator();

  const onSubmit = async (action: "hold" | "deleted") => {
    const res = await api.POST("/opinions/{opinionID}/reports/solve", {
      credentials: "include",
      params: {
        path: {
          opinionID: opinion.id,
        },
      },
      body: {
        action,
      },
    });
    if (res.response.status === 200) {
      toast.success("通報を処理しました");
      revalidate();
    } else {
      toast.error("通報の処理に失敗しました");
    }
  };

  const handleSubmitHold = () => onSubmit("hold");
  const handleSubmitDelete = () => onSubmit("deleted");

  return (
    <div className="rounded-xl bg-white p-2 ">
      <div className="flex items-center font-bold text-mt-red">
        <Alert />
        <p className="ml-1">{reportCount}人から通報</p>
      </div>
      <div className="mt-1 border-mt-gray-200 border-b pb-3">
        {reasons.map(({ reason }, i) => {
          return <p key={i}>・{reason}</p>;
        })}
      </div>
      <div className="mt-3 flex">
        <Avatar src={user.iconURL} className="mr-2" />
        <div className="flex-1">
          <p className="text-mt-disabled text-xs">{user.displayName}</p>
          <p className="mt-1 text-mt-disabled text-xs">
            {JST(opinion.postedAt).format("YYYY/MM/DD HH:mm")}
          </p>
          <p className="mt-1">{opinion.content}</p>
          <div className="-translate-x-6 mt-3 flex justify-center pb-4">
            {status !== "hold" && (
              <button
                type="button"
                className="cursor-pointer rounded-full border border-[#8E8E93] px-4 py-2 font-semibold text-[#8E8E93] text-xl"
                onClick={handleSubmitHold}
              >
                保留にする
              </button>
            )}
            {status !== "deleted" && (
              <button
                type="button"
                className="cursor-pointer rounded-full border border-mt-red px-4 py-2 font-semibold text-mt-red text-xl"
                onClick={handleSubmitDelete}
              >
                削除する
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
