import { useOutletContext } from "react-router";
import { SessionRouteContext } from "../_pages.$session_id/types";
import { SanitizedHtml } from "~/features/xss-html";

export default function Page() {
  const { session } = useOutletContext<SessionRouteContext>();

  return <SanitizedHtml html={session.description || ""} />;
}
