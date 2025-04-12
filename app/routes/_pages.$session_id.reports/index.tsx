import { useState } from "react";
import { useNavigate, useRevalidator } from "react-router";
import { toast } from "react-toastify";
import { api } from "~/libs/api";
import type { Route } from "~/react-router/_pages.$session_id.reports/+types";
import { ConfiromDialog } from "./components/ConfirmDialog";
import { ReportCard } from "./components/ReportCard";
import { Tabs } from "./components/Tabs";

export { loader } from "./modules/loader";

type TabsType = "unsolved" | "hold" | "deleted";

export default function Page({
  loaderData: { reports, defaultTab },
}: Route.ComponentProps) {
  const [activeTab, setActiveTab] = useState<TabsType>(defaultTab);
  const navigate = useNavigate();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const { revalidate } = useRevalidator();
  const [isDeleted, setIsDeleted] = useState(false);
  const [opinionID, setOpinionID] = useState("");

  const onSubmit = async (id: string, action: "hold" | "deleted") => {
    const res = await api.POST("/opinions/{opinionID}/reports/solve", {
      credentials: "include",
      params: {
        path: {
          opinionID: id,
        },
      },
      body: {
        action,
      },
    });
    if (res.response.status === 200) {
      toast.success("通報を処理しました");
      revalidate();
      setIsConfirmDialogOpen(false);
    } else {
      toast.error("通報の処理に失敗しました");
    }
  };

  const handleOpenHoldConfirmDialog = (id: string) => {
    setIsDeleted(false);
    setIsConfirmDialogOpen(true);
    setOpinionID(id);
  };
  const handleOpenDeleteConfirmDialog = (id: string) => {
    setIsDeleted(true);
    setIsConfirmDialogOpen(true);
    setOpinionID(id);
  };

  const handleSubmitDelete = () => {
    onSubmit(opinionID, "deleted");
  };
  const handleSubmitHold = () => {
    onSubmit(opinionID, "hold");
  };
  const handleCancel = () => {
    setIsConfirmDialogOpen(false);
  };

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
          return (
            <ReportCard
              {...report}
              key={i}
              onSubmitDelete={handleOpenDeleteConfirmDialog}
              onSubmitHold={handleOpenHoldConfirmDialog}
            />
          );
        })}
      </div>

      <ConfiromDialog
        isDeleted={isDeleted}
        isOpen={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onSubmitDelete={handleSubmitDelete}
        onSubmitHold={handleSubmitHold}
        onCancel={handleCancel}
      />
    </div>
  );
}
