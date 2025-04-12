import { useState } from "react";
import { useNavigate } from "react-router";
import type { Route } from "~/react-router/_pages.$session_id.reports/+types";
import { ReportCard } from "./components/ReportCard";
import { Tabs } from "./components/Tabs";

export { loader } from "./modules/loader";

type TabsType = "unsolved" | "hold" | "deleted";

export default function Page({
  loaderData: { reports, defaultTab },
}: Route.ComponentProps) {
  const [activeTab, setActiveTab] = useState<TabsType>(defaultTab);
  const navigate = useNavigate();

  return (
    <div>
      <Tabs
        tabs={[
          { label: "未対応", value: "unsolved" },
          { label: "保留中", value: "hold" },
          { label: "削除済み", value: "deleted" },
        ]}
        activeTab={activeTab}
        onChange={(value) => {
          setActiveTab(value as TabsType);
          navigate(`?q=${value}`, {
            replace: true,
          });
        }}
      />
      <div className="mx-auto mt-2 flex max-w-2xl flex-col space-y-2">
        {reports?.map((report, i) => {
          return <ReportCard {...report} key={i} />;
        })}
      </div>
    </div>
  );
}
