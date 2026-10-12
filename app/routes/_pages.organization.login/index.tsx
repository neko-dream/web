import type { MouseEvent } from "react";
import { Link } from "react-router";
import { OrganizationAuthFrame } from "~/components/features/auth/AuthFrame";
import { AuthProviderLinks } from "~/components/features/auth/AuthProviderLinks";
import {
  EmailLoginConfirmation,
  EmailPasswordForm,
  useEmailLogin,
} from "~/components/features/auth/EmailLoginForm";

export const meta = () => [
  { title: "組織向けログイン | ことひろ" },
  { name: "referrer", content: "no-referrer" },
];
export const headers = () => ({
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
});
export default function Page() {
  // Accounts are provisioned; this is login, not signup or consent collection.
  const login = useEmailLogin(true);
  const guardOAuth = (event: MouseEvent<HTMLAnchorElement>) => {
    if (login.busy) {
      event.preventDefault();
    }
  };
  return (
    <OrganizationAuthFrame>
      {login.waiting ? (
        <EmailLoginConfirmation login={login} />
      ) : (
        <>
          <h1 className="auth-heading">組織向けログイン</h1>
          <div className="flex flex-col items-center">
            <AuthProviderLinks disabled={login.busy} onClick={guardOAuth} />
            <div className="auth-divider">または</div>
            <EmailPasswordForm login={login} />
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
