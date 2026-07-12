import { Link, useLocation } from "react-router";
import { Home, PlusCircle, Search, User } from "~/components/icons";

const navItems = [
  { icon: Home, label: "ホーム", to: "/home" },
  { icon: Search, label: "検索", to: "/search" },
  { icon: User, label: "マイページ", to: "/users/me" },
] as const;

export const BottomNav = () => {
  const { pathname } = useLocation();

  const isActive = (to: string) => {
    if (to === "/home") {
      return pathname === "/home";
    }
    if (to === "/users/me") {
      return pathname.startsWith("/users/me");
    }
    if (to === "/search") {
      return pathname === "/search";
    }
    return false;
  };

  return (
    <div className="pointer-events-none fixed right-0 bottom-0 left-0 z-40 flex justify-center pb-[calc(env(safe-area-inset-bottom,0px)+16px)]">
      <nav className="pointer-events-auto flex items-center rounded-full bg-[#f0f4f9] p-2 shadow-[0px_4px_8px_rgba(0,0,0,0.12)]">
        {navItems.map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex size-12 items-center justify-center rounded-full ${
                active
                  ? "bg-[linear-gradient(135deg,#ffc4c0,#cdccf3_50%,#c1e6f7)] text-[#191c1e]"
                  : "text-[#8e8e93]"
              }`}
            >
              <item.icon className="size-6" />
            </Link>
          );
        })}
        <div className="mx-1 h-12 w-6" />
        <Link
          to="/make/new"
          className="flex size-16 items-center justify-center rounded-2xl shadow-[0px_4px_2px_rgba(0,0,0,0.25)]"
          style={{
            backgroundImage:
              "linear-gradient(225deg, #ff3b30 0%, #5856d6 50%, #32ade6 100%)",
          }}
        >
          <PlusCircle className="size-6 text-white" />
        </Link>
      </nav>
    </div>
  );
};
