import { Suspense } from "react";
import { Await, Link } from "react-router";
import Session from "~/components/features/talksession-card";
import type { Route } from "~/react-router/_pages.users.me.histories/+types";

export { loader } from "./modules/loader";

export default function Page({
  loaderData: { $session },
}: Route.ComponentProps) {
  return (
    <div className="mt-4 space-y-4">
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={$session}>
          {({ data }) => {
            return data?.talkSessions.map((session, i) => (
              <Link
                to={`/${session.talkSession.id}`}
                className="mx-auto block w-full max-w-2xl rounded-md bg-white p-2"
                key={i}
                viewTransition={true}
              >
                <Session {...session} />
              </Link>
            ));
          }}
        </Await>
      </Suspense>
    </div>
  );
}
