import { Suspense } from "react";
import { Await, Link } from "react-router";
import type { Route } from "~/react-router/_pages.$session_id/+types/route";
import { toSafeInternalPath } from "~/utils/redirect";

type Props = Pick<Route.ComponentProps["loaderData"], "$restrictions"> & {
  sessionID: string;
  onClose: () => void;
  nextPath?: string;
};

export const DemographicsModalContent = ({
  $restrictions,
  sessionID,
  onClose,
  nextPath,
}: Props) => {
  const safeNextPath = toSafeInternalPath(nextPath);

  return (
    <Suspense>
      <Await resolve={$restrictions}>
        {(restrictions) => {
          return (
            <div className="w-[327px] p-2">
              <p className="text-center font-bold text-[18px]">
                参加される方へ
              </p>
              <p className="mt-4 text-center text-sm">
                このセッションは、より良い意思決定のため
                以下の情報を入力した方が参加可能です🍀
              </p>
              <div className="mt-4 space-y-2">
                {restrictions.map(({ description, required }, i) => {
                  return (
                    <div key={i} className="flex items-center space-x-2">
                      <p
                        className={`font-semibold ${
                          required ? "" : "text-[#C1C2C5]"
                        }`}
                      >
                        ・ {description}
                      </p>
                      {required && (
                        <p className="font-semibold text-[#FF2D55]">
                          （未入力）
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-col space-y-4">
                <Link
                  className="cursor-pointer text-center font-bold text-cs-blue-600"
                  to={`/make/${sessionID}/demographics${
                    safeNextPath
                      ? `?next=${encodeURIComponent(safeNextPath)}`
                      : ""
                  }`}
                >
                  情報を入力・認証する
                </Link>
                <button
                  onClick={onClose}
                  type="button"
                  className="cursor-pointer font-bold text-cs-disabled"
                >
                  キャンセル
                </button>
              </div>
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
};
