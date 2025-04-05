import { Link, useOutletContext } from "react-router";
import { button } from "~/components/Button";
import type { SessionRouteContext } from "~/types/ctx";

export default function Page() {
  const { session } = useOutletContext<SessionRouteContext>();

  return (
    <>
      <div className="justify-center space-y-2 rounded-xl bg-white p-4">
        <p className="font-bold text-gray-400">メッセージ</p>
        <p className="text-gray-400 text-sm">
          セッションに参加してくれた人たちに向けて、お礼のメッセージや今後の意気込みを伝えよう！
        </p>
        <span className="flex justify-center">
          <Link
            to={`/create/${session.id}/message`}
            className={button({
              className: "inline-flex w-auto items-center justify-center",
              color: "primary",
            })}
          >
            メッセージを書く
          </Link>
        </span>
      </div>

      <div className="mt-4 justify-center space-y-2 rounded-xl bg-white p-4">
        <p className="font-bold text-gray-400">ロードマップ</p>
        <p className="text-gray-400 text-sm">
          セッションを終えた今、活動を進める道標になるロードマップを記入しよう！
        </p>
        <span className="flex justify-center">
          <Link
            to={`/create/${session.id}/loadmap`}
            className={button({
              className: "inline-flex w-auto items-center justify-center",
              color: "primary",
            })}
          >
            ロードマップを書く
          </Link>
        </span>
      </div>
    </>
  );
}
