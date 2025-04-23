import { CenterDialog, type ModalProps } from "~/components/ui/modal";
import { useSatisfiedStore } from "~/hooks/useVote";

type Props = Omit<ModalProps, "children"> & {
  sessionID: string;
  children: (
    status: "consent" | "demography",
    next: () => void,
  ) => React.ReactNode;
};

export const RequestsModal = ({ sessionID, children, ...props }: Props) => {
  const { isRequestModal, setIsRequestModal } = useSatisfiedStore(
    (state) => state,
  );

  const next = () => {
    const [, ...rest] = isRequestModal;
    setIsRequestModal(rest);
  };

  return (
    <CenterDialog {...props}>{children(isRequestModal[0], next)}</CenterDialog>
  );
};
