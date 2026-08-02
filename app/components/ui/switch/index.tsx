import { tv } from "tailwind-variants";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  "aria-label"?: string;
};

const track = tv({
  base: "flex w-14 cursor-pointer items-center rounded-full border border-gray-300 p-1 transition-colors",
  variants: {
    checked: {
      true: "primary-gradient justify-end",
      false: "justify-start bg-gray-200",
    },
  },
});

export const Switch = ({ checked, onChange, className, ...props }: Props) => {
  return (
    <button
      {...props}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={track({ checked, class: className })}
    >
      <span className="size-5 rounded-full bg-white shadow" />
    </button>
  );
};
