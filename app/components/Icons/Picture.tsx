import type { SVGProps } from "react";
const SvgPicture = (props: SVGProps<SVGSVGElement>) => (
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
      d="M21.75 3.75H2.25a.75.75 0 0 0-.75.75v15c0 .415.335.75.75.75h19.5a.75.75 0 0 0 .75-.75v-15a.75.75 0 0 0-.75-.75m-.937 14.813H3.188v-.936l3.246-3.85 3.518 4.171 5.472-6.487 5.389 6.389zm0-3.043L15.567 9.3a.186.186 0 0 0-.286 0l-5.33 6.319-3.374-4.001a.186.186 0 0 0-.286 0l-3.104 3.68v-9.86h17.626zM7.124 10.688a2.062 2.062 0 1 0 0-4.124 2.062 2.062 0 0 0 0 4.124m0-2.72a.655.655 0 1 1 0 1.313.655.655 0 1 1 0-1.312"
    />
  </svg>
);
export default SvgPicture;
