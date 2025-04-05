import { Suspense } from "react";
import { Await } from "react-router";
import type { Route } from "~/app/routes/_pages.users.me._index/+types";
import { Card } from "~/components/Card";

export { loader } from "./modules/loader";

export default function Page({
  loaderData: { $opinions },
}: Route.ComponentProps) {
  return (
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
                date={"2025/12/31 10:00"}
              />
            );
          });
        }}
      </Await>
    </Suspense>
  );
}
