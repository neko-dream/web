import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const menuVariants = {
  hidden: {
    y: -20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

const menu = [
  {
    title: "トップページ",
    path: "/",
  },
  {
    title: "ことひろとは",
    path: "/about",
  },
  {
    title: "お問い合わせ",
    path: "/contact",
  },
];

export const MenuDialog = ({ open, onOpenChange, ...props }: Props) => {
  const handleCloseModal = () => onOpenChange(false);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-0 z-20 w-full"
          >
            <div
              {...props}
              className="absolute flex w-full flex-col space-y-2 bg-white pt-16 pb-4"
            >
              {menu.map(({ path, title }, i) => {
                return (
                  <Link
                    key={i}
                    to={path}
                    className="flex h-10 items-center px-4 text-sm"
                    onClick={handleCloseModal}
                  >
                    {title}
                  </Link>
                );
              })}
            </div>
          </motion.div>
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-0 z-10 h-full w-full bg-slate-600/60"
            onClick={handleCloseModal}
          />
        </>
      )}
    </AnimatePresence>
  );
};
