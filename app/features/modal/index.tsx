import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { tv } from "tailwind-variants";

interface ModalProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}

const overlay = tv({
  base: "fixed inset-0 z-50 flex items-center justify-center bg-black/50",
  variants: {
    state: {
      open: "animate-fadeIn",
      close: "animate-fadeOut",
    },
  },
});

export const Modal = ({ isOpen, onOpenChange, children }: ModalProps) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleEscape = (e: KeyboardEvent) => {
    if (isOpen && e.key === "Escape") {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  });

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    setIsClosing(true);
    window.setTimeout(() => {
      onOpenChange(false);
      setIsClosing(false);
    }, 200);
  };

  return createPortal(
    <button
      className={overlay({ state: isClosing ? "close" : "open" })}
      onClick={handleClose}
    >
      <button
        className="mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">{children}</div>
      </button>
    </button>,
    document.body,
  );
};
