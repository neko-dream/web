import type { MouseEvent } from "react";
import { AuthGoogle, AuthLine } from "~/components/icons";
import { GOOGLE_LOGIN_URL, LINE_LOGIN_URL } from "~/constants";
import "./auth.css";

type Props = {
  disabled?: boolean;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export function AuthProviderLinks({ disabled = false, onClick }: Props) {
  return (
    <div className="auth-provider-links">
      <a
        href={GOOGLE_LOGIN_URL}
        onClick={onClick}
        aria-disabled={disabled}
        className="auth-provider-link auth-provider-google"
      >
        <AuthGoogle />
        <span>Googleでログイン</span>
      </a>
      <a
        href={LINE_LOGIN_URL}
        onClick={onClick}
        aria-disabled={disabled}
        className="auth-provider-link auth-provider-line"
      >
        <AuthLine />
        <span>LINEでログイン</span>
      </a>
    </div>
  );
}
