import type { SVGProps } from "react";
const SvgArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={8}
    fill="none"
    viewBox="0 0 12 8"
    {...props}
  >
    <path
      fill="#8E8E93"
      d="M10.293.293 6 4.586 1.707.293.293 1.707 6 7.414l5.707-5.707z"
    />
  </svg>
);
export default SvgArrow;
