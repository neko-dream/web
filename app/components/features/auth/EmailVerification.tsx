import { ChevronLeft } from "lucide-react";
import { type FormEvent, type ReactNode, useId, useState } from "react";
import { Link } from "react-router";
import { Label } from "~/components/ui/label";
import {
  AuthError,
  AuthHeading,
  AuthHelp,
  AuthInput,
  AuthSubmitButton,
} from "./AuthControls";

const backButtonClassName =
  "mb-[18px] grid size-9 place-items-center rounded-full border border-[#5856d6] bg-white text-[#007aff]";

const PIN_LENGTH = 6;
const FULL_WIDTH_DIGIT_PATTERN = /[０-９]/g;
const NON_DIGIT_PATTERN = /\D/g;

/**
 * 貼り付けた確認コードの空白・ハイフン・全角数字を半角数字だけにそろえる
 */
const normalizePIN = (value: string) =>
  value
    .replace(FULL_WIDTH_DIGIT_PATTERN, (digit) =>
      String.fromCharCode(digit.charCodeAt(0) - 0xfee0),
    )
    .replace(NON_DIGIT_PATTERN, "")
    .slice(0, PIN_LENGTH);

const VerificationHeader = ({
  back,
  caption,
}: { back: ReactNode; caption: string }) => {
  return (
    <>
      {back}
      <AuthHeading>アカウントの確認</AuthHeading>
      <p className="mb-[22px] text-[#7b8590] text-[13px] leading-relaxed">
        {caption}
      </p>
    </>
  );
};

type LinkConfirmationProps = {
  busy: boolean;
  disabled: boolean;
  error: string;
  onConfirm: () => void;
};

/**
 * メールの確認リンクを開いた後、ボタンを押して本人確認する
 */
export const EmailLinkConfirmation = ({
  busy,
  disabled,
  error,
  onConfirm,
}: LinkConfirmationProps) => {
  return (
    <>
      <VerificationHeader
        back={
          <Link
            className={backButtonClassName}
            to="/organization/login"
            aria-label="ログイン画面に戻る"
          >
            <ChevronLeft size={20} />
          </Link>
        }
        caption="ログインを開始したブラウザで、下のボタンを押してください。"
      />
      {error && <AuthError>{error}</AuthError>}
      <AuthSubmitButton
        type="button"
        disabled={busy || disabled}
        onClick={onConfirm}
      >
        {busy ? "確認しています…" : "確認する"}
      </AuthSubmitButton>
      <AuthHelp>
        リンクは一度だけ使えます。期限切れの場合はログイン画面からやり直してください。
      </AuthHelp>
    </>
  );
};

type PINConfirmationProps = {
  email: string;
  busy: boolean;
  cooldown: number;
  error: string;
  expiresAt: string;
  pinLocked: boolean;
  onConfirmPIN: (pin: string) => void;
  onResend: () => void;
  onBack: () => void;
};

const resendButtonLabel = (busy: boolean, cooldown: number) => {
  if (busy) {
    return "処理しています…";
  }
  return cooldown > 0 ? `再送まであと${cooldown}秒` : "確認メールを再送する";
};

/**
 * 確認メールの送信後、確認コードの入力か確認メールの再送を受け付ける
 */
export const EmailPINConfirmation = ({
  email,
  busy,
  cooldown,
  error,
  expiresAt,
  pinLocked,
  onConfirmPIN,
  onResend,
  onBack,
}: PINConfirmationProps) => {
  const [pin, setPIN] = useState("");
  const emailID = useId();
  const pinID = useId();
  const canConfirm = pin.length === PIN_LENGTH && !busy && !pinLocked;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canConfirm) {
      onConfirmPIN(pin);
    }
  };

  return (
    <>
      <VerificationHeader
        back={
          <button
            className={backButtonClassName}
            type="button"
            aria-label="ログイン画面に戻る"
            onClick={onBack}
          >
            <ChevronLeft size={20} />
          </button>
        }
        caption="確認メールを送信しました。メールの「確認する」ボタンを押すか、下に6桁の番号を入力してください。"
      />
      <Label className="mb-4" title="メールアドレス" htmlFor={emailID}>
        <AuthInput id={emailID} type="email" value={email} readOnly={true} />
      </Label>
      {error && <AuthError>{error}</AuthError>}
      <form onSubmit={handleSubmit}>
        <Label className="mb-4" title="6桁の番号" htmlFor={pinID}>
          <AuthInput
            id={pinID}
            className="text-center"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="メールに記載された6桁の番号"
            value={pin}
            onChange={(event) => setPIN(normalizePIN(event.target.value))}
            disabled={busy || pinLocked}
            required={true}
          />
        </Label>
        <AuthSubmitButton type="submit" disabled={!canConfirm}>
          {busy ? "確認しています…" : "確認する"}
        </AuthSubmitButton>
        <AuthHelp>
          番号を5回間違えた場合は、確認メールを再送してください。
        </AuthHelp>
      </form>
      <AuthSubmitButton
        type="button"
        disabled={busy || cooldown > 0}
        onClick={onResend}
      >
        {resendButtonLabel(busy, cooldown)}
      </AuthSubmitButton>
      <AuthHelp>
        メールが届かない場合は、迷惑メールフォルダも確認してください。このメールで確認できる時間は15分です。
      </AuthHelp>
      <AuthHelp>
        有効期限：
        {new Date(expiresAt).toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </AuthHelp>
    </>
  );
};
