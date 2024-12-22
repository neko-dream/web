import { Await, Link, useLoaderData, useSearchParams } from "react-router";
import { Suspense } from "react";
import Error from "~/components/Error";
import Heading from "~/components/Heading";
import Session from "~/components/Session";
import Tabs from "~/components/Tabs";
import { loader } from "./modules/loader";

export { loader };

export default function Page() {
  const { $session } = useLoaderData<typeof loader>();
  const [params] = useSearchParams();
  const isFinished = params.get("q") === "finished";

  return (
    <>
      <Heading className="h-10 shrink-0">投稿されたセッション</Heading>
      <Tabs
        items={[
          { label: "開催中", href: "/home" },
          { label: "終了", href: "/home?q=finished" },
        ]}
        active={isFinished ? "終了" : "開催中"}
        className="shrink-0"
      />
      <Suspense>
        <Await resolve={$session}>
          {(data) => {
            if (!data?.talkSessions.length) {
              return (
                <Error>
                  <p>お探しのトークセッションは </p>
                  <p>見つかりませんでした...</p>
                  <p className="mt-2 text-xs text-gray-700">
                    右上の 🔍 から探せるよ！
                  </p>
                </Error>
              );
            }

            return (
              <div className="space-y-2 bg-gray-100 pt-2">
                {data?.talkSessions.map((session, i) => (
                  <Link
                    to={
                      isFinished
                        ? `/${session.talkSession.id}`
                        : `/${session.talkSession.id}/swipe`
                    }
                    className="block"
                    key={i}
                  >
                    <Session {...session} />
                  </Link>
                ))}
              </div>
            );
          }}
        </Await>
      </Suspense>
    </>
  );
}
