import { useNavigate } from "react-router";
import { CenterDialog, type ModalProps } from "~/components/ui/modal";
import { useSatisfiedStore } from "~/hooks/useVote";

type Props = Omit<ModalProps, "children"> & {
  sessionID: string;
  children: (
    status: "consent" | "demography" | "signup",
    next: () => void,
  ) => React.ReactNode;
};

export const RequestsModal = ({ sessionID, children, ...props }: Props) => {
  const { isRequestModal, setIsRequestModal, nextPath } = useSatisfiedStore(
    (state) => state,
  );
  const navigate = useNavigate();

  const next = () => {
    const [, ...rest] = isRequestModal;
    // 次のでもグラを取得する必要がなければ繊維
    if (rest.length === 0 && nextPath) {
      navigate(nextPath);
    }
    setIsRequestModal(rest);
  };

  return (
    <CenterDialog {...props}>{children(isRequestModal[0], next)}</CenterDialog>
  );
};
