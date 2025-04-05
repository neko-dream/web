import { Link, Outlet } from "react-router";
import type { Route } from "~/app/routes/_pages.users.me/+types/route";
import { Avatar } from "~/components/Avatar";
import { Setting } from "~/components/Icons";
import { Tabs } from "./components/Tabs";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { loader } from "./modules/loader";

export default function Layout({ loaderData: { user } }: Route.ComponentProps) {
  return (
    <>
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center pt-4">
        <Link to={"/edit/users/me"} className="mr-2 ml-auto">
          <Setting />
        </Link>
        <Avatar src={user.iconURL} className="mt-2 h-24 w-24" />
        <p className="mt-2 text-2xl">{user.displayName}</p>
        <Tabs
          className="mt-2"
          items={[
            { label: "自分の意見", href: "/users/me" },
            { label: "セッション", href: "/users/me/histories" },
          ]}
        />
      </div>
      <div className="h-full w-full flex-1 bg-mt-gray-200">
        <Outlet />
      </div>
    </>
  );
}
