import type { SVGProps } from "react";
const SvgCalendar = (props: SVGProps<SVGSVGElement>) => (
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
      d="M20.625 4.313h-3.937v-1.5a.19.19 0 0 0-.188-.188h-1.312a.19.19 0 0 0-.188.188v1.5H9v-1.5a.19.19 0 0 0-.187-.188H7.5a.19.19 0 0 0-.187.188v1.5H3.375a.75.75 0 0 0-.75.75v15.562c0 .415.335.75.75.75h17.25a.75.75 0 0 0 .75-.75V5.063a.75.75 0 0 0-.75-.75m-.937 15.375H4.313V10.78h15.375zM4.313 9.188V6h3v1.125c0 .103.084.188.187.188h1.313A.19.19 0 0 0 9 7.125V6h6v1.125c0 .103.084.188.188.188H16.5a.19.19 0 0 0 .188-.188V6h3v3.188z"
    />
  </svg>
);
export default SvgCalendar;
