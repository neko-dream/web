import type { SVGProps } from "react";
const SvgInfoCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={24}
    fill="none"
    viewBox="0 0 25 24"
    {...props}
  >
    <path
      fill="#007AFF"
      d="M12.5 1.5C6.702 1.5 2 6.202 2 12s4.702 10.5 10.5 10.5S23 17.798 23 12 18.298 1.5 12.5 1.5m0 19.219A8.72 8.72 0 0 1 3.781 12 8.72 8.72 0 0 1 12.5 3.281 8.72 8.72 0 0 1 21.219 12a8.72 8.72 0 0 1-8.719 8.719"
    />
    <path
      fill="#007AFF"
      d="M11.375 7.875a1.125 1.125 0 1 0 2.25 0 1.125 1.125 0 0 0-2.25 0m1.688 2.625h-1.126a.19.19 0 0 0-.187.188v6.374c0 .104.084.188.188.188h1.124a.19.19 0 0 0 .188-.187v-6.375a.19.19 0 0 0-.187-.188"
    />
  </svg>
);
export default SvgInfoCircle;
