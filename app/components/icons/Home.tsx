import type { SVGProps } from "react";
const SvgHome = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    viewBox="0 0 18 18"
    {...props}
  >
    <path
      fill="#007AFF"
      d="m16.637 8.877-6.792-6.79-.455-.454a.554.554 0 0 0-.78 0L1.361 8.877a1.12 1.12 0 0 0-.33.808 1.136 1.136 0 0 0 1.14 1.113h.747v5.725h12.16v-5.725h.764a1.12 1.12 0 0 0 1.04-.696q.085-.207.085-.431c0-.299-.118-.582-.33-.794m-6.653 6.38H8.015v-3.586h1.969zm3.83-5.725v5.725H11.11V11.25a.703.703 0 0 0-.703-.704H7.593a.703.703 0 0 0-.703.704v4.007H4.185V9.532H2.497l6.504-6.498.406.406 6.096 6.092z"
    />
  </svg>
);
export default SvgHome;
