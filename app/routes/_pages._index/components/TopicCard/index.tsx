import { ClockCircle, Environment } from "~/components/Icons";
import { Card } from "../Card";

export const TopicCard = () => {
  return (
    <a
      href="/#"
      className="primary-gradient-30 block h-[336px] w-[327px] cursor-pointer rounded-[24px] p-[2px] select-none"
    >
      <div className="flex h-[332px] w-[323px] flex-col items-start justify-start rounded-[22px] bg-[#F8F8FC] pt-4 pb-0">
        <p className="mx-4 font-bold">西山公園で野外ライブを開催したい！</p>
        <div className="mx-4 mt-4 box-border flex w-[-webkit-fill-available] justify-between border-b border-[#E5E5EA] pb-2">
          <p className="flex w-28 text-xs">
            <Environment />
            鯖江
          </p>
          <p className="flex w-28 text-xs">
            <ClockCircle />
            あと40日
          </p>
        </div>
        <p className="primary-gradient mx-4 mt-2 font-bold text-clip">
          みんなの意見
        </p>
        <div className="mt-2 w-full overflow-hidden rounded-sm">
          <Card
            description="つつじ祭りとやると楽しそう？"
            user={{
              displayID: "#",
              iconURL:
                "https://avatars.githubusercontent.com/u/135724197?v=4&size=64",
              displayName: "mizdra",
            }}
            date="2021/08/02"
            className="shadow-md"
          />
          <Card
            description="つつじ祭りとやると楽しそう？"
            user={{
              displayID: "#",
              iconURL:
                "https://avatars.githubusercontent.com/u/135724197?v=4&size=64",
              displayName: "mizdra",
            }}
            date="2021/08/02"
            className="mt-2 h-20.5 overflow-hidden rounded"
          />
        </div>
      </div>
    </a>
  );
};
