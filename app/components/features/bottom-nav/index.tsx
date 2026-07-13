import { motion } from "motion/react";
import { Link, useLocation } from "react-router";
import { Home, PlusCircle, Search, User } from "~/components/icons";

const navItems = [
  { icon: Home, label: "ホーム", to: "/home" },
  { icon: Search, label: "検索", to: "/search" },
  { icon: User, label: "マイページ", to: "/users/me" },
] as const;

const isActivePath = (to: string, pathname: string) => {
  if (to === "/home") {
    return pathname === "/home";
  }
  return pathname.startsWith(to);
};

const spring = {
  type: "spring",
  stiffness: 400,
  damping: 30,
} as const;

export const BottomNav = () => {
  const { pathname } = useLocation();

  const visible =
    pathname === "/home" ||
    pathname === "/search" ||
    pathname.startsWith("/users/me");

  if (!visible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-0 bottom-0 left-0 z-40 flex justify-center pb-[calc(env(safe-area-inset-bottom,0px)+16px)]">
      <motion.div
        initial={{ y: 96, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...spring, damping: 24 }}
        className="pointer-events-auto flex items-center gap-6"
      >
        <nav className="flex items-center gap-6 rounded-full bg-[#F0F4F9] p-2 shadow-[0px_4px_8px_rgba(0,0,0,0.16)]">
          {navItems.map((item) => {
            const active = isActivePath(item.to, pathname);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className="relative flex size-12 items-center justify-center"
              >
                {active && (
                  <motion.span
                    layoutId="bottom-nav-active"
                    transition={spring}
                    className="absolute inset-0 rounded-full bg-[linear-gradient(90deg,#FFC4C0,#CDCCF3_50%,#C1E6F7)]"
                  />
                )}
                <motion.span
                  whileTap={{ scale: 0.85 }}
                  transition={spring}
                  className={`relative ${active ? "text-[#191C1E]" : "text-[#8E8E93]"}`}
                >
                  <item.icon className="size-6" />
                </motion.span>
              </Link>
            );
          })}
        </nav>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          transition={spring}
          className="rounded-2xl shadow-[0px_4px_2px_rgba(0,0,0,0.25)]"
        >
          <Link
            to="/make/new"
            aria-label="セッションを作成"
            className="flex size-16 items-center justify-center rounded-2xl bg-[linear-gradient(225deg,#FF3B30_0%,#5856D6_50%,#32ADE6_100%)]"
          >
            <PlusCircle className="size-6 text-white" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};
