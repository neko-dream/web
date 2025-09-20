import { Suspense, use } from "react";
import { Link } from "react-router";
import TalkSessionCard from "~/components/features/talksession-card";
import { Avatar } from "~/components/ui/avatar";
import type { Route } from "~/react-router/_pages.users.$user_id/+types";

export { loader } from "./modules/loader";

export default function Page({
  loaderData: { $user, $sesssions },
}: Route.ComponentProps) {
  return (
    <>
      <Suspense>
        <UserProfile $user={$user} />
      </Suspense>
      <Suspense>
        <TalkSessions $sesssions={$sesssions} />
      </Suspense>
    </>
  );
}

const UserProfile = ({
  $user,
}: Pick<Route.ComponentProps["loaderData"], "$user">) => {
  const user = use($user).data;

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center pt-4">
      <Avatar src={user.iconURL} className="mt-2 h-24 w-24" />
      <p className="mt-2 text-2xl">{user.displayName}</p>
    </div>
  );
};

const TalkSessions = ({
  $sesssions,
}: Pick<Route.ComponentProps["loaderData"], "$sesssions">) => {
  const sessions = use($sesssions).data;

  return (
    <div className="mt-8 flex-1 space-y-4 bg-cs-gray-200 py-4">
      {sessions?.talkSessions.map((session, i) => {
        return (
          <Link
            to={`/${session.talkSession.id}`}
            className="mx-auto block w-full max-w-2xl rounded-md bg-white p-2"
            key={i}
            viewTransition={true}
          >
            <TalkSessionCard {...session} />
          </Link>
        );
      })}
    </div>
  );
};
