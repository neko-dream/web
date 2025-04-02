import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useEffect } from "react";
import { ModalProps } from "./types";

export const CenterDialog = ({
  isOpen,
  onOpenChange,
  children,
}: ModalProps) => {
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

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-40 w-full bg-black"
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
            className="fixed inset-0 top-1/2 left-1/2 z-50 h-fit w-fit -translate-x-1/2 -translate-y-1/2"
          >
            <div className="rounded-lg bg-white p-2 shadow-xl">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
};
