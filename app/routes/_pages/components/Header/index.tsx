import { Dispatch, SetStateAction, Suspense } from "react";
import { Await, Link } from "react-router";
import LogoIcon from "~/assets/kotihiro.png";
import { Avatar, AvatarSkeleton } from "~/components/Avatar";
import type { Route } from "~/app/routes/_pages/+types/route";
import { button } from "~/components/Button";
import { PlusCircle, Search } from "~/components/Icons";

type Props = Route.ComponentProps["loaderData"] & {
  setIsSearchMenuOpen: Dispatch<SetStateAction<boolean>>;
};

export const Header = ({ $user, setIsSearchMenuOpen }: Props) => {
  const handleClose = () => {
    setIsSearchMenuOpen(false);
  };

  const handleOpenChange = () => {
    setIsSearchMenuOpen((prev) => !prev);
  };

  return (
    <header className="z-20 flex h-12 w-full shrink-0 items-center justify-between space-x-6 bg-white px-4">
      <Link to="/home" className="mr-auto" viewTransition>
        <img src={LogoIcon} alt="" className="h-8 w-[109px]" />
      </Link>

      <button onClick={handleOpenChange}>
        <Search className="h-5 w-5" />
      </button>

      <Suspense fallback={<AvatarSkeleton />}>
        <Await resolve={$user}>
          {(user) => {
            if (!user?.isVerify) {
              return null;
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
    </header>
  );
};
