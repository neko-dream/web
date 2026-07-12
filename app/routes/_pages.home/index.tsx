import { Suspense, useState } from "react";
import { Await, Link } from "react-router";
import Session from "~/components/features/talksession-card";
import { ArrowRight } from "~/components/icons";
import type { Route } from "~/react-router/_pages.home/+types";
import type { components } from "~/types/openapi";
import { SessionSkeleton } from "./components/SessionSkeleton";

export { loader } from "./modules/loader";
export { meta } from "./modules/meta";

type TalkSessionItem = {
  talkSession: components["schemas"]["TalkSession"];
  opinionCount: number;
};

const TABS = [
  { label: "おすすめ", value: "recommended" },
  { label: "公共", value: "public" },
  { label: "カジュアル", value: "casual" },
] as const;

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-16 items-center justify-between px-4">
    <div className="flex flex-col justify-center font-bold text-[22px] text-black leading-[1.4]">
      <span>{children}</span>
    </div>
    <ArrowRight className="size-8 shrink-0" />
  </div>
);

const SessionList = ({
  sessions,
}: {
  sessions: TalkSessionItem[];
}) => {
  if (sessions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 px-4 md:grid md:grid-cols-2">
      {sessions.map((session, i) => (
        <Link
          to={`/${session.talkSession.id}`}
          className="block"
          key={i}
          viewTransition={true}
        >
          <Session {...session} />
        </Link>
      ))}
    </div>
  );
};

export default function Page({
  loaderData: { $session, $closeSession, theme },
}: Route.ComponentProps) {
  const [activeTab, setActiveTab] = useState<string>(TABS[0].value);

  return (
    <div className="mx-auto mb-16 w-full max-w-4xl md:max-w-5xl">
      {/* タブ */}
      <div className="border-[#c1c7ce] border-b-[0.5px] border-solid px-4">
        <div className="flex items-start">
          {TABS.map((tab) => (
            <button
              type="button"
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className="flex w-[120px] flex-col items-center gap-2 pt-2"
            >
              <span
                className={`text-center font-bold text-base leading-[1.55] ${
                  activeTab === tab.value ? "text-[#191c1e]" : "text-[#71787e]"
                }`}
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                {tab.label}
              </span>
              <div
                className={`h-1 w-full rounded-full bg-[#40b6ef] ${
                  activeTab === tab.value ? "" : "opacity-0"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

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
            if (!data || data.talkSessions.length === 0) {
              return (
                <div className="mt-4 space-y-2 p-4">
                  {theme ? (
                    <>
                      <p>
                        【{theme}】に一致するセッションが見つかりませんでした。
                      </p>
                      <p className="primary-gradient inline-block text-clip font-semibold">
                        再検索のヒント
                      </p>
                      <p className="text-[#8E8E93]">
                        ・誤字、脱字がないか確認してみてください
                        <br />
                        ・言葉の区切り方を変えてみてください
                        <br />
                        ・似たキーワードを入れてみてください
                      </p>
                    </>
                  ) : (
                    <p className="text-center">
                      セッションがまだありません。🙇
                    </p>
                  )}
                </div>
              );
            }

            return (
              <>
                <SectionHeading>注目のセッション</SectionHeading>
                <SessionList sessions={data.talkSessions} />
              </>
            );
          }}
        </Await>
      </Suspense>

      <Suspense
        fallback={
          <>
            <div className="mt-6">
              <SectionHeading>更新されたセッション</SectionHeading>
            </div>
            <SessionSkeleton />
          </>
        }
      >
        <Await resolve={$closeSession}>
          {(data) => {
            if (!data || data?.talkSessions?.length === 0) {
              return null;
            }

            return (
              <>
                <div className="mt-6">
                  <SectionHeading>更新されたセッション</SectionHeading>
                </div>
                <SessionList sessions={data.talkSessions} />
              </>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
