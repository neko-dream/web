import { Eye, EyeOff } from "lucide-react";
import { type ComponentProps, useState } from "react";
import { cn } from "tailwind-variants";
import { AuthInput } from "./AuthControls";

export function AuthPasswordInput({
  className,
  ...props
}: Omit<ComponentProps<typeof AuthInput>, "type">) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <AuthInput
        {...props}
        className={cn(["pr-12", className])}
        type={visible ? "text" : "password"}
      />
      <button
        className="absolute top-0 right-0 grid size-12 place-items-center text-[#868e96]"
        type="button"
        aria-label={visible ? "パスワードを隠す" : "パスワードを表示する"}
        aria-pressed={visible}
        disabled={props.disabled}
        onClick={() => setVisible((value) => !value)}
      >
        {visible ? <Eye size={24} /> : <EyeOff size={24} />}
      </button>
    </div>
  );
}
