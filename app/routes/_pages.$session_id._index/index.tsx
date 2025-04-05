import { useOutletContext } from "react-router";
import { SanitizedHtml } from "~/components/features/xss-html";
import type { SessionRouteContext } from "~/types/ctx";

export default function Page() {
  const { session } = useOutletContext<SessionRouteContext>();

  return <SanitizedHtml html={session.description || ""} />;
}
