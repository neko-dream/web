import { tv } from "tailwind-variants";
import LINE_IMG from "~/assets/auth/LINE.png";

const button = tv({
  base: "flex items-center rounded-full border border-gray-300 px-4 py-1",
});

export function LINELoginButton(
  props: React.ComponentPropsWithoutRef<"button">,
) {
  return (
    <button {...props} className={button({ className: props.className })}>
      <img src={LINE_IMG} className="mr-2 w-5" alt="" />
      <p className="font-medium">LINE</p>
    </button>
  );
}
