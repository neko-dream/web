import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router";
import Graph from "~/components/features/graph-opinion";
import { Left } from "~/components/icons";
// import Graph from "~/features/opinion-graph/components";
import type { Route } from "../_pages.report.$session_id/+types";

export { loader } from "./modules/loader";

export default function Page({
  loaderData: { report, session, position },
}: Route.ComponentProps) {
  const navigate = useNavigate();

  const [windowWidth, setWindowWidth] = useState(374);

  useEffect(() => {
    const _windowWidth = window.innerWidth;
    setWindowWidth(_windowWidth);
    const resize = () => {
      const _windowWidth = window.innerWidth;
      setWindowWidth(_windowWidth);
    };
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  // グループ３が一番意見多そうなので、グループ３の意見を取得
  // ついでにインデックス順にする
  const positions = position?.positions
    // .filter((opinion) => {
    //   return (
    //     opinion.groupId === 3 &&
    //     (opinion.perimeterIndex || opinion.perimeterIndex === 0)
    //   );
    // })
    .sort((a, b) => (a.perimeterIndex || 0) - (b.perimeterIndex || 0));

  return (
    <div className="flex-1 bg-[#F2F2F7]">
      <button
        type="button"
        className="flex w-full cursor-pointerp-2 bg-white p-2 font-bold text-[18px]"
        onClick={() => navigate(-1)}
      >
        <Left className="text-black" />
        <span className="-translate-x-[13.5px] mx-auto">{session?.theme}</span>
      </button>

      <div className="mt-2 flex justify-center">
        <Graph
          polygons={positions}
          positions={position?.positions}
          myPosition={position?.myPosition}
          windowWidth={windowWidth}
          selectGroupId={(_id: number) => {}}
        />
      </div>

      <div className="m-4 mx-auto w-full max-w-2xl rounded-md bg-white p-2">
        <div className="flex items-center space-x-2">
          <img src="/icon.png" alt="" className="m-1 h-7" />
          <p className="text-gray-500 text-xs">ことひろAIレポート</p>
        </div>
        <article className="prose mt-1 text-gray-800 text-sm">
          <ReactMarkdown>{report}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
