import type { SVGProps } from "react";
const SvgPen = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={19}
    height={19}
    fill="none"
    viewBox="0 0 19 19"
    {...props}
  >
    <path
      fill="#8E8E93"
      d="M1 19q.12.015.24 0l4-1a1 1 0 0 0 .47-.26L18 5.41a2 2 0 0 0 0-2.82L16.42 1a2 2 0 0 0-2.83 0L1.3 13.29a1.06 1.06 0 0 0-.27.47l-1 4A1 1 0 0 0 .76 19q.12.015.24 0M15 2.41 16.59 4 15 5.59 13.42 4zM2.91 14.51 12 5.41 13.59 7l-9.1 9.1-2.11.52z"
    />
  </svg>
);
export default SvgPen;
