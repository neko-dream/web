import { useEffect, useRef, useState } from "react";
import {
  EmailLoginError,
  beginEmailLogin,
  confirmEmailPIN,
  toErrorMessage,
} from "~/components/features/auth/email-login";

/** 確認メールの再送間隔（秒） */
const RESEND_COOLDOWN_SECONDS = 60;

/**
 * メール・パスワードでログインし、メールの確認コードで本人確認する
 */
export const useEmailLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [pinLocked, setPINLocked] = useState(false);
  const [error, setError] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const running = useRef(false);

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

  /**
   * リクエストを1つずつ実行する
   * @param keepBusy 成功時にページ遷移するまで busy を維持する
   */
  const run = async (
    request: () => Promise<void>,
    onRateLimited: () => void,
    keepBusy = false,
  ) => {
    if (running.current) {
      return;
    }
    running.current = true;
    setBusy(true);
    setError("");
    try {
      await request();
      if (keepBusy) {
        return;
      }
    } catch (error) {
      setError(toErrorMessage(error));
      if (error instanceof EmailLoginError && error.status === 429) {
        onRateLimited();
      }
    }
    running.current = false;
    setBusy(false);
  };

  const send = () => {
    if (!(email.trim() && password)) {
      return;
    }
    return run(
      async () => {
        setExpiresAt(await beginEmailLogin(email.trim(), password));
        setWaiting(true);
        setPINLocked(false);
        setCooldown(RESEND_COOLDOWN_SECONDS);
      },
      () => setCooldown(RESEND_COOLDOWN_SECONDS),
    );
  };

  const confirmPIN = (pin: string) => {
    if (pinLocked) {
      return;
    }
    return run(
      async () => window.location.replace(await confirmEmailPIN(pin)),
      () => setPINLocked(true),
      true,
    );
  };

  const back = () => {
    setWaiting(false);
    setPassword("");
    setError("");
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    busy,
    waiting,
    pinLocked,
    error,
    expiresAt,
    cooldown,
    send,
    confirmPIN,
    back,
  };
};

export type EmailLogin = ReturnType<typeof useEmailLogin>;
