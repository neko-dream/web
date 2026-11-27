import { type MouseEvent, Suspense, useEffect, useRef, useState } from "react";
import {
  Await,
  Link,
  Outlet,
  useNavigate,
  useRevalidator,
  useSearchParams,
} from "react-router";
import { AuthenticateCard } from "~/components/features/auth/LoginCard";
import { Left, Notification } from "~/components/icons";
import { Avatar } from "~/components/ui/avatar";
import { useAuthStore } from "~/hooks/useAuthStore";
import { useSatisfiedStore, useVote } from "~/hooks/useVote";
import { JST } from "~/libs/dayjs";
import type { Route } from "~/react-router/_pages.$session_id/+types/route";
import { Tabs } from "~/routes/_pages.$session_id/components/Tabs";
import type { SessionRouteContext } from "~/types/ctx";
import { isEnd } from "~/utils/format-date";
import { notfound } from "~/utils/response";
import { AccordionParticipantGraph } from "./components/AccordionParticipantGraph";
import { CreateOpinionButton } from "./components/CreateOpinionButton";
import { EditButton } from "./components/EditButton";
import { LookupOtherOpinionButton } from "./components/LookupOtherOpinionButton";
import { RequestsModal } from "./components/RequestsModal";
import { ConsentModalContent } from "./components/RequestsModal/components/ConsentModalContent";
import { DemographicsModalContent } from "./components/RequestsModal/components/DemographicsModalContent";
import { SurveyModalContent } from "./components/RequestsModal/components/SurveyModalContent";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { clientLoader } from "./modules/loader";
export { meta } from "./modules/meta";
export { shouldRevalidate } from "./modules/shouldRevalidate";

type Tab = {
  label: string;
  href: string;
  external?: boolean;
};

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export default function Layout({
  loaderData: { $session, enableSurvey, ...props },
}: Route.ComponentProps) {
  return (
    <Suspense>
      <Await resolve={$session}>
        {({ data: session }) => {
          if (!session) {
            throw notfound();
          }
          return (
            <Contents
              session={session}
              enableSurvey={enableSurvey}
              {...props}
            />
          );
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
};

const Contents = ({
  session,
  $restrictions,
  $remainingCount,
  $positions,
  $survey,
  enableSurvey,
}: Props) => {
  const tabs: Tab[] = [
    { label: "内容", href: `/${session.id}` },
    { label: "意見", href: `/${session.id}/opinions` },
    { label: "分析", href: `/${session.id}/analysis` },
  ];

  const navigate = useNavigate();
  const authStatus = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const { check } = useVote({ sessionID: session.id });
  const { isRequestModal, setIsRequestModal, nextPath, setNextPath } =
    useSatisfiedStore();
  const { revalidate } = useRevalidator();
  const [searchParams] = useSearchParams();
  const signupQuery = searchParams.get("signup");

  // ログイン状態が確定してから、未ログイン時のサインアップ導線を出す
  useEffect(() => {
    if (authStatus !== "ready" || user) {
      return;
    }
    if (signupQuery === "true") {
      setIsRequestModal(["signup"]);
    }
  }, [authStatus, user, signupQuery, setIsRequestModal]);

  // オーナーかどうかでタブを出し分ける。ログイン状態の変化に追随させる
  const isOwner = user?.displayID === session.owner.displayID;
  const tabItems: Tab[] = isOwner
    ? [
        ...tabs,
        { label: "活動報告", href: `/${session.id}/conclusion` },
        { label: "通報", href: `/${session.id}/reports` },
        { label: "設定", href: `/${session.id}/config` },
        {
          label: "スクリーン",
          href: `/${session.id}/fullscreen`,
          external: true,
        },
      ]
    : tabs;

  const [survey, setSurvey] = useState<UnwrapPromise<Props["$survey"]> | null>(
    null,
  );
  const hasCheckedSurvey = useRef(false);

  /**
   * セッション詳細に遷移したとき、アンケートが設定されていて
   * 未回答（未答フラグなし）ならアンケートダイアログを開く
   */
  useEffect(() => {
    if (!enableSurvey || authStatus !== "ready" || hasCheckedSurvey.current) {
      return;
    }
    hasCheckedSurvey.current = true;
    // 自動表示は初回のログイン状態で判定する（ログイン後の再表示はしない）
    const user = useAuthStore.getState().user;
    $survey.then((surveyData) => {
      if (!surveyData || surveyData.questions.length === 0) {
        return;
      }
      // check()経由（意見投稿・スワイプ等のアクション時）でも表示できるよう保持しておく
      setSurvey(surveyData);
      // 未ログインでは回答を送信できないため表示しない
      if (!user) {
        return;
      }
      // オーナー自身には表示しない
      if (session.owner.displayID === user.displayID) {
        return;
      }
      if (
        window.localStorage.getItem(`survey-answered-${session.id}`) ||
        window.sessionStorage.getItem(`survey-dismissed-${session.id}`)
      ) {
        return;
      }
      setNextPath(undefined);
      setIsRequestModal(["survey"]);
    });
  }, [
    enableSurvey,
    authStatus,
    $survey,
    session.id,
    session.owner.displayID,
    setNextPath,
    setIsRequestModal,
  ]);

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
            <EditButton session={session} />
          </Suspense>
        </div>

        <Suspense>
          <AccordionParticipantGraph $positions={$positions} />
        </Suspense>

        <Suspense>
          <LookupOtherOpinionButton
            $remainingCount={$remainingCount}
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
          <div className="flex items-center">
            <Notification className="fill-cs-blue-600" />
            <p className="ml-2">誰でも参加OK</p>
          </div>
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
          if (state === "survey" && survey) {
            return (
              <SurveyModalContent
                sessionID={session.id}
                survey={survey}
                onClose={() => {
                  // キャンセル時は同一ブラウザセッション中は自動表示しない
                  window.sessionStorage.setItem(
                    `survey-dismissed-${session.id}`,
                    "true",
                  );
                  handleCloseRequestModal();
                }}
                onAnswered={() => {
                  window.localStorage.setItem(
                    `survey-answered-${session.id}`,
                    "true",
                  );
                  // 後続のモーダル（デモグラ等）があれば進め、なければnextPathへ遷移
                  next();
                }}
              />
            );
          }
          if (state === "consent") {
            return (
              <ConsentModalContent
                sessionID={session.id}
                aliasName={
                  session.organizationAlias?.aliasName ||
                  session.owner.displayName
                }
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
            return (
              <AuthenticateCard
                onSuccess={() => {
                  revalidate();
                  setIsRequestModal(["consent"]);
                }}
                useWithoutLoggingIn={false}
              />
            );
          }
        }}
      </RequestsModal>
    </>
  );
};
