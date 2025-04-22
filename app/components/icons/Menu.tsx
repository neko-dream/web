import type { SVGProps } from "react";
const SvgMenu = (props: SVGProps<SVGSVGElement>) => (
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
      d="M21.188 3.75H2.813a.19.19 0 0 0-.188.188v1.5c0 .103.084.187.188.187h18.375a.19.19 0 0 0 .187-.187v-1.5a.19.19 0 0 0-.187-.188m0 14.625H2.813a.19.19 0 0 0-.188.188v1.5c0 .103.084.187.188.187h18.375a.19.19 0 0 0 .187-.187v-1.5a.19.19 0 0 0-.187-.188m0-7.312H2.813a.19.19 0 0 0-.188.187v1.5c0 .103.084.188.188.188h18.375a.19.19 0 0 0 .187-.188v-1.5a.19.19 0 0 0-.187-.187"
    />
  </svg>
);
export default SvgMenu;
