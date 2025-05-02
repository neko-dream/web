import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { ModalProps } from "./types";

/**
 * swipeカードに謎にzIndexがついて負けるので一旦5000にしている
 */
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

  // 背景スクロールを制御する
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";

      // スクロール位置を復元
      const scrollY = document.body.style.top;
      window.scrollTo(0, Number.parseInt(scrollY || "0") * -1);
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-[5000] w-full bg-black"
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
            className="-translate-x-1/2 -translate-y-1/2 fixed inset-0 top-1/2 left-1/2 z-[5000] h-fit w-fit min-w-[343px]"
          >
            <div className="rounded-lg bg-white p-2 shadow-xl">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
};
