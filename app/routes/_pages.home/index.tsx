import { Suspense, useState } from "react";
import { Await, Link } from "react-router";
import LogoIcon from "~/assets/kotohiro.png";
import Session from "~/components/features/talksession-card";
import type { Route } from "~/react-router/_pages.home/+types";
import type { components } from "~/types/openapi";
import { SessionSkeleton } from "./components/SessionSkeleton";

export { clientLoader } from "./modules/loader";
export { meta } from "./modules/meta";

type TalkSessionItem = {
  talkSession: components["schemas"]["TalkSession"];
  opinionCount: number;
};

const TABS = [
  { label: "すべて", value: "all" },
  { label: "開催中", value: "open" },
  { label: "終了", value: "finished" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2 px-4 pt-7 pb-3">
    <span className="h-4 w-1 rounded-full bg-[linear-gradient(180deg,#FF3B30,#5856D6,#32ADE6)]" />
    <h2 className="font-bold text-[19px] text-ink tracking-tight">
      {children}
    </h2>
  </div>
);

const SessionList = ({ sessions }: { sessions: TalkSessionItem[] }) => (
  <div className="grid grid-cols-1 gap-6 px-4 min-[600px]:grid-cols-2 min-[600px]:gap-x-8">
    {sessions.map((session) => (
      <Link
        to={`/${session.talkSession.id}`}
        className="block"
        key={session.talkSession.id}
        viewTransition={true}
      >
        <Session {...session} />
      </Link>
    ))}
  </div>
);

const SearchHint = ({ theme }: { theme: string }) => (
  <div className="mx-4 mt-4 rounded-2xl bg-surface p-4">
    <p className="font-semibold text-ink">
      「{theme}」に一致するセッションが見つかりませんでした。
    </p>
    <p className="mt-3 font-semibold text-ink-subtle text-sm">検索のヒント</p>
    <p className="mt-1 text-ink-subtle text-sm leading-6">
      ・誤字、脱字がないか確認してみてください
      <br />
      ・言葉の区切り方を変えてみてください
      <br />
      ・似たキーワードを入れてみてください
    </p>
    <Link
      to="/home"
      className="mt-4 inline-flex rounded-full bg-white px-4 py-2 font-semibold text-brand-blue text-sm"
    >
      検索をクリア
    </Link>
  </div>
);

export default function Page({
  loaderData: { $session, $closeSession, theme },
}: Route.ComponentProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("all");

  const showOpen = !theme && activeTab !== "finished";
  const showClosed = !theme && activeTab !== "open";

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex items-center px-4 pt-5 pb-2">
        <img src={LogoIcon} alt="ことひろ" className="h-8 w-[109px]" />
      </div>

      {theme ? (
        <div className="flex items-center gap-2 border-line border-b px-4 pt-2 pb-4">
          <p className="line-clamp-1 text-ink-muted text-sm">
            「{theme}」の検索結果
          </p>
          <Link
            to="/home"
            className="ml-auto shrink-0 font-semibold text-brand-blue text-sm"
          >
            クリア
          </Link>
        </div>
      ) : (
        <div className="sticky top-0 z-20 border-line border-b bg-white/90 px-4 backdrop-blur">
          <div className="flex items-start" role="tablist">
            {TABS.map((tab) => {
              const active = activeTab === tab.value;
              return (
                <button
                  type="button"
                  role="tab"
                  aria-selected={active}
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className="flex flex-1 cursor-pointer flex-col items-center pt-2"
                >
                  <span
                    className={`pb-2 font-bold text-sm ${
                      active ? "text-ink" : "text-ink-subtle"
                    }`}
                  >
                    {tab.label}
                  </span>
                  <span
                    className={`h-[3px] w-full rounded-full ${
                      active
                        ? "bg-[linear-gradient(90deg,#FF3B30,#5856D6,#32ADE6)]"
                        : "bg-transparent"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {showOpen && (
        <Suspense
          fallback={
            <>
              <SectionHeading>注目のセッション</SectionHeading>
              <SessionSkeleton />
            </>
          }
        >
          <Await resolve={$session}>
            {(data) => {
              const sessions = data?.talkSessions || [];
              if (sessions.length === 0) {
                return theme ? (
                  <SearchHint theme={theme} />
                ) : (
                  <p className="px-4 pt-8 text-center text-ink-subtle text-sm">
                    開催中のセッションはありません。
                  </p>
                );
              }

              return (
                <>
                  <SectionHeading>
                    {theme ? "検索結果" : "注目のセッション"}
                  </SectionHeading>
                  <SessionList sessions={sessions} />
                </>
              );
            }}
          </Await>
        </Suspense>
      )}

      {showClosed && (
        <Suspense fallback={null}>
          <Await resolve={$closeSession}>
            {(data) => {
              const sessions = data?.talkSessions || [];
              if (sessions.length === 0) {
                return null;
              }

              return (
                <div className="mt-4">
                  <SectionHeading>終了したセッション</SectionHeading>
                  <SessionList sessions={sessions} />
                </div>
              );
            }}
          </Await>
        </Suspense>
      )}
    </div>
  );
}
