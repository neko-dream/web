import type { SVGProps } from "react";
const SvgHashtag = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="url(#paint0_linear_1227_29193)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 15h14M7 20l4-16zm6 0 4-16zM6 9h14z"
    />
    <defs>
      <linearGradient
        id="paint0_linear_1227_29193"
        x1={4}
        x2={20}
        y1={12}
        y2={12}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF3B30" />
        <stop offset={0.5} stopColor="#5856D6" />
        <stop offset={1} stopColor="#32ADE6" />
      </linearGradient>
    </defs>
  </svg>
);
export default SvgHashtag;
