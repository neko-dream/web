import { Await, Link } from "react-router";
import { Suspense } from "react";
import Error from "~/components/Error";
import Session from "~/components/TalkSessionCard";
import { SessionSkeleton } from "./components/SessionSkeleton";
import type { Route } from "../_pages.home/+types";

export { loader } from "./modules/loader";

export default function Page({
  loaderData: { $session, $closeSession },
}: Route.ComponentProps) {
  return (
    <div className="mx-auto mb-16 w-full max-w-2xl">
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
              <>
                <h2 className="mx-4 mt-6 text-xl font-bold">
                  注目のセッション
                </h2>
                <div className="mt-4 space-y-6 px-4">
                  {data?.talkSessions.map((session, i) => (
                    <Link
                      to={`/${session.talkSession.id}`}
                      className="block"
                      key={i}
                      viewTransition
                    >
                      <Session {...session} />
                    </Link>
                  ))}
                </div>
              </>
            );
          }}
        </Await>
      </Suspense>

      <Suspense fallback={<SessionSkeleton />}>
        <Await resolve={$closeSession}>
          {(data) => {
            return (
              <>
                <h2 className="mx-4 mt-12 text-xl font-bold">
                  終了したセッション
                </h2>
                <div className="mt-4 space-y-6 px-4">
                  {data?.talkSessions.map((session, i) => (
                    <Link
                      to={`/${session.talkSession.id}`}
                      className="block hover:opacity-80"
                      key={i}
                      viewTransition
                    >
                      <Session {...session} />
                    </Link>
                  ))}
                </div>
              </>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
