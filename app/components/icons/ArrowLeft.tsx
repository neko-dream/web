import type { SVGProps } from "react";
const SvgArrowLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={24}
    fill="none"
    viewBox="0 0 25 24"
    {...props}
  >
    <path d="M20.688 11.11H6.975l8.208-7.126a.186.186 0 0 0-.122-.328h-2.074a.38.38 0 0 0-.246.092l-8.858 7.685a.75.75 0 0 0 0 1.132l8.909 7.732q.053.046.122.047h2.144a.187.187 0 0 0 .122-.328L6.975 12.89h13.713a.19.19 0 0 0 .188-.188v-1.406a.19.19 0 0 0-.188-.188" />
  </svg>
);
export default SvgArrowLeft;
