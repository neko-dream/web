import { useLoaderData, useOutletContext } from "react-router";
import { SessionRouteContext } from "../_pages.$id/types";
import CreateConcluesion from "./components/CreateConcluesionForm";
import AddTimelineForm from "./components/AddTimelineForm";
import { loader } from "./modules/loader";
import EditTimelineForm from "./components/EditTimelineForm";

export { loader };

export default function Page() {
  const { timeline, conclusion } = useLoaderData<typeof loader>();
  const { session } = useOutletContext<SessionRouteContext>();
  const sortedTimeline = timeline.sort((a, b) => a.Sequence - b.Sequence);

  return (
    <div className="p-4">
      <CreateConcluesion
        talkSessionID={session.id}
        defaultValue={conclusion?.content}
      />
      <AddTimelineForm talkSessionID={session.id} />
      {sortedTimeline.map((item, i) => {
        return (
          <EditTimelineForm key={i} talkSessionID={session.id} {...item} />
        );
      })}
    </div>
  );
}
