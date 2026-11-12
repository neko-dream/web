import { type MouseEvent, useState } from "react";
import { Link } from "react-router";
import LogoIcon from "~/assets/kotohiro.png";
import { AuthFrame } from "~/components/features/auth/AuthFrame";
import { AuthProviderLinks } from "~/components/features/auth/AuthProviderLinks";
import { OrganizationLoginLink } from "~/components/features/auth/OrganizationLoginLink";
import { TermsAgreement } from "~/components/features/auth/TermsAgreement";
import { Arrow } from "~/components/icons";

export { meta } from "./modules/meta";
export default function Page() {
  const [agreed, setAgreed] = useState(false);

  const guardOAuth = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!agreed) {
      event.preventDefault();
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-10">
      <img
        src={LogoIcon}
        alt="ことひろ"
        className="h-10 w-[136px]"
        loading="eager"
      />
      <p className="mt-2 mb-6 text-center text-ink-subtle text-sm">
        言葉を重ねて、より良い意思決定を。
      </p>

      <AuthFrame className="w-full shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <h1 className="primary-gradient text-clip text-center font-bold text-xl">
          ことひろにログイン
        </h1>
        <p className="mt-1 text-center text-ink-subtle text-sm">
          Google・LINEでログインできます
        </p>
        <TermsAgreement checked={agreed} onChange={setAgreed} />
        <div className="mx-4 mt-6 flex flex-col items-center">
          <AuthProviderLinks disabled={!agreed} onClick={guardOAuth} />
          <Link
            to="/"
            className="mt-6 flex items-center space-x-2 font-bold text-ink-muted text-sm"
          >
            <span>新規登録はこちら</span>
            <Arrow className="-rotate-90" />
          </Link>
        </div>
      </AuthFrame>
      <OrganizationLoginLink className="mt-6 w-fit justify-center" />
    </div>
  );
}
