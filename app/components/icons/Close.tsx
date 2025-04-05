import type { SVGProps } from "react";
const SvgClose = (props: SVGProps<SVGSVGElement>) => (
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
      d="m13.214 12 6.152-7.334a.186.186 0 0 0-.143-.307h-1.87c-.11 0-.216.05-.289.134l-5.074 6.05-5.074-6.05a.38.38 0 0 0-.288-.134h-1.87a.186.186 0 0 0-.143.307L10.767 12l-6.152 7.334a.187.187 0 0 0 .143.307h1.87c.11 0 .215-.05.288-.134l5.074-6.05 5.074 6.05c.07.084.176.134.289.134h1.87c.16 0 .246-.185.143-.307z"
    />
  </svg>
);
export default SvgClose;
