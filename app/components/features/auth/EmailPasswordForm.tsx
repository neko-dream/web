import { type FormEvent, useId, useState } from "react";
import { Label } from "~/components/ui/label";
import { AuthError, AuthInput, AuthSubmitButton } from "./AuthControls";
import { AuthPasswordInput } from "./AuthPasswordInput";
import { validateEmailLoginFields } from "./email-login";

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
  const emailID = useId();
  const passwordID = useId();
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
  const emailErrorID = `${emailID}-error`;
  const passwordErrorID = `${passwordID}-error`;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || cooldown > 0) {
      return;
    }
    const emailInput = event.currentTarget.elements.namedItem("email");
    if (!(emailInput instanceof HTMLInputElement)) {
      return;
    }
    const errors = validateEmailLoginFields(
      email,
      password,
      emailInput.validity.typeMismatch,
    );
    setFieldErrors(errors);
    if (errors.email || errors.password) {
      const invalidInput = errors.email
        ? emailInput
        : event.currentTarget.elements.namedItem("password");
      if (invalidInput instanceof HTMLInputElement) {
        invalidInput.focus();
      }
      return;
    }
    onSubmit();
  };

  return (
    <form className="w-full" noValidate={true} onSubmit={handleSubmit}>
      <Label className="mb-4" title="メールアドレス" htmlFor={emailID}>
        <AuthInput
          id={emailID}
          type="email"
          name="email"
          autoComplete="username"
          placeholder="メールアドレスを入力"
          value={email}
          onChange={(event) => {
            onEmailChange(event.target.value);
            setFieldErrors((errors) => ({ ...errors, email: "" }));
          }}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? emailErrorID : undefined}
          required={true}
          disabled={busy}
        />
        {fieldErrors.email && (
          <AuthError id={emailErrorID}>{fieldErrors.email}</AuthError>
        )}
      </Label>
      <Label className="mb-4" title="パスワード" htmlFor={passwordID}>
        <AuthPasswordInput
          id={passwordID}
          name="password"
          autoComplete="current-password"
          placeholder="パスワードを入力"
          value={password}
          onChange={(event) => {
            onPasswordChange(event.target.value);
            setFieldErrors((errors) => ({ ...errors, password: "" }));
          }}
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={fieldErrors.password ? passwordErrorID : undefined}
          required={true}
          disabled={busy}
        />
        {fieldErrors.password && (
          <AuthError id={passwordErrorID}>{fieldErrors.password}</AuthError>
        )}
      </Label>
      {error && <AuthError>{error}</AuthError>}
      <AuthSubmitButton type="submit" disabled={busy || cooldown > 0}>
        {submitButtonLabel(busy, cooldown)}
      </AuthSubmitButton>
    </form>
  );
};
