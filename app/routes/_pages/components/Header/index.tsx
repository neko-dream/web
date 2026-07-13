import { Suspense, use } from "react";
import LogoIcon from "~/assets/kotohiro.png";
import type { Route } from "~/react-router/_pages/+types/route";

type Props = Route.ComponentProps["loaderData"];

export const Header = ({ $user }: Props) => {
  return (
    <header className="sticky top-0 z-30 w-full">
      <div className="relative flex h-14 w-full items-center bg-white px-4 py-1">
        <Suspense
          fallback={<img src={LogoIcon} alt="" className="h-10 w-[137px]" />}
        >
          <Logo $user={$user} />
        </Suspense>
      </div>
    </header>
  );
};

const Logo = ({ $user }: Props) => {
  const user = use($user);
  return (
    <a href={user ? "/home" : "/"} className="mr-auto">
      <img src={LogoIcon} alt="" className="h-10 w-[137px]" />
    </a>
  );
};
