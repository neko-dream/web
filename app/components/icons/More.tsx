import type { SVGProps } from "react";
const SvgMore = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="#333"
      d="M10.688 5.414a1.313 1.313 0 1 0 2.625 0 1.313 1.313 0 0 0-2.626 0m0 6.563a1.312 1.312 0 1 0 2.624 0 1.312 1.312 0 0 0-2.624 0m0 6.562a1.312 1.312 0 1 0 2.624 0 1.312 1.312 0 0 0-2.624 0"
    />
  </svg>
);
export default SvgMore;
