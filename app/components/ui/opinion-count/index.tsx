import type { JSX } from "react";
import { Message } from "~/components/icons";

type Props = {
  count: number;
};

export const OpinionCount = ({ count }: Props): JSX.Element => {
  return (
    <div className="flex items-center space-x-1">
      <Message className="text-blue-500" />
      <p className="font-bold text-blue-500 text-xs">
        {count < 99 ? count : "99+"} 件
      </p>
    </div>
  );
};
