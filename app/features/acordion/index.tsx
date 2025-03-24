import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ArrowIcon from "~/assets/icons/arrow.svg";
import { tv } from "tailwind-variants";

type ListProps = {
  title: ReactNode;
  children: ReactNode;
  className?: string;
};

const acordion = tv({
  base: "box-border flex flex-col rounded-md bg-white p-2 hover:cursor-pointer",
});

export const List = ({ children, className, title }: ListProps) => {
  const [isShow, setIsShow] = useState(false);

  return (
    <motion.div
      className={acordion({ className })}
      onClick={() => setIsShow((value) => !value)}
      initial={false}
    >
      <h2 className="flex items-center justify-between">
        {title}
        <motion.img
          src={ArrowIcon}
          alt=""
          animate={{ rotate: isShow ? 0 : 90 }}
          transition={{ duration: 0.2 }}
        />
      </h2>
      <AnimatePresence initial={false}>
        {isShow && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="pt-2 text-xl md:text-2xl">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
