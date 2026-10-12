import { useEffect, useRef, useState } from "react";
import { AuthFrame } from "~/components/features/auth/AuthFrame";
import { EmailLinkConfirmation } from "~/components/features/auth/EmailVerification";
import {
  confirmEmailLogin,
  toErrorMessage,
} from "~/components/features/auth/email-login";

export { authHeaders as headers } from "~/components/features/auth/authHeaders";

const VERIFICATION_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export const meta = () => [
  { title: "アカウントの確認 | ことひろ" },
  { name: "referrer", content: "no-referrer" },
];

export default function Page() {
  const token = useRef("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // 確認トークンはURLのフラグメントで受け取り、読み取ったらすぐ消す
  useEffect(() => {
    const readLink = () => {
      const fragment = window.location.hash.slice(1);
      if (fragment) {
        token.current = fragment;
        window.history.replaceState(null, "", window.location.pathname);
      }
      const valid = VERIFICATION_TOKEN_PATTERN.test(token.current);
      setReady(valid);
      setError(
        valid
          ? ""
          : "メールに届いた確認リンクから開いてください。期限切れの場合は、ログインからやり直してください。",
      );
    };
    readLink();
    window.addEventListener("hashchange", readLink);
    return () => window.removeEventListener("hashchange", readLink);
  }, []);

  const confirm = async () => {
    if (!ready || busy) {
      return;
    }
    setBusy(true);
    setError("");
    try {
      window.location.replace(await confirmEmailLogin(token.current));
    } catch (error) {
      setError(toErrorMessage(error));
      setBusy(false);
    }
  };

  return (
    <AuthFrame>
      <EmailLinkConfirmation
        busy={busy}
        disabled={!ready}
        error={error}
        onConfirm={confirm}
      />
    </AuthFrame>
  );
}
