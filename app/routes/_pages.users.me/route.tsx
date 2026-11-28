import { Outlet } from "react-router";
import { Avatar } from "~/components/ui/avatar";
import { LogoHeader } from "~/components/ui/logo-header";
import type { Route } from "~/react-router/_pages.users.me/+types/route";
import { Tabs } from "./components/Tabs";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { clientLoader } from "./modules/loader";

export default function Layout({ loaderData: { user } }: Route.ComponentProps) {
  return (
    <>
      <LogoHeader />
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center pt-2">
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
      <div className="h-full w-full flex-1 bg-cs-gray-200 pb-[calc(env(safe-area-inset-bottom,0px)+88px)]">
        <Outlet />
      </div>
    </>
  );
}
