import { useEffect, useRef, useState } from "react";
import { AuthFrame } from "~/components/features/auth/AuthFrame";
import { EmailVerificationCard } from "~/components/features/auth/EmailVerificationCard";
import { confirmEmailLogin } from "~/components/features/auth/email-login";
const verificationTokenPattern = /^[A-Za-z0-9_-]{43}$/;

export const meta = () => [
  { title: "アカウントの確認 | ことひろ" },
  { name: "referrer", content: "no-referrer" },
];
export const headers = () => ({
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
});

export default function Page() {
  const token = useRef("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const readLink = () => {
      const fragment = window.location.hash.slice(1);
      if (fragment) {
        token.current = fragment;
        window.history.replaceState(null, "", window.location.pathname);
      }
      const valid = verificationTokenPattern.test(token.current);
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
      setError(
        error instanceof Error
          ? error.message
          : "通信に失敗しました。もう一度お試しください。",
      );
      setBusy(false);
    }
  };
  return (
    <AuthFrame label="アカウントの確認">
      <EmailVerificationCard
        onConfirm={confirm}
        busy={busy || !ready}
        error={error}
      />
    </AuthFrame>
  );
}
