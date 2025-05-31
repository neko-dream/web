import { Suspense, useEffect, useState } from "react";
import { Await, Link, useLocation } from "react-router";
import { tv } from "tailwind-variants";
import LogoIcon from "~/assets/kotihiro.png";
import { Close, Menu, PlusCircle, Search } from "~/components/icons";
import { Avatar, AvatarSkeleton } from "~/components/ui/avatar";
import { button } from "~/components/ui/button";
import type { Route } from "~/react-router/_pages/+types/route";
import { MenuDialog } from "../MenuDialog";
import { SearchModal } from "../SearchModal";

type Props = Route.ComponentProps["loaderData"];

const ignorePersonalIconPages = [
  "/",
  "/signup",
  "/guide/about",
  "/guide/contact",
];

const header = tv({
  base: "fixed z-30 w-full border-gray-100 border-b-2",
  variants: {
    isDialogOpen: {
      true: "shadow-none",
    },
  },
});

export const Header = ({ $user }: Props) => {
  const location = useLocation();
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  // モーダルの状態が変わったときにスクロールを制御
  useEffect(() => {
    if (isMenuDialogOpen || isSearchDialogOpen) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuDialogOpen, isSearchDialogOpen]);

  const handleSearchDialogOpenChange = () =>
    setIsSearchDialogOpen((prev) => !prev);
  const handleMenuButtonClick = () => setIsMenuDialogOpen((prev) => !prev);

  return (
    <>
      <header
        className={header({
          isDialogOpen: isMenuDialogOpen || isSearchDialogOpen,
        })}
      >
        <span className="relative flex h-12 w-full items-center bg-white px-4">
          <Suspense
            fallback={<img src={LogoIcon} alt="" className="h-8 w-[109px]" />}
          >
            <Await resolve={$user}>
              {(user) => (
                <a href={user ? "/home" : "/"} className="mr-auto">
                  <img src={LogoIcon} alt="" className="h-8 w-[109px]" />
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
                        className={button({
                          className:
                            "flex h-8 items-center rounded-md bg-[#32ADE6] p-2 text-xs",
                        })}
                      >
                        ログイン
                      </Link>
                    );
                  }

                  return (
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={handleSearchDialogOpenChange}
                        className="cursor-pointer"
                      >
                        <Search className="h-5 w-5" />
                      </button>
                      <Link to={"/users/me"}>
                        <Avatar src={user?.iconURL || ""} className="h-8 w-8" />
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
      <div className="h-12 w-full" />

      {/* 各種ダイアログ */}
      <SearchModal
        open={isSearchDialogOpen}
        onOpenChange={setIsSearchDialogOpen}
      />
      <MenuDialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen} />
    </>
  );
};
