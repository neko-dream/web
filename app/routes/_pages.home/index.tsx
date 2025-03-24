import { Await, Link, useLoaderData } from "react-router";
import { Suspense } from "react";
import Error from "~/components/Error";
import Session from "~/components/Session";
import { loader } from "./modules/loader";
import { SessionSkeleton } from "./components/SessionSkeleton";
import { headers } from "./modules/headers";

export { loader, headers };

export default function Page() {
  const { $session } = useLoaderData<typeof loader>();

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
                    to={`/${session.talkSession.id}`}
                    className="block"
                    key={i}
                    viewTransition
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
