import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { use } from "react";
import { Doughnut } from "react-chartjs-2";
import { CenterDialog, type ModalProps } from "~/components/ui/modal";
import { api } from "~/libs/api";
import { cache } from "~/utils/cache";

// Chart.js のコンポーネントを登録
ChartJS.register(ArcElement, Tooltip, Legend);

type Props = Omit<ModalProps, "children"> & {
  opinionID: string;
};

export const AnalyticsModal = (props: Props) => {
  if (!props.opinionID) {
    return <div>...loading now</div>;
  }

  const data = use(
    cache(props.opinionID, async () => {
      return api
        .GET("/opinions/{opinionID}/analysis", {
          credentials: "include",
          params: {
            path: {
              opinionID: props.opinionID,
            },
          },
        })
        .then(({ data }) => data || []);
    })
  );

  // 各グループの割合と人数を計算
  const chartData = data.map((item) => {
    const total = item.agreeCount + item.disagreeCount + item.passCount;

    return {
      groupName: item.groupName,
      total,
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
    };
  });

  return (
    <CenterDialog {...props}>
      <div className="min-w-[300px] space-y-4">
        {chartData.map(({ counts, data, groupName, total }, index) => {
          // 全てが0人の時はグラフを表示しない
          if (total === 0) {
            return null;
          }

          return (
            <div key={index} className="flex items-center space-x-4">
              <div className="relative ml-8 shrink-0">
                <Doughnut
                  data={{
                    datasets: [
                      {
                        data,
                        backgroundColor: ["#32ade6", "#ff2d55", "#5856d6"], // 各セグメントの色
                        borderWidth: 0,
                      },
                    ],
                  }}
                  options={{
                    cutout: "60%",
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        enabled: false,
                      },
                    },
                  }}
                  width={150}
                  height={150}
                />
                {/* 中央のテキスト */}
                <div className="absolute inset-1/3 text-center font-bold text-gray-500 text-lg">
                  {groupName}
                </div>
              </div>

              {/* 全ての投票タイプの割合表示 */}
              <div className="text-gray-600 text-sm">
                <div className="space-y-1">
                  <PercentLabel
                    label="良さそう"
                    percentage={counts.agree.percentage}
                    count={counts.agree.count}
                  />
                  <PercentLabel
                    label="パス"
                    percentage={counts.pass.percentage}
                    count={counts.pass.count}
                  />
                  <PercentLabel
                    label="違うかも"
                    percentage={counts.disagree.percentage}
                    count={counts.disagree.count}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </CenterDialog>
  );
};

type PercentLabelProps = {
  label: string;
  percentage: number;
  count: number;
};

const PercentLabel = ({ percentage, count, label }: PercentLabelProps) => {
  return (
    <p className="flex w-36">
      <span className="mr-auto">{label}</span>
      <span className="ml-1 w-[42px] text-end font-extrabold">
        {Math.ceil(percentage)}%
      </span>
      <span className="ml-2 font-roboto">{count}人</span>
    </p>
  );
};
