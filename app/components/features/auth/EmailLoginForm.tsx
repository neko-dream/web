import { Eye, EyeOff } from "lucide-react";
import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import { EmailVerificationCard } from "./EmailVerificationCard";
import {
  EmailLoginError,
  beginEmailLogin,
  confirmEmailPIN,
} from "./email-login";
import "./auth.css";
function canSendEmail(
  agreed: boolean,
  sending: boolean,
  email: string,
  password: string,
) {
  return agreed && !sending && email.trim().length > 0 && password.length > 0;
}

function submitButtonLabel(busy: boolean, cooldown: number) {
  if (busy) {
    return "確認メールを送信しています…";
  }
  if (cooldown > 0) {
    return `再送まであと${cooldown}秒`;
  }
  return "ログイン";
}

export function useEmailLogin(
  agreed: boolean,
  onSuccess?: () => void,
  blocked = false,
) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [pinLocked, setPINLocked] = useState(false);
  const [error, setError] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const sending = useRef(false);
  useEffect(() => {
    if (!cooldown) {
      return;
    }
    const timer = window.setTimeout(
      () => setCooldown((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [cooldown]);
  const send = async () => {
    if (!canSendEmail(agreed, sending.current || blocked, email, password)) {
      return;
    }
    sending.current = true;
    setBusy(true);
    setError("");
    try {
      setExpiresAt(await beginEmailLogin(email.trim(), password));
      setWaiting(true);
      setPINLocked(false);
      setCooldown(60);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "通信に失敗しました。もう一度お試しください。",
      );
      if (error instanceof EmailLoginError && error.status === 429) {
        setCooldown(60);
      }
    } finally {
      sending.current = false;
      setBusy(false);
    }
  };
  const confirmPIN = async (pin: string) => {
    if (sending.current || blocked || pinLocked) {
      return;
    }
    sending.current = true;
    setBusy(true);
    setError("");
    try {
      const destination = await confirmEmailPIN(pin);
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.replace(destination);
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "通信に失敗しました。もう一度お試しください。",
      );
      if (error instanceof EmailLoginError && error.status === 429) {
        setPINLocked(true);
      }
    } finally {
      sending.current = false;
      setBusy(false);
    }
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    send();
  };

  const back = () => {
    setWaiting(false);
    setPassword("");
    setError("");
  };
  return {
    agreed,
    email,
    setEmail,
    password,
    setPassword,
    busy: busy || blocked,
    waiting,
    pinLocked,
    error,
    expiresAt,
    cooldown,
    send,
    confirmPIN,
    submit,
    back,
  };
}
type LoginState = ReturnType<typeof useEmailLogin>;
export function EmailPasswordForm({ login }: { login: LoginState }) {
  const {
    agreed,
    email,
    setEmail,
    password,
    setPassword,
    busy,
    error,
    cooldown,
    submit,
  } = login;
  const [showPassword, setShowPassword] = useState(false);
  const passwordID = useId();
  return (
    <>
      <form className="w-full" onSubmit={submit}>
        <label className="auth-field">
          <span className="auth-field-label">メールアドレス</span>
          <input
            className="auth-input"
            type="email"
            name="email"
            autoComplete="username"
            placeholder="メールアドレスを入力"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required={true}
            disabled={busy}
          />
        </label>
        <label className="auth-field" htmlFor={passwordID}>
          <span className="auth-field-label">パスワード</span>
        </label>
        <div className="auth-password-wrap">
          <input
            id={passwordID}
            className="auth-input"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="パスワードを入力"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required={true}
            disabled={busy}
          />
          <button
            className="auth-password-toggle"
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
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        <button
          className="auth-primary"
          type="submit"
          disabled={!agreed || busy || cooldown > 0}
        >
          {submitButtonLabel(busy, cooldown)}
        </button>
      </form>
    </>
  );
}
export function EmailLoginConfirmation({ login }: { login: LoginState }) {
  return (
    <EmailVerificationCard
      key={login.expiresAt}
      email={login.email}
      busy={login.busy}
      cooldown={login.cooldown}
      expiresAt={login.expiresAt}
      error={login.error}
      onResend={login.send}
      onConfirmPIN={login.confirmPIN}
      pinLocked={login.pinLocked}
      onBack={login.back}
    />
  );
}
