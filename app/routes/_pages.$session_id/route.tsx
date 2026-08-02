import { FileText } from "lucide-react";
import { type MouseEvent, Suspense, useEffect, useState } from "react";
import {
  Await,
  Link,
  Outlet,
  useNavigate,
  useOutletContext,
  useRevalidator,
  useSearchParams,
} from "react-router";
import { AuthenticateCard } from "~/components/features/auth/LoginCard";
import {
  Alert,
  ClockCircle,
  Environment,
  Home,
  Left,
  LineChart,
  Message,
  More,
  Notification,
  Pen,
  Pushpin,
  Setting,
  Smile,
  User,
} from "~/components/icons";
import { Avatar } from "~/components/ui/avatar";
import { MunicipalityBadge } from "~/components/ui/municipality-badge";
import {
  SURVEY_RESTRICTION_KEY,
  useSatisfiedStore,
  useVote,
} from "~/hooks/useVote";
import { JST } from "~/libs/dayjs";
import type { Route } from "~/react-router/_pages.$session_id/+types/route";
import type { RouteContext, SessionRouteContext } from "~/types/ctx";
import { isEnd } from "~/utils/format-date";
import { notfound } from "~/utils/response";
import { AccordionParticipantGraph } from "./components/AccordionParticipantGraph";
import { EditButton } from "./components/EditButton";
import { LookupOtherOpinionButton } from "./components/LookupOtherOpinionButton";
import { RequestsModal } from "./components/RequestsModal";
import { ConsentModalContent } from "./components/RequestsModal/components/ConsentModalContent";
import { DemographicsModalContent } from "./components/RequestsModal/components/DemographicsModalContent";
import { SurveyModalContent } from "./components/RequestsModal/components/SurveyModalContent";
import { SessionToolbar, type ToolbarItem } from "./components/SessionToolbar";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader } from "./modules/loader";
export { shouldRevalidate } from "./modules/shouldRevalidate";
export { meta } from "./modules/meta";

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

/** 参加制限（入力済対象）タグのアイコン */
const restrictionIcons: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  birth: User,
  gender: Smile,
  city: Home,
  prefecture: Pushpin,
};

export default function Layout({
  loaderData: { $session, enableSurvey, ...props },
}: Route.ComponentProps) {
  const { $user } = useOutletContext<RouteContext>();

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
              $user={$user}
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
  $user: RouteContext["$user"];
};

const Contents = ({
  session,
  $restrictions,
  $user,
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

  // 参加制限（アンケート回答restrictionはタグ表示しない）
  const restrictions =
    session.restrictions?.filter(({ key }) => key !== SURVEY_RESTRICTION_KEY) ??
    [];

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
  const [tabItems, setTabItems] = useState<ToolbarItem[]>(tabs);
  const { check } = useVote({ sessionID: session.id });
  const { isRequestModal, setIsRequestModal, nextPath, setNextPath } =
    useSatisfiedStore();
  const { revalidate } = useRevalidator();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    $user.then((user) => {
      if (!user) {
        const signup = searchParams.get("signup");
        if (signup === "true") {
          setIsRequestModal(["signup"]);
        }
      }

      if (session.owner.displayID !== user?.displayID) {
        return;
      }

      const ownerTabs: ToolbarItem[] = [
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
      ];
      setTabItems(ownerTabs);
    });
  }, []);

  const [survey, setSurvey] = useState<UnwrapPromise<Props["$survey"]> | null>(
    null,
  );

  /**
   * セッション詳細に遷移したとき、アンケートが設定されていて
   * 未回答（未答フラグなし）ならアンケートダイアログを開く
   */
  useEffect(() => {
    if (!enableSurvey) {
      return;
    }
    Promise.all([$user, $survey]).then(([user, surveyData]) => {
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
      <div className="mx-auto flex w-full max-w-4xl flex-col space-y-2 px-4 py-2">
        <div className="flex h-10 items-center">
          <Link to="/home">
            <Left className="fill-gray-600" />
          </Link>
          <p className="ml-2 line-clamp-1 font-bold text-lg">{session.theme}</p>
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

        <div className="flex items-center gap-2">
          {session.organizationAlias?.aliasName && (
            <MunicipalityBadge name={session.organizationAlias.aliasName} />
          )}
          <Avatar src={session.owner.iconURL} className="h-[30px] w-[30px]" />
          <p className="line-clamp-1 text-[#8E8E93] text-sm">
            {session.owner.displayName}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {session.city && (
            <div className="flex items-center gap-1">
              <Environment className="size-4 text-[#8E8E93]" />
              <p className="text-[#8E8E93] text-sm">{session.city}</p>
            </div>
          )}
          <div className="flex items-center gap-1">
            <ClockCircle className="size-4 text-[#8E8E93]" />
            <p className="text-[#8E8E93] text-sm">{remainingLabel}</p>
          </div>
        </div>

        {restrictions.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1 py-1">
            <div className="rounded bg-[#D0E5F5] px-2 py-1">
              <p className="whitespace-nowrap text-[#657A88] text-sm">
                入力済対象
              </p>
            </div>
            {restrictions.map((restriction) => {
              const Icon = restrictionIcons[restriction.key];
              return (
                <div
                  key={restriction.key}
                  className="flex items-center gap-[2px] py-1"
                >
                  {Icon && <Icon className="size-[18px] text-[#71787E]" />}
                  <p className="whitespace-nowrap text-[#71787E] text-sm">
                    {restriction.description}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center text-blue-500 text-sm">
            <Notification className="fill-cs-blue-600" />
            <p className="ml-2">誰でも参加OK</p>
          </div>
        )}
      </div>

      <div className="flex-1 bg-[#F2F2F7] p-4 pb-32">
        <Outlet context={{ session } satisfies SessionRouteContext} />
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
