import { ChevronLeft } from "lucide-react";
import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router";
import {
  AuthError,
  AuthHeading,
  AuthHelp,
  AuthSubmitButton,
} from "~/components/features/auth/AuthControls";
import { AuthPasswordInput } from "~/components/features/auth/AuthPasswordInput";
import { BrandedAuthFrame } from "~/components/features/auth/BrandedAuthFrame";
import { toErrorMessage } from "~/components/features/auth/email-login";
import {
  type PasswordPolicy,
  isPasswordSetupToken,
  loadPasswordPolicy,
  setupPassword,
  validateSetupPassword,
} from "~/components/features/auth/password-setup";
import { Label } from "~/components/ui/label";

export { authHeaders as headers } from "~/components/features/auth/authHeaders";
export const meta = () => [
  { title: "新しいパスワードを設定 | ことひろ" },
  { name: "referrer", content: "no-referrer" },
  { name: "robots", content: "noindex, nofollow" },
];

// Figma 48:8061: 343px form, 24px section gaps, 48px password inputs.
const passwordFieldClassName =
  "space-y-2 [&>div:first-child]:mb-0 [&_label]:font-['Open_Sans',sans-serif] [&_label]:text-[#191c1e] [&_label]:text-base [&_label]:leading-[1.55]";

function passwordPolicyCaption(
  policy: PasswordPolicy | null,
  loading: boolean,
) {
  if (policy) {
    return `${policy.minLength}文字以上（英数字は最大${policy.maxBytes}文字）`;
  }
  return loading ? "入力条件を確認しています…" : "";
}

export default function Page() {
  const token = useRef("");
  const [ready, setReady] = useState(false);
  const [policy, setPolicy] = useState<PasswordPolicy | null>(null);
  const [policyError, setPolicyError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const passwordID = useId();
  const confirmationID = useId();
  const passwordHelpID = useId();
  const confirmationHelpID = useId();
  const inputDisabled = !(ready && policy) || busy;

  useEffect(() => {
    const readLink = () => {
      const fragment = window.location.hash.slice(1);
      if (fragment) {
        token.current = fragment;
        window.history.replaceState(null, "", window.location.pathname);
      }
      const valid = isPasswordSetupToken(token.current);
      setReady(valid);
      setError(
        valid
          ? ""
          : "メールに届いた設定リンクから開いてください。期限切れの場合は、管理者にメールの再送を依頼してください。",
      );
    };
    readLink();
    window.addEventListener("hashchange", readLink);
    return () => window.removeEventListener("hashchange", readLink);
  }, []);

  useEffect(() => {
    if (!ready) {
      setPolicy(null);
      setPolicyError("");
      return;
    }
    const abort = new AbortController();
    setPolicy(null);
    setPolicyError("");
    loadPasswordPolicy(abort.signal)
      .then((policy) => {
        if (!abort.signal.aborted) {
          setPolicy(policy);
        }
      })
      .catch(() => {
        if (!abort.signal.aborted) {
          setPolicyError(
            "パスワードの入力条件を取得できませんでした。メールの設定リンクからもう一度開いてください。",
          );
        }
      });
    return () => abort.abort();
  }, [ready]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!policy || inputDisabled || done) {
      return;
    }
    const validation = validateSetupPassword(password, confirmation, policy);
    if (validation) {
      setError(validation);
      return;
    }
    setBusy(true);
    setError("");
    try {
      await setupPassword(token.current, password);
      token.current = "";
      setPassword("");
      setConfirmation("");
      setDone(true);
    } catch (error) {
      setError(toErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <BrandedAuthFrame>
      {!done && (
        <Link
          to="/organization/login"
          className="mb-6 grid size-12 place-items-center rounded-full border-2 border-[#5856d6] bg-white text-[#007aff]"
          aria-label="ログイン画面に戻る"
        >
          <ChevronLeft size={24} />
        </Link>
      )}
      <AuthHeading className="mb-6">
        {done ? "設定が完了しました" : "新しいパスワードを設定"}
      </AuthHeading>
      {done ? (
        <>
          <p className="text-[#7b8590] text-sm leading-relaxed">
            メールアドレスと設定したパスワードでログインしてください。ログイン時には、メールに届く6桁の番号で確認します。
          </p>
          <Link
            to="/organization/login"
            className="mt-6 block text-center text-blue-600 underline underline-offset-4"
          >
            ログイン画面へ
          </Link>
        </>
      ) : (
        <form className="w-full" noValidate={true} onSubmit={submit}>
          <p className="mb-6 text-[#71787e] text-base leading-[21px] tracking-[-0.31px]">
            ログインに使うパスワードを設定してください。
          </p>
          <Label
            title="新しいパスワード"
            htmlFor={passwordID}
            className={`${passwordFieldClassName} mb-6`}
          >
            <AuthPasswordInput
              id={passwordID}
              name="password"
              autoComplete="new-password"
              placeholder="パスワードを入力"
              aria-describedby={passwordHelpID}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={inputDisabled}
              required={true}
            />
            <p
              id={passwordHelpID}
              className="text-[#71787e] text-[13px] leading-[18px] tracking-[-0.08px]"
            >
              {passwordPolicyCaption(policy, ready && !policyError)}
            </p>
          </Label>
          <Label
            title="パスワード確認用"
            htmlFor={confirmationID}
            className={passwordFieldClassName}
          >
            <p
              id={confirmationHelpID}
              className="text-[#71787e] text-[15px] leading-5 tracking-[-0.23px]"
            >
              新しいパスワードをもう一度入力してください
            </p>
            <AuthPasswordInput
              id={confirmationID}
              name="passwordConfirmation"
              autoComplete="new-password"
              placeholder="パスワードを入力"
              aria-describedby={confirmationHelpID}
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              disabled={inputDisabled}
              required={true}
            />
          </Label>
          {error && <AuthError>{error}</AuthError>}
          {policyError && <AuthError>{policyError}</AuthError>}
          <AuthSubmitButton type="submit" disabled={inputDisabled}>
            {busy ? "設定しています…" : "完了"}
          </AuthSubmitButton>
          <AuthHelp>
            設定リンクは24時間有効です。期限切れの場合は、管理者に設定メールの再送を依頼してください。
          </AuthHelp>
        </form>
      )}
    </BrandedAuthFrame>
  );
}
