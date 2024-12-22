import { Link, Outlet, useLoaderData, useLocation } from "react-router";
import { useState } from "react";
import { RiChat1Line } from "react-icons/ri";
import Avator from "~/components/Avator";
import Heading from "~/components/Heading";
import { loader } from "./modules/loader";
import { SessionRouteContext } from "./types";
import { OpinionModal } from "~/feature/opinion/components/OpinionModal";
import { SessionDetialModal } from "./components/SessionDetialModal";
import { JST } from "~/libs/date";
import { tv } from "tailwind-variants";

const regexSwipe = /^\/[^/]+\/swipe$/;
const regexReply = /^\/[^/]+\/(?!swipe$)[^/]+$/;
const regexHome = /^\/[^/]+$/;

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader };

const swipeUI = tv({
  base: "flex flex-1 flex-col",
  variants: {
    isSwipePage: {
      true: "overflow-hidden",
    },
  },
});

export default function Route() {
  const { session, isOwner } = useLoaderData<typeof loader>();
  const [isOpen, setIsOpen] = useState(false);
  const [isSessionDetailOpen, setIsSessionDetailOpen] = useState(false);
  const pathname = useLocation().pathname;
  const isSwipePage = regexSwipe.test(pathname);
  const isReplyPage = regexReply.test(pathname);
  const isHomePage = regexHome.test(pathname);

  const isFinished = JST(session.scheduledEndTime).isBefore();

  return (
    <div className={swipeUI({ isSwipePage })}>
      <div className="relative">
        <div className="mt-8 flex shrink-0 flex-col p-3 pl-4">
          <p className="text-sm text-[#6d6c6a]">テーマ</p>
          <p className="line-clamp-1">{session.theme}</p>
          <div className="mt-2 flex items-center space-x-2">
            <Avator src={session.owner.iconURL} className="h-6 w-6" />
            <p className="line-clamp-1 w-48 text-sm text-[#6d6c6a]">
              {session.owner.displayName}
            </p>
          </div>
        </div>

        {isSwipePage && (
          <Link
            to={`/${session.id}`}
            className="absolute right-2 top-2 text-blue-500 underline"
            onClick={() => setIsOpen(false)}
          >
            みんなの意見を見る {"->"}
          </Link>
        )}

        {isReplyPage && (
          <Link
            to={`/${session.id}`}
            className="absolute left-2 top-2 text-blue-500 underline"
            onClick={() => setIsOpen(false)}
          >
            {"<-"} みんなの意見を見る
          </Link>
        )}

        {!isFinished && isHomePage && (
          <Link
            to={`/${session.id}/swipe`}
            className="absolute left-2 top-2 text-blue-500 underline"
            onClick={() => setIsOpen(false)}
          >
            {"<-"} スワイプ画面にもどる
          </Link>
        )}

        {isHomePage && isOwner && (
          <Link
            to={`/${session.id}/conclusion`}
            className="absolute right-2 top-2 text-blue-500 underline"
            onClick={() => setIsOpen(false)}
          >
            結論を投稿する {"->"}
          </Link>
        )}

        <button
          onClick={() => {
            setIsOpen(false);
            setIsSessionDetailOpen(true);
          }}
          className="absolute bottom-2 right-16 flex items-center space-x-1 rounded-full border border-gray-600 px-2 py-1"
        >
          詳細
        </button>

        <button
          onClick={() => {
            setIsOpen(true);
            setIsSessionDetailOpen(false);
          }}
          className="absolute bottom-2 right-4 flex items-center space-x-1 rounded-full border border-gray-600 p-1 text-blue-500"
        >
          <RiChat1Line className="text-black" size={24} />
        </button>
      </div>
      <Heading>みんなの意見、どう思う？</Heading>

      <Outlet context={{ session } satisfies SessionRouteContext} />

      <SessionDetialModal
        open={isSessionDetailOpen}
        onClose={() => {
          setTimeout(() => {
            setIsSessionDetailOpen(false);
          }, 500);
        }}
        session={session}
      />

      <OpinionModal
        talkSessionID={session.id}
        open={isOpen}
        onClose={() => {
          setTimeout(() => {
            setIsOpen(false);
          }, 500);
        }}
      />
    </div>
  );
}
