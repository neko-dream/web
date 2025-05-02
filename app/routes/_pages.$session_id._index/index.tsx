import { useOutletContext } from "react-router";
import { SanitizedHtml } from "~/components/features/xss-html";
import type { SessionRouteContext } from "~/types/ctx";

export default function Page() {
  const { session } = useOutletContext<SessionRouteContext>();

  return (
    <div className="mx-auto max-w-4xl [&_p]:min-h-6">
      <SanitizedHtml html={session.description || ""} />
    </div>
  );
}
