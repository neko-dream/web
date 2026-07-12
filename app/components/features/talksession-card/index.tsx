import DefaultSessionIcon from "~/assets/default/session.webp";
import { JST } from "~/libs/dayjs";
import type { components } from "~/types/openapi";
import { ClockCircle, Environment, Message } from "../../icons";
import { Avatar } from "../../ui/avatar";
import { MunicipalityBadge } from "../../ui/municipality-badge";

type Props = {
  talkSession: components["schemas"]["TalkSession"];
  opinionCount: number;
};

export default function TalkSessionCard({ talkSession, opinionCount }: Props) {
  const isFinished = JST(talkSession.scheduledEndTime).isBefore();

  return (
    <div className="flex">
      {/* サムネイル */}
      <img
        src={talkSession.thumbnailURL || DefaultSessionIcon}
        className="aspect-square h-16 w-16 rounded-2xl object-cover"
        alt="session thumbnail"
        loading="lazy"
      />

      <div className="ml-4 flex w-full flex-col gap-[2px]">
        {/* テーマ名 */}
        <p className="line-clamp-1 font-bold text-base">{talkSession.theme}</p>

        {/* アバター */}
        <div className="flex items-center gap-2">
          <Avatar src={talkSession.owner.iconURL} className="block h-5 w-5" />
          <p className="text-black text-xs">{talkSession.owner.displayName}</p>
        </div>

        {/* 自治体バッジ */}
        {talkSession.organizationAlias?.aliasName && (
          <MunicipalityBadge name={talkSession.organizationAlias.aliasName} />
        )}

        <div className="flex space-x-4">
          <div className="flex w-full max-w-24 items-center space-x-1">
            <Environment className="text-gray-500" />
            <p className="text-gray-500 text-xs">{talkSession.city || "---"}</p>
          </div>

          <div className="flex">
            <ClockCircle className="text-gray-500" />
            {isFinished ? (
              <p className="ml-1 w-14 text-gray-500 text-xs">終了</p>
            ) : (
              <p className="ml-1 w-14 whitespace-nowrap text-gray-500 text-xs">
                {JST(talkSession.scheduledEndTime).format("M/Dまで")}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <Message className="text-blue-500" />
            <p className="font-bold text-blue-500 text-xs">
              {opinionCount < 99 ? opinionCount : "99+"} 件
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
