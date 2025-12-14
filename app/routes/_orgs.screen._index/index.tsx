import { useEffect, useState } from "react";
import { Card as OpinionCard } from "~/components/features/opinion-card";
import OpinionGraph from "~/components/features/opinion-graph";
import { Avatar } from "~/components/ui/avatar";
import { GroupTabs } from "~/components/ui/group-tabs";

export default function Page() {
  const [activeTab, setActiveTab] = useState("all");
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mock Data for Graph
  const mockPositions = [
    // Group A (blue-ish in design, 0 here)
    ...Array.from({ length: 20 }).map((_, i) => ({
      posX: 10 + Math.random() * 50,
      posY: 10 + Math.random() * 100,
      groupID: "2", // C in code (A=0, B=1, C=2) -> adjusting to match visual later if needed
      displayID: `a-${i}`,
      iconURL: null,
    })),
    // Group B
    ...Array.from({ length: 15 }).map((_, i) => ({
      posX: 60 + Math.random() * 40,
      posY: 60 + Math.random() * 50,
      groupID: "1",
      displayID: `b-${i}`,
      iconURL: null,
    })),
    // Group C
    ...Array.from({ length: 10 }).map((_, i) => ({
      posX: 90 + Math.random() * 30,
      posY: 10 + Math.random() * 40,
      groupID: "0",
      displayID: `c-${i}`,
      iconURL: null,
    })),
  ];

  // Mock Data for Timeline
  const mockOpinions = [
    {
      id: "1",
      user: {
        displayID: "sakura",
        displayName: "Sakura",
        iconURL: "/default_icon.png",
      },
      date: "2025-12-31T00:00:00",
      description: "抽選会とか？",
      opinionCount: 3,
      group: "A",
    },
    {
      id: "2",
      user: {
        displayID: "micchy",
        displayName: "ミッチー",
        iconURL: "/default_icon.png",
      },
      date: "2025-12-31T00:00:00",
      description:
        "やきとりとビールに、ビール一缶お裾分け券をセットにして、住民同士の交流を図るというのはどうでしょうか😃",
      opinionCount: 3,
      group: "B",
    },
    {
      id: "3",
      user: {
        displayID: "sabako",
        displayName: "さばこ",
        iconURL: "/default_icon.png",
      },
      date: "2025-12-31T00:00:00",
      description: "騒音が気になる。。。",
      opinionCount: 3,
      group: "C",
    },
    {
      id: "4",
      user: {
        displayID: "neko",
        displayName: "neko-neko",
        iconURL: "/default_icon.png",
      },
      date: "2025-12-31T00:00:00",
      description: "子どもたちが楽しめるスペースも欲しいですね！",
      opinionCount: 1,
      group: "A",
    },
  ];

  const filteredOpinions =
    activeTab === "all"
      ? mockOpinions
      : mockOpinions.filter((op) => op.group === activeTab);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Left Column: Visuals */}
      <div className="flex w-[60%] flex-col p-8">
        <h1 className="mb-4 font-bold text-3xl text-blue-500">
          地域のお祭りを盛り上げたい！
        </h1>

        <div className="relative flex-1 rounded-3xl border-2 border-gray-100">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Graph Component */}
            <OpinionGraph
              positions={mockPositions}
              polygons={[]} // Library calculates polygons from positions
              myPosition={null}
              windowWidth={windowWidth * 0.6} // 60% width
              selectGroupId={() => {}}
              background={0xffffff}
            />
          </div>
        </div>

        <div className="mt-8 flex space-x-12 px-4">
          <StatItem label="Aグループ" count={100} />
          <StatItem label="Bグループ" count={90} />
          <StatItem label="Cグループ" count={50} />
        </div>
      </div>

      {/* Right Column: Timeline & Info */}
      <div className="flex w-[40%] flex-col border-gray-100 border-l bg-gray-50 p-6">
        <div className="mb-6 rounded-xl bg-blue-50 p-6">
          <div className="mb-2 flex items-center space-x-2">
            <Avatar className="h-6 w-6" src="/default_icon_half.png" />
            <span className="font-bold text-gray-600 text-sm">
              ことひろAIレポート
            </span>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            公園でのライブイベントの開催に関するセッションは、Aグループ、Bグループ、そしてCグループの3つの立場に分かれています。
            <br />
            ・Aグループ
            <br />
            公園が地域住民にとってアクセスしやすい場所であり、音楽を無料で楽しめる機会を提供することの重要性を強調。
            特に、音楽が地域のコミュニティ活動を活性化させ、住民同士のつながりを深める場となると主張。公園という開かれた空間が、音楽を通じて多様な人々を引き寄せ、地域の文化的魅力を高める。
          </p>
        </div>

        <div className="mb-4">
          <GroupTabs
            activeTab={activeTab}
            onChange={setActiveTab}
            tabs={[
              { label: "すべて", value: "all" },
              { label: "Aグループ", value: "A" },
              { label: "Bグループ", value: "B" },
              { label: "Cグループ", value: "C" },
            ]}
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="flex flex-col space-y-4">
            {filteredOpinions.map((opinion) => (
              <OpinionCard
                key={opinion.id}
                user={opinion.user}
                date={opinion.date}
                description={opinion.description}
                opinionCount={opinion.opinionCount}
                className="bg-white shadow-sm"
                isJudgeButton={false} // Screenshot doesn't show judge buttons in list
                isMoreButton={true}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const StatItem = ({ label, count }: { label: string; count: number }) => (
  <div className="flex items-baseline space-x-4">
    <span className="font-bold text-gray-600 text-lg">{label}</span>
    <span className="font-bold text-3xl">
      {count}
      <span className="ml-1 text-base text-gray-500">人</span>
    </span>
  </div>
);
