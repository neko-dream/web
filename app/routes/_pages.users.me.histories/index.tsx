import { Suspense } from "react";
import type { Route } from "../_pages.users.me.histories/+types";
import { loader } from "./modules/loader";
import { Await, Link } from "react-router";
import Session from "~/components/Session";

export { loader };

export default function Page({
  loaderData: { $session },
}: Route.ComponentProps) {
  return (
    <Suspense>
      <Await resolve={$session}>
        {({ data }) => {
          return (
            <div className="mx-auto mt-4 mb-16 w-full max-w-2xl space-y-6 px-1">
              {data?.talkSessions.map((session, i) => (
                <Link
                  to={`/${session.talkSession.id}`}
                  className="block rounded-md bg-white p-2"
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
  );
}
