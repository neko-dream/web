import { RichTextEditor } from "~/components/features/rich-text-editor";
import { Heading } from "~/components/ui/heading";
import type { Route } from "../_pages.make.$session_id.loadmap/+types";

export { loader } from "./modules/loader";
export { meta } from "./modules/meta";

export default function Page({
  loaderData: { session },
}: Route.ComponentProps) {
  const handleImageUploader = async (file: File) => {
    await file;
    return "";
  };

  return (
    <div className="flex-1 bg-cs-gray-200">
      <Heading title="活動報告" to={`/${session.id}`} isLink={true} />

      <form className="mx-auto w-full max-w-xl p-4">
        <RichTextEditor
          onImageLoad={handleImageUploader}
          onUpdate={console.log}
        />
      </form>

      <StatusSelect />
    </div>
  );
}

import { useState } from "react";
import { Arrow, Check } from "~/components/icons";

type StatusOption = {
  value: string;
  label: string;
  color: "blue" | "gray" | "red" | "green" | "yellow";
};

const statusOptions: StatusOption[] = [
  { value: "waiting", label: "待機中", color: "gray" },
  { value: "in-progress", label: "取り組み中", color: "blue" },
  { value: "completed", label: "完了", color: "green" },
  { value: "goal", label: "ゴール", color: "yellow" },
];

const colorClasses = {
  blue: "bg-gradient-to-r from-blue-400 to-blue-600 text-white",
  gray: "bg-gray-200 text-gray-600",
  red: "bg-gradient-to-r from-red-400 to-red-600 text-white",
  green: "bg-gradient-to-r from-green-400 to-green-600 text-white",
  yellow: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white",
};

export const StatusSelect = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("in-progress");

  const selectedOption = statusOptions.find(
    (option) => option.value === selectedValue,
  );

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      {/* メインボタン */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex min-w-[140px] items-center justify-between gap-3 rounded-full px-6 py-3 font-medium transition-all duration-200 ${colorClasses[selectedOption?.color || "gray"]}hover:shadow-lg active:scale-95 `}
      >
        <span>{selectedOption?.label}</span>
        <Arrow
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ドロップダウンメニュー */}
      {isOpen && (
        <div className="absolute top-full right-0 left-0 z-10 mt-2 rounded-2xl border border-gray-200 bg-white py-2 shadow-xl">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`flex w-full items-center justify-between px-6 py-3 text-left transition-colors duration-150 hover:bg-gray-50 ${selectedValue === option.value ? "bg-blue-50" : ""}
              `}
            >
              <span
                className={`font-medium ${
                  selectedValue === option.value
                    ? "text-blue-600"
                    : "text-gray-700"
                }`}
              >
                {option.label}
              </span>
              {selectedValue === option.value && (
                <Check className="h-4 w-4 text-blue-600" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* オーバーレイ（ドロップダウンを閉じるため） */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
