import type { SVGProps } from "react";
const SvgPencil = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="#8E8E93"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m15.232 5.232 3.536 3.536zm1.5-1.5a2.5 2.5 0 1 1 3.536 3.536L6.5 21.036H3v-3.572z"
    />
  </svg>
);
export default SvgPencil;
