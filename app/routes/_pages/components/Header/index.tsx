import { Suspense, useEffect, useState } from "react";
import { Await, Link, useLocation } from "react-router";
import LogoIcon from "~/assets/kotihiro.png";
import { Avatar, AvatarSkeleton } from "~/components/Avatar";
import type { Route } from "~/app/routes/_pages/+types/route";
import { button } from "~/components/Button";
import { Close, Menu, PlusCircle, Search } from "~/components/Icons";
import { SearchModal } from "../SearchModal";
import { MenuDialog } from "../MenuDialog";
import { tv } from "tailwind-variants";

type Props = Route.ComponentProps["loaderData"];

const ignoreParsonalIconPages = ["/", "/signup", "/about", "/contact"];

const header = tv({
  base: "fixed z-30 w-full shadow",
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

          {ignoreParsonalIconPages.includes(location.pathname) && (
            <button
              className="ml-auto cursor-pointer"
              onClick={handleMenuButtonClick}
            >
              {isMenuDialogOpen ? <Close /> : <Menu />}
            </button>
          )}

          {!ignoreParsonalIconPages.includes(location.pathname) && (
            <Suspense fallback={<AvatarSkeleton />}>
              <Await resolve={$user}>
                {(user) => {
                  if (!user?.isVerify) {
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
                        onClick={handleSearchDialogOpenChange}
                        className="cursor-pointer"
                      >
                        <Search className="h-5 w-5" />
                      </button>
                      <Link to={"/users/me"}>
                        <Avatar src={user?.iconURL || ""} className="h-8 w-8" />
                      </Link>

                      <Link
                        to={"/create/session/new"}
                        className={button({
                          className:
                            "flex h-8 items-center space-x-1 rounded-md bg-[#007AFF] p-2 text-xs",
                        })}
                      >
                        <PlusCircle />
                        <span>作成</span>
                      </Link>
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
