import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import type { ModalProps } from "./index.js";

export const HalfBottomDialog = ({
  isOpen,
  onOpenChange,
  children,
}: ModalProps) => {
  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-40 bg-black"
          />

          {/* モーダル本体 */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
              mass: 0.5,
            }}
            className="fixed right-0 bottom-0 left-0 z-50 rounded-t-2xl bg-white p-4 shadow-lg"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
};
