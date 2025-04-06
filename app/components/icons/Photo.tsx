import type { SVGProps } from "react";
const SvgPhoto = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="#8E8E93"
      d="M5 21a2 2 0 0 1-1.425-.575A2 2 0 0 1 3 19V5q0-.825.575-1.4Q4.175 3 5 3h14q.825 0 1.4.6.6.575.6 1.4v14q0 .825-.6 1.425Q19.825 21 19 21zm0-2h14V5H5zm1-2h12l-3.75-5-3 4L9 13zm-1 2V5z"
    />
  </svg>
);
export default SvgPhoto;
