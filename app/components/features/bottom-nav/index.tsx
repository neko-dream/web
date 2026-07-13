import { motion } from "motion/react";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Home, PlusCircle, Search, User } from "~/components/icons";
import { SearchModal } from "~/routes/_pages/components/SearchModal";

const spring = {
  type: "spring",
  stiffness: 400,
  damping: 30,
} as const;

const ActiveIndicator = () => (
  <motion.span
    layoutId="bottom-nav-active"
    transition={spring}
    className="absolute inset-0 rounded-full bg-[linear-gradient(90deg,#FFC4C0,#CDCCF3_50%,#C1E6F7)]"
  />
);

const itemClass = "relative flex size-12 items-center justify-center";
const iconClass = (active: boolean) =>
  `relative ${active ? "text-[#191C1E]" : "text-[#8E8E93]"}`;

export const BottomNav = () => {
  const { pathname } = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isHomeActive = pathname === "/home" && !isSearchOpen;
  const isMypageActive = pathname.startsWith("/users/me") && !isSearchOpen;

  return (
    <>
      <div className="pointer-events-none fixed right-0 bottom-0 left-0 z-40 flex justify-center pb-[calc(env(safe-area-inset-bottom,0px)+16px)]">
        <motion.div
          initial={{ y: 96, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...spring, damping: 24 }}
          className="pointer-events-auto flex items-center gap-6"
        >
          <nav className="flex items-center gap-6 rounded-full bg-[#F0F4F9] p-2 shadow-[0px_4px_8px_rgba(0,0,0,0.16)]">
            <Link
              to="/home"
              aria-label="ホーム"
              aria-current={isHomeActive ? "page" : undefined}
              className={itemClass}
            >
              {isHomeActive && <ActiveIndicator />}
              <motion.span
                whileTap={{ scale: 0.85 }}
                transition={spring}
                className={iconClass(isHomeActive)}
              >
                <Home className="size-6" />
              </motion.span>
            </Link>

            <button
              type="button"
              aria-label="検索"
              onClick={() => setIsSearchOpen(true)}
              className={`${itemClass} cursor-pointer`}
            >
              {isSearchOpen && <ActiveIndicator />}
              <motion.span
                whileTap={{ scale: 0.85 }}
                transition={spring}
                className={iconClass(isSearchOpen)}
              >
                <Search className="size-6" />
              </motion.span>
            </button>

            <Link
              to="/users/me"
              aria-label="マイページ"
              aria-current={isMypageActive ? "page" : undefined}
              className={itemClass}
            >
              {isMypageActive && <ActiveIndicator />}
              <motion.span
                whileTap={{ scale: 0.85 }}
                transition={spring}
                className={iconClass(isMypageActive)}
              >
                <User className="size-6" />
              </motion.span>
            </Link>
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

      <SearchModal open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
};
