import { Link, useLoaderData } from "react-router";
import { Avatar } from "~/components/Avatar";
import { loader } from "./modules/loader";
import { Setting } from "~/components/Icons";

export { loader };

export default function Page() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="mt-2 flex flex-1 flex-col items-center">
      <Link to={"/mypage/edit"} className="mr-2 ml-auto">
        <Setting />
      </Link>
      <Avatar src={user.iconURL} className="mt-2 h-16 w-16" />
      <p className="text-2xl">{user.displayName}</p>
    </div>
  );
}
