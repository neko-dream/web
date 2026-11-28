import { Suspense } from "react";
import ReactMarkdown from "react-markdown";
import { Await } from "react-router";
import type { Route } from "~/react-router/_pages.$session_id.analysis/+types";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { clientLoader } from "./modules/loader";

export default function Page({
  loaderData: { $reports },
}: Route.ComponentProps) {
  return (
    <div className="w-full">
      <Suspense>
        <Await resolve={$reports}>
          {({ data }) => {
            return (
              <div className="w-full rounded-md bg-white p-2">
                <div className="flex items-center space-x-2">
                  <img src="/icon.png" alt="" className="m-1 h-7" />
                  <p className="text-gray-500 text-xs">ことひろAIレポート</p>
                </div>
                <article className="prose mt-1 max-w-none text-gray-800 text-sm">
                  {data?.report ? (
                    <ReactMarkdown>{data.report}</ReactMarkdown>
                  ) : (
                    <p className="py-4 text-center">
                      まだレポートがありません。意見を投稿してみよう🎵
                    </p>
                  )}
                </article>
              </div>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
