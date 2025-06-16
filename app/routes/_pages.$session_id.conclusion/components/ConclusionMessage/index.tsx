import { use } from "react";
import { Link } from "react-router";
import { SanitizedHtml } from "~/components/features/xss-html";
import { Avatar } from "~/components/ui/avatar";
import { button } from "~/components/ui/button";
import type { Route } from "~/react-router/_pages.$session_id.conclusion/+types";

type Props = {
  $message: Route.ComponentProps["loaderData"]["$message"];
  sessionID: string;
};

export const ConclusionMessage = ({ $message, sessionID }: Props) => {
  const data = use($message);

  return (
    <div className="justify-center space-y-2 rounded-xl bg-white p-4">
      <p className="font-bold text-gray-400">メッセージ</p>
      {data ? (
        <>
          <div className="flex items-center text-[#C7C7CC]">
            <Avatar src={data.user.iconURL} className="h-5 w-5" />
            <p className="ml-2">{data.user.displayName}</p>
          </div>
          <SanitizedHtml html={data.content} />
        </>
      ) : (
        <>
          <p className="text-gray-400 text-sm">
            セッションに参加してくれた人たちに向けて、お礼のメッセージや今後の意気込みを伝えよう！
          </p>
          <span className="flex justify-center">
            <Link
              to={`/make/${sessionID}/message`}
              className={button({
                className: "inline-flex w-auto items-center justify-center",
                color: "primary",
              })}
            >
              メッセージを書く
            </Link>
          </span>
        </>
      )}
    </div>
  );
};
