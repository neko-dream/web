import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router";
import { SearchWhite } from "~/components/Icons";
import { input } from "~/components/Input";

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

export const SearchModal = ({ open, onOpenChange }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleCloseModal = () => onOpenChange(false);

  const handleSubmit = () => {
    const query = encodeURIComponent(inputRef.current?.value || "");
    navigate(`/home?q=${query}`);
    handleCloseModal();
  };

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
            <div className="absolute z-10 flex w-full flex-col bg-white pt-10">
              <div className="flex space-x-2 p-4">
                <input
                  className={input({ className: "h-10" })}
                  placeholder="キーワードで検索"
                  ref={inputRef}
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-500 hover:opacity-80"
                >
                  <SearchWhite className="fill-white" />
                </button>
              </div>
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
