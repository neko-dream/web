import type { SVGProps } from "react";
const SvgArrowDown = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={24}
    fill="none"
    viewBox="0 0 25 24"
    {...props}
  >
    <path
      fill="#5856D6"
      d="M20.704 10.906h-1.899a.38.38 0 0 0-.284.128l-5.13 5.914V3.75a.19.19 0 0 0-.187-.187h-1.407a.19.19 0 0 0-.187.187v13.198l-5.13-5.914a.37.37 0 0 0-.284-.129H4.297c-.16 0-.246.19-.14.31l7.778 8.965a.75.75 0 0 0 1.133 0l7.776-8.965a.187.187 0 0 0-.14-.31"
    />
  </svg>
);
export default SvgArrowDown;
