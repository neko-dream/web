import type { SVGProps } from "react";
const SvgClockCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={16}
    fill="none"
    viewBox="0 0 17 16"
    {...props}
  >
    <g fill="#8E8E93">
      <path d="M8.5 1a7 7 0 1 0 .001 14.001A7 7 0 0 0 8.5 1m0 12.813a5.813 5.813 0 0 1 0-11.625 5.813 5.813 0 0 1 0 11.625" />
      <path d="m11.23 9.978-2.228-1.61V4.5a.125.125 0 0 0-.125-.125h-.752A.125.125 0 0 0 8 4.5v4.303c0 .04.019.078.052.102l2.584 1.884c.056.04.134.028.175-.027l.447-.609a.125.125 0 0 0-.028-.175" />
    </g>
  </svg>
);
export default SvgClockCircle;
