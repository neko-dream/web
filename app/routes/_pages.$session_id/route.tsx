import { type MouseEvent, Suspense, useEffect, useState } from "react";
import {
  Await,
  Link,
  Outlet,
  useNavigate,
  useOutletContext,
} from "react-router";
import { Left, Notification } from "~/components/icons";
import { Avatar } from "~/components/ui/avatar";
import { useSatisfiedStore, useVote } from "~/hooks/useVote";
import { JST } from "~/libs/date";
import { notfound } from "~/libs/response";
import type { Route } from "~/react-router/_pages.$session_id/+types/route";
import { Tabs } from "~/routes/_pages.$session_id/components/Tabs";
import type { RouteContext, SessionRouteContext } from "~/types/ctx";
import { isEnd } from "~/utils/format-date";
import { AccordionParticipantGraph } from "./components/AccordionParticipantGraph";
import { CreateOpinionButton } from "./components/CreateOpinionButton";
import { EditButton } from "./components/EditButton";
import { LookupOtherOpinionButton } from "./components/LookupOtherOpinionButton";
import { RequestsModal } from "./components/RequestsModal";
import { ConsentModalContent } from "./components/RequestsModal/components/ConsentModalContent";
import { DemographicsModalContent } from "./components/RequestsModal/components/DemographicsModalContent";
import { SignupModalContent } from "./components/RequestsModal/components/SignupModalContent";
import { RESTRICTIONS_ICON_MAP } from "./constants";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader } from "./modules/loader";
export { shouldRevalidate } from "./modules/shouldRevalidate";
export { meta } from "./modules/meta";

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
  $positions,
}: Props) => {
  const tabs = [
    { label: "内容", href: `/${session.id}` },
    { label: "意見", href: `/${session.id}/opinions` },
    { label: "分析", href: `/${session.id}/analysis` },
  ];

  const navigate = useNavigate();
  const [tabItems, setTabItems] = useState<Tab[]>(tabs);
  const { check } = useVote({ sessionID: session.id });
  const { isRequestModal, setIsRequestModal, nextPath } = useSatisfiedStore();

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

  const handleCloseRequestModal = () => {
    setIsRequestModal([]);
  };

  const handleMoveCreateOpinionPage = async (e: MouseEvent) => {
    e.preventDefault();
    const result = await check(`/make/${session.id}/opinions/new`);
    if (result === "satisfied") {
      navigate(`/make/${session.id}/opinions/new`);
    }
  };

  const handleMoveSwipePage = async (e: MouseEvent) => {
    e.preventDefault();
    const result = await check(`/swipe/${session.id}`);
    if (result === "satisfied") {
      navigate(`/swipe/${session.id}`);
    }
  };

  return (
    <>
      <div className="mx-auto mt-2 flex w-full max-w-4xl flex-col space-y-2 px-4 py-2">
        <div className="flex items-center">
          <Link to="/home">
            <Left className="fill-gray-600" />
          </Link>
          <p className="ml-2 font-bold text-base md:text-3xl">
            {session.theme}
          </p>
          <Suspense>
            <EditButton $user={$user} session={session} />
          </Suspense>
        </div>

        <Suspense>
          <AccordionParticipantGraph $positions={$positions} />
        </Suspense>

        <Suspense>
          <LookupOtherOpinionButton
            $remainingCount={$remainingCount}
            $user={$user}
            onClick={handleMoveSwipePage}
            className="relative mx-auto mt-2 block h-12 w-[248px] cursor-pointer border-gradient p-2 text-center before:rounded-2xl"
          />
        </Suspense>

        <div className="flex items-center space-x-2">
          <Avatar src={session.owner.iconURL} className="h-6 w-6" />
          <p className="line-clamp-1 w-48 text-gray-500 text-sm">
            {session.owner.displayName}
          </p>
        </div>

        <div className="text-blue-500 text-sm">
          {session.restrictions.length === 0 ? (
            <div className="flex items-center">
              <Notification className="fill-cs-blue-600" />
              <p className="ml-2">誰でも参加OK</p>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <p className="inline-block whitespace-nowrap rounded bg-cs-blue-50 px-2 py-1">
                入力済対象
              </p>
              <div className="flex flex-wrap items-center">
                {session.restrictions.map(({ description, key }, i) => {
                  return (
                    <p className="ml-2 flex space-x-1" key={i}>
                      <span>{RESTRICTIONS_ICON_MAP[key]}</span>
                      <span>{description}</span>
                    </p>
                  );
                })}
              </div>
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
          {!isEnd(session.scheduledEndTime) && (
            <CreateOpinionButton onClick={handleMoveCreateOpinionPage} />
          )}
        </div>
      </div>

      <RequestsModal
        isOpen={isRequestModal.length > 0}
        onOpenChange={() => setIsRequestModal([])}
        sessionID={session.id}
      >
        {(state, next) => {
          if (state === "consent") {
            return (
              <ConsentModalContent
                sessionID={session.id}
                onClose={handleCloseRequestModal}
                onConform={next}
              />
            );
          }
          if (state === "demography") {
            return (
              <DemographicsModalContent
                $restrictions={$restrictions}
                sessionID={session.id}
                onClose={handleCloseRequestModal}
                nextPath={nextPath}
              />
            );
          }
          if (state === "signup") {
            return <SignupModalContent />;
          }
        }}
      </RequestsModal>
    </>
  );
};
