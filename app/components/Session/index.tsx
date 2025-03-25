import { RiMapPinLine } from "react-icons/ri";
import { components } from "~/libs/api/openapi";
import { Avatar } from "../Avatar";
import { OpinionCount } from "../OpinionCount";
import { JST } from "~/libs/date";

type Props = {
  talkSession: components["schemas"]["talkSession"];
  opinionCount: number;
};

export default function Session({ talkSession, opinionCount }: Props) {
  const isFinished = JST(talkSession.scheduledEndTime).isBefore();

  return (
    <div className="flex">
      {/* サムネイル */}
      {/* FIXME: 画像のURLを修正してください */}
      <img
        src={talkSession.thumbnailURL || "https://placehold.jp/150x150.png"}
        className="aspect-square h-16 w-16 rounded-2xl"
        alt="session thumbnail"
      />

      <div className="ml-4 flex w-full flex-col space-y-1">
        {/* テーマ名 */}
        <p className="font-bold">{talkSession.theme}</p>

        {/* アバター */}
        <div className="flex items-center space-x-2">
          <Avatar
            src={"https://placehold.jp/150x150.png"}
            className="block h-5 w-5"
          />
          <p className="text-xs text-gray-500">
            {talkSession.owner.displayName}
          </p>
        </div>

        <div className="flex space-x-4">
          {talkSession.city && (
            <div className="flex w-full max-w-24 items-center space-x-1">
              <RiMapPinLine className="text-gray-500" />
              <p className="text-xs text-gray-500">{talkSession.city}</p>
            </div>
          )}

          {isFinished ? (
            <p className="w-10 text-xs text-gray-500">終了</p>
          ) : (
            <p className="w-10 text-xs text-gray-500">
              {JST(talkSession.scheduledEndTime).format("MM/DD")}
            </p>
          )}

          <OpinionCount count={opinionCount} />
        </div>
      </div>
    </div>
  );
}
