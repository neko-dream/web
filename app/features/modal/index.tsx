import { motion, AnimatePresence } from "framer-motion";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useEffect } from "react";

export type BaseModalProps = {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
};

export const Modal = ({ isOpen, onOpenChange, children }: BaseModalProps) => {
  const handleEscape = (e: KeyboardEvent) => {
    if (isOpen && e.key === "Escape") {
      onOpenChange(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-40 bg-black"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.75, y: 20 }}
            transition={{
              type: "spring",
              duration: 0.2,
              bounce: 0.3,
            }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <button
              className="mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">{children}</div>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
