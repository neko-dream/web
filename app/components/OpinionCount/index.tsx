import { RiMessage2Line } from "react-icons/ri";

type Props = {
  count: number;
};

export default function OpinionCount({ count }: Props) {
  return (
    <div className="flex items-center space-x-1">
      <RiMessage2Line className="text-blue-500" />
      <p className="text-xs text-blue-500">{count < 99 ? count : "99+"}件</p>
    </div>
  );
}
