import { useOutletContext } from "react-router";
import { SessionRouteContext } from "../$session_id/types";
import xss from "xss";

export default function Page() {
  const { session } = useOutletContext<SessionRouteContext>();
  const sanitizedHtml = xss(session.description || "");

  return <article dangerouslySetInnerHTML={{ __html: sanitizedHtml || "" }} />;
}
