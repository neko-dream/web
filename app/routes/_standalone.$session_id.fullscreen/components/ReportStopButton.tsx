import { useState } from "react";
import { useParams } from "react-router";
import { api } from "~/libs/openapi-fetch";

type Props = {
  defaultDisableAnalysis?: boolean | null;
};

export const ReportStopButton = ({ defaultDisableAnalysis }: Props) => {
  const { session_id } = useParams();
  const [disableAnalysis, setDisableAnalysis] = useState(
    defaultDisableAnalysis ?? false,
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (!session_id || isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await api.PUT(
        "/talksessions/{talkSessionID}/analysis/toggle",
        {
          credentials: "include",
          params: {
            path: {
              talkSessionID: session_id,
            },
          },
        },
      );

      if (error || !data) {
        return;
      }

      setDisableAnalysis(data.disableAnalysis);
    } finally {
      setIsLoading(false);
    }
  };

  const enabled = !disableAnalysis;

  return (
    <div className="flex cursor-pointer items-center gap-2">
      <span className="font-bold text-gray-700 text-sm">
        レポートの更新を停止
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={isLoading}
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 disabled:opacity-40 ${
          enabled ? "bg-blue-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};
