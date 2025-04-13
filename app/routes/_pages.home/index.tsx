import { Suspense } from "react";
import { Await, Link } from "react-router";
import Session from "~/components/features/talksession-card";
import { ErrorView } from "~/components/layouts/error";
import type { Route } from "~/react-router/_pages.home/+types";
import { SessionSkeleton } from "./components/SessionSkeleton";

export { loader } from "./modules/loader";
export { meta } from "./modules/meta";

export default function Page({
  loaderData: { $session, $closeSession },
}: Route.ComponentProps) {
  return (
    <div className="mx-auto mb-16 w-full max-w-2xl">
      <Suspense
        fallback={
          <>
            <h2 className="mx-4 mt-6 font-bold text-xl">注目のセッション</h2>
            <SessionSkeleton />
          </>
        }
      >
        <Await resolve={$session}>
          {(data) => {
            if (data?.talkSessions.length === 0) {
              return (
                <ErrorView>
                  <p>お探しのトークセッションは </p>
                  <p>見つかりませんでした...</p>
                  <p className="mt-2 text-gray-700 text-xs">
                    右上の 🔍 から探せるよ！
                  </p>
                </ErrorView>
              );
            }

            return (
              <>
                <h2 className="mx-4 mt-6 font-bold text-xl">
                  注目のセッション
                </h2>
                <div className="mt-4 space-y-6 px-4">
                  {data?.talkSessions.map((session, i) => (
                    <Link
                      to={`/${session.talkSession.id}`}
                      className="block"
                      key={i}
                      viewTransition={true}
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
                <h2 className="mx-4 mt-12 font-bold text-xl">
                  終了したセッション
                </h2>
                <div className="mt-4 space-y-6 px-4">
                  {data?.talkSessions.map((session, i) => (
                    <Link
                      to={`/${session.talkSession.id}`}
                      className="block hover:opacity-80"
                      key={i}
                      viewTransition={true}
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
