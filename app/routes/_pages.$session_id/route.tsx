import { Link, Outlet } from "react-router";
import { loader } from "./modules/loader";
import { SessionRouteContext } from "./types";
import { JST } from "~/libs/date";
import { OpinionCheckButton } from "./components/OpinionCheckButton";
import { Tabs } from "~/components/Tabs";
import { Avatar } from "~/components/Avatar";
import type { Route } from "~/app/routes/_pages.$session_id/+types/route";
import { CreateOpinionButton } from "./components/CreateOpinionButton";
import { Graph } from "~/features/graph/components";
import { List } from "~/features/acordion";
import { PieChart } from "~/components/Icons";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader };

export default function Route({
  loaderData: { session, user },
}: Route.ComponentProps) {
  return (
    <>
      <div className="flex flex-col space-y-2 px-4 py-2">
        <p className="font-bold">{session.theme}</p>

        <List
          className="bg-gray-100"
          title={
            <div className="flex items-center space-x-2">
              <PieChart />
              <p>参加者のグラフ</p>
            </div>
          }
        >
          <Graph className="mt-2" />
        </List>

        <Link
          to={`/swipe/${session.id}`}
          className="mx-auto mt-2 block"
          viewTransition
        >
          <OpinionCheckButton />
        </Link>

        <div className="flex items-center space-x-2">
          <Avatar src={session.owner.iconURL} className="h-6 w-6" />
          <p className="line-clamp-1 w-48 text-sm text-gray-500">
            {session.owner.displayName}
          </p>
        </div>

        <p className="text-sm text-blue-500">未ログインも回答可能</p>

        <div className="flex space-x-2">
          {session.city && (
            <p className="text-sm text-gray-500">{session.city}</p>
          )}
          <p className="text-sm text-gray-500">
            {JST(session.scheduledEndTime).format("MM/DD(ddd)まで")}
          </p>
        </div>
      </div>

      <Tabs
        items={[
          { label: "活動報告", href: `/${session.id}/conclusion` },
          { label: "内容", href: `/${session.id}` },
          { label: "意見", href: `/${session.id}/opinion` },
          { label: "レポート", href: `/${session.id}/report` },
        ]}
      />

      <div className="flex-1 bg-[#F2F2F7] p-4">
        <Outlet context={{ session, user } satisfies SessionRouteContext} />
        <div className="fixed right-4 bottom-4 z-10">
          <CreateOpinionButton to={`/create/${session.id}/opinion`} />
        </div>
      </div>
    </>
  );
}
