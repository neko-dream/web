import type { SVGProps } from "react";
const SvgLineChart = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="#000"
      stroke="#8E8E93"
      d="M4.188 18.563v.5H20.5v.687h-17V4.25h.688zm6.84-7.194-.353-.355-.354.353L7.3 14.37l-.485-.487 3.864-3.84 2.765 2.782.354.356.354-.355 5.17-5.167.486.486-6.012 6.01z"
    />
  </svg>
);
export default SvgLineChart;
