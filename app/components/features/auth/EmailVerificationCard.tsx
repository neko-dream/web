import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

type Props = {
  email?: string;
  busy?: boolean;
  cooldown?: number;
  error?: string;
  expiresAt?: string;
  onResend?: () => void;
  onConfirm?: () => void;
  onConfirmPIN?: (pin: string) => void;
  pinLocked?: boolean;
  onBack?: () => void;
};
export function EmailVerificationCard({
  email,
  busy = false,
  cooldown = 0,
  error,
  expiresAt,
  onResend,
  onConfirm,
  onConfirmPIN,
  pinLocked = false,
  onBack,
}: Props) {
  return (
    <>
      {onBack ? (
        <button
          className="auth-back"
          type="button"
          aria-label="ログイン画面に戻る"
          onClick={onBack}
        >
          <ChevronLeft size={20} />
        </button>
      ) : (
        <Link
          className="auth-back"
          to="/organization/login"
          aria-label="ログイン画面に戻る"
        >
          <ChevronLeft size={20} />
        </Link>
      )}
      <h1 className="auth-heading">アカウントの確認</h1>
      <p className="auth-caption">
        {onConfirm
          ? "ログインを開始したブラウザで、下のボタンを押して本人確認を完了してください。"
          : "本人確認メールを送信しました。ログインを開始したブラウザで、メールの確認リンクを開いてください。"}
      </p>
      {email && (
        <label className="auth-field">
          <span className="auth-field-label">メールアドレス</span>
          <input
            className="auth-input"
            type="email"
            value={email}
            readOnly={true}
          />
        </label>
      )}
      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
      {onConfirmPIN && (
        <PINConfirmationForm
          busy={busy}
          pinLocked={pinLocked}
          onConfirmPIN={onConfirmPIN}
        />
      )}
      {onConfirm ? (
        <button
          className="auth-primary"
          type="button"
          disabled={busy}
          onClick={onConfirm}
        >
          {busy ? "確認しています…" : "ログインを確認する"}
        </button>
      ) : (
        <button
          className="auth-primary"
          type="button"
          disabled={busy || cooldown > 0}
          onClick={onResend}
        >
          {resendButtonLabel(busy, cooldown)}
        </button>
      )}
      <p className="auth-help">
        {onConfirm
          ? "リンクは一度だけ使えます。期限切れの場合はログイン画面からやり直してください。"
          : "メールが届かない場合は、迷惑メールフォルダも確認してください。リンクと確認コードの有効期限は15分です。"}
      </p>
      {expiresAt && (
        <p className="auth-help">
          有効期限：
          {new Date(expiresAt).toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}
    </>
  );
}
const PIN_PATTERN = /^[0-9]{6}$/;
function resendButtonLabel(busy: boolean, cooldown: number) {
  if (busy) {
    return "処理しています…";
  }
  return cooldown > 0 ? `再送まであと${cooldown}秒` : "確認メールを再送する";
}
function PINConfirmationForm({
  busy,
  pinLocked,
  onConfirmPIN,
}: { busy: boolean; pinLocked: boolean; onConfirmPIN: (pin: string) => void }) {
  const [pin, setPIN] = useState("");
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (PIN_PATTERN.test(pin) && !busy && !pinLocked) {
          onConfirmPIN(pin);
        }
      }}
    >
      <label className="auth-field">
        <span className="auth-field-label">6桁の確認コード</span>
        <input
          className="auth-input"
          type="text"
          style={{ textAlign: "center" }}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          pattern="[0-9]{6}"
          placeholder="メールに記載された6桁の番号"
          value={pin}
          onChange={(event) => setPIN(event.target.value)}
          disabled={busy || pinLocked}
          required={true}
        />
      </label>
      <button
        className="auth-primary"
        type="submit"
        disabled={busy || pinLocked || !PIN_PATTERN.test(pin)}
      >
        {busy ? "確認しています…" : "確認する"}
      </button>
      <p className="auth-help">
        リンクが開けない場合は、メールの確認コードでも確認できます。5回間違えた場合は、確認メールを再送してください。
      </p>
    </form>
  );
}
