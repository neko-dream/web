import { type ComponentProps, use } from "react";
import { useAuthStore } from "~/hooks/useAuthStore";
import type { Route } from "~/react-router/_pages.$session_id/+types/route";

type Props = ComponentProps<"button"> & {
  $remainingCount: Route.ComponentProps["loaderData"]["$remainingCount"];
};

export const LookupOtherOpinionButton = ({
  $remainingCount,
  ...props
}: Props) => {
  const user = useAuthStore((state) => state.user);
  const count = use($remainingCount);

  if (!(user || count) || count === 0) {
    return;
  }

  return (
    <button {...props} type="button">
      <span className="primary-gradient inline-block text-clip">
        みんなの意見を見る
      </span>
      <span className="-top-2 absolute right-0 flex h-6 w-6 items-center justify-center rounded-full bg-cs-caution p-1 text-sm text-white">
        {count}
      </span>
    </button>
  );
};
