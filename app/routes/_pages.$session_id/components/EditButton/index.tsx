import { type ComponentProps, use } from "react";
import { Link } from "react-router";
import { Edit } from "~/components/icons";
import type { RouteContext } from "~/types/ctx";

type Props = ComponentProps<"button"> & {
  $user: RouteContext["$user"];
  session: {
    owner: {
      displayID: string;
    };
    id: string;
  };
};

export const EditButton = ({ $user, session }: Props) => {
  const user = use($user);

  if (user?.displayID !== session.owner.displayID) {
    return null;
  }

  return (
    <Link to={`/create/session/${session.id}`} className="ml-2 cursor-pointer">
      <Edit />
    </Link>
  );
};
