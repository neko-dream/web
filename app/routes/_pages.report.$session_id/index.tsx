import { Suspense } from "react";
import ReactMarkdown from "react-markdown";
import { Await, Link } from "react-router";
import Graph from "~/components/features/opinion-graph";
import { Left } from "~/components/icons";
import { useWindowResize } from "~/hooks/useWindowResize";
import type { Route } from "~/react-router/_pages.report.$session_id/+types";

export { loader } from "./modules/loader";
export { meta } from "./modules/meta";

export default function Page({
  loaderData: { $reports, $session, $positions },
}: Route.ComponentProps) {
  const windowWidth = useWindowResize(374);

  return (
    <div className="flex-1 bg-[#F2F2F7]">
      <Suspense>
        <Await resolve={$session}>
          {({ data: session }) => {
            return (
              <Link
                className="flex w-full cursor-pointerp-2 items-center bg-white p-2 font-bold text-[18px]"
                to={`/${session?.id}/analysis`}
              >
                <Left className="text-black" />
                <span className="-translate-x-[13.5px] mx-auto">
                  {session?.theme}
                </span>
              </Link>
            );
          }}
        </Await>
      </Suspense>

      <Suspense>
        <Await resolve={$positions}>
          {({ data: position }) => {
            const positions = position?.positions.sort(
              (a, b) => (a.perimeterIndex || 0) - (b.perimeterIndex || 0),
            );

            return (
              <div className="mt-2 flex justify-center">
                <Graph
                  polygons={positions}
                  positions={position?.positions}
                  myPosition={position?.myPosition}
                  windowWidth={windowWidth}
                  selectGroupId={(_id: number) => {}}
                />
              </div>
            );
          }}
        </Await>
      </Suspense>

      <div className="m-4 mx-auto w-full max-w-2xl rounded-md bg-white p-2">
        <div className="flex items-center space-x-2">
          <img src="/icon.png" alt="" className="m-1 h-7" />
          <p className="text-gray-500 text-xs">ことひろAIレポート</p>
        </div>
        <article className="prose mt-1 text-gray-800 text-sm">
          <Suspense>
            <Await resolve={$reports}>
              {({ data }) => {
                return <ReactMarkdown>{data?.report}</ReactMarkdown>;
              }}
            </Await>
          </Suspense>
        </article>
      </div>
    </div>
  );
}
