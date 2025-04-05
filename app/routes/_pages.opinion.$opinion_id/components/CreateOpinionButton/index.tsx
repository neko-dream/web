import type { ComponentProps } from "react";
import { Button } from "~/components/ui/button";

type Props = {
  onClick: ComponentProps<typeof Button>["onClick"];
};

export const CreateOpinionButton = ({ onClick }: Props) => {
  return (
    <Button
      onClick={onClick}
      className="flex rounded-xl bg-blue-500 p-3 text-white shadow-lg"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="pencil">
          <path
            id="Vector"
            d="M15.2322 5.23223L18.7677 8.76777L15.2322 5.23223ZM16.7322 3.73223C17.7085 2.75592 19.2914 2.75592 20.2677 3.73223C21.244 4.70854 21.244 6.29146 20.2677 7.26777L6.5 21.0355H3V17.4644L16.7322 3.73223Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
      <span className="ml-2">コメントを書いてみる</span>
    </Button>
  );
};
