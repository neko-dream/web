import type { Dispatch, ReactNode, SetStateAction } from "react";

export type ModalProps = {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
};
