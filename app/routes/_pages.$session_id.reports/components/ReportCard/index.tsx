import { Alert } from "~/components/icons";
import { Avatar } from "~/components/ui/avatar";
import { JST } from "~/libs/dayjs";
import type { components } from "~/types/openapi";

type Props = components["schemas"]["reportDetail"] & {
  onSubmitDelete: (id: string) => void;
  onSubmitHold: (id: string) => void;
};

export const ReportCard = ({
  opinion,
  reasons,
  reportCount,
  user,
  status,
  onSubmitDelete,
  onSubmitHold,
}: Props) => {
  return (
    <div className="rounded-xl bg-white p-2 ">
      <div className="flex items-center font-bold text-cs-caution">
        <Alert />
        <p className="ml-1">{reportCount}人から通報</p>
      </div>
      <div className="mt-1 border-cs-gray-200 border-b pb-3">
        {reasons.map(({ reason }, i) => {
          return <p key={i}>・{reason}</p>;
        })}
      </div>
      <div className="mt-3 flex">
        <Avatar src={user.iconURL} className="mr-2" />
        <div className="flex-1">
          <p className="text-cs-disabled text-xs">{user.displayName}</p>
          <p className="mt-1 text-cs-disabled text-xs">
            {JST(opinion.postedAt).format("YYYY/MM/DD HH:mm")}
          </p>
          <p className="mt-1">{opinion.content}</p>
          <div className="-translate-x-6 mt-3 flex justify-center gap-4 pb-4">
            {status !== "hold" && (
              <button
                type="button"
                className="cursor-pointer rounded-full border border-[#8E8E93] px-4 py-2 font-semibold text-[#8E8E93] text-xl"
                onClick={() => onSubmitHold(opinion.id)}
              >
                保留にする
              </button>
            )}
            {status !== "deleted" && (
              <button
                type="button"
                className="cursor-pointer rounded-full border border-cs-caution px-4 py-2 font-semibold text-cs-caution text-xl"
                onClick={() => onSubmitDelete(opinion.id)}
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
