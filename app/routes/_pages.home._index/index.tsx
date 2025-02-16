import { Await, Link, useLoaderData, useSearchParams } from "react-router";
import { Suspense } from "react";
import Error from "~/components/Error";
import Session from "~/components/Session";
import { loader } from "./modules/loader";
import { SessionSkeleton } from "./components/SessionSkeleton";

export { loader };

export default function Page() {
  const { $session } = useLoaderData<typeof loader>();
  const [params] = useSearchParams();
  const isFinished = params.get("q") === "finished";

  return (
    <>
      <h2 className="mx-4 mt-4 text-xl font-bold">注目のセッション</h2>
      <Suspense fallback={<SessionSkeleton />}>
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
              <div className="mt-4 space-y-6 px-4">
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
