import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useEffect, useMemo, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Button } from "~/components/ui/button";
import { CenterDialog, type ModalProps } from "~/components/ui/modal";
import { api } from "~/libs/api";
import type { VoteType } from "~/types";

// Chart.js のコンポーネントを登録
ChartJS.register(ArcElement, Tooltip, Legend);

type DataItem = {
  agreeCount: number;
  disagreeCount: number;
  passCount: number;
  groupID: number;
  groupName: string;
};

type Props = Omit<ModalProps, "children"> & {
  opinionID: string;
};

const voteJPmap = {
  agree: "良さそう",
  disagree: "違うかも",
  pass: "保留",
};

export const AnalyticsModal = (props: Props) => {
  const [data, setData] = useState<DataItem[]>([]);
  const [selectVoteType, setSelectVoteType] = useState<VoteType>("agree");

  useEffect(() => {
    if (!props.opinionID) {
      return;
    }
    api
      .GET("/opinions/{opinionID}/analysis", {
        credentials: "include",
        params: {
          path: {
            opinionID: props.opinionID,
          },
        },
      })
      .then(({ data }) => {
        setData(data || []);
      });
  }, [props.opinionID]);

  // 各グループの割合と人数を計算
  const chartData = useMemo(() => {
    return data
      .map((item) => {
        const total = item.agreeCount + item.disagreeCount + item.passCount;

        // フラグを設定
        const isSingleCount =
          (item.agreeCount > 0 &&
            item.disagreeCount === 0 &&
            item.passCount === 0) ||
          (item.agreeCount === 0 &&
            item.disagreeCount > 0 &&
            item.passCount === 0) ||
          (item.agreeCount === 0 &&
            item.disagreeCount === 0 &&
            item.passCount > 0);

        const isAllZero = total === 0;

        return {
          groupName: item.groupName,
          item,
          data: [
            (item.agreeCount / total) * 100,
            (item.disagreeCount / total) * 100,
            (item.passCount / total) * 100,
          ],
          counts: {
            agree: {
              count: item.agreeCount,
              percentage: (item.agreeCount / total) * 100,
            },
            disagree: {
              count: item.disagreeCount,
              percentage: (item.disagreeCount / total) * 100,
            },
            pass: {
              count: item.passCount,
              percentage: (item.passCount / total) * 100,
            },
          },
          flags: {
            isSingleCount,
            isAllZero,
          },
        };
      })
      .filter(Boolean);
  }, [data]);

  return (
    <CenterDialog {...props}>
      <div className="min-w-[300px] space-y-4">
        {chartData.map(({ counts, data, flags, groupName }, index) => {
          const count = counts[selectVoteType]?.count;
          const percentage = counts[selectVoteType]?.percentage;

          return (
            <div key={index} className="flex items-center">
              <div className="relative h-22 w-22">
                <Doughnut
                  data={{
                    datasets: [
                      {
                        data,
                        backgroundColor: ["#4c6ef5", "#f783ac", "#74c0fc"], // 各セグメントの色
                        spacing: flags.isAllZero || flags.isSingleCount ? 0 : 2,
                        borderWidth: 0,
                      },
                    ],
                  }}
                  options={{
                    cutout: "60%",
                  }}
                />
                {/* 中央のテキスト */}
                <div className="absolute inset-0 flex translate-y-1 items-center justify-center font-bold text-gray-500 text-lg">
                  {groupName}
                </div>
              </div>
              {/* 人数と割合の表示 */}
              <p className="text-start text-gray-600 text-sm">
                {groupName}グループ（{count}人）では
                <br />
                {percentage}%が{voteJPmap[selectVoteType]}
                としました。
              </p>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex justify-center space-x-8">
        <OpinionButton
          color="disagree"
          onClick={() => setSelectVoteType("disagree")}
        >
          違うかも
        </OpinionButton>
        <OpinionButton color="pass" onClick={() => setSelectVoteType("pass")}>
          保留
        </OpinionButton>
        <OpinionButton color="agree" onClick={() => setSelectVoteType("agree")}>
          良さそう
        </OpinionButton>
      </div>
    </CenterDialog>
  );
};

const OpinionButton = (props: Button) => {
  return (
    <Button {...props} className="z-10 h-7 w-16 cursor-pointer px-0 text-xs" />
  );
};
