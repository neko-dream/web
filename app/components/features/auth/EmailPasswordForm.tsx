import { Eye, EyeOff } from "lucide-react";
import { type FormEvent, useId, useState } from "react";
import { Label } from "~/components/ui/label";
import { AuthError, AuthInput, AuthSubmitButton } from "./AuthControls";

type Props = {
  email: string;
  password: string;
  busy: boolean;
  cooldown: number;
  error: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: () => void;
};

const submitButtonLabel = (busy: boolean, cooldown: number) => {
  if (busy) {
    return "確認メールを送信しています…";
  }
  if (cooldown > 0) {
    return `再送まであと${cooldown}秒`;
  }
  return "ログイン";
};

export const EmailPasswordForm = ({
  email,
  password,
  busy,
  cooldown,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const emailID = useId();
  const passwordID = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <Label className="mb-4" title="メールアドレス" htmlFor={emailID}>
        <AuthInput
          id={emailID}
          type="email"
          name="email"
          autoComplete="username"
          placeholder="メールアドレスを入力"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          required={true}
          disabled={busy}
        />
      </Label>
      <Label className="mb-4" title="パスワード" htmlFor={passwordID}>
        <div className="relative">
          <AuthInput
            id={passwordID}
            className="pr-12"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="パスワードを入力"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            required={true}
            disabled={busy}
          />
          <button
            className="absolute top-0 right-0 grid size-12 place-items-center text-[#868e96]"
            type="button"
            aria-label={
              showPassword ? "パスワードを隠す" : "パスワードを表示する"
            }
            aria-pressed={showPassword}
            onClick={() => setShowPassword((value) => !value)}
          >
            {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
          </button>
        </div>
      </Label>
      {error && <AuthError>{error}</AuthError>}
      <AuthSubmitButton type="submit" disabled={busy || cooldown > 0}>
        {submitButtonLabel(busy, cooldown)}
      </AuthSubmitButton>
    </form>
  );
};
