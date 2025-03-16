import type { SVGProps } from "react";
const SvgLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="#fff"
      d="M16.969 5.116V3.304a.187.187 0 0 0-.303-.148L6.101 11.41a.747.747 0 0 0 0 1.179l10.565 8.252c.125.096.303.01.303-.148v-1.811a.38.38 0 0 0-.143-.296L8.388 12l8.438-6.588c.089-.07.143-.18.143-.295"
    />
  </svg>
);
export default SvgLeft;
