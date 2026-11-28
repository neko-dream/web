import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { tv } from "tailwind-variants";
import LogoIcon from "~/assets/kotohiro.png";
import { Close, Menu, PlusCircle, Search } from "~/components/icons";
import { Avatar, AvatarSkeleton } from "~/components/ui/avatar";
import { button } from "~/components/ui/button";
import { useAuthStore } from "~/hooks/useAuthStore";
import { canCreateTalkSession } from "~/libs/session-creation";
import { MenuDialog } from "../MenuDialog";
import { SearchModal } from "../SearchModal";

const ignorePersonalIconPages = [
  "/",
  "/auth/signup",
  "/guide/about",
  "/guide/contact",
];

const header = tv({
  base: "fixed z-30 w-full border-line border-b bg-white/90 backdrop-blur",
  variants: {
    isDialogOpen: {
      true: "shadow-none",
    },
  },
});

export const Header = () => {
  const location = useLocation();
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const permissions = useAuthStore((state) => state.permissions);
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
        <span className="relative flex h-14 w-full items-center px-4">
          <a href={user ? "/home" : "/"} className="mr-auto">
            <img src={LogoIcon} alt="" className="h-8 w-[109px]" />
          </a>

          {ignorePersonalIconPages.includes(location.pathname) && (
            <button
              type="button"
              className="ml-auto cursor-pointer"
              onClick={handleMenuButtonClick}
            >
              {isMenuDialogOpen ? <Close /> : <Menu />}
            </button>
          )}

          {!ignorePersonalIconPages.includes(location.pathname) &&
            (status === "loading" ? (
              <AvatarSkeleton />
            ) : !user?.isRegistered ? (
              <Link
                to={"/"}
                className={button({
                  className:
                    "flex h-8 items-center rounded-full bg-brand-blue p-2 text-xs",
                })}
              >
                ログインする
              </Link>
            ) : (
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleSearchDialogOpenChange}
                  className="cursor-pointer"
                >
                  <Search className="h-5 w-5 text-ink-muted" />
                </button>
                <Link to={"/users/me"}>
                  <Avatar src={user.iconURL || ""} className="h-8 w-8" />
                </Link>

                {canCreateTalkSession(permissions) && (
                  <Link
                    to={"/make/new"}
                    className={button({
                      className:
                        "flex h-8 items-center gap-1 rounded-full bg-brand-blue p-2 text-xs",
                    })}
                  >
                    <PlusCircle />
                    <span>作成</span>
                  </Link>
                )}
              </div>
            ))}
        </span>
      </header>

      {/* スペーサー */}
      <div className="h-14 w-full" />

      {/* 各種ダイアログ */}
      <SearchModal
        open={isSearchDialogOpen}
        onOpenChange={setIsSearchDialogOpen}
      />
      <MenuDialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen} />
    </>
  );
};
