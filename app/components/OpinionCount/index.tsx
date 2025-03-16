import { JSX } from "react";
import { RiMessage2Line } from "react-icons/ri";

type Props = {
  count: number;
};

export const OpinionCount = ({ count }: Props): JSX.Element => {
  return (
    <div className="flex items-center space-x-1">
      <RiMessage2Line className="text-blue-500" />
      <p className="text-xs font-bold text-blue-500">
        コメント{count < 99 ? count : "99+"}件
      </p>
    </div>
  );
};
