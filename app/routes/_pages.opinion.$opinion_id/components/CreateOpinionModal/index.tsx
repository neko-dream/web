import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { InfoCircle } from "~/components/Icons";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const CreateOpinionModal = ({ isOpen, onClose, children }: Props) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black"
          />

          {/* モーダル本体 */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed right-0 bottom-0 left-0 z-50 rounded-t-2xl bg-white p-4 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <h2 className="mx-auto text-lg font-bold">コメント</h2>
            </div>
            <div className="mt-1 flex items-center space-x-1 text-sm font-bold text-blue-500">
              <InfoCircle />
              <p>投稿のルール</p>
            </div>
            <div className="mt-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
