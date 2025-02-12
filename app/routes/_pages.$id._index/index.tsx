import { Link, useLoaderData, useOutletContext } from "react-router";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Card from "~/components/Card";
import Heading from "~/components/Heading";
import { components } from "~/libs/api/openapi";
// import Graph from "./components/Graph";
import { loader } from "./modules/loader";
import { SessionRouteContext } from "../_pages.$id/types";
import { JST } from "~/libs/date";

export { loader };

type Card = {
  opinion: components["schemas"]["opinion"];
  user: components["schemas"]["user"];
  agreeCount?: number;
  disagreeCount?: number;
  passCount?: number;
};

export default function Page() {
  const {
    data,
    opinions: allOpinions,
    report,
    timeline,
    conclusion,
  } = useLoaderData<typeof loader>();
  const { session } = useOutletContext<SessionRouteContext>();

  const [groupID, setGroupID] = useState<number>(1000);
  const [opinions, setOpinions] = useState<Card[]>([]);

  const isFinished = JST(session.scheduledEndTime).isBefore();

  useEffect(() => {
    if (groupID === 1000) {
      setOpinions(allOpinions?.opinions || []);
      return;
    }
    const opinions = data?.groupOpinions.filter((opinion) => {
      return opinion.groupId === groupID;
    });
    setOpinions(opinions?.[0]?.opinions || []);
  }, [data?.groupOpinions, groupID, allOpinions?.opinions]);

  // グループ３が一番意見多そうなので、グループ３の意見を取得
  // ついでにインデックス順にする
  const positions = data?.positions
    .filter((opinion) => {
      return (
        opinion.groupId === 3 &&
        (opinion.perimeterIndex || opinion.perimeterIndex === 0)
      );
    })
    .sort((a, b) => (a.perimeterIndex || 0) - (b.perimeterIndex || 0));
  console.log(positions);

  const sortedTimeline = timeline?.items.sort(
    (a, b) => a.Sequence - b.Sequence,
  );

  return (
    <>
      {/* <Graph
        polygons={positions}
        positions={data?.positions}
        myPosition={data?.myPosition}
        selectGroupId={(id: number) => {
          setGroupID(id);
        }}
      /> */}
      <Heading>レポート & 結論</Heading>

      <details className="prose-sm px-2">
        <summary className="pt-4">レポートを見る</summary>
        <ReactMarkdown className="pt-4">{report?.report}</ReactMarkdown>
      </details>

      {isFinished && (
        <details className="px-2">
          <summary className="pt-4">結論</summary>
          <p className="text-xl">タイトル: {conclusion?.content}</p>
          <div className="mt-4">
            {sortedTimeline?.map((item, i) => {
              return (
                <div key={i} className="relative flex pb-6">
                  <p className="w-14 shrink-0">{item.Status}</p>
                  <p>{item.Content}</p>
                  {sortedTimeline.length - 1 !== i && (
                    <div className="absolute bottom-1 left-5 h-4 w-0.5 bg-slate-500" />
                  )}
                </div>
              );
            })}
          </div>
        </details>
      )}

      <Heading className="mt-4">みんなの意見</Heading>
      <div className="flex items-center">
        <div className="pl-3"></div>
        <p className="pt-0.5 text-xs">グループ：</p>
        <select
          className="mb-2 mt-2 h-6 w-32 rounded-full border border-gray-300 px-2 py-0.5 text-xs"
          onChange={(e) => {
            setGroupID(Number(e.currentTarget.value));
          }}
          value={groupID}
        >
          <option value={1000}>すべて</option>
          {data?.groupOpinions.map((opinion, i) => {
            return (
              <option key={i} value={opinion.groupId}>
                {opinion.groupName}
              </option>
            );
          })}
        </select>
      </div>
      <div className="mx-4 mb-16 space-y-4">
        {opinions.map((opinion, i) => {
          const total = [
            opinion.agreeCount || 0,
            opinion.disagreeCount || 0,
            opinion.passCount || 0,
          ].reduce((acc, cur) => acc + cur, 0);
          const sortedOpinion = [
            {
              key: "agree",
              count: opinion.agreeCount || 0,
            },
            {
              key: "disagree",
              count: opinion.disagreeCount || 0,
            },
            {
              key: "pass",
              count: opinion.passCount || 0,
            },
          ].sort((a, b) => {
            return a.count - b.count;
          });

          const lastItem = sortedOpinion[sortedOpinion.length - 1];
          const parcent =
            lastItem && Math.trunc((lastItem?.count / total) * 100);

          return (
            <Link
              key={i}
              to={`/${session.id}/${opinion.opinion.id}`}
              className="block"
            >
              <Card
                percentage={{
                  key: lastItem?.key,
                  value: parcent || 0,
                }}
                title={opinion.opinion.title || ""}
                description={opinion.opinion.content || ""}
                user={{
                  displayID: "",
                  displayName: opinion.user.displayName || "",
                  iconURL: opinion.user.iconURL || "",
                }}
                img={opinion.opinion.pictureURL}
                opinionStatus={opinion.opinion.voteType!}
                isOpnionLink={`/${session.id}/${opinion.opinion.id}`}
                referenceURL={opinion.opinion.referenceURL}
              />
            </Link>
          );
        })}
      </div>
    </>
  );
}
