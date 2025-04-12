import { Suspense } from "react";
import ReactMarkdown from "react-markdown";
import { Await, Link, useOutletContext } from "react-router";
import { Card } from "~/components/features/opinion-card";
import Graph from "~/components/features/opinion-graph";
import { Arrow } from "~/components/icons";
import { useWindowResize } from "~/hooks/useWindowResize";
import type { Route } from "~/react-router/_pages.$session_id.analysis/+types";
import type { SessionRouteContext } from "~/types/ctx";
import { loader } from "./modules/loader";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader };

export default function Page({
  loaderData: { $opinions, $reports, $positions },
}: Route.ComponentProps) {
  const { session } = useOutletContext<SessionRouteContext>();
  const windowWidth = useWindowResize(374);

  return (
    <div className="mx-auto flex max-w-4xl items-start">
      <div className="w-full">
        <div className="mx-auto w-full max-w-2xl rounded-md bg-white p-2">
          <div className="flex items-center space-x-2">
            <img src="/icon.png" alt="" className="m-1 h-7" />
            <p className="text-gray-500 text-xs">ことひろAIレポート</p>
          </div>
          <article className="mt-1 line-clamp-4 text-gray-800 text-sm">
            <Suspense>
              <Await resolve={$reports}>
                {({ data }) => {
                  return <ReactMarkdown>{data?.report}</ReactMarkdown>;
                }}
              </Await>
            </Suspense>
          </article>
          <Link
            to={`/report/${session.id}`}
            className="m-2 flex items-center justify-end text-blue-400 text-xs"
          >
            <span className="mr-1">詳しくみる</span>
            <Arrow className="rotate-270 text-blue-400" />
          </Link>
        </div>

        <div className="mt-2 flex flex-col space-y-2">
          <Suspense>
            <Await resolve={$opinions}>
              {({ data }) => {
                return data?.opinions.map(
                  ({ opinion, user: opinionUser, myVoteType }, i) => {
                    return (
                      <Card
                        href={`/opinion/${opinion.id}`}
                        key={i}
                        title={opinion.title}
                        description={opinion.content}
                        user={opinionUser}
                        status={myVoteType}
                        date={opinion.postedAt}
                        className="mx-auto w-full max-w-2xl"
                      />
                    );
                  },
                );
              }}
            </Await>
          </Suspense>
        </div>
      </div>

      <Suspense>
        <Await resolve={$positions}>
          {({ data }) => {
            // グループ３が一番意見多そうなので、グループ３の意見を取得
            // ついでにインデックス順にする
            const positions = data?.positions
              // .filter((opinion) => {
              //   return (
              //     opinion.groupId === 3 &&
              //     (opinion.perimeterIndex || opinion.perimeterIndex === 0)
              //   );
              // })
              .sort(
                (a, b) => (a.perimeterIndex || 0) - (b.perimeterIndex || 0),
              );

            return (
              <div className="ml-4 hidden min-w-[391px] rounded bg-white p-2 md:block">
                <Graph
                  polygons={positions}
                  positions={data?.positions}
                  myPosition={data?.myPosition}
                  windowWidth={windowWidth < 768 ? windowWidth : 180}
                  selectGroupId={(_id: number) => {}}
                  background={0xffffff}
                />
              </div>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
