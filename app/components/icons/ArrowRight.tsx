import type { SVGProps } from "react";
const SvgArrowRight = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={24}
    fill="none"
    viewBox="0 0 25 24"
    {...props}
  >
    <path
      fill="#32ADE6"
      d="m21.115 11.433-8.854-7.685a.38.38 0 0 0-.246-.092H9.94a.187.187 0 0 0-.122.328l8.208 7.125H4.311a.19.19 0 0 0-.188.188v1.406c0 .103.084.188.188.188h13.713l-8.208 7.125a.187.187 0 0 0 .122.328h2.144a.18.18 0 0 0 .122-.047l8.911-7.73a.75.75 0 0 0 0-1.134"
    />
  </svg>
);
export default SvgArrowRight;
