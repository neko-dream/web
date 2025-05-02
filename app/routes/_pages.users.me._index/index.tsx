import { Suspense } from "react";
import { Await } from "react-router";
import { Card } from "~/components/features/opinion-card";
import type { Route } from "~/react-router/_pages.users.me._index/+types";

export { loader } from "./modules/loader";

export default function Page({
  loaderData: { $opinions },
}: Route.ComponentProps) {
  return (
    <div className="mt-4 space-y-4">
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={$opinions}>
          {({ data }) => {
            return data?.opinions.map(({ opinion, user }, i) => {
              return (
                <Card
                  key={i}
                  title={opinion.title}
                  description={opinion.content}
                  user={{
                    displayID: "",
                    displayName: user.displayName,
                    iconURL: user.iconURL,
                  }}
                  className="mx-auto w-full max-w-2xl"
                  date={opinion.postedAt}
                />
              );
            });
          }}
        </Await>
      </Suspense>
    </div>
  );
}
