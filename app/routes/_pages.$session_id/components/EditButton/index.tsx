import type { ComponentProps } from "react";
import { Link } from "react-router";
import { Edit } from "~/components/icons";
import { useAuthStore } from "~/hooks/useAuthStore";

type Props = ComponentProps<"button"> & {
  session: {
    owner: {
      displayID: string;
    };
    id: string;
  };
};

export const EditButton = ({ session }: Props) => {
  const user = useAuthStore((state) => state.user);

  if (user?.displayID !== session.owner.displayID) {
    return null;
  }

  return (
    <Link to={`/make/${session.id}`} className="ml-2 cursor-pointer">
      <Edit />
    </Link>
  );
};
