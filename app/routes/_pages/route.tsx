import { Await, Link, Outlet, useLoaderData } from "react-router";
import { Suspense, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchIcon from "~/assets/search.svg";
import LogoIcon from "~/assets/kotihiro.png";
import Avator from "~/components/Avator";
import { SearchMenuDialog } from "./components/SearchMenuDialog";
import { loader } from "./modules/loader";
import "./route.css";
import { AvatarSkeleton } from "./components/AvatarSkeleton";

export { ErrorBoundary } from "./modules/ErrorBoundary";
export { meta } from "./modules/meta";
export { loader };

export default function Route() {
  const { $user } = useLoaderData<typeof loader>();
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false);

  const handleClose = () => {
    setIsSearchMenuOpen(false);
  };

  const handleOpenChange = () => {
    setIsSearchMenuOpen((prev) => !prev);
  };

  return (
    <>
      {/* 常時表示はされない */}
      <ToastContainer position="top-center" autoClose={1500} />
      <SearchMenuDialog
        open={isSearchMenuOpen}
        onOpenChange={setIsSearchMenuOpen}
      />

      {/* ヘッダー */}
      <header className="z-20 flex h-10 w-full shrink-0 items-center justify-between space-x-6 bg-white px-4">
        <Link to="/home" className="mr-auto">
          <img src={LogoIcon} alt="" className="h-8 w-[109px]" />
        </Link>

        <button onClick={handleOpenChange}>
          <img src={SearchIcon} alt="" loading="lazy" className="h-5 w-5" />
        </button>

        <Suspense fallback={<AvatarSkeleton />}>
          <Await resolve={$user}>
            {(user) => {
              return (
                <Link to={"/mypage"} onClick={handleClose}>
                  <Avator src={user?.iconURL || ""} className="h-8 w-8" />
                </Link>
              );
            }}
          </Await>
        </Suspense>
      </header>

      <main className="flex flex-1 flex-col bg-white">
        <Outlet />
      </main>
    </>
  );
}
