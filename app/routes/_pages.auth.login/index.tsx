import { type MouseEvent, useState } from "react";
import { Link } from "react-router";
import LogoIcon from "~/assets/kotohiro.png";
import { AnimatedHexagonBackground } from "~/components/features/auth/AnimatedHexagonBackground";
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
    <div className="relative isolate flex flex-1 flex-col overflow-hidden">
      <AnimatedHexagonBackground />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_38%,#fff_38%,rgba(255,255,255,0.85)_60%,rgba(255,255,255,0.15)_100%)]"
      />
      <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-10">
        <img
          src={LogoIcon}
          alt="ことひろ"
          className="h-10 w-[136px]"
          loading="eager"
        />
        <p className="mt-2 mb-7 text-center text-[13px] text-ink-muted">
          言葉を重ねて、より良い意思決定へ。
        </p>

        <AuthFrame>
          <h1 className="text-center font-bold text-[21px] text-ink tracking-tight">
            ことひろにログイン
          </h1>
          <p className="mt-1.5 text-center text-[13px] text-ink-muted">
            Google・LINEでログインできます
          </p>
          <TermsAgreement checked={agreed} onChange={setAgreed} />
          <div className="mt-5 flex flex-col items-center gap-3">
            <AuthProviderLinks disabled={!agreed} onClick={guardOAuth} />
            <Link
              to="/"
              className="mt-2 flex min-h-11 items-center gap-1.5 font-medium text-[13px] text-ink-muted hover:text-ink"
            >
              <span>新規登録はこちら</span>
              <Arrow className="-rotate-90" />
            </Link>
          </div>
        </AuthFrame>
        <OrganizationLoginLink className="mt-4 mb-2 w-fit justify-center" />
      </div>
    </div>
  );
}
