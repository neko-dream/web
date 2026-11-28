import { FileText } from "lucide-react";
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
import {
  Alert,
  ClockCircle,
  Environment,
  Left,
  LineChart,
  Message,
  More,
  Pen,
  Setting,
} from "~/components/icons";
import { Avatar } from "~/components/ui/avatar";
import { MunicipalityBadge } from "~/components/ui/municipality-badge";
import { useAuthStore } from "~/hooks/useAuthStore";
import { useSatisfiedStore, useVote } from "~/hooks/useVote";
import { JST } from "~/libs/dayjs";
import type { Route } from "~/react-router/_pages.$session_id/+types/route";
import type { SessionRouteContext } from "~/types/ctx";
import { isEnd } from "~/utils/format-date";
import { notfound } from "~/utils/response";
import { AccordionParticipantGraph } from "./components/AccordionParticipantGraph";
import { EditButton } from "./components/EditButton";
import { LookupOtherOpinionButton } from "./components/LookupOtherOpinionButton";
import { RequestsModal } from "./components/RequestsModal";
import { ConsentModalContent } from "./components/RequestsModal/components/ConsentModalContent";
import { SurveyModalContent } from "./components/RequestsModal/components/SurveyModalContent";
import { SessionToolbar, type ToolbarItem } from "./components/SessionToolbar";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { clientLoader } from "./modules/loader";
export { meta } from "./modules/meta";
export { shouldRevalidate } from "./modules/shouldRevalidate";

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
  $remainingCount,
  $positions,
  $survey,
  enableSurvey,
}: Props) => {
  const tabs: ToolbarItem[] = [
    { label: "内容", href: `/${session.id}`, icon: FileText },
    { label: "意見", href: `/${session.id}/opinions`, icon: Message },
    { label: "分析", href: `/${session.id}/analysis`, icon: LineChart },
  ];

  const remainingDays = JST(session.scheduledEndTime).diff(
    JST(new Date()),
    "day",
  );
  const remainingLabel = isEnd(session.scheduledEndTime)
    ? "終了"
    : remainingDays === 0
      ? "本日まで"
      : `あと${remainingDays}日`;

  const navigate = useNavigate();
  const authStatus = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const { check } = useVote({ sessionID: session.id });
  const { isRequestModal, setIsRequestModal, setNextPath } =
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
  const tabItems: ToolbarItem[] = isOwner
    ? [
        ...tabs,
        { label: "活動報告", href: `/${session.id}/conclusion`, icon: Pen },
        { label: "通報", href: `/${session.id}/reports`, icon: Alert },
        { label: "設定", href: `/${session.id}/config`, icon: Setting },
        {
          label: "スクリーン",
          href: `/${session.id}/fullscreen`,
          icon: More,
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
      <div className="sticky top-0 z-20 border-line border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-4xl items-center gap-2 px-4">
          <Link
            to="/home"
            aria-label="ホームに戻る"
            className="-ml-2 flex size-10 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface"
          >
            <Left className="fill-current" />
          </Link>
          <p className="line-clamp-1 font-bold text-base tracking-tight">
            {session.theme}
          </p>
          <div className="ml-auto flex shrink-0">
            <Suspense>
              <EditButton session={session} />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-4xl flex-col gap-2 px-4 py-3">
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

        <div className="flex items-center gap-2">
          {session.organizationAlias?.aliasName && (
            <MunicipalityBadge name={session.organizationAlias.aliasName} />
          )}
          <Avatar src={session.owner.iconURL} className="h-[30px] w-[30px]" />
          <p className="line-clamp-1 text-ink-subtle text-sm">
            {session.owner.displayName}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {session.city && (
            <div className="flex items-center gap-1">
              <Environment className="size-4 text-ink-subtle" />
              <p className="text-ink-subtle text-sm">{session.city}</p>
            </div>
          )}
          <div className="flex items-center gap-1">
            <ClockCircle className="size-4 text-ink-subtle" />
            <p className="text-ink-subtle text-sm">{remainingLabel}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-surface py-4 pb-32">
        <div className="mx-auto w-full max-w-4xl px-4">
          <Outlet context={{ session } satisfies SessionRouteContext} />
        </div>
      </div>

      <SessionToolbar
        items={tabItems}
        showFab={!isEnd(session.scheduledEndTime)}
        onFabClick={handleMoveCreateOpinionPage}
      />

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
                  // 後続のモーダルがあれば進め、なければnextPathへ遷移
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
