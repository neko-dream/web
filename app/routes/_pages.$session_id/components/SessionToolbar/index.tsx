import { motion } from "motion/react";
import type { ComponentType, MouseEvent, SVGProps } from "react";
import { NavLink } from "react-router";

export type ToolbarItem = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  external?: boolean;
};

type Props = {
  items: ToolbarItem[];
  showFab: boolean;
  onFabClick: (e: MouseEvent) => void;
};

const spring = {
  type: "spring",
  stiffness: 400,
  damping: 30,
} as const;

/**
 * セッション詳細用のボトムツールバー（タブの代替）
 */
export const SessionToolbar = ({ items, showFab, onFabClick }: Props) => {
  return (
    <div className="pointer-events-none fixed right-0 bottom-0 left-0 z-40 flex justify-center pb-[calc(env(safe-area-inset-bottom,0px)+16px)]">
      <motion.div
        initial={{ y: 96, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...spring, damping: 24 }}
        className="pointer-events-auto flex max-w-full items-center gap-2 px-2"
      >
        <nav className="flex items-center gap-2 overflow-x-auto rounded-full bg-[#EAEEF3] p-2 shadow-[0px_4px_8px_rgba(0,0,0,0.16)]">
          {items.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={true}
              aria-label={item.label}
              prefetch="viewport"
              replace={true}
              viewTransition={true}
              preventScrollReset={true}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="relative flex size-12 shrink-0 items-center justify-center"
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="session-toolbar-active"
                      transition={spring}
                      className="absolute inset-0 rounded-full bg-[#D0E5F5]"
                    />
                  )}
                  <motion.span
                    whileTap={{ scale: 0.85 }}
                    transition={spring}
                    className={`relative ${isActive ? "text-[#191C1E]" : "text-[#71787E]"}`}
                  >
                    <item.icon className="size-6" />
                  </motion.span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {showFab && (
          <motion.button
            type="button"
            aria-label="意見を書いてみる"
            onClick={onFabClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            transition={spring}
            className="flex size-16 shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-[#007AFF] shadow-[0px_4px_2px_rgba(0,0,0,0.25)]"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M15.2322 5.23223L18.7677 8.76777M16.7322 3.73223C17.7085 2.75592 19.2914 2.75592 20.2677 3.73223C21.244 4.70854 21.244 6.29146 20.2677 7.26777L6.5 21.0355H3V17.4644L16.7322 3.73223Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};
