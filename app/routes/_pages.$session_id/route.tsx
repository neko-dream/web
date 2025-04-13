import { type MouseEvent, Suspense, useEffect, useState } from "react";
import {
  Await,
  Link,
  Outlet,
  useNavigate,
  useOutletContext,
} from "react-router";
import { Graph } from "~/components/features/opinion-graph";
import { Edit, Notification, PieChart } from "~/components/icons";
import { List } from "~/components/ui/acordion";
import { Avatar } from "~/components/ui/avatar";
import { JST } from "~/libs/date";
import { notfound } from "~/libs/response";
import type { Route } from "~/react-router/_pages.$session_id/+types/route";
import { Tabs } from "~/routes/_pages.$session_id/components/Tabs";
import type { RouteContext, SessionRouteContext } from "~/types/ctx";
import { CreateOpinionButton } from "./components/CreateOpinionButton";
import { DemographicsModal } from "./components/DemographicsModal";
import { RESTRICTIONS_ICON_MAP } from "./constants";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader } from "./modules/loader";
export { shouldRevalidate } from "./modules/shouldRevalidate";

type Tab = {
  label: string;
  href: string;
};

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export default function Layout({
  loaderData: { $session, ...props },
}: Route.ComponentProps) {
  const { $user } = useOutletContext<RouteContext>();

  return (
    <Suspense>
      <Await resolve={$session}>
        {({ data: session }) => {
          if (!session) {
            throw notfound();
          }
          return <Contents session={session} $user={$user} {...props} />;
        }}
      </Await>
    </Suspense>
  );
}

type Props = Omit<Route.ComponentProps["loaderData"], "$session"> & {
  session: Exclude<
    UnwrapPromise<Route.ComponentProps["loaderData"]["$session"]>["data"],
    null | undefined
  >;
  $user: RouteContext["$user"];
};

const Contents = ({
  session,
  $restrictions,
  $user,
  $remainingCount,
}: Props) => {
  const [isDemograDialogOpen, setIsDemograDialogOpen] = useState(false);
  const [isRequestDemogra, setIsRequestDemogra] = useState<boolean>();

  const tabs = [
    { label: "内容", href: `/${session.id}` },
    { label: "意見", href: `/${session.id}/opinion` },
    { label: "レポート", href: `/${session.id}/analysis` },
  ];

  const [tabItems, setTabItems] = useState<Tab[]>(tabs);

  const navigate = useNavigate();

  useEffect(() => {
    $user.then((user) => {
      if (session.owner.displayID !== user?.displayID) {
        return;
      }
      const ownerTabs = [
        ...tabs,
        { label: "活動報告", href: `/${session.id}/conclusion` },
        { label: "通報", href: `/${session.id}/reports` },
      ];
      setTabItems(ownerTabs);
    });
  }, []);

  useEffect(() => {
    $restrictions.then((restrictions) => {
      const hasRequiredRestrictions = restrictions.some(
        (restriction) => restriction.required,
      );
      setIsRequestDemogra(hasRequiredRestrictions);
    });
  }, []);

  const handleDemographicsDialogOpen = (e: MouseEvent) => {
    e.preventDefault();
    if (isRequestDemogra) {
      setIsDemograDialogOpen(true);
    } else {
      navigate(`/create/${session.id}/opinion`);
    }
  };

  return (
    <>
      <div className="mx-auto mt-2 flex w-full max-w-4xl flex-col space-y-2 px-4 py-2">
        <div className="flex items-center">
          <p className="font-bold text-base md:text-3xl">{session.theme}</p>
          <Suspense>
            <Await resolve={$user}>
              {(user) => {
                if (!user) {
                  return null;
                }
                return (
                  <Link
                    to={`/create/session/${session.id}`}
                    className="ml-2 cursor-pointer"
                  >
                    <Edit />
                  </Link>
                );
              }}
            </Await>
          </Suspense>
        </div>

        <List
          className="block bg-gray-100 md:hidden"
          title={
            <div className="flex items-center space-x-2">
              <PieChart />
              <p>参加者のグラフ</p>
            </div>
          }
        >
          <Graph className="mt-2" />
        </List>

        <Suspense>
          <Await resolve={$remainingCount}>
            {(count) => {
              if (count === 0) {
                return null;
              }
              return (
                <Link
                  to={`/swipe/${session.id}`}
                  className="md:!hidden relative mx-auto mt-2 block h-12 w-[248px] border-gradient p-2 text-center before:rounded-2xl"
                  viewTransition={true}
                >
                  <span className="primary-gradient mt-1 inline-block text-clip">
                    みんなの意見を見る
                  </span>
                  <span className="-top-2 absolute right-0 flex h-6 w-6 items-center justify-center rounded-full bg-mt-red p-1 text-sm text-white">
                    {count}
                  </span>
                </Link>
              );
            }}
          </Await>
        </Suspense>

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

      <div className="mx-auto w-full max-w-4xl">
        <Tabs items={tabItems} />
      </div>

      <div className="flex-1 bg-[#F2F2F7] p-4">
        <Suspense>
          <Await resolve={session}>
            {() => {
              return (
                <Outlet context={{ session } satisfies SessionRouteContext} />
              );
            }}
          </Await>
        </Suspense>
        <div className="fixed right-4 bottom-4 z-10">
          <CreateOpinionButton
            disabled={isRequestDemogra === null}
            onClick={handleDemographicsDialogOpen}
          />
        </div>
      </div>

      <DemographicsModal
        $restrictions={$restrictions}
        sessionID={session.id}
        isOpen={isDemograDialogOpen}
        onOpenChange={setIsDemograDialogOpen}
      />
    </>
  );
};
