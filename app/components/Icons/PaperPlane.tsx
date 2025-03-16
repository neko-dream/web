import type { SVGProps } from "react";
const SvgPaperPlane = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={21}
    height={21}
    fill="none"
    viewBox="0 0 21 21"
    {...props}
  >
    <g clipPath="url(#clip0_1235_23121)">
      <path
        fill="#000"
        stroke="#fff"
        strokeWidth={1.75}
        d="M18.124 1.512a1 1 0 0 1 .48-.135l-.416.24-16.25 9.375-.423.244a1 1 0 0 1 .36-.353l16.249-9.37ZM1.993 12.671a1 1 0 0 1-.4-.298l.448.186L6.25 14.3l.501.207.409-.356 6.755-5.886-4.338 6.259-.619.893 1.004.414 6.008 2.48.448.185a1 1 0 0 1-.5-.07l-4.366-1.802-.63-.26-.407.548-1.71 2.308a1 1 0 0 1-.396.32l.294-.396 1.43-1.933.666-.902-1.036-.427-1.43-.59-1.209-.499v4.321a1 1 0 0 1-.125-.49v-3.882l-.54-.223-4.465-1.848zm15.303 4.983a1 1 0 0 1-.2.46l.074-.477 2.32-15.13.074-.481c.058.152.08.324.052.506l-2.32 15.12z"
      />
    </g>
    <defs>
      <clipPath id="clip0_1235_23121">
        <path fill="#fff" d="M.5.5h20v20H.5z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgPaperPlane;
