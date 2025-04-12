import type { SVGProps } from "react";
const SvgDefaultAvatar = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={72}
    height={72}
    fill="none"
    viewBox="0 0 72 72"
    {...props}
  >
    <rect width={72} height={72} fill="#EADDFF" rx={36} />
    <path
      fill="#4F378A"
      fillRule="evenodd"
      d="M46.799 28.8c0 5.965-4.836 10.8-10.8 10.8s-10.8-4.835-10.8-10.8S30.034 18 35.999 18c5.964 0 10.8 4.835 10.8 10.8m-3.6 0a7.2 7.2 0 1 1-14.4 0 7.2 7.2 0 0 1 14.4 0"
      clipRule="evenodd"
    />
    <path
      fill="#4F378A"
      d="M35.999 45c-11.654 0-21.584 6.891-25.366 16.546q1.383 1.373 2.907 2.592C16.357 55.274 25.193 48.6 36 48.6s19.641 6.674 22.458 15.538a36 36 0 0 0 2.907-2.592C57.582 51.89 47.652 45 36 45"
    />
  </svg>
);
export default SvgDefaultAvatar;
