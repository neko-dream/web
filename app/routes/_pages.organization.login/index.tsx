import type { MouseEvent } from "react";
import { Link } from "react-router";
import { AuthHeading } from "~/components/features/auth/AuthControls";
import { AuthProviderLinks } from "~/components/features/auth/AuthProviderLinks";
import { EmailPasswordForm } from "~/components/features/auth/EmailPasswordForm";
import { EmailPINConfirmation } from "~/components/features/auth/EmailVerification";
import { useEmailLogin } from "~/hooks/useEmailLogin";
import { OrganizationAuthFrame } from "./components/OrganizationAuthFrame";
import "~/components/features/auth/auth.css";
import "./index.css";

export { authHeaders as headers } from "~/components/features/auth/authHeaders";

export const meta = () => [
  { title: "組織向けログイン | ことひろ" },
  { name: "referrer", content: "no-referrer" },
];

export default function Page() {
  // 配布済みアカウントのログインなので同意チェックは置かない
  const login = useEmailLogin();

  const guardOAuth = (event: MouseEvent<HTMLAnchorElement>) => {
    if (login.busy) {
      event.preventDefault();
    }
  };

  return (
    <OrganizationAuthFrame>
      {login.waiting ? (
        <EmailPINConfirmation
          // 再送で確認コードの入力をリセットする
          key={login.expiresAt}
          email={login.email}
          busy={login.busy}
          cooldown={login.cooldown}
          error={login.error}
          expiresAt={login.expiresAt}
          pinLocked={login.pinLocked}
          onConfirmPIN={login.confirmPIN}
          onResend={login.send}
          onBack={login.back}
        />
      ) : (
        <>
          <AuthHeading>組織向けログイン</AuthHeading>
          <div className="flex flex-col items-center">
            <AuthProviderLinks disabled={login.busy} onClick={guardOAuth} />
            <div className="my-6 flex w-full items-center gap-2 text-[#868e96] before:h-px before:flex-1 before:bg-[#d8dbe0] after:h-px after:flex-1 after:bg-[#d8dbe0]">
              または
            </div>
            <EmailPasswordForm
              email={login.email}
              password={login.password}
              busy={login.busy}
              cooldown={login.cooldown}
              error={login.error}
              onEmailChange={login.setEmail}
              onPasswordChange={login.setPassword}
              onSubmit={login.send}
            />
          </div>
          <Link
            to="/"
            className="mt-6 block text-center text-gray-600 text-sm underline underline-offset-4"
          >
            一般向けログインはこちら
          </Link>
        </>
      )}
    </OrganizationAuthFrame>
  );
}
