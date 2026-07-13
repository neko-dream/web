import { Suspense, useEffect, useState } from "react";
import { Await, Link, useLocation } from "react-router";
import LogoIcon from "~/assets/kotohiro.png";
import { Close, Menu, PlusCircle, User } from "~/components/icons";
import { Avatar, AvatarSkeleton } from "~/components/ui/avatar";
import { button } from "~/components/ui/button";
import type { Route } from "~/react-router/_pages/+types/route";
import { MenuDialog } from "../MenuDialog";

type Props = Route.ComponentProps["loaderData"];

const ignorePersonalIconPages = [
  "/",
  "/auth/signup",
  "/guide/about",
  "/guide/contact",
];

export const Header = ({ $user }: Props) => {
  const location = useLocation();
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);

  // モーダルの状態が変わったときにスクロールを制御
  useEffect(() => {
    if (isMenuDialogOpen) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuDialogOpen]);

  const handleMenuButtonClick = () => setIsMenuDialogOpen((prev) => !prev);

  return (
    <>
      <header className="fixed z-30 w-full">
        <span className="relative flex h-14 w-full items-center bg-white px-4 py-1">
          <Suspense
            fallback={<img src={LogoIcon} alt="" className="h-10 w-[137px]" />}
          >
            <Await resolve={$user}>
              {(user) => (
                <a href={user ? "/home" : "/"} className="mr-auto">
                  <img src={LogoIcon} alt="" className="h-10 w-[137px]" />
                </a>
              )}
            </Await>
          </Suspense>

          {ignorePersonalIconPages.includes(location.pathname) && (
            <button
              type="button"
              className="ml-auto cursor-pointer"
              onClick={handleMenuButtonClick}
            >
              {isMenuDialogOpen ? <Close /> : <Menu />}
            </button>
          )}

          {!ignorePersonalIconPages.includes(location.pathname) && (
            <Suspense fallback={<AvatarSkeleton />}>
              <Await resolve={$user}>
                {(user) => {
                  if (!user?.isRegistered) {
                    return (
                      <Link
                        to={"/"}
                        aria-label="ログインする"
                        className="flex size-10 items-center justify-center rounded-full bg-[#D0E5F5]"
                      >
                        <User className="size-6 text-[#657A88]" />
                      </Link>
                    );
                  }

                  return (
                    <div className="flex items-center space-x-4">
                      <Link to={"/users/me"}>
                        <Avatar
                          src={user?.iconURL || ""}
                          className="h-10 w-10"
                        />
                      </Link>

                      {user?.orgType && (
                        <Link
                          to={"/make/new"}
                          className={button({
                            className:
                              "flex h-8 items-center space-x-1 rounded-md bg-[#007AFF] p-2 text-xs",
                          })}
                        >
                          <PlusCircle />
                          <span>作成</span>
                        </Link>
                      )}
                    </div>
                  );
                }}
              </Await>
            </Suspense>
          )}
        </span>
      </header>

      {/* スペーサー */}
      <div className="h-14 w-full" />

      {/* 各種ダイアログ */}
      <MenuDialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen} />
    </>
  );
};
