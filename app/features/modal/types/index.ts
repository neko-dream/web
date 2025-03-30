import { Dispatch, ReactNode, SetStateAction } from "react";

export type BaseModalProps = {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
};
