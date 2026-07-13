import { Landmark } from "lucide-react";

type Props = {
  name: string;
};

export const MunicipalityBadge = ({ name }: Props) => {
  return (
    <div className="inline-flex items-center justify-center gap-1 self-start rounded-full bg-[#FFF4E6] p-1">
      <Landmark className="size-[18px] text-[#E8590C]" />
      <p className="whitespace-nowrap text-[#E8590C] text-sm leading-[1.55]">
        {name}
      </p>
    </div>
  );
};
