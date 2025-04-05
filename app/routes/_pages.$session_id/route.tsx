import { Link, Outlet } from "react-router";
import type { Route } from "~/app/routes/_pages.$session_id/+types/route";
import { Graph } from "~/components/features/graph-opinion";
import { Edit, PieChart } from "~/components/icons";
import { List } from "~/components/ui/acordion";
import { Avatar } from "~/components/ui/avatar";
import { JST } from "~/libs/date";
import { Tabs } from "~/routes/_pages.$session_id/components/Tabs";
import type { SessionRouteContext } from "~/types/ctx";
import { CreateOpinionButton } from "./components/CreateOpinionButton";
import { OpinionCheckButton } from "./components/OpinionCheckButton";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader } from "./modules/loader";

export default function Layout({
  loaderData: { session, user, report },
}: Route.ComponentProps) {
  const isOwner = session.owner.displayID === user?.displayID;

  const items = [
    { label: "活動報告", href: `/${session.id}/conclusion` },
    { label: "内容", href: `/${session.id}` },
    { label: "意見", href: `/${session.id}/opinion` },
  ];

  if (report) {
    items.push({ label: "レポート", href: `/${session.id}/report` });
  }

  return (
    <>
      <div className="flex flex-col space-y-2 px-4 py-2">
        <div className="flex">
          <p className="font-bold">{session.theme}</p>
          {isOwner && (
            <Link
              to={`/create/session/${session.id}`}
              className="ml-2 cursor-pointer"
            >
              <Edit />
            </Link>
          )}
        </div>

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
          viewTransition={true}
        >
          <OpinionCheckButton />
        </Link>

        <div className="flex items-center space-x-2">
          <Avatar src={session.owner.iconURL} className="h-6 w-6" />
          <p className="line-clamp-1 w-48 text-gray-500 text-sm">
            {session.owner.displayName}
          </p>
        </div>

        <p className="text-blue-500 text-sm">未ログインも回答可能</p>

        <div className="flex space-x-2">
          {session.city && (
            <p className="text-gray-500 text-sm">{session.city}</p>
          )}
          <p className="text-gray-500 text-sm">
            {JST(session.scheduledEndTime).format("MM/DD(ddd)まで")}
          </p>
        </div>
      </div>

      <Tabs items={items} />

      <div className="flex-1 bg-[#F2F2F7] p-4">
        <Outlet
          context={{ session, user, report } satisfies SessionRouteContext}
        />
        <div className="fixed right-4 bottom-4 z-10">
          <CreateOpinionButton to={`/create/${session.id}/opinion`} />
        </div>
      </div>
    </>
  );
}
