import { type MouseEvent, Suspense, useEffect, useState } from "react";
import { Await, Link, Outlet, useNavigate } from "react-router";
import { Graph } from "~/components/features/opinion-graph";
import { Edit, Notification, PieChart } from "~/components/icons";
import { List } from "~/components/ui/acordion";
import { Avatar } from "~/components/ui/avatar";
import { JST } from "~/libs/date";
import type { Route } from "~/react-router/_pages.$session_id/+types/route";
import { Tabs } from "~/routes/_pages.$session_id/components/Tabs";
import type { SessionRouteContext } from "~/types/ctx";
import { CreateOpinionButton } from "./components/CreateOpinionButton";
import { DemographicsModal } from "./components/DemographicsModal";
import { RESTRICTIONS_ICON_MAP } from "./constants";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader } from "./modules/loader";
export { shouldRevalidate } from "./modules/shouldRevalidate";

export default function Layout({
  loaderData: { session, user, report, $restrictions, $remainingCount },
}: Route.ComponentProps) {
  const [isDemographicsDialogOpen, setIsDemographicsDialogOpen] =
    useState(false);
  const [isRequestDemographics, setIsRequestDemographics] = useState<
    boolean | null
  >(null);

  const navigate = useNavigate();

  const isOwner = session.owner.displayID === user?.displayID;

  const items = [
    { label: "活動報告", href: `/${session.id}/conclusion` },
    { label: "内容", href: `/${session.id}` },
    { label: "意見", href: `/${session.id}/opinion` },
  ];

  if (report) {
    items.push({ label: "レポート", href: `/${session.id}/analysis` });
  }
  items.push({ label: "通報", href: `/${session.id}/reports` });

  useEffect(() => {
    $restrictions.then((restrictions) => {
      const hasRequiredRestrictions = restrictions.some(
        (restriction) => restriction.required,
      );
      setIsRequestDemographics(hasRequiredRestrictions);
    });
  }, []);

  const handleDemographicsDialogOpen = (e: MouseEvent) => {
    e.preventDefault();
    if (isRequestDemographics) {
      setIsDemographicsDialogOpen(true);
    } else {
      navigate(`/create/${session.id}/opinion`);
    }
  };

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
          className="relative mx-auto mt-2 h-12 w-[248px] border-gradient p-2 text-center before:rounded-2xl"
          viewTransition={true}
        >
          <span className="primary-gradient mt-1 inline-block text-clip">
            みんなの意見を見る
          </span>
          <Suspense>
            <Await resolve={$remainingCount}>
              {(count) => {
                if (count === 0) {
                  return null;
                }
                return (
                  <span className="-top-2 absolute right-0 flex h-6 w-6 items-center justify-center rounded-full bg-mt-red p-1 text-sm text-white">
                    {count}
                  </span>
                );
              }}
            </Await>
          </Suspense>
        </Link>

        <div className="flex items-center space-x-2">
          <Avatar src={session.owner.iconURL} className="h-6 w-6" />
          <p className="line-clamp-1 w-48 text-gray-500 text-sm">
            {session.owner.displayName}
          </p>
        </div>

        <div className="text-blue-500 text-sm">
          {session.restrictions.length === 0 ? (
            <div className="flex items-center ">
              <Notification className="fill-mt-blue-600" />
              <p className="ml-2">誰でも参加OK</p>
            </div>
          ) : (
            <div className="flex items-center">
              <p className="rounded bg-mt-blue-50 px-2 py-1">入力済対象</p>
              {session.restrictions.map(({ description, key }, i) => {
                return (
                  <p className="ml-2 flex space-x-1" key={i}>
                    <span>{RESTRICTIONS_ICON_MAP[key]}</span>
                    <span>{description}</span>
                  </p>
                );
              })}
            </div>
          )}
        </div>

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
          <CreateOpinionButton
            disabled={isRequestDemographics === null}
            onClick={handleDemographicsDialogOpen}
          />
        </div>
      </div>

      <DemographicsModal
        $restrictions={$restrictions}
        sessionID={session.id}
        isOpen={isDemographicsDialogOpen}
        onOpenChange={setIsDemographicsDialogOpen}
      />
    </>
  );
}
