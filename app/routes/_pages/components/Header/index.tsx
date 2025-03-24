import { Dispatch, SetStateAction, Suspense } from "react";
import { Await, Link, useLocation } from "react-router";
import LogoIcon from "~/assets/kotihiro.png";
import { Avatar, AvatarSkeleton } from "~/components/Avatar";
import type { Route } from "~/app/routes/_pages/+types/route";
import { button } from "~/components/Button";
import { Close, Menu, PlusCircle, Search } from "~/components/Icons";

type Props = Route.ComponentProps["loaderData"] & {
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
  setIsSearchOpen: Dispatch<SetStateAction<boolean>>;
};

const ignoreParsonalIconPages = ["/", "/signup", "/about", "/contact"];

export const Header = ({
  $user,
  isMenuOpen,
  setIsSearchOpen,
  setIsMenuOpen,
}: Props) => {
  const location = useLocation();

  const handleClose = () => {
    setIsSearchOpen(false);
  };

  const handleOpenChange = () => {
    setIsSearchOpen((prev) => !prev);
  };

  const handleMenuButtonClick = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <header className="relative z-30 flex h-12 w-full shrink-0 items-center justify-between space-x-6 bg-white px-4">
      <Link to="/home" className="mr-auto" viewTransition>
        <img src={LogoIcon} alt="" className="h-8 w-[109px]" />
      </Link>

      {ignoreParsonalIconPages.includes(location.pathname) && (
        <button className="cursor-pointer" onClick={handleMenuButtonClick}>
          {isMenuOpen ? <Close /> : <Menu />}
        </button>
      )}

      {!ignoreParsonalIconPages.includes(location.pathname) && (
        <>
          <button onClick={handleOpenChange} className="cursor-pointer">
            <Search className="h-5 w-5" />
          </button>

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
                  <>
                    <Link to={"/users/me"} onClick={handleClose}>
                      <Avatar src={user?.iconURL || ""} className="h-8 w-8" />
                    </Link>

                    <Link
                      to={"/create/session"}
                      className={button({
                        className:
                          "flex h-8 items-center space-x-1 rounded-md bg-[#007AFF] p-2 text-xs",
                      })}
                    >
                      <PlusCircle />
                      <span>作成</span>
                    </Link>
                  </>
                );
              }}
            </Await>
          </Suspense>
        </>
      )}
    </header>
  );
};
