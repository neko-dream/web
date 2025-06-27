import { Link, useOutletContext } from "react-router";
import { button } from "~/components/ui/button";
import type { SessionRouteContext } from "~/types/ctx";
import type { Route } from "../_pages.$session_id.conclusion/+types";
import { ConclusionMessage } from "./components/ConclusionMessage";

export { loader } from "./modules/loader";

export default function Page({
  loaderData: { $message },
}: Route.ComponentProps) {
  const { session } = useOutletContext<SessionRouteContext>();

  return (
    <div className="mx-auto w-full max-w-2xl">
      <ConclusionMessage $message={$message} sessionID={session.id} />

      <div className="mt-4 justify-center space-y-2 rounded-xl bg-white p-4">
        <p className="font-bold text-gray-400">ロードマップ</p>
        <p className="text-gray-400 text-sm">
          セッションを終えた今、活動を進める道標になるロードマップを記入しよう！
        </p>
        <span className="flex justify-center">
          <Link
            to={`/make/${session.id}/loadmap`}
            className={button({
              className: "inline-flex w-auto items-center justify-center",
              color: "primary",
            })}
          >
            ロードマップを書く
          </Link>
        </span>
      </div>
    </div>
  );
}
