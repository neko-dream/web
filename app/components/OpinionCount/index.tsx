import { JSX } from "react";
import { Message } from "../Icons";

type Props = {
  count: number;
};

export const OpinionCount = ({ count }: Props): JSX.Element => {
  return (
    <div className="flex items-center space-x-1">
      <Message className="text-blue-500" />
      <p className="text-xs font-bold text-blue-500">
        {count < 99 ? count : "99+"} 件
      </p>
    </div>
  );
};
